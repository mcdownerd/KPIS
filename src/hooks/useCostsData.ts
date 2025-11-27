import { useState, useEffect } from 'react'
import { getCostsByYear, getCostsGroupedByMonth } from '@/lib/api/costs'
import { toast } from 'sonner'

interface CostData {
    month: string;
    comida20: number;
    papel20: number;
    comida32: number;
    papel32: number;
}

interface CostSummary {
    categoria: string;
    objetivo: string;
    ytd: string;
    status: 'ok' | 'warn';
}

export function useCostsData(year: number = new Date().getFullYear()) {
    const [costData, setCostData] = useState<CostData[]>([])
    const [costSummary, setCostSummary] = useState<CostSummary[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadCostsData()
    }, [year])

    const loadCostsData = async () => {
        try {
            setLoading(true)
            setError(null)

            const monthlyData = await getCostsGroupedByMonth(year)
            const processed = processMonthlyData(monthlyData)
            setCostData(processed)

            const summary = processSummary(monthlyData)
            setCostSummary(summary)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados de custos'
            setError(errorMessage)
            toast.error(errorMessage)
            setCostData([])
            setCostSummary([])
        } finally {
            setLoading(false)
        }
    }

    const processMonthlyData = (data: any[]): CostData[] => {
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

        return months.map((month, index) => {
            const monthData = data.find(d => d.month === index)

            return {
                month,
                comida20: monthData?.comida || 0,
                papel20: monthData?.papel || 0,
                comida32: monthData?.comida || 0,
                papel32: monthData?.papel || 0
            }
        })
    }

    const processSummary = (data: any[]): CostSummary[] => {
        // Calculate YTD averages
        const totals = {
            comida: 0,
            papel: 0,
            refeicoes: 0,
            perdas: 0,
            count: 0
        }

        data.forEach(monthData => {
            if (monthData.comida) totals.comida += monthData.comida
            if (monthData.papel) totals.papel += monthData.papel
            if (monthData.refeicoes) totals.refeicoes += monthData.refeicoes
            if (monthData.perdas) totals.perdas += monthData.perdas
            totals.count++
        })

        const avgComida = totals.count > 0 ? totals.comida / totals.count : 0
        const avgPapel = totals.count > 0 ? totals.papel / totals.count : 0
        const avgRefeicoes = totals.count > 0 ? totals.refeicoes / totals.count : 0
        const avgPerdas = totals.count > 0 ? totals.perdas / totals.count : 0

        return [
            {
                categoria: 'Comida (20)',
                objetivo: '26.5%',
                ytd: `${avgComida.toFixed(2)}%`,
                status: avgComida <= 26.5 ? 'ok' : 'warn'
            },
            {
                categoria: 'Papel (20)',
                objetivo: '1.5%',
                ytd: `${avgPapel.toFixed(2)}%`,
                status: avgPapel <= 1.5 ? 'ok' : 'warn'
            },
            {
                categoria: 'Refeições (20)',
                objetivo: '0.70%',
                ytd: `${avgRefeicoes.toFixed(2)}%`,
                status: avgRefeicoes <= 0.7 ? 'ok' : 'warn'
            },
            {
                categoria: 'Perdas (20)',
                objetivo: '0.50%',
                ytd: `${avgPerdas.toFixed(2)}%`,
                status: avgPerdas <= 0.5 ? 'ok' : 'warn'
            },
            {
                categoria: 'C.Vendas Total (20)',
                objetivo: '29.2%',
                ytd: `${(avgComida + avgPapel + avgRefeicoes + avgPerdas).toFixed(2)}%`,
                status: (avgComida + avgPapel + avgRefeicoes + avgPerdas) <= 29.2 ? 'ok' : 'warn'
            }
        ]
    }

    return {
        costData,
        costSummary,
        loading,
        error,
        refetch: loadCostsData
    }
}
