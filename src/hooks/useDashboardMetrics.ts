import { useState, useEffect } from 'react';
import { getDashboardMetrics, DashboardMetrics } from '@/lib/api/dashboard';
import { useToast } from './use-toast';

export function useDashboardMetrics() {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchMetrics() {
            try {
                // Por enquanto, pegamos o ano todo de 2025
                const startDate = '2025-01-01';
                const endDate = '2025-12-31';

                const data = await getDashboardMetrics(startDate, endDate);
                setMetrics(data);
            } catch (error) {
                console.error('Error fetching dashboard metrics:', error);
                toast({
                    title: 'Erro ao carregar métricas',
                    description: 'Não foi possível carregar os dados do dashboard.',
                    variant: 'destructive',
                });
            } finally {
                setLoading(false);
            }
        }

        fetchMetrics();
    }, [toast]);

    return { metrics, loading };
}
