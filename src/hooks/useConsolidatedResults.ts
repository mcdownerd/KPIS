import { useState, useEffect } from 'react';
import { getConsolidatedResults } from '@/lib/api/service';

export interface ConsolidatedResult {
    id: string;
    month_name: string;
    record_date: string;
    metric_category: string;
    metric_name: string;
    pb_value: number | null;
    region_value: number | null;
    typology_value: number | null;
    national_value: number | null;
    ly_value: number | null;
    created_at: string;
    updated_at: string;
}

export function useConsolidatedResults(category?: string) {
    const [results, setResults] = useState<ConsolidatedResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await getConsolidatedResults(category);
            setResults(data || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching consolidated results:', err);
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [category]);

    return { results, loading, error, refetch: fetchData };
}
