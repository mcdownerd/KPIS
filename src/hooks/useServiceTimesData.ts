import { useState, useEffect } from 'react'
import { getServiceTimesByMonth, ServiceTime } from '@/lib/api/service_times'
import { toast } from 'sonner'

interface ServiceTimeData {
    location: string;
    lunch: number;
    dinner: number;
    day: number;
    rank: number;
    target: number;
}

interface MonthlyServiceData {
    location: string;
    [key: string]: string | number;
}

export function useServiceTimesData(year: number = new Date().getFullYear()) {
    const [serviceTimesData, setServiceTimesData] = useState<ServiceTimeData[]>([])
    const [monthlyData, setMonthlyData] = useState<MonthlyServiceData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadServiceTimesData()
    }, [year])

    const loadServiceTimesData = async () => {
        try {
            setLoading(true)
            setError(null)

            // Load data for all months of the year
            const allMonthsData: ServiceTime[] = []

            for (let month = 0; month < 12; month++) {
                const monthData = await getServiceTimesByMonth(month, year)
                allMonthsData.push(...monthData)
            }

            // Process YTD data for the main table (using all months data)
            const processedYTD = processCurrentMonthData(allMonthsData)
            setServiceTimesData(processedYTD)

            // Process monthly evolution data
            const processedMonthly = processMonthlyEvolution(allMonthsData)
            setMonthlyData(processedMonthly)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar tempos de serviço'
            setError(errorMessage)
            toast.error(errorMessage)
            setServiceTimesData([])
            setMonthlyData([])
        } finally {
            setLoading(false)
        }
    }

    const processCurrentMonthData = (data: ServiceTime[]): ServiceTimeData[] => {
        if (data.length === 0) return []

        // Group by store and calculate averages
        const storeData: Record<string, { lunch: number[]; dinner: number[]; day: number[]; target: number }> = {}

        data.forEach(record => {
            const storeId = record.store_id
            if (!storeData[storeId]) {
                storeData[storeId] = {
                    lunch: [],
                    dinner: [],
                    day: [],
                    target: record.target_time || 110
                }
            }

            if (record.lunch_time) storeData[storeId].lunch.push(record.lunch_time)
            if (record.dinner_time) storeData[storeId].dinner.push(record.dinner_time)
            if (record.day_time) storeData[storeId].day.push(record.day_time)
        })

        // Calculate averages and create result
        const result = Object.keys(storeData).map((storeId, index) => {
            const store = storeData[storeId]
            const avgLunch = store.lunch.length > 0 ? Math.round(store.lunch.reduce((a, b) => a + b, 0) / store.lunch.length) : 0
            const avgDinner = store.dinner.length > 0 ? Math.round(store.dinner.reduce((a, b) => a + b, 0) / store.dinner.length) : 0
            const avgDay = store.day.length > 0 ? Math.round(store.day.reduce((a, b) => a + b, 0) / store.day.length) : 0

            return {
                location: `Loja ${index + 1}`,
                lunch: avgLunch,
                dinner: avgDinner,
                day: avgDay,
                rank: index + 1,
                target: store.target
            }
        })

        // Sort by day time (best performance first)
        return result.sort((a, b) => a.day - b.day).map((item, index) => ({
            ...item,
            rank: index + 1
        }))
    }

    const processMonthlyEvolution = (data: ServiceTime[]): MonthlyServiceData[] => {
        if (data.length === 0) return []

        const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

        // Group by store
        const storeMonthlyData: Record<string, Record<string, number[]>> = {}

        data.forEach(record => {
            const storeId = record.store_id
            const month = new Date(record.record_date).getMonth()
            const monthKey = months[month]

            if (!storeMonthlyData[storeId]) {
                storeMonthlyData[storeId] = {}
                months.forEach(m => {
                    storeMonthlyData[storeId][m] = []
                })
            }

            if (record.day_time) {
                storeMonthlyData[storeId][monthKey].push(record.day_time)
            }
        })

        // Calculate averages
        return Object.keys(storeMonthlyData).map((storeId, index) => {
            const monthlyAverages: MonthlyServiceData = {
                location: `Loja ${index + 1}`
            }

            months.forEach(month => {
                const values = storeMonthlyData[storeId][month]
                if (values.length > 0) {
                    monthlyAverages[month] = Math.round(values.reduce((a, b) => a + b, 0) / values.length)
                } else {
                    monthlyAverages[month] = 0
                }
            })

            // Calculate YTD and LY (Last Year) - for now using current year data
            const allValues = months.flatMap(m => storeMonthlyData[storeId][m])
            monthlyAverages['ytd'] = allValues.length > 0 ? Math.round(allValues.reduce((a, b) => a + b, 0) / allValues.length) : 0
            monthlyAverages['ly'] = monthlyAverages['ytd'] // Placeholder - would need last year's data

            return monthlyAverages
        })
    }

    return {
        serviceTimesData,
        monthlyData,
        loading,
        error,
        refetch: loadServiceTimesData
    }
}
