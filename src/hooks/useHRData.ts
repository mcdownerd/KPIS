import { useState, useEffect } from 'react';
import { getHRMetricsByType, HRMetric } from '@/lib/api/hr';
import { useToast } from './use-toast';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface LaborData {
    month: string;
    rawDate: string;
    vendas: number;
    horas: number;
    prod: number;
    mo: number; // This will now hold the MO percentage
    custo_total: number; // New field for Total Cost in Euros
    vendas_amadora: number;
    horas_amadora: number;
    vendas_queluz: number;
    horas_queluz: number;
    prod_amadora: number;
    prod_queluz: number;
    mo_amadora: number;
    mo_queluz: number;
    custo_amadora: number;
    custo_queluz: number;
}

export interface MetricData {
    month: string;
    rawDate: string;
    value: number;
    target: number;
    amadora: number;
    queluz: number;
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

                // Sort labor data by updated_at or created_at to ensure we process the most recent ones last
                labor.sort((a, b) => {
                    const dateA = new Date(a.updated_at || a.created_at || 0).getTime();
                    const dateB = new Date(b.updated_at || b.created_at || 0).getTime();
                    return dateA - dateB;
                });

                // Process Labor Data
                const processedLabor = labor.map(m => {
                    const date = parseISO(m.record_date);
                    const monthName = format(date, 'MMM', { locale: ptBR });

                    const vendasAmadora = m.additional_data?.vendas_amadora || 0;
                    const horasAmadora = m.additional_data?.horas_amadora || 0;
                    const vendasQueluz = m.additional_data?.vendas_queluz || 0;
                    const horasQueluz = m.additional_data?.horas_queluz || 0;
                    const custoAmadora = m.additional_data?.custo_amadora || 0;
                    const custoQueluz = m.additional_data?.custo_queluz || 0;

                    const prodAmadora = horasAmadora > 0 ? vendasAmadora / horasAmadora : 0;
                    const prodQueluz = horasQueluz > 0 ? vendasQueluz / horasQueluz : 0;

                    // Determine MO Percentage and Total Cost
                    let moPercentage = 0;
                    let totalCost = 0;

                    if (m.additional_data?.mo_percentage !== undefined) {
                        moPercentage = m.additional_data.mo_percentage;
                        totalCost = m.value; // In new logic, m.value is Total Cost
                    } else {
                        // Legacy handling
                        if (m.value > 100) {
                            totalCost = m.value;
                            moPercentage = m.additional_data?.vendas ? (totalCost / m.additional_data.vendas) * 100 : 0;
                        } else {
                            moPercentage = m.value;
                            totalCost = m.additional_data?.vendas ? (m.additional_data.vendas * moPercentage) / 100 : 0;
                        }
                    }

                    return {
                        month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
                        rawDate: m.record_date,
                        vendas: m.additional_data?.vendas || 0,
                        horas: m.additional_data?.horas || 0,
                        prod: m.additional_data?.prod || 0,
                        mo: moPercentage,
                        custo_total: totalCost,
                        vendas_amadora: vendasAmadora,
                        horas_amadora: horasAmadora,
                        vendas_queluz: vendasQueluz,
                        horas_queluz: horasQueluz,
                        prod_amadora: prodAmadora,
                        prod_queluz: prodQueluz,
                        mo_amadora: 0, // Placeholder
                        mo_queluz: 0,   // Placeholder
                        custo_amadora: custoAmadora,
                        custo_queluz: custoQueluz
                    };
                });

                // Deduplicate Labor Data (keep the most recent one for each month)
                const uniqueLaborData = Object.values(processedLabor.reduce((acc, curr) => {
                    acc[curr.month] = curr;
                    return acc;
                }, {} as Record<string, LaborData>));

                setLaborData(uniqueLaborData); const processedTurnover = turnover.map(m => {
                    const date = parseISO(m.record_date);
                    const monthName = format(date, 'MMM', { locale: ptBR });
                    return {
                        month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
                        rawDate: m.record_date,
                        value: m.value,
                        target: m.target_value || 2.0,
                        amadora: m.additional_data?.amadora || 0,
                        queluz: m.additional_data?.queluz || 0
                    };
                });
                setTurnoverData(processedTurnover);

                // Process Staffing Data
                const processedStaffing = staffing.map(m => {
                    const date = parseISO(m.record_date);
                    const monthName = format(date, 'MMM', { locale: ptBR });
                    return {
                        month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
                        rawDate: m.record_date,
                        value: m.value,
                        target: m.target_value || 100,
                        amadora: m.additional_data?.amadora || 0,
                        queluz: m.additional_data?.queluz || 0
                    };
                });
                setStaffingData(processedStaffing);

                // Process Performance Data
                const processedPerformance = productivity.map(m => {
                    const date = parseISO(m.record_date);
                    const monthName = format(date, 'MMM', { locale: ptBR });
                    return {
                        month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
                        rawDate: m.record_date,
                        value: m.value,
                        target: m.target_value || 4.5,
                        amadora: 0, // Not implemented yet
                        queluz: 0
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
