import { supabase } from '../supabase'

export interface DashboardMetrics {
    sales_growth: number;
    gcs_growth: number;
    delivery_growth: number;
    service_time_avg: number;
    service_time_delivery: number;
    cost_percentage: number;
    inventory_deviations_count: number;
    fastinsight_score: number;
    rating: number;
    turnover_rate: number;
}

/**
 * Get dashboard overview metrics for a specific period
 */
export async function getDashboardMetrics(startDate: string, endDate: string): Promise<DashboardMetrics> {
    const { data: profile } = await supabase.auth.getUser()
    if (!profile.user) throw new Error('User not authenticated')

    const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('store_id')
        .eq('id', profile.user.id)
        .single()

    if (!userProfile?.store_id) {
        return {
            sales_growth: 0,
            gcs_growth: 0,
            delivery_growth: 0,
            service_time_avg: 0,
            service_time_delivery: 0,
            cost_percentage: 0,
            inventory_deviations_count: 0,
            fastinsight_score: 0,
            rating: 0,
            turnover_rate: 0
        }
    }

    // Fetch sales summary metrics
    const { data: salesMetrics } = await supabase
        .from('sales_summary_metrics')
        .select('*')
        .eq('store_id', userProfile.store_id)
        .gte('record_date', startDate)
        .lte('record_date', endDate)

    // Fetch service time metrics
    const { data: serviceMetrics } = await supabase
        .from('service_time_metrics')
        .select('*')
        .eq('store_id', userProfile.store_id)
        .gte('record_date', startDate)
        .lte('record_date', endDate)

    // Fetch costs (legacy or new?) - Keeping legacy for now as MaintenanceForm is incomplete
    const { data: costs } = await supabase
        .from('costs')
        .select('percentage')
        .eq('store_id', userProfile.store_id)
        .gte('record_date', startDate)
        .lte('record_date', endDate)

    // Fetch inventory deviations
    const { data: deviations } = await supabase
        .from('inventory_deviations')
        .select('status')
        .eq('store_id', userProfile.store_id)
        .gte('record_date', startDate)
        .lte('record_date', endDate)
        .in('status', ['warning', 'critical'])

    // Fetch HR metrics (Turnover)
    const { data: hrMetrics } = await supabase
        .from('hr_metrics')
        .select('value')
        .eq('store_id', userProfile.store_id)
        .eq('metric_type', 'turnover_rate')
        .gte('record_date', startDate)
        .lte('record_date', endDate)
        .order('record_date', { ascending: false })
        .limit(1)

    // Fetch Performance metrics (Rating, Fastinsight)
    const { data: performance } = await supabase
        .from('performance_tracking')
        .select('metric_name, value')
        .eq('store_id', userProfile.store_id)
        .gte('record_date', startDate)
        .lte('record_date', endDate)

    // Calculate metrics from sales_summary_metrics
    const totalSales = salesMetrics?.reduce((sum, s) => sum + Number(s.total_sales || 0), 0) || 0
    const deliverySales = salesMetrics?.reduce((sum, s) => sum + Number(s.delivery_sales || 0), 0) || 0

    // Calculate metrics from service_time_metrics
    // Average of averages might not be mathematically perfect but sufficient for dashboard overview
    const avgServiceTime = serviceMetrics?.length
        ? serviceMetrics.reduce((sum, st) => sum + (st.service_time_avg || 0), 0) / serviceMetrics.length
        : 0

    const avgDeliveryTime = serviceMetrics?.length
        ? serviceMetrics.reduce((sum, st) => sum + (st.delivery_time_avg || 0), 0) / serviceMetrics.length
        : 0;

    const avgCost = costs?.length ? costs.reduce((sum, c) => sum + Number(c.percentage), 0) / costs.length : 0
    const deviationCount = deviations?.length || 0

    // Latest turnover
    const turnoverRate = hrMetrics?.[0]?.value || 0;

    // Performance metrics
    const rating = performance?.find(p => p.metric_name === 'Avaliações Google')?.value || 0;
    const fastinsight = performance?.find(p => p.metric_name === 'Fastinsight')?.value || 0;

    // Calculate delivery percentage
    const deliveryPercentage = totalSales > 0 ? (deliverySales / totalSales) * 100 : 0;

    let salesGrowth = 0;
    if (salesMetrics && salesMetrics.length > 0) {
        salesGrowth = 12.5; // Hardcoded for demo
    }

    return {
        sales_growth: salesGrowth,
        gcs_growth: 5.2, // Placeholder
        delivery_growth: deliveryPercentage,
        service_time_avg: avgServiceTime,
        service_time_delivery: avgDeliveryTime,
        cost_percentage: avgCost,
        inventory_deviations_count: deviationCount,
        fastinsight_score: fastinsight,
        rating: rating,
        turnover_rate: turnoverRate
    }
}

/**
 * Get all stores (for admin view)
 */
export async function getAllStores() {
    const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('name', { ascending: true })

    if (error) throw error
    return data || []
}

/**
 * Get user's store information
 */
export async function getUserStore() {
    const { data: profile } = await supabase.auth.getUser()
    if (!profile.user) throw new Error('User not authenticated')

    const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('store_id, stores(*)')
        .eq('id', profile.user.id)
        .single()

    if (!userProfile?.store_id) {
        return null
    }

    return userProfile.stores
}
