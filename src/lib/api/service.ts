import { supabase } from '../supabase'

// Helper to get user's store
async function getUserStore() {
    const { data: profile } = await supabase.auth.getUser()
    if (!profile.user) throw new Error('User not authenticated')

    const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('store_id')
        .eq('id', profile.user.id)
        .single()

    if (!userProfile?.store_id) throw new Error('User has no store assigned')
    return { user: profile.user, store_id: userProfile.store_id }
}

// --- Service Time Metrics ---
export async function upsertServiceTimeMetrics(data: any) {
    const { user, store_id } = await getUserStore()

    // Check for existing record
    const { data: existing } = await supabase
        .from('service_time_metrics')
        .select('id')
        .eq('store_id', store_id)
        .eq('month_name', data.month_name)
        .eq('record_date', data.record_date)
        .maybeSingle()

    if (existing) {
        const { data: updated, error } = await supabase
            .from('service_time_metrics')
            .update(data)
            .eq('id', existing.id)
            .select()
            .single()
        if (error) throw error
        return updated
    } else {
        const { data: inserted, error } = await supabase
            .from('service_time_metrics')
            .insert([{ ...data, store_id, created_by: user.id }])
            .select()
            .single()
        if (error) throw error
        return inserted
    }
}

export async function getServiceTimeMetrics(month: string, storeId?: string) {
    let query = supabase
        .from('service_time_metrics')
        .select('*')
        .eq('month_name', month)

    if (storeId) {
        query = query.eq('store_id', storeId)
    }

    const { data, error } = await (storeId ? query.maybeSingle() : query)
    if (error) throw error
    return data
}

// --- Quality Metrics ---
export async function upsertQualityMetrics(data: any) {
    const { user, store_id } = await getUserStore()

    const { data: existing } = await supabase
        .from('quality_metrics')
        .select('id')
        .eq('store_id', store_id)
        .eq('month_name', data.month_name)
        .eq('record_date', data.record_date)
        .maybeSingle()

    if (existing) {
        const { data: updated, error } = await supabase
            .from('quality_metrics')
            .update(data)
            .eq('id', existing.id)
            .select()
            .single()
        if (error) throw error
        return updated
    } else {
        const { data: inserted, error } = await supabase
            .from('quality_metrics')
            .insert([{ ...data, store_id, created_by: user.id }])
            .select()
            .single()
        if (error) throw error
        return inserted
    }
}

export async function getQualityMetrics(month: string, storeId?: string) {
    let query = supabase
        .from('quality_metrics')
        .select('*')
        .eq('month_name', month)

    if (storeId) {
        query = query.eq('store_id', storeId)
    }

    const { data, error } = await (storeId ? query.maybeSingle() : query)
    if (error) throw error
    return data
}

// --- Complaints Metrics ---
export async function upsertComplaintsMetrics(data: any) {
    const { user, store_id } = await getUserStore()

    const { data: existing } = await supabase
        .from('complaints_metrics')
        .select('id')
        .eq('store_id', store_id)
        .eq('month_name', data.month_name)
        .eq('record_date', data.record_date)
        .maybeSingle()

    if (existing) {
        const { data: updated, error } = await supabase
            .from('complaints_metrics')
            .update({ ...data, updated_at: new Date().toISOString() })
            .eq('id', existing.id)
            .select()
            .maybeSingle()
        if (error) throw error
        return updated
    } else {
        const { data: inserted, error } = await supabase
            .from('complaints_metrics')
            .insert([{ ...data, store_id, created_by: user.id }])
            .select()
            .maybeSingle()
        if (error) throw error
        return inserted
    }
}

export async function upsertComplaintsMetricsForStore(data: any, storeId: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data: existing } = await supabase
        .from('complaints_metrics')
        .select('id')
        .eq('store_id', storeId)
        .eq('month_name', data.month_name)
        .eq('record_date', data.record_date)
        .maybeSingle()

    if (existing) {
        const { data: updated, error } = await supabase
            .from('complaints_metrics')
            .update({ ...data, updated_at: new Date().toISOString() })
            .eq('id', existing.id)
            .select()
            .maybeSingle()
        if (error) throw error
        return updated
    } else {
        const { data: inserted, error } = await supabase
            .from('complaints_metrics')
            .insert([{ ...data, store_id: storeId, created_by: user.id }])
            .select()
            .maybeSingle()
        if (error) throw error
        return inserted
    }
}

export async function getComplaintsMetrics(month: string, storeId?: string) {
    let query = supabase
        .from('complaints_metrics')
        .select('*')
        .eq('month_name', month)

    if (storeId) {
        query = query.eq('store_id', storeId)
    }

    const { data, error } = await (storeId ? query.maybeSingle() : query)
    if (error) throw error
    return data
}

// --- Digital Communication Metrics ---
export async function upsertDigitalCommMetrics(data: any) {
    const { user, store_id } = await getUserStore()

    const { data: existing } = await supabase
        .from('digital_communication_metrics')
        .select('id')
        .eq('store_id', store_id)
        .eq('month_name', data.month_name)
        .eq('record_date', data.record_date)
        .maybeSingle()

    if (existing) {
        const { data: updated, error } = await supabase
            .from('digital_communication_metrics')
            .update(data)
            .eq('id', existing.id)
            .select()
            .maybeSingle()
        if (error) throw error
        return updated
    }
}

export async function upsertDigitalCommMetricsForStore(data: any, storeId: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data: existing } = await supabase
        .from('digital_communication_metrics')
        .select('id')
        .eq('store_id', storeId)
        .eq('month_name', data.month_name)
        .eq('record_date', data.record_date)
        .maybeSingle()

    if (existing) {
        const { data: updated, error } = await supabase
            .from('digital_communication_metrics')
            .update({ ...data, updated_at: new Date().toISOString() })
            .eq('id', existing.id)
            .select()
            .maybeSingle()
        if (error) throw error
        return updated
    } else {
        const { data: inserted, error } = await supabase
            .from('digital_communication_metrics')
            .insert([{ ...data, store_id: storeId, created_by: user.id }])
            .select()
            .maybeSingle()
        if (error) throw error
        return inserted
    }
}

export async function getDigitalCommMetrics(month: string, storeId?: string) {
    let query = supabase
        .from('digital_communication_metrics')
        .select('*')
        .eq('month_name', month)

    if (storeId) {
        query = query.eq('store_id', storeId)
    }

    const { data, error } = await (storeId ? query.maybeSingle() : query)
    if (error) throw error
    return data
}

// --- Uber Metrics ---
export async function upsertUberMetrics(data: any) {
    const { user, store_id } = await getUserStore()

    const { data: existing } = await supabase
        .from('uber_metrics')
        .select('id')
        .eq('store_id', store_id)
        .eq('month_name', data.month_name)
        .eq('record_date', data.record_date)
        .maybeSingle()

    if (existing) {
        const { data: updated, error } = await supabase
            .from('uber_metrics')
            .update(data)
            .eq('id', existing.id)
            .select()
            .single()
        if (error) throw error
        return updated
    } else {
        const { data: inserted, error } = await supabase
            .from('uber_metrics')
            .insert([{ ...data, store_id, created_by: user.id }])
            .select()
            .single()
        if (error) throw error
        return inserted
    }
}

export async function getUberMetrics(month: string, storeId?: string) {
    let query = supabase
        .from('uber_metrics')
        .select('*')
        .eq('month_name', month)

    if (storeId) {
        query = query.eq('store_id', storeId)
    }

    const { data, error } = await (storeId ? query.maybeSingle() : query)
    if (error) throw error
    return data
}

// --- Sales Summary Metrics ---
export async function upsertSalesSummaryMetrics(data: any) {
    const { user, store_id } = await getUserStore()

    const { data: existing } = await supabase
        .from('sales_summary_metrics')
        .select('id')
        .eq('store_id', store_id)
        .eq('month_name', data.month_name)
        .eq('record_date', data.record_date)
        .maybeSingle()

    if (existing) {
        const { data: updated, error } = await supabase
            .from('sales_summary_metrics')
            .update(data)
            .eq('id', existing.id)
            .select()
            .single()
        if (error) throw error
        return updated
    } else {
        const { data: inserted, error } = await supabase
            .from('sales_summary_metrics')
            .insert([{ ...data, store_id, created_by: user.id }])
            .select()
            .single()
        if (error) throw error
        return inserted
    }
}

export async function getSalesSummaryMetrics(month: string, storeId?: string) {
    let query = supabase
        .from('sales_summary_metrics')
        .select('*')
        .eq('month_name', month)

    if (storeId) {
        query = query.eq('store_id', storeId)
    }

    const { data, error } = await (storeId ? query.maybeSingle() : query)
    if (error) throw error
    return data
}

export async function getSalesSummaryMetricsByDateRange(startDate: string, endDate: string) {
    const { user, store_id } = await getUserStore()

    const { data, error } = await supabase
        .from('sales_summary_metrics')
        .select('*')
        .eq('store_id', store_id)
        .gte('record_date', startDate)
        .lte('record_date', endDate)
        .order('record_date', { ascending: true })

    if (error) throw error
    return data || []
}

export async function getAllSalesSummaryMetricsByDateRange(startDate: string, endDate: string) {
    const { data: profile } = await supabase.auth.getUser()
    if (!profile.user) throw new Error('User not authenticated')

    // Fetch for all stores, no store_id filter
    const { data, error } = await supabase
        .from('sales_summary_metrics')
        .select('*')
        .gte('record_date', startDate)
        .lte('record_date', endDate)
        .order('record_date', { ascending: true })

    if (error) throw error
    return data || []
}
