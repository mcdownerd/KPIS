import { supabase } from '../supabase'

export interface Delivery {
    id: string;
    store_id: string;
    delivery_date: string;
    platform: 'Uber Eats' | 'Glovo' | 'Bolt Food' | 'Takeaway';
    order_count: number;
    total_value: number;
    notes?: string;
    created_at?: string;
    updated_at?: string;
    created_by?: string;
}

/**
 * Fetch deliveries for a specific month
 */
export async function getDeliveriesByMonth(month: number, year: number) {
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

    const startDate = new Date(year, month, 1).toISOString().split('T')[0]
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0]

    const { data, error } = await supabase
        .from('deliveries')
        .select('*')
        .eq('store_id', userProfile.store_id)
        .gte('delivery_date', startDate)
        .lte('delivery_date', endDate)

    if (error) throw error
    return data || []
}

/**
 * Upsert a delivery record
 */
export async function upsertDelivery(
    date: string,
    platform: string,
    field: 'order_count' | 'total_value',
    value: number
) {
    const { data: profile } = await supabase.auth.getUser()
    if (!profile.user) throw new Error('User not authenticated')

    const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('store_id')
        .eq('id', profile.user.id)
        .single()

    if (!userProfile?.store_id) throw new Error('User has no store assigned')

    // Check if record exists
    const { data: existing } = await supabase
        .from('deliveries')
        .select('*')
        .eq('store_id', userProfile.store_id)
        .eq('delivery_date', date)
        .eq('platform', platform)
        .single()

    if (existing) {
        // Update
        const updates: any = { updated_at: new Date().toISOString() }
        updates[field] = value

        const { data, error } = await supabase
            .from('deliveries')
            .update(updates)
            .eq('id', existing.id)
            .select()
            .single()

        if (error) throw error
        return data
    } else {
        // Insert
        const newRecord: any = {
            store_id: userProfile.store_id,
            delivery_date: date,
            platform: platform,
            created_by: profile.user.id,
            order_count: 0,
            total_value: 0
        }
        newRecord[field] = value

        const { data, error } = await supabase
            .from('deliveries')
            .insert([newRecord])
            .select()
            .single()

        if (error) throw error
        return data
    }
}
