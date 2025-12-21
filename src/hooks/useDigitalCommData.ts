import { useState, useEffect } from 'react'
import { getDigitalCommMetrics } from '@/lib/api/service'
import { toast } from 'sonner'

interface MonthlyDigitalData {
    location: string;
    [key: string]: string | number;
    target: number;
}

export function useDigitalCommData() {
    const [mloversData, setMloversData] = useState<MonthlyDigitalData[]>([])
    const [googleData, setGoogleData] = useState<MonthlyDigitalData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadDigitalData()
    }, [])

    const loadDigitalData = async () => {
        try {
            setLoading(true)
            setError(null)

            const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
            const allMonthsData: any[] = []

            // Fetch data for all months
            const promises = months.map(month => getDigitalCommMetrics(month))
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

            // Process monthly evolution data
            setMloversData(processMonthlyEvolution(allMonthsData, 'mlovers'))
            setGoogleData(processMonthlyEvolution(allMonthsData, 'google_rating'))
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados digitais'
            console.error(errorMessage)
            setError(errorMessage)
            toast.error(errorMessage)
            setMloversData([])
            setGoogleData([])
        } finally {
            setLoading(false)
        }
    }

    const processMonthlyEvolution = (data: any[], field: string): MonthlyDigitalData[] => {
        const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
        const shortMonths = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

        // Group by store
        const storeMonthlyData: Record<string, Record<string, number>> = {}

        data.forEach(record => {
            const storeId = record.store_id
            const monthIndex = monthNames.indexOf(record.month_name)

            if (monthIndex >= 0) {
                const monthKey = shortMonths[monthIndex]
                if (!storeMonthlyData[storeId]) {
                    storeMonthlyData[storeId] = {}
                }
                storeMonthlyData[storeId][monthKey] = Number(record[field] || 0)
            }
        })

        // Define targets
        const targets: Record<string, Record<string, number>> = {
            'mlovers': {
                'f86b0b1f-05d0-4310-a655-a92ca1ab68bf': 14, // Amadora
                'fcf80b5a-b658-48f3-871c-ac62120c5a78': 18  // Queluz
            },
            'google_rating': {
                'f86b0b1f-05d0-4310-a655-a92ca1ab68bf': 4.2, // Amadora
                'fcf80b5a-b658-48f3-871c-ac62120c5a78': 4.3  // Queluz
            }
        }

        const storeIds = ['f86b0b1f-05d0-4310-a655-a92ca1ab68bf', 'fcf80b5a-b658-48f3-871c-ac62120c5a78']

        return storeIds.map((storeId) => {
            let locationName = storeId === 'fcf80b5a-b658-48f3-871c-ac62120c5a78' ? 'Queluz' : 'Amadora'
            const row: MonthlyDigitalData = {
                location: locationName,
                target: targets[field]?.[storeId] || 0
            }

            shortMonths.forEach(m => {
                row[m] = storeMonthlyData[storeId]?.[m] || 0
            })

            return row
        })
    }

    return {
        mloversData,
        googleData,
        loading,
        error,
        refetch: loadDigitalData
    }
}
