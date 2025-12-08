import { useState, useEffect } from 'react';
import { getSalesSummaryMetricsByDateRange, getAllSalesSummaryMetricsByDateRange } from '@/lib/api/service';
import { useToast } from './use-toast';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface PlatformData {
    name: string;
    value: number;
    color: string;
}

export interface MonthlySalesData {
    month: string;
    amadoraTotal: number;
    amadoraDelivery: number;
    queluzTotal: number;
    queluzDelivery: number;
}

export function useSalesByPlatformData() {
    const [platformData, setPlatformData] = useState<PlatformData[]>([]);
    const [salesByMonth, setSalesByMonth] = useState<MonthlySalesData[]>([]);
    const [totalSales, setTotalSales] = useState(0);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const [totalAmadora, setTotalAmadora] = useState(0);
    const [totalQueluz, setTotalQueluz] = useState(0);

    useEffect(() => {
        async function fetchSales() {
            try {
                // Fetch data for the whole year of 2025 for ALL stores
                const startDate = '2025-01-01';
                const endDate = '2025-12-31';
                const data = await getAllSalesSummaryMetricsByDateRange(startDate, endDate);

                processSalesData(data);
            } catch (error) {
                console.error('Error fetching sales data:', error);
                toast({
                    title: 'Erro ao carregar vendas',
                    description: 'Não foi possível carregar os dados de vendas.',
                    variant: 'destructive',
                });
            } finally {
                setLoading(false);
            }
        }

        fetchSales();
    }, [toast]);

    const processSalesData = (salesMetrics: any[]) => {
        // 1. Process Platform Data (Pie Chart)
        // Aggregate totals from all monthly records
        let totalDelivery = 0;
        let totalSala = 0;
        let totalMop = 0;
        let grandTotal = 0;

        // Store totals
        let amadoraSum = 0;
        let queluzSum = 0;

        salesMetrics.forEach(metric => {
            totalDelivery += Number(metric.delivery || 0);
            totalSala += Number(metric.sala || 0);
            totalMop += Number(metric.mop || 0);
            grandTotal += Number(metric.totais || 0);

            if (metric.store_id === 'fcf80b5a-b658-48f3-871c-ac62120c5a78') { // Queluz
                queluzSum += Number(metric.totais || 0);
            } else if (metric.store_id === 'f86b0b1f-05d0-4310-a655-a92ca1ab68bf') { // Amadora
                amadoraSum += Number(metric.totais || 0);
            }
        });

        setTotalSales(grandTotal);
        setTotalAmadora(amadoraSum);
        setTotalQueluz(queluzSum);

        const processedPlatformData: PlatformData[] = [
            { name: 'Delivery', value: 0, color: '#0088FE' },
            { name: 'Sala', value: 0, color: '#00C49F' },
            { name: 'MOP', value: 0, color: '#FFBB28' },
        ];

        if (grandTotal > 0) {
            processedPlatformData[0].value = Number(((totalDelivery / grandTotal) * 100).toFixed(1));
            processedPlatformData[1].value = Number(((totalSala / grandTotal) * 100).toFixed(1));
            processedPlatformData[2].value = Number(((totalMop / grandTotal) * 100).toFixed(1));
        }

        // Filter out platforms with 0 sales if desired, or keep them to show 0%
        setPlatformData(processedPlatformData.filter(item => item.value > 0));

        // 2. Process Monthly Data (Table)
        const monthlyData: Record<string, MonthlySalesData> = {};

        // Initialize months
        const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        months.forEach(month => {
            monthlyData[month] = {
                month,
                amadoraTotal: 0,
                amadoraDelivery: 0,
                queluzTotal: 0,
                queluzDelivery: 0
            };
        });

        salesMetrics.forEach(metric => {
            const monthName = metric.month_name;

            if (monthlyData[monthName]) {
                // Determine store based on store_id
                // Amadora: f86b0b1f-05d0-4310-a655-a92ca1ab68bf
                // Queluz: fcf80b5a-b658-48f3-871c-ac62120c5a78

                if (metric.store_id === 'fcf80b5a-b658-48f3-871c-ac62120c5a78') { // Queluz
                    monthlyData[monthName].queluzTotal += Number(metric.totais || 0);
                    monthlyData[monthName].queluzDelivery += Number(metric.delivery || 0);
                } else if (metric.store_id === 'f86b0b1f-05d0-4310-a655-a92ca1ab68bf') { // Amadora
                    monthlyData[monthName].amadoraTotal += Number(metric.totais || 0);
                    monthlyData[monthName].amadoraDelivery += Number(metric.delivery || 0);
                }
            }
        });

        // Convert to array and filter out months with no data
        const sortedMonthlyData = Object.values(monthlyData).filter(m => m.queluzTotal > 0 || m.amadoraTotal > 0);

        setSalesByMonth(sortedMonthlyData);
    };

    return { platformData, salesByMonth, totalSales, totalAmadora, totalQueluz, loading };
}
