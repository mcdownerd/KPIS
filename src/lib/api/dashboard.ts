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

    // Fetch sales data
    const { data: sales } = await supabase
        .from('sales')
        .select('total_value, platform')
        .eq('store_id', userProfile.store_id)
        .gte('sale_date', startDate)
        .lte('sale_date', endDate)

    // Fetch service times
    const { data: serviceTimes } = await supabase
        .from('service_times')
        .select('day_time, delivery_time')
        .eq('store_id', userProfile.store_id)
        .gte('record_date', startDate)
        .lte('record_date', endDate)

    // Fetch costs
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

    // Calculate metrics
    const totalSales = sales?.reduce((sum, s) => sum + Number(s.total_value), 0) || 0
    const deliverySales = sales?.filter(s => s.platform === 'Delivery').reduce((sum, s) => sum + Number(s.total_value), 0) || 0
    const avgServiceTime = serviceTimes?.length ? serviceTimes.reduce((sum, st) => sum + (st.day_time || 0), 0) / serviceTimes.length : 0
    const avgCost = costs?.length ? costs.reduce((sum, c) => sum + Number(c.percentage), 0) / costs.length : 0
    const deviationCount = deviations?.length || 0

    // Latest turnover
    const turnoverRate = hrMetrics?.[0]?.value || 0;

    // Performance metrics
    const rating = performance?.find(p => p.metric_name === 'Avaliações Google')?.value || 0;
    const fastinsight = performance?.find(p => p.metric_name === 'Fastinsight')?.value || 0;

    // Calculate delivery time average
    const avgDeliveryTime = serviceTimes?.length
        ? serviceTimes.reduce((sum, st) => sum + (st.delivery_time || 0), 0) / serviceTimes.length
        : 0;

    // Calculate delivery percentage
    const deliveryPercentage = totalSales > 0 ? (deliverySales / totalSales) * 100 : 0;

    let salesGrowth = 0;
    if (sales && sales.length > 0) {
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
