import { useState, useEffect } from 'react';
import { getHRMetricsByType, HRMetric } from '@/lib/api/hr';
import { useToast } from './use-toast';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface LaborData {
    month: string;
    vendas: number;
    horas: number;
    prod: number;
    mo: number;
}

export interface MetricData {
    month: string;
    value: number;
    target: number;
}

export function useHRData() {
    const [laborData, setLaborData] = useState<LaborData[]>([]);
    const [turnoverData, setTurnoverData] = useState<MetricData[]>([]);
    const [staffingData, setStaffingData] = useState<MetricData[]>([]);
    const [performanceData, setPerformanceData] = useState<MetricData[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchHRData() {
            try {
                const startDate = '2025-01-01';
                const endDate = '2025-12-31';

                // Fetch all metrics in parallel
                const [labor, turnover, staffing, productivity] = await Promise.all([
                    getHRMetricsByType('labor_cost', startDate, endDate),
                    getHRMetricsByType('turnover_rate', startDate, endDate),
                    getHRMetricsByType('staffing_hours', startDate, endDate),
                    getHRMetricsByType('productivity', startDate, endDate)
                ]);

                // Process Labor Data
                const processedLabor = labor.map(m => {
                    const date = parseISO(m.record_date);
                    const monthName = format(date, 'MMM', { locale: ptBR });
                    return {
                        month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
                        vendas: m.additional_data?.vendas || 0,
                        horas: m.additional_data?.horas || 0,
                        prod: m.additional_data?.prod || 0,
                        mo: m.value
                    };
                });
                setLaborData(processedLabor);

                // Process Turnover Data
                const processedTurnover = turnover.map(m => {
                    const date = parseISO(m.record_date);
                    const monthName = format(date, 'MMM', { locale: ptBR });
                    return {
                        month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
                        value: m.value,
                        target: m.target_value || 2.0
                    };
                });
                setTurnoverData(processedTurnover);

                // Process Staffing Data
                const processedStaffing = staffing.map(m => {
                    const date = parseISO(m.record_date);
                    const monthName = format(date, 'MMM', { locale: ptBR });
                    return {
                        month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
                        value: m.value,
                        target: m.target_value || 100
                    };
                });
                setStaffingData(processedStaffing);

                // Process Performance Data
                const processedPerformance = productivity.map(m => {
                    const date = parseISO(m.record_date);
                    const monthName = format(date, 'MMM', { locale: ptBR });
                    return {
                        month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
                        value: m.value,
                        target: m.target_value || 4.5
                    };
                });
                setPerformanceData(processedPerformance);

            } catch (error) {
                console.error('Error fetching HR data:', error);
                toast({
                    title: 'Erro ao carregar dados de RH',
                    description: 'Não foi possível carregar as métricas de pessoas.',
                    variant: 'destructive',
                });
            } finally {
                setLoading(false);
            }
        }

        fetchHRData();
    }, [toast]);

    return { laborData, turnoverData, staffingData, performanceData, loading };
}
