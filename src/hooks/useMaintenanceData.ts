import { useState, useEffect } from 'react';
import { getMaintenanceByDateRange } from '@/lib/api/maintenance';
import { getUtilitiesByDateRange } from '@/lib/api/utilities';
import { getPerformanceTrackingByDateRange } from '@/lib/api/performance';
import { useToast } from './use-toast';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface MaintenanceData {
    month: string;
    custo: number;
    avarias: number;
}

export interface Breakdown {
    id: string;
    equipamento: string;
    problema: string;
    data: string;
    status: 'Pendente' | 'Em Resolução' | 'Concluído';
    custo: number;
}

export interface UtilityData {
    mes: string;
    aguaAmd: string;
    eletAmd: string;
    aguaQlz: string;
    eletQlz: string;
}

export interface PerformanceData {
    mes: string;
    cmpAmd: string;
    plAmd: string;
    avalAmd: string;
    cmpQlz: string;
    plQlz: string;
    avalQlz: string;
}

export function useMaintenanceData() {
    const [maintenanceData, setMaintenanceData] = useState<MaintenanceData[]>([]);
    const [breakdowns, setBreakdowns] = useState<Breakdown[]>([]);
    const [utilityData, setUtilityData] = useState<UtilityData[]>([]);
    const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
    const [summary, setSummary] = useState({
        totalCost: 0,
        totalBreakdowns: 0,
        pending: 0,
        avgResolutionTime: 0 // Placeholder
    });
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchMaintenanceData = async () => {
        try {
            setLoading(true);
            const startDate = '2025-01-01';
            const endDate = '2025-12-31';

            // Fetch all data in parallel
            const [maintenanceRecords, utilityRecords, performanceRecords] = await Promise.all([
                getMaintenanceByDateRange(startDate, endDate),
                getUtilitiesByDateRange(startDate, endDate),
                getPerformanceTrackingByDateRange(startDate, endDate)
            ]);

            // --- Process Maintenance Data (Chart & Breakdowns) ---
            const monthlyData: Record<string, MaintenanceData> = {};
            const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

            months.forEach(month => {
                monthlyData[month] = { month, custo: 0, avarias: 0 };
            });

            maintenanceRecords.forEach(item => {
                const date = parseISO(item.breakdown_date);
                const monthName = format(date, 'MMMM', { locale: ptBR });
                const formattedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

                if (monthlyData[formattedMonth]) {
                    monthlyData[formattedMonth].custo += item.cost || 0;
                    monthlyData[formattedMonth].avarias += 1;
                }
            });

            const chartData = Object.values(monthlyData).filter(m => m.avarias > 0 || m.custo > 0);
            setMaintenanceData(chartData);

            const formattedBreakdowns: Breakdown[] = maintenanceRecords.map(item => ({
                id: item.id,
                equipamento: item.equipment_name,
                problema: item.cause || 'N/A',
                data: format(parseISO(item.breakdown_date), 'dd/MM/yyyy'),
                status: item.status === 'pending' ? 'Pendente' : item.status === 'in_progress' ? 'Em Resolução' : 'Concluído',
                custo: item.cost || 0
            }));
            setBreakdowns(formattedBreakdowns);

            const totalCost = maintenanceRecords.reduce((sum, item) => sum + (item.cost || 0), 0);
            const pending = maintenanceRecords.filter(item => item.status === 'pending').length;

            setSummary({
                totalCost,
                totalBreakdowns: maintenanceRecords.length,
                pending,
                avgResolutionTime: 48
            });

            // --- Process Utility Data ---
            const utilitiesByMonth: Record<string, { water: number, electricity: number }> = {};

            utilityRecords.forEach(item => {
                const date = parseISO(item.reading_date);
                const monthName = format(date, 'MMMM', { locale: ptBR });
                const formattedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

                if (!utilitiesByMonth[formattedMonth]) {
                    utilitiesByMonth[formattedMonth] = { water: 0, electricity: 0 };
                }

                if (item.utility_type === 'water') {
                    utilitiesByMonth[formattedMonth].water += item.cost || 0;
                } else if (item.utility_type === 'electricity') {
                    utilitiesByMonth[formattedMonth].electricity += item.cost || 0;
                }
            });

            const formattedUtilityData: UtilityData[] = Object.keys(utilitiesByMonth).map(month => ({
                mes: month,
                aguaAmd: "-", // No data for Amadora
                eletAmd: "-", // No data for Amadora
                aguaQlz: utilitiesByMonth[month].water.toFixed(2),
                eletQlz: utilitiesByMonth[month].electricity.toFixed(2)
            }));

            // Sort by month index if needed, but for now just map keys
            // Better sorting:
            const sortedUtilityData = formattedUtilityData.sort((a, b) => {
                return months.indexOf(a.mes) - months.indexOf(b.mes);
            });

            setUtilityData(sortedUtilityData);

            // --- Process Performance Data ---
            const performanceByMonth: Record<string, { cmp: string, pl: string, aval: string }> = {};

            performanceRecords.forEach(item => {
                const date = parseISO(item.record_date);
                const monthName = format(date, 'MMMM', { locale: ptBR });
                const formattedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

                if (!performanceByMonth[formattedMonth]) {
                    performanceByMonth[formattedMonth] = { cmp: "-", pl: "-", aval: "-" };
                }

                // Store value if available, formatted
                if (item.metric_name === 'CMP') performanceByMonth[formattedMonth].cmp = item.value ? `${item.value}%` : "-";
                if (item.metric_name === 'PL') performanceByMonth[formattedMonth].pl = item.value ? `${item.value}%` : "-";
                if (item.metric_name === 'Avaliacoes') performanceByMonth[formattedMonth].aval = item.value ? `${item.value}%` : "-";
            });

            const formattedPerformanceData: PerformanceData[] = Object.keys(performanceByMonth).map(month => ({
                mes: month,
                cmpAmd: "-",
                plAmd: "-",
                avalAmd: "-",
                cmpQlz: performanceByMonth[month].cmp,
                plQlz: performanceByMonth[month].pl,
                avalQlz: performanceByMonth[month].aval
            }));

            const sortedPerformanceData = formattedPerformanceData.sort((a, b) => {
                return months.indexOf(a.mes) - months.indexOf(b.mes);
            });

            setPerformanceData(sortedPerformanceData);

        } catch (error) {
            console.error('Error fetching maintenance data:', error);
            toast({
                title: 'Erro ao carregar manutenção',
                description: 'Não foi possível carregar os dados de manutenção.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaintenanceData();
    }, []);

    return { maintenanceData, breakdowns, utilityData, performanceData, summary, loading, refetch: fetchMaintenanceData };
}
