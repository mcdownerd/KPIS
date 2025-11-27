import { supabase } from '../supabase'

export interface Sale {
    id: string;
    store_id: string;
    sale_date: string;
    platform: 'Delivery' | 'Sala' | 'MOP';
    total_value: number;
    created_at?: string;
    updated_at?: string;
    created_by?: string;
}

/**
 * Fetch sales for a specific date range
 */
export async function getSalesByDateRange(startDate: string, endDate: string) {
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
        .from('sales')
        .select('*')
        .eq('store_id', userProfile.store_id)
        .gte('sale_date', startDate)
        .lte('sale_date', endDate)
        .order('sale_date', { ascending: true })

    if (error) throw error
    return data || []
}

/**
 * Get sales aggregated by month
 */
export async function getSalesByMonth(year: number) {
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

    const startDate = `${year}-01-01`
    const endDate = `${year}-12-31`

    const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('store_id', userProfile.store_id)
        .gte('sale_date', startDate)
        .lte('sale_date', endDate)
        .order('sale_date', { ascending: true })

    if (error) throw error
    return data || []
}

/**
 * Create a new sale record
 */
export async function createSale(sale: Omit<Sale, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'store_id'>) {
    const { data: profile } = await supabase.auth.getUser()
    if (!profile.user) throw new Error('User not authenticated')

    const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('store_id')
        .eq('id', profile.user.id)
        .single()

    if (!userProfile?.store_id) throw new Error('User has no store assigned')

    const { data, error } = await supabase
        .from('sales')
        .insert([{
            ...sale,
            store_id: userProfile.store_id,
            created_by: profile.user.id
        }])
        .select()
        .single()

    if (error) throw error
    return data
}

/**
 * Update a sale record
 */
export async function updateSale(id: string, updates: Partial<Omit<Sale, 'id' | 'store_id' | 'created_at' | 'created_by'>>) {
    const { data, error } = await supabase
        .from('sales')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

/**
 * Delete a sale record
 */
export async function deleteSale(id: string) {
    const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', id)

    if (error) throw error
    return true
}

/**
 * Get sales summary by platform for a date range
 */
export async function getSalesSummaryByPlatform(startDate: string, endDate: string) {
    const sales = await getSalesByDateRange(startDate, endDate)

    const summary = sales.reduce((acc, sale) => {
        if (!acc[sale.platform]) {
            acc[sale.platform] = 0
        }
        acc[sale.platform] += sale.total_value
        return acc
    }, {} as Record<string, number>)

    return summary
}
