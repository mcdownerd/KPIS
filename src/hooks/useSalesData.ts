import { useState, useEffect } from 'react'
import { getSalesSummaryMetricsByDateRange } from '@/lib/api/service'
import { toast } from 'sonner'

interface MonthlySalesData {
    month: string;
    sales: number;
    delivery: number;
}

export function useSalesData(year: number = new Date().getFullYear()) {
    const [salesData, setSalesData] = useState<MonthlySalesData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadSalesData()
    }, [year])

    const loadSalesData = async () => {
        try {
            setLoading(true)
            setError(null)

            const startDate = `${year}-01-01`
            const endDate = `${year}-12-31`
            const salesMetrics = await getSalesSummaryMetricsByDateRange(startDate, endDate)

            // Group sales by month
            const monthlyData = processMonthlyData(salesMetrics)
            setSalesData(monthlyData)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados de vendas'
            setError(errorMessage)
            toast.error(errorMessage)
            setSalesData([])
        } finally {
            setLoading(false)
        }
    }

    const processMonthlyData = (metrics: any[]): MonthlySalesData[] => {
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

        // Initialize data for all months
        const monthlyTotals: Record<number, { sales: number; delivery: number }> = {}

        for (let i = 0; i < 12; i++) {
            monthlyTotals[i] = { sales: 0, delivery: 0 }
        }

        // Aggregate sales by month
        metrics.forEach(metric => {
            const date = new Date(metric.record_date)
            const monthIndex = date.getMonth()

            monthlyTotals[monthIndex].sales += Number(metric.total_sales || 0)
            monthlyTotals[monthIndex].delivery += Number(metric.delivery_sales || 0)
        })

        // Convert to array format for chart
        return months.map((month, index) => ({
            month,
            sales: monthlyTotals[index].sales / 1000, // Convert to thousands
            delivery: monthlyTotals[index].delivery / 1000
        }))
    }

    return {
        salesData,
        loading,
        error,
        refetch: loadSalesData
    }
}
