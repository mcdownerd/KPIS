import { supabase } from '../supabase'

export interface ProductYield {
    id: string;
    store_id: string;
    record_date: string;
    product_name: string;
    yield_value: number;
    created_at?: string;
    updated_at?: string;
    created_by?: string;
}

export async function upsertYield(yieldData: Omit<ProductYield, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'store_id'>) {
    const { data: profile } = await supabase.auth.getUser()
    if (!profile.user) throw new Error('User not authenticated')

    const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('store_id')
        .eq('id', profile.user.id)
        .single()

    if (!userProfile?.store_id) throw new Error('User has no store assigned')

    // Check if record exists for this product and date
    const { data: existing } = await supabase
        .from('product_yields')
        .select('id')
        .eq('store_id', userProfile.store_id)
        .eq('record_date', yieldData.record_date)
        .eq('product_name', yieldData.product_name)
        .maybeSingle()

    if (existing) {
        // Update
        const { data, error } = await supabase
            .from('product_yields')
            .update({ yield_value: yieldData.yield_value })
            .eq('id', existing.id)
            .select()
            .single()

        if (error) throw error
        return data
    } else {
        // Insert
        const { data, error } = await supabase
            .from('product_yields')
            .insert([{
                ...yieldData,
                store_id: userProfile.store_id,
                created_by: profile.user.id
            }])
            .select()
            .single()

        if (error) throw error
        return data
    }
}

export async function getYieldsByMonth(month: number, year: number) {
    const { data: profile } = await supabase.auth.getUser()
    if (!profile.user) throw new Error('User not authenticated')

    const startDate = new Date(year, month, 1).toISOString().split('T')[0]
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0]

    // Fetch yields from ALL stores (not filtered by user's store)
    const { data, error } = await supabase
        .from('product_yields')
        .select('*')
        .gte('record_date', startDate)
        .lte('record_date', endDate)
        .order('record_date', { ascending: true })

    if (error) throw error
    return data || []
}

