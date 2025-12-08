import { supabase } from '../supabase'

export interface PerformanceTracking {
    id: string;
    store_id: string;
    record_date: string;
    metric_name: 'cmp' | 'pl' | 'aval' | 'gastos_gerais';
    value?: number;
    status: 'OK' | 'NOK';
    created_at?: string;
    updated_at?: string;
    created_by?: string;
}

/**
 * Fetch performance tracking records for a specific date range
 */
export async function getPerformanceTrackingByDateRange(startDate: string, endDate: string) {
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
        .from('performance_tracking')
        .select('*')
        .eq('store_id', userProfile.store_id)
        .gte('record_date', startDate)
        .lte('record_date', endDate)
        .order('record_date', { ascending: true })

    if (error) throw error
    return data || []
}

/**
 * Get performance tracking by month
 */
export async function getPerformanceTrackingByMonth(month: number, year: number) {
    const startDate = new Date(year, month, 1).toISOString().split('T')[0]
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0]

    return getPerformanceTrackingByDateRange(startDate, endDate)
}

/**
 * Get performance tracking by metric type
 */
export async function getPerformanceTrackingByMetric(metricName: PerformanceTracking['metric_name'], startDate: string, endDate: string) {
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
        .from('performance_tracking')
        .select('*')
        .eq('store_id', userProfile.store_id)
        .eq('metric_name', metricName)
        .gte('record_date', startDate)
        .lte('record_date', endDate)
        .order('record_date', { ascending: true })

    if (error) throw error
    return data || []
}

/**
 * Create a new performance tracking record
 */
export async function createPerformanceTracking(tracking: Omit<PerformanceTracking, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'store_id'>) {
    const { data: profile } = await supabase.auth.getUser()
    if (!profile.user) throw new Error('User not authenticated')

    const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('store_id')
        .eq('id', profile.user.id)
        .single()

    if (!userProfile?.store_id) throw new Error('User has no store assigned')

    const { data, error } = await supabase
        .from('performance_tracking')
        .insert([{
            ...tracking,
            store_id: userProfile.store_id,
            created_by: profile.user.id
        }])
        .select()
        .single()

    if (error) throw error
    return data
}

/**
 * Update a performance tracking record
 */
export async function updatePerformanceTracking(id: string, updates: Partial<Omit<PerformanceTracking, 'id' | 'store_id' | 'created_at' | 'created_by'>>) {
    const { data, error } = await supabase
        .from('performance_tracking')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

/**
 * Delete a performance tracking record
 */
export async function deletePerformanceTracking(id: string) {
    const { error } = await supabase
        .from('performance_tracking')
        .delete()
        .eq('id', id)

    if (error) throw error
    return true
}

/**
 * Get performance summary for a period
 */
export async function getPerformanceSummary(startDate: string, endDate: string) {
    const records = await getPerformanceTrackingByDateRange(startDate, endDate)

    const summary = {
        cmp: { ok: 0, nok: 0, total: 0, rate: 0 },
        pl: { ok: 0, nok: 0, total: 0, rate: 0 },
        aval: { ok: 0, nok: 0, total: 0, rate: 0 },
        gastos_gerais: { ok: 0, nok: 0, total: 0, rate: 0 },
        overall: { ok: 0, nok: 0, total: 0, rate: 0 }
    }

    records.forEach(record => {
        const metric = summary[record.metric_name]
        metric.total++
        if (record.status === 'OK') {
            metric.ok++
            summary.overall.ok++
        } else {
            metric.nok++
            summary.overall.nok++
        }
        summary.overall.total++
    })

    // Calculate rates
    Object.keys(summary).forEach(key => {
        const metric = summary[key as keyof typeof summary]
        metric.rate = metric.total > 0 ? (metric.ok / metric.total) * 100 : 0
    })

    return summary
}

/**
 * Get monthly performance tracking grouped by metric
 */
export async function getMonthlyPerformanceTracking(year: number) {
    const startDate = `${year}-01-01`
    const endDate = `${year}-12-31`

    const records = await getPerformanceTrackingByDateRange(startDate, endDate)

    const grouped = records.reduce((acc, record) => {
        const month = new Date(record.record_date).getMonth()
        if (!acc[month]) {
            acc[month] = {
                month,
                cmp: 'NOK',
                pl: 'NOK',
                aval: 'NOK',
                gastos_gerais: 'NOK',
                total_ok: 0,
                total: 0
            }
        }

        acc[month][record.metric_name] = record.status
        acc[month].total++
        if (record.status === 'OK') {
            acc[month].total_ok++
        }

        return acc
    }, {} as Record<number, any>)

    return Object.values(grouped).map((item: any) => ({
        ...item,
        taxa: item.total > 0 ? `${Math.round((item.total_ok / item.total) * 100)}%` : '0%'
    }))
}
/**
 * Clear all performance tracking records for the current store
 */
export async function clearAllPerformanceTracking() {
    const { data: profile } = await supabase.auth.getUser()
    if (!profile.user) throw new Error('User not authenticated')

    const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('store_id')
        .eq('id', profile.user.id)
        .single()

    if (!userProfile?.store_id) throw new Error('User has no store assigned')

    const { error } = await supabase
        .from('performance_tracking')
        .delete()
        .eq('store_id', userProfile.store_id)

    if (error) throw error
    return true
}
