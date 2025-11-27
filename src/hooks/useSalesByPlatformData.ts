import { useState, useEffect } from 'react';
import { getSalesByDateRange, Sale } from '@/lib/api/sales';
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

    useEffect(() => {
        async function fetchSales() {
            try {
                // Fetch data for the whole year of 2025
                const startDate = '2025-01-01';
                const endDate = '2025-12-31';
                const data = await getSalesByDateRange(startDate, endDate);

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

    const processSalesData = (sales: Sale[]) => {
        // 1. Process Platform Data (Pie Chart)
        const platformSummary = sales.reduce((acc, sale) => {
            const platform = sale.platform;
            acc[platform] = (acc[platform] || 0) + Number(sale.total_value);
            return acc;
        }, {} as Record<string, number>);

        const total = Object.values(platformSummary).reduce((sum, val) => sum + val, 0);
        setTotalSales(total);

        const processedPlatformData: PlatformData[] = [
            { name: 'Delivery', value: 0, color: '#0088FE' },
            { name: 'Sala', value: 0, color: '#00C49F' },
            { name: 'MOP', value: 0, color: '#FFBB28' },
        ];

        processedPlatformData.forEach(item => {
            if (platformSummary[item.name]) {
                // Calculate percentage
                item.value = Number(((platformSummary[item.name] / total) * 100).toFixed(1));
            }
        });

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

        sales.forEach(sale => {
            const date = parseISO(sale.sale_date);
            const monthName = format(date, 'MMMM', { locale: ptBR });
            // Capitalize first letter
            const formattedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

            if (monthlyData[formattedMonth]) {
                // Assuming current user is Queluz for now based on test data
                // In a real multi-store scenario, we would check sale.store_id
                monthlyData[formattedMonth].queluzTotal += Number(sale.total_value);
                if (sale.platform === 'Delivery') {
                    monthlyData[formattedMonth].queluzDelivery += Number(sale.total_value);
                }
            }
        });

        // Convert to array and filter out months with no data (optional, or keep all)
        // Let's keep only months up to current date or months with data
        const sortedMonthlyData = Object.values(monthlyData).filter(m => m.queluzTotal > 0 || m.amadoraTotal > 0);

        setSalesByMonth(sortedMonthlyData);
    };

    return { platformData, salesByMonth, totalSales, loading };
}
