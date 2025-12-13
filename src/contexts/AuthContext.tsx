import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react'
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

    // Refs to track state inside the event listener without dependencies
    const mountedRef = useRef(true)
    const lastUserIdRef = useRef<string | null>(null)
    const profileLoadedRef = useRef(false)

    useEffect(() => {
        mountedRef.current = true
        return () => { mountedRef.current = false }
    }, [])

    useEffect(() => {
        console.log('[AuthProvider] Initializing...')

        // Initial check
        getCurrentUser().then(async (currentUser) => {
            if (!mountedRef.current) return;

            if (currentUser) {
                setUser(currentUser)
                lastUserIdRef.current = currentUser.id
                try {
                    const userProfile = await getCurrentUserProfile()
                    if (mountedRef.current) {
                        setProfile(userProfile)
                        profileLoadedRef.current = true
                    }
                } catch (error) {
                    console.error('[AuthProvider] Error loading initial profile:', error)
                }
            }
            if (mountedRef.current) setLoading(false)
        })

        const { data: { subscription } } = onAuthStateChange(async (event, session) => {
            if (!mountedRef.current) return;

            if (session?.user) {
                const userId = session.user.id
                const isSameUser = userId === lastUserIdRef.current

                setUser(session.user)
                lastUserIdRef.current = userId

                // Determine if we need to fetch the profile
                const needsInitialFetch = !isSameUser || !profileLoadedRef.current;
                // Revalidation happens on SIGNED_IN event for existing user (e.g. window focus)
                const isRevalidation = isSameUser && profileLoadedRef.current && event === 'SIGNED_IN';

                if (needsInitialFetch || isRevalidation) {
                    // Only set loading to true if it's an initial fetch (new user or first load)
                    // Do NOT set loading for revalidations (window focus) or token refreshes
                    if (needsInitialFetch && event !== 'TOKEN_REFRESHED') {
                        setLoading(true)
                    }

                    try {
                        // Race condition protection
                        const profilePromise = getCurrentUserProfile()
                        const timeoutPromise = new Promise<null>((resolve) =>
                            setTimeout(() => resolve(null), 3000)
                        )

                        const userProfile = await Promise.race([profilePromise, timeoutPromise])

                        if (!mountedRef.current) return;

                        if (!userProfile && session.user) {
                            // Fallback
                            setProfile(mapSupabaseUserToProfile(session.user))
                        } else {
                            setProfile(userProfile)
                        }
                        profileLoadedRef.current = true
                    } catch (error) {
                        console.error('[AuthProvider] Error loading profile:', error)
                        if (session.user) {
                            setProfile(mapSupabaseUserToProfile(session.user))
                        }
                    } finally {
                        // Only turn off loading if we turned it on
                        if (mountedRef.current && needsInitialFetch) {
                            setLoading(false)
                        }
                    }
                }
            } else if (event === 'SIGNED_OUT') {
                setUser(null)
                setProfile(null)
                lastUserIdRef.current = null
                profileLoadedRef.current = false
                setLoading(false)
            }
        })

        return () => {
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
            profileLoadedRef.current = true
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
