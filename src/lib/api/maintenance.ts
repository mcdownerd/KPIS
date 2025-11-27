import { supabase } from '../supabase'

export interface Maintenance {
    id: string;
    store_id: string;
    breakdown_date: string;
    equipment_name: string;
    cause?: string;
    parts_replaced?: string;
    cost?: number;
    status: 'pending' | 'in_progress' | 'completed';
    created_at?: string;
    updated_at?: string;
    created_by?: string;
}

/**
 * Fetch maintenance records for a specific date range
 */
export async function getMaintenanceByDateRange(startDate: string, endDate: string) {
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
        .from('maintenance')
        .select('*')
        .eq('store_id', userProfile.store_id)
        .gte('breakdown_date', startDate)
        .lte('breakdown_date', endDate)
        .order('breakdown_date', { ascending: false })

    if (error) throw error
    return data || []
}

/**
 * Get maintenance records by month
 */
export async function getMaintenanceByMonth(month: number, year: number) {
    const startDate = new Date(year, month, 1).toISOString().split('T')[0]
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0]

    return getMaintenanceByDateRange(startDate, endDate)
}

/**
 * Get maintenance records by year
 */
export async function getMaintenanceByYear(year: number) {
    const startDate = `${year}-01-01`
    const endDate = `${year}-12-31`

    return getMaintenanceByDateRange(startDate, endDate)
}

/**
 * Get maintenance records by status
 */
export async function getMaintenanceByStatus(status: Maintenance['status']) {
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
        .from('maintenance')
        .select('*')
        .eq('store_id', userProfile.store_id)
        .eq('status', status)
        .order('breakdown_date', { ascending: false })

    if (error) throw error
    return data || []
}

/**
 * Create a new maintenance record
 */
export async function createMaintenance(maintenance: Omit<Maintenance, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'store_id'>) {
    const { data: profile } = await supabase.auth.getUser()
    if (!profile.user) throw new Error('User not authenticated')

    const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('store_id')
        .eq('id', profile.user.id)
        .single()

    if (!userProfile?.store_id) throw new Error('User has no store assigned')

    const { data, error } = await supabase
        .from('maintenance')
        .insert([{
            ...maintenance,
            store_id: userProfile.store_id,
            created_by: profile.user.id
        }])
        .select()
        .single()

    if (error) throw error
    return data
}

/**
 * Update a maintenance record
 */
export async function updateMaintenance(id: string, updates: Partial<Omit<Maintenance, 'id' | 'store_id' | 'created_at' | 'created_by'>>) {
    const { data, error } = await supabase
        .from('maintenance')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

/**
 * Delete a maintenance record
 */
export async function deleteMaintenance(id: string) {
    const { error } = await supabase
        .from('maintenance')
        .delete()
        .eq('id', id)

    if (error) throw error
    return true
}

/**
 * Get total maintenance costs for a period
 */
export async function getTotalMaintenanceCosts(startDate: string, endDate: string) {
    const records = await getMaintenanceByDateRange(startDate, endDate)

    return records.reduce((total, record) => {
        return total + (record.cost || 0)
    }, 0)
}

/**
 * Get maintenance summary
 */
export async function getMaintenanceSummary(startDate: string, endDate: string) {
    const records = await getMaintenanceByDateRange(startDate, endDate)

    const summary = {
        total_breakdowns: records.length,
        total_cost: 0,
        pending: 0,
        in_progress: 0,
        completed: 0,
        avg_cost: 0
    }

    records.forEach(record => {
        summary.total_cost += record.cost || 0
        summary[record.status]++
    })

    summary.avg_cost = records.length > 0 ? summary.total_cost / records.length : 0

    return summary
}

/**
 * Get pending maintenance (for alerts)
 */
export async function getPendingMaintenance() {
    return getMaintenanceByStatus('pending')
}
