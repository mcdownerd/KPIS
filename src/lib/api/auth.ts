import { supabase } from '../supabase'

export async function signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                role: 'user',
            },
        },
    })

    if (error) throw error

    // Still insert into user_profiles for backward compatibility
    if (data.user) {
        const { error: profileError } = await supabase
            .from('user_profiles')
            .insert([{
                id: data.user.id,
                email: email,
                full_name: fullName,
                role: 'user',
            }])

        if (profileError) console.warn('Profile insert failed:', profileError)
    }

    return data
}

export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) throw error
    return data
}

export async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return true
}

export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

// Helper to map Supabase user to our UserProfile format
export function mapSupabaseUserToProfile(user: any) {
    if (!user) return null

    const metadata = user.user_metadata || {}

    return {
        id: user.id,
        email: user.email || '',
        full_name: metadata.full_name || user.email?.split('@')[0] || 'Utilizador',
        role: metadata.role || 'user',
        store_id: metadata.store_id || null,
        is_admin: metadata.is_admin === true || metadata.role === 'admin',
        store_name: metadata.store_name || null,
    }
}

export async function getCurrentUserProfile(userId?: string) {
    // Get user from auth (fast, no RLS issues)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Extract profile from user_metadata
    return mapSupabaseUserToProfile(user)
}

export async function updateUserProfile(userId: string, updates: {
    full_name?: string
    store_id?: string
    role?: string
}) {
    // Update both user_metadata and user_profiles table
    const { error: authError } = await supabase.auth.updateUser({
        data: updates
    })

    if (authError) throw authError

    // Also update user_profiles for backward compatibility
    const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

    if (error) console.warn('Profile table update failed:', error)

    // Return the updated profile from metadata
    return mapSupabaseUserToProfile((await getCurrentUser())!)
}

export async function isUserAdmin() {
    const profile = await getCurrentUserProfile()
    return profile?.is_admin || profile?.role === 'admin'
}

export async function resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) throw error
    return true
}

export async function updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
        password: newPassword,
    })

    if (error) throw error
    return true
}

export function onAuthStateChange(callback: (event: string, session: unknown) => void) {
    return supabase.auth.onAuthStateChange(callback)
}
