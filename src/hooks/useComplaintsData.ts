import { useState, useEffect } from 'react'
import { getComplaintsMetrics } from '@/lib/api/service'
import { toast } from 'sonner'

interface MonthlyComplaintsData {
    location: string;
    [key: string]: string | number;
    target: number;
}

export function useComplaintsData() {
    const [complaintsData, setComplaintsData] = useState<MonthlyComplaintsData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadComplaintsData()
    }, [])

    const loadComplaintsData = async () => {
        try {
            setLoading(true)
            setError(null)

            const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
            const allMonthsData: any[] = []

            const promises = months.map(month => getComplaintsMetrics(month))
            const results = await Promise.all(promises)

            results.forEach(data => {
                if (data) {
                    if (Array.isArray(data)) {
                        allMonthsData.push(...data)
                    } else {
                        allMonthsData.push(data)
                    }
                }
            })

            setComplaintsData(processMonthlyEvolution(allMonthsData))
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados de reclamações'
            console.error(errorMessage)
            setError(errorMessage)
            toast.error(errorMessage)
            setComplaintsData([])
        } finally {
            setLoading(false)
        }
    }

    const processMonthlyEvolution = (data: any[]): MonthlyComplaintsData[] => {
        const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
        const shortMonths = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

        const storeMonthlyData: Record<string, Record<string, number>> = {}

        data.forEach(record => {
            const storeId = record.store_id
            const monthIndex = monthNames.indexOf(record.month_name)

            if (monthIndex >= 0) {
                const monthKey = shortMonths[monthIndex]
                if (!storeMonthlyData[storeId]) {
                    storeMonthlyData[storeId] = {}
                }
                storeMonthlyData[storeId][monthKey] = Number(record.total_complaints || 0)
            }
        })

        const storeIds = ['f86b0b1f-05d0-4310-a655-a92ca1ab68bf', 'fcf80b5a-b658-48f3-871c-ac62120c5a78']

        return storeIds.map((storeId) => {
            let locationName = storeId === 'fcf80b5a-b658-48f3-871c-ac62120c5a78' ? 'Queluz' : 'Amadora'
            const row: MonthlyComplaintsData = {
                location: locationName,
                target: 2 // Meta padrão de 2 reclamações
            }

            shortMonths.forEach(m => {
                row[m] = storeMonthlyData[storeId]?.[m] || 0
            })

            return row
        })
    }

    return {
        complaintsData,
        loading,
        error,
        refetch: loadComplaintsData
    }
}
