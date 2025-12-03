import { supabase } from '../supabase'

export async function signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
        },
    })

    if (error) throw error

    if (data.user) {
        const { error: profileError } = await supabase
            .from('user_profiles')
            .insert([{
                id: data.user.id,
                email: email,
                full_name: fullName,
                role: 'user',
            }])

        if (profileError) throw profileError
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

export async function getCurrentUserProfile(userId?: string) {
    let targetUserId = userId;
    if (!targetUserId) {
        const user = await getCurrentUser()
        if (!user) return null
        targetUserId = user.id
    }

    try {
        console.log('Fetching profile for:', targetUserId)
        const queryPromise = supabase
            .from('user_profiles')
            .select('*')
            .eq('id', targetUserId)
            .single()

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Query timeout')), 15000)
        )

        const result = await Promise.race([queryPromise, timeoutPromise]) as { data: unknown; error: unknown }
        const { data, error } = result

        if (error) {
            console.error('Error loading profile:', error)
            return null
        }

        return data
    } catch (err) {
        console.error('Error loading profile:', err)
        return null
    }
}

export async function updateUserProfile(userId: string, updates: {
    full_name?: string
    store_id?: string
    role?: string
}) {
    const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function isUserAdmin() {
    const profile = await getCurrentUserProfile()
    return profile?.role === 'admin'
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
