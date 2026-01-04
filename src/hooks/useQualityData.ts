import { useState, useEffect } from 'react';
import { getQualityMetrics } from '@/lib/api/service';

export interface QualityMetric {
    id: string;
    store_id: string;
    month_name: string;
    record_date: string;
    sg: number | null;
    precisao: number | null;
    qualidade: number | null;
    rapidez: number | null;
    nps: number | null;
    created_at: string;
    updated_at: string;
}

export function useQualityData(month: string) {
    const [qualityData, setQualityData] = useState<QualityMetric[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await getQualityMetrics(month);
            setQualityData(Array.isArray(data) ? data : data ? [data] : []);
            setError(null);
        } catch (err) {
            console.error('Error fetching quality metrics:', err);
            setError('Erro ao carregar métricas de qualidade');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (month) {
            fetchData();
        }
    }, [month]);

    return { qualityData, loading, error, refetch: fetchData };
}
