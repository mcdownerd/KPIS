import { useState, useEffect } from 'react'
import { getSalesByMonth, Sale } from '@/lib/api/sales'
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

            const sales = await getSalesByMonth(year)

            // Group sales by month and platform
            const monthlyData = processMonthlyData(sales)
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

    const processMonthlyData = (sales: Sale[]): MonthlySalesData[] => {
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

        // Initialize data for all months
        const monthlyTotals: Record<number, { sales: number; delivery: number }> = {}

        for (let i = 0; i < 12; i++) {
            monthlyTotals[i] = { sales: 0, delivery: 0 }
        }

        // Aggregate sales by month
        sales.forEach(sale => {
            const saleDate = new Date(sale.sale_date)
            const monthIndex = saleDate.getMonth()

            if (sale.platform === 'Delivery') {
                monthlyTotals[monthIndex].delivery += sale.total_value
            }

            // All platforms contribute to total sales
            monthlyTotals[monthIndex].sales += sale.total_value
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
