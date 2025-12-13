import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
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

interface AuthContextType {
    user: User | null
    profile: UserProfile | null
    loading: boolean
    isAdmin: boolean
    isManager: boolean
    isSupervisor: boolean
    isAdminOrSupervisor: boolean
    canAccessAdmin: boolean
    hasStore: boolean
    refetch: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        console.log('[AuthProvider] Initializing...')
        let cancelled = false;

        // Check current session immediately
        getCurrentUser().then(async (currentUser) => {
            if (cancelled) return;

            if (currentUser) {
                setUser(currentUser)
                try {
                    const userProfile = await getCurrentUserProfile()
                    if (!cancelled) setProfile(userProfile)
                } catch (error) {
                    console.error('[AuthProvider] Error loading initial profile:', error)
                }
            }
            if (!cancelled) setLoading(false)
        })

        const { data: { subscription } } = onAuthStateChange(async (event, session) => {
            console.log('[AuthProvider] Event:', event, 'Session:', !!session)
            if (cancelled) return;

            if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') && session?.user) {
                setUser(session.user)

                // Only fetch profile if we don't have it or if it's a fresh sign in
                if (!profile || event === 'SIGNED_IN') {
                    // Don't set loading true for token refresh to avoid UI flicker
                    if (event !== 'TOKEN_REFRESHED') setLoading(true)

                    try {
                        const profilePromise = getCurrentUserProfile()
                        const timeoutPromise = new Promise<null>((resolve) =>
                            setTimeout(() => resolve(null), 2000)
                        )

                        const userProfile = await Promise.race([profilePromise, timeoutPromise])

                        if (cancelled) return;

                        if (!userProfile && session.user) {
                            setProfile(mapSupabaseUserToProfile(session.user))
                        } else {
                            setProfile(userProfile)
                        }
                    } catch (error) {
                        console.error('[AuthProvider] Error loading profile:', error)
                        if (session.user) {
                            setProfile(mapSupabaseUserToProfile(session.user))
                        }
                    } finally {
                        if (!cancelled) setLoading(false)
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
    const isSupervisor = profile?.role === 'supervisor'
    const canAccessAdmin = isAdmin || isManager
    const hasStore = !!profile?.store_id
    const isAdminOrSupervisor = isAdmin || isSupervisor

    const refetch = async () => {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
        if (currentUser) {
            const userProfile = await getCurrentUserProfile()
            setProfile(userProfile)
        }
    }

    const value = {
        user,
        profile,
        loading,
        isAdmin,
        isManager,
        isSupervisor,
        isAdminOrSupervisor,
        canAccessAdmin,
        hasStore,
        refetch
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
