import { supabase } from '../supabase'

export interface Cost {
    id: string;
    store_id: string;
    record_date: string;
    cost_type: 'comida' | 'papel' | 'refeicoes' | 'perdas';
    percentage: number;
    target_percentage?: number;
    created_at?: string;
    updated_at?: string;
    created_by?: string;
}

/**
 * Fetch costs for a specific date range
 */
export async function getCostsByDateRange(startDate: string, endDate: string) {
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
        .from('costs')
        .select('*')
        .eq('store_id', userProfile.store_id)
        .gte('record_date', startDate)
        .lte('record_date', endDate)
        .order('record_date', { ascending: true })

    if (error) throw error
    return data || []
}

/**
 * Get costs by month
 */
export async function getCostsByMonth(month: number, year: number) {
    const startDate = new Date(year, month, 1).toISOString().split('T')[0]
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0]

    return getCostsByDateRange(startDate, endDate)
}

/**
 * Get costs by year
 */
export async function getCostsByYear(year: number) {
    const startDate = `${year}-01-01`
    const endDate = `${year}-12-31`

    return getCostsByDateRange(startDate, endDate)
}

/**
 * Create a new cost record
 */
export async function createCost(cost: Omit<Cost, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'store_id'>) {
    const { data: profile } = await supabase.auth.getUser()
    if (!profile.user) throw new Error('User not authenticated')

    const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('store_id')
        .eq('id', profile.user.id)
        .single()

    if (!userProfile?.store_id) throw new Error('User has no store assigned')

    const { data, error } = await supabase
        .from('costs')
        .insert([{
            ...cost,
            store_id: userProfile.store_id,
            created_by: profile.user.id
        }])
        .select()
        .single()

    if (error) throw error
    return data
}

/**
 * Update a cost record
 */
export async function updateCost(id: string, updates: Partial<Omit<Cost, 'id' | 'store_id' | 'created_at' | 'created_by'>>) {
    const { data, error } = await supabase
        .from('costs')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

/**
 * Delete a cost record
 */
export async function deleteCost(id: string) {
    const { error } = await supabase
        .from('costs')
        .delete()
        .eq('id', id)

    if (error) throw error
    return true
}

/**
 * Get cost summary by type for a period
 */
export async function getCostSummary(startDate: string, endDate: string) {
    const costs = await getCostsByDateRange(startDate, endDate)

    const summary = costs.reduce((acc, cost) => {
        if (!acc[cost.cost_type]) {
            acc[cost.cost_type] = {
                total: 0,
                count: 0,
                average: 0
            }
        }
        acc[cost.cost_type].total += cost.percentage
        acc[cost.cost_type].count += 1
        return acc
    }, {} as Record<string, { total: number; count: number; average: number }>)

    // Calculate averages
    Object.keys(summary).forEach(type => {
        summary[type].average = summary[type].total / summary[type].count
    })

    return summary
}

/**
 * Get costs grouped by month for charts
 */
export async function getCostsGroupedByMonth(year: number) {
    const costs = await getCostsByYear(year)

    const grouped = costs.reduce((acc, cost) => {
        const month = new Date(cost.record_date).getMonth()
        if (!acc[month]) {
            acc[month] = {}
        }
        if (!acc[month][cost.cost_type]) {
            acc[month][cost.cost_type] = []
        }
        acc[month][cost.cost_type].push(cost.percentage)
        return acc
    }, {} as Record<number, Record<string, number[]>>)

    // Calculate averages per month
    const result = Object.keys(grouped).map(monthKey => {
        const month = parseInt(monthKey)
        const monthData = grouped[month]
        const averages: Record<string, number> = {}

        Object.keys(monthData).forEach(type => {
            const values = monthData[type]
            averages[type] = values.reduce((sum, val) => sum + val, 0) / values.length
        })

        return {
            month,
            ...averages
        }
    })

    return result
}
