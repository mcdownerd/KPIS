import { supabase } from '../supabase'

export interface InventoryDeviation {
    id: string;
    store_id: string;
    record_date: string;
    item_name: string;
    deviation_value: number; // valor do desvio (positivo ou negativo)
    status: 'ok' | 'warning' | 'critical';
    created_at?: string;
    updated_at?: string;
    created_by?: string;
}

/**
 * Fetch inventory deviations for a specific date range
 * Now fetches from ALL stores to enable cross-store visibility
 */
export async function getInventoryDeviationsByDateRange(startDate: string, endDate: string) {
    const { data: profile } = await supabase.auth.getUser()
    if (!profile.user) throw new Error('User not authenticated')

    // Fetch deviations from ALL stores (not filtered by user's store)
    const { data, error } = await supabase
        .from('inventory_deviations')
        .select('*')
        .gte('record_date', startDate)
        .lte('record_date', endDate)
        .order('record_date', { ascending: true })

    if (error) throw error
    return data || []
}

/**
 * Get inventory deviations by month
 */
export async function getInventoryDeviationsByMonth(month: number, year: number) {
    const startDate = new Date(year, month, 1).toISOString().split('T')[0]
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0]

    return getInventoryDeviationsByDateRange(startDate, endDate)
}

/**
 * Create a new inventory deviation record
 */
export async function createInventoryDeviation(deviation: Omit<InventoryDeviation, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'store_id'>) {
    const { data: profile } = await supabase.auth.getUser()
    if (!profile.user) throw new Error('User not authenticated')

    const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('store_id')
        .eq('id', profile.user.id)
        .single()

    if (!userProfile?.store_id) throw new Error('User has no store assigned')

    const { data, error } = await supabase
        .from('inventory_deviations')
        .insert([{
            ...deviation,
            store_id: userProfile.store_id,
            created_by: profile.user.id
        }])
        .select()
        .single()

    if (error) throw error
    return data
}

/**
 * Upsert (Update or Insert) an inventory deviation record
 * Checks if a record exists for the same store, date, and item. If so, updates it. Otherwise, inserts a new one.
 */
export async function upsertInventoryDeviation(deviation: Omit<InventoryDeviation, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'store_id'>) {
    const { data: profile } = await supabase.auth.getUser()
    if (!profile.user) throw new Error('User not authenticated')

    const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('store_id')
        .eq('id', profile.user.id)
        .single()

    if (!userProfile?.store_id) throw new Error('User has no store assigned')

    // Check if record exists
    const { data: existingRecord } = await supabase
        .from('inventory_deviations')
        .select('id')
        .eq('store_id', userProfile.store_id)
        .eq('record_date', deviation.record_date)
        .eq('item_name', deviation.item_name)
        .maybeSingle()

    if (existingRecord) {
        // Update existing record
        const { data, error } = await supabase
            .from('inventory_deviations')
            .update({
                deviation_value: deviation.deviation_value,
                status: deviation.status,
                updated_at: new Date().toISOString()
            })
            .eq('id', existingRecord.id)
            .select()
            .single()

        if (error) throw error
        return data
    } else {
        // Insert new record
        const { data, error } = await supabase
            .from('inventory_deviations')
            .insert([{
                ...deviation,
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
 * Update an inventory deviation record
 */
export async function updateInventoryDeviation(id: string, updates: Partial<Omit<InventoryDeviation, 'id' | 'store_id' | 'created_at' | 'created_by'>>) {
    const { data, error } = await supabase
        .from('inventory_deviations')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

/**
 * Delete an inventory deviation record
 */
export async function deleteInventoryDeviation(id: string) {
    const { error } = await supabase
        .from('inventory_deviations')
        .delete()
        .eq('id', id)

    if (error) throw error
    return true
}

/**
 * Get inventory deviation summary by status
 */
export async function getInventoryDeviationSummary(startDate: string, endDate: string) {
    const deviations = await getInventoryDeviationsByDateRange(startDate, endDate)

    const summary = {
        ok: 0,
        warning: 0,
        critical: 0,
        total: deviations.length
    }

    deviations.forEach(deviation => {
        summary[deviation.status]++
    })

    return summary
}

/**
 * Get critical deviations (for alerts)
 */
export async function getCriticalDeviations(startDate: string, endDate: string) {
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
        .from('inventory_deviations')
        .select('*')
        .eq('store_id', userProfile.store_id)
        .eq('status', 'critical')
        .gte('record_date', startDate)
        .lte('record_date', endDate)
        .order('record_date', { ascending: false })

    if (error) throw error
    return data || []
}

/**
 * Calculate deviation status based on value
 */
export function calculateDeviationStatus(deviationValue: number): 'ok' | 'warning' | 'critical' {
    const absValue = Math.abs(deviationValue)

    if (absValue <= 50) {
        return 'ok'
    } else if (absValue <= 100) {
        return 'warning'
    } else {
        return 'critical'
    }
}
