import { useState, useEffect } from 'react'
import { getCurrentUser, getCurrentUserProfile, onAuthStateChange } from '@/lib/api/auth'
import type { User } from '@supabase/supabase-js'

interface UserProfile {
    id: string
    full_name: string | null
    email: string | null
    role: string
    store_id: string | null
    stores?: {
        id: string
        name: string
        location: string | null
    }
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false;

        // loadInitialAuth removed to avoid race conditions with onAuthStateChange

        const { data: { subscription } } = onAuthStateChange(async (event, session) => {
            // console.log('[useAuth] Event:', event, 'Has session:', !!session, 'User ID:', session?.user?.id)

            // Carregar perfil no SIGNED_IN e INITIAL_SESSION (F5)
            if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
                // console.log('[useAuth] Loading profile for event:', event)
                setUser(session.user)
                setLoading(true)
                try {
                    const userProfile = await getCurrentUserProfile(session.user.id)
                    // console.log('[useAuth] Profile result:', userProfile)
                    setProfile(userProfile)
                } catch (error) {
                    console.error('[useAuth] Error loading profile:', error)
                } finally {
                    setLoading(false)
                }
            } else if (event === 'SIGNED_OUT') {
                setUser(null)
                setProfile(null)
            }
        })

        return () => {
            cancelled = true;
            subscription.unsubscribe()
        }
    }, [])

    const isAdmin = profile?.role === 'admin'
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
