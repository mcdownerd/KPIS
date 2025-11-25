import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
    children: ReactNode
    requireAdmin?: boolean
    requireStore?: boolean
}

export function ProtectedRoute({
    children,
    requireAdmin = false,
    requireStore = false
}: ProtectedRouteProps) {
    const { user, profile, loading, isAdmin, hasStore } = useAuth()

    // Mostrar loading enquanto verifica autenticação
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    // Redirecionar para login se não autenticado
    if (!user) {
        return <Navigate to="/login" replace />
    }

    // Redirecionar para home se requer admin mas não é admin
    if (requireAdmin && !isAdmin) {
        return <Navigate to="/" replace />
    }

    // Mostrar mensagem se requer loja mas não tem
    if (requireStore && !hasStore) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Acesso Restrito</h2>
                    <p className="text-muted-foreground">
                        Você precisa estar associado a uma loja para acessar esta página.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Entre em contato com o administrador.
                    </p>
                </div>
            </div>
        )
    }

    // Renderizar página se autorizado
    return <>{children}</>
}
