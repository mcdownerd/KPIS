import { supabase } from '../supabase'

export interface ServiceTime {
    id: string;
    store_id: string;
    record_date: string;
    lunch_time: number; // tempo em segundos
    dinner_time: number; // tempo em segundos
    day_time: number; // tempo em segundos
    delivery_time?: number; // tempo de delivery em segundos
    target_time: number; // tempo alvo em segundos
    created_at?: string;
    updated_at?: string;
    created_by?: string;
}

/**
 * Fetch service times for a specific date range
 */
export async function getServiceTimesByDateRange(startDate: string, endDate: string) {
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
        .from('service_times')
        .select('*')
        .eq('store_id', userProfile.store_id)
        .gte('record_date', startDate)
        .lte('record_date', endDate)
        .order('record_date', { ascending: true })

    if (error) throw error
    return data || []
}

/**
 * Get service times by month
 */
export async function getServiceTimesByMonth(month: number, year: number) {
    const startDate = new Date(year, month, 1).toISOString().split('T')[0]
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0]

    return getServiceTimesByDateRange(startDate, endDate)
}

/**
 * Create a new service time record
 */
export async function createServiceTime(serviceTime: Omit<ServiceTime, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'store_id'>) {
    const { data: profile } = await supabase.auth.getUser()
    if (!profile.user) throw new Error('User not authenticated')

    const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('store_id')
        .eq('id', profile.user.id)
        .single()

    if (!userProfile?.store_id) throw new Error('User has no store assigned')

    const { data, error } = await supabase
        .from('service_times')
        .insert([{
            ...serviceTime,
            store_id: userProfile.store_id,
            created_by: profile.user.id
        }])
        .select()
        .single()

    if (error) throw error
    return data
}

/**
 * Update a service time record
 */
export async function updateServiceTime(id: string, updates: Partial<Omit<ServiceTime, 'id' | 'store_id' | 'created_at' | 'created_by'>>) {
    const { data, error } = await supabase
        .from('service_times')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

/**
 * Delete a service time record
 */
export async function deleteServiceTime(id: string) {
    const { error } = await supabase
        .from('service_times')
        .delete()
        .eq('id', id)

    if (error) throw error
    return true
}

/**
 * Get average service times for a period
 */
export async function getAverageServiceTimes(startDate: string, endDate: string) {
    const serviceTimes = await getServiceTimesByDateRange(startDate, endDate)

    if (serviceTimes.length === 0) {
        return {
            lunch_avg: 0,
            dinner_avg: 0,
            day_avg: 0
        }
    }

    const totals = serviceTimes.reduce((acc, st) => {
        acc.lunch += st.lunch_time || 0
        acc.dinner += st.dinner_time || 0
        acc.day += st.day_time || 0
        return acc
    }, { lunch: 0, dinner: 0, day: 0 })

    return {
        lunch_avg: Math.round(totals.lunch / serviceTimes.length),
        dinner_avg: Math.round(totals.dinner / serviceTimes.length),
        day_avg: Math.round(totals.day / serviceTimes.length)
    }
}
