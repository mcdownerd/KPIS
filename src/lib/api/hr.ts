import { supabase } from '../supabase'

export interface HRMetric {
    id: string;
    store_id: string;
    record_date: string;
    metric_type: 'labor_cost' | 'turnover' | 'turnover_rate' | 'staffing' | 'staffing_hours' | 'productivity' | 'managers';
    value: number;
    target_value?: number;
    additional_data?: {
        vendas?: number;
        horas?: number;
        prod?: number;
        mo?: number;
        amadora?: number;
        queluz?: number;
        vendas_amadora?: number;
        horas_amadora?: number;
        vendas_queluz?: number;
        horas_queluz?: number;
        prod_amadora?: number;
        prod_queluz?: number;
        mo_amadora?: number;
        mo_queluz?: number;
        custo_amadora?: number;
        custo_queluz?: number;
        mo_percentage?: number;
        manager_morning?: string;
        manager_night?: string;
    };
    created_at?: string;
    updated_at?: string;
    created_by?: string;
}

/**
 * Fetch HR metrics for a specific date range
 */
export async function getHRMetricsByDateRange(startDate: string, endDate: string) {
    const { data: profile } = await supabase.auth.getUser()
    if (!profile.user) throw new Error('User not authenticated')

    const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('store_id')
        .eq('id', profile.user.id)
        .single()

    if (!userProfile?.store_id) {
        return []
    }

    const { data, error } = await supabase
        .from('hr_metrics')
        .select('*')
        .eq('store_id', userProfile.store_id)
        .gte('record_date', startDate)
        .lte('record_date', endDate)
        .order('record_date', { ascending: true })

    if (error) throw error
    return data || []
}

/**
 * Get HR metrics by month
 */
export async function getHRMetricsByMonth(month: number, year: number) {
    const startDate = new Date(year, month, 1).toISOString().split('T')[0]
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0]

    return getHRMetricsByDateRange(startDate, endDate)
}

/**
 * Get HR metrics by type
 */
export async function getHRMetricsByType(metricType: HRMetric['metric_type'], startDate: string, endDate: string) {
    const { data: profile } = await supabase.auth.getUser()
    if (!profile.user) throw new Error('User not authenticated')

    const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('store_id')
        .eq('id', profile.user.id)
        .single()

    if (!userProfile?.store_id) {
        return []
    }

    const { data, error } = await supabase
        .from('hr_metrics')
        .select('*')
        .eq('store_id', userProfile.store_id)
        .eq('metric_type', metricType)
        .gte('record_date', startDate)
        .lte('record_date', endDate)
        .order('record_date', { ascending: true })

    if (error) throw error
    return data || []
}

/**
 * Create a new HR metric record
 */
export async function createHRMetric(metric: Omit<HRMetric, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'store_id'>) {
    const { data: profile } = await supabase.auth.getUser()
    if (!profile.user) throw new Error('User not authenticated')

    const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('store_id')
        .eq('id', profile.user.id)
        .single()

    if (!userProfile?.store_id) throw new Error('User has no store assigned')

    const { data, error } = await supabase
        .from('hr_metrics')
        .insert([{
            ...metric,
            store_id: userProfile.store_id,
            created_by: profile.user.id
        }])
        .select()
        .single()

    if (error) throw error
    return data
}

/**
 * Update an HR metric record
 */
export async function updateHRMetric(id: string, updates: Partial<Omit<HRMetric, 'id' | 'store_id' | 'created_at' | 'created_by'>>) {
    const { data, error } = await supabase
        .from('hr_metrics')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

/**
 * Upsert an HR metric record
 */
export async function upsertHRMetric(metric: Omit<HRMetric, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'store_id'>) {
    const { data: profile } = await supabase.auth.getUser()
    if (!profile.user) throw new Error('User not authenticated')

    const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('store_id')
        .eq('id', profile.user.id)
        .single()

    if (!userProfile?.store_id) throw new Error('User has no store assigned')

    // Check for existing record
    const { data: existing } = await supabase
        .from('hr_metrics')
        .select('id')
        .eq('store_id', userProfile.store_id)
        .eq('record_date', metric.record_date)
        .eq('metric_type', metric.metric_type)
        .maybeSingle()

    if (existing) {
        const { data, error } = await supabase
            .from('hr_metrics')
            .update({
                ...metric,
                updated_at: new Date().toISOString()
            })
            .eq('id', existing.id)
            .select()
            .single()

        if (error) throw error
        return data
    } else {
        const { data, error } = await supabase
            .from('hr_metrics')
            .insert([{
                ...metric,
                store_id: userProfile.store_id,
                created_by: profile.user.id
            }])
            .select()
            .single()

        if (error) throw error
        return data
    }
}

/**
 * Delete an HR metric record
 */
export async function deleteHRMetric(id: string) {
    const { error } = await supabase
        .from('hr_metrics')
        .delete()
        .eq('id', id)

    if (error) throw error
    return true
}

/**
 * Get average turnover for a period
 */
export async function getAverageTurnover(startDate: string, endDate: string) {
    const metrics = await getHRMetricsByType('turnover', startDate, endDate)

    if (metrics.length === 0) return 0

    const total = metrics.reduce((sum, m) => sum + m.value, 0)
    return total / metrics.length
}

/**
 * Get average staffing for a period
 */
export async function getAverageStaffing(startDate: string, endDate: string) {
    const metrics = await getHRMetricsByType('staffing', startDate, endDate)

    if (metrics.length === 0) return 0

    const total = metrics.reduce((sum, m) => sum + m.value, 0)
    return total / metrics.length
}

/**
 * Get labor cost summary
 */
export async function getLaborCostSummary(startDate: string, endDate: string) {
    const metrics = await getHRMetricsByType('labor_cost', startDate, endDate)

    const summary = {
        total_sales: 0,
        total_hours: 0,
        avg_productivity: 0,
        avg_labor_percentage: 0,
        count: metrics.length
    }

    if (metrics.length === 0) return summary

    metrics.forEach(m => {
        if (m.additional_data) {
            summary.total_sales += m.additional_data.vendas || 0
            summary.total_hours += m.additional_data.horas || 0
            summary.avg_productivity += m.additional_data.prod || 0
            summary.avg_labor_percentage += m.additional_data.mo || 0
        }
    })

    summary.avg_productivity = summary.avg_productivity / metrics.length
    summary.avg_labor_percentage = summary.avg_labor_percentage / metrics.length

    return summary
}
