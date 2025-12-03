import { useState, useEffect } from 'react'
import { getCurrentUser, getCurrentUserProfile, onAuthStateChange, mapSupabaseUserToProfile } from '@/lib/api/auth'
import type { User } from '@supabase/supabase-js'

interface UserProfile {
    id: string
    full_name: string | null
    email: string | null
    role: string
    store_id: string | null
    is_admin: boolean
    store_name?: string | null
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false;

        const { data: { subscription } } = onAuthStateChange(async (event, session) => {
            if (cancelled) return;

            // Handle auth state changes
            if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
                setUser(session.user)
                setLoading(true)

                try {
                    // Add timeout protection (2 seconds)
                    const profilePromise = getCurrentUserProfile()
                    const timeoutPromise = new Promise<null>((resolve) =>
                        setTimeout(() => {
                            console.warn('Profile load timed out - using session data')
                            resolve(null)
                        }, 2000)
                    )

                    const userProfile = await Promise.race([profilePromise, timeoutPromise])

                    if (cancelled) return;

                    // If timeout occurred, extract from session directly
                    if (!userProfile && session.user) {
                        setProfile(mapSupabaseUserToProfile(session.user))
                    } else {
                        setProfile(userProfile)
                    }
                } catch (error) {
                    console.error('[useAuth] Error loading profile:', error)
                    // Fallback to session data
                    if (session.user) {
                        setProfile(mapSupabaseUserToProfile(session.user))
                    }
                } finally {
                    if (!cancelled) {
                        setLoading(false)
                    }
                }
            } else if (event === 'SIGNED_OUT') {
                setUser(null)
                setProfile(null)
                setLoading(false)
            }
        })

        return () => {
            cancelled = true;
            subscription.unsubscribe()
        }
    }, [])

    const isAdmin = profile?.is_admin || profile?.role === 'admin'
    const isManager = profile?.role === 'gerente'
    const isConsultant = profile?.role === 'consultor'
    const canAccessAdmin = isAdmin || isManager
    const hasStore = !!profile?.store_id

    return {
        user,
        profile,
        loading,
        isAdmin,
        isManager,
        isConsultant,
        canAccessAdmin,
        hasStore,
        refetch: async () => {
            const currentUser = await getCurrentUser()
            setUser(currentUser)
            if (currentUser) {
                const userProfile = await getCurrentUserProfile()
                setProfile(userProfile)
            }
        },
    }
}
