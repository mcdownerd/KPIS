import { supabase } from '../supabase'

export interface Utility {
    id: string;
    store_id: string;
    utility_type: 'water' | 'electricity' | 'gas';
    reading_date: string;
    reading_value: number;
    cost: number;
    notes?: string;
    created_at?: string;
    updated_at?: string;
    created_by?: string;
}

/**
 * Fetch all utilities for the current user's store
 */
export async function getUtilities() {
    const { data: profile } = await supabase.auth.getUser()
    if (!profile.user) throw new Error('User not authenticated')

    // Get user's store_id
    const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('store_id')
        .eq('id', profile.user.id)
        .single()

    if (!userProfile?.store_id) {
        console.warn('User has no store assigned')
        return []
    }

    const { data, error } = await supabase
        .from('utilities')
        .select('*')
        .eq('store_id', userProfile.store_id)
        .order('reading_date', { ascending: false })

    if (error) throw error
    return data || []
}

/**
 * Fetch utilities for a specific month
 */
export async function getUtilitiesByMonth(month: number, year: number) {
    const { data: profile } = await supabase.auth.getUser()
    if (!profile.user) throw new Error('User not authenticated')

    // Get user's store_id
    const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('store_id')
        .eq('id', profile.user.id)
        .single()

    if (!userProfile?.store_id) {
        return []
    }

    // Calculate start and end dates for the month
    // Note: month is 0-indexed (0 = January)
    const startDate = new Date(year, month, 1).toISOString().split('T')[0]
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0]

    const { data, error } = await supabase
        .from('utilities')
        .select('*')
        .eq('store_id', userProfile.store_id)
        .gte('reading_date', startDate)
        .lte('reading_date', endDate)

    if (error) throw error
    return data || []
}

/**
 * Fetch utilities for a specific date range
 */
export async function getUtilitiesByDateRange(startDate: string, endDate: string) {
    const { data: profile } = await supabase.auth.getUser()
    if (!profile.user) throw new Error('User not authenticated')

    // Get user's store_id
    const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('store_id')
        .eq('id', profile.user.id)
        .single()

    if (!userProfile?.store_id) {
        return []
    }

    const { data, error } = await supabase
        .from('utilities')
        .select('*')
        .eq('store_id', userProfile.store_id)
        .gte('reading_date', startDate)
        .lte('reading_date', endDate)
        .order('reading_date', { ascending: true })

    if (error) throw error
    return data || []
}

/**
 * Upsert a utility reading (insert or update if exists)
 */
export async function upsertUtilityReading(
    date: string,
    type: string,
    value: number,
    cost: number = 0
) {
    const { data: profile } = await supabase.auth.getUser()
    if (!profile.user) throw new Error('User not authenticated')

    const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('store_id')
        .eq('id', profile.user.id)
        .single()

    if (!userProfile?.store_id) throw new Error('User has no store assigned')

    // Check if reading exists
    const { data: existing } = await supabase
        .from('utilities')
        .select('id')
        .eq('store_id', userProfile.store_id)
        .eq('reading_date', date)
        .eq('utility_type', type)
        .single()

    if (existing) {
        // Update
        const { data, error } = await supabase
            .from('utilities')
            .update({
                reading_value: value,
                cost: cost,
                updated_at: new Date().toISOString()
            })
            .eq('id', existing.id)
            .select()
            .single()

        if (error) throw error
        return data
    } else {
        // Insert
        const { data, error } = await supabase
            .from('utilities')
            .insert([{
                store_id: userProfile.store_id,
                reading_date: date,
                utility_type: type,
                reading_value: value,
                cost: cost,
                created_by: profile.user.id
            }])
            .select()
            .single()

        if (error) throw error
        return data
    }
}

/**
 * Create a new utility record
 */
export async function createUtility(utility: Omit<Utility, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'store_id'>) {
    const { data: profile } = await supabase.auth.getUser()
    if (!profile.user) throw new Error('User not authenticated')

    // Get user's store_id
    const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('store_id')
        .eq('id', profile.user.id)
        .single()

    if (!userProfile?.store_id) throw new Error('User has no store assigned')

    const { data, error } = await supabase
        .from('utilities')
        .insert([{
            ...utility,
            store_id: userProfile.store_id,
            created_by: profile.user.id
        }])
        .select()
        .single()

    if (error) throw error
    return data
}

/**
 * Update an existing utility record
 */
export async function updateUtility(id: string, updates: Partial<Omit<Utility, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'store_id'>>) {
    const { data, error } = await supabase
        .from('utilities')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

/**
 * Delete a utility record
 */
export async function deleteUtility(id: string) {
    const { error } = await supabase
        .from('utilities')
        .delete()
        .eq('id', id)

    if (error) throw error
    return true
}
