import { supabase } from '../supabase'

export interface CashRegisterShift {
    id: string;
    store_id: string;
    shift_date: string;
    shift_type: 'morning' | 'night';
    operator_name: string;
    gcs: number;
    sales: number;
    cash: number;
    mb: number;
    mbp: number;
    tr_euro: number;
    difference: number;
    reimbursement_qty: number;
    reimbursement_value: number;
    reimbursement_note?: string;
    manager_name?: string;
    created_at?: string;
    updated_at?: string;
    created_by?: string;
}

/**
 * Fetch cash register shifts for a specific month
 */
export async function getCashRegisterShiftsByMonth(month: number, year: number) {
    const { data: profile } = await supabase.auth.getUser()
    if (!profile.user) throw new Error('User not authenticated')

    const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('store_id')
        .eq('id', profile.user.id)
        .single()

    if (!userProfile?.store_id) return []

    const startDate = new Date(year, month, 1).toISOString().split('T')[0]
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0]

    const { data, error } = await supabase
        .from('cash_register_shifts')
        .select('*')
        .eq('store_id', userProfile.store_id)
        .gte('shift_date', startDate)
        .lte('shift_date', endDate)

    if (error) throw error
    return data || []
}

/**
 * Upsert a cash register shift
 */
export async function upsertCashRegisterShift(shift: Omit<CashRegisterShift, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'store_id'> & { id?: string }) {
    const { data: profile } = await supabase.auth.getUser()
    if (!profile.user) throw new Error('User not authenticated')

    const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('store_id')
        .eq('id', profile.user.id)
        .single()

    if (!userProfile?.store_id) throw new Error('User has no store assigned')

    const shiftData = {
        ...shift,
        store_id: userProfile.store_id,
        created_by: profile.user.id
    }

    // If ID is provided, update. If not, insert.
    // However, for upserting based on logic, we might want to match by date/type/operator if ID is missing?
    // For now, let's assume the UI handles IDs or we insert new.

    if (shift.id) {
        const { data, error } = await supabase
            .from('cash_register_shifts')
            .update({
                ...shift,
                updated_at: new Date().toISOString()
            })
            .eq('id', shift.id)
            .select()
            .single()

        if (error) throw error
        return data
    } else {
        const { data, error } = await supabase
            .from('cash_register_shifts')
            .insert([shiftData])
            .select()
            .single()

        if (error) throw error
        return data
    }
}

/**
 * Delete a cash register shift
 */
export async function deleteCashRegisterShift(id: string) {
    const { error } = await supabase
        .from('cash_register_shifts')
        .delete()
        .eq('id', id)

    if (error) throw error
    return true
}
