import { useState, useEffect } from 'react'
import { getServiceTimeMetrics } from '@/lib/api/service'
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

            const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
            const allMonthsData: any[] = []

            // Fetch data for all months
            // Note: In a real scenario, we should have a bulk fetch API. 
            // For now, we'll fetch sequentially or in parallel.
            // Since getServiceTimeMetrics filters by month name, we iterate over names.

            // We need to fetch for both stores if possible, but the API might be restricted to user's store.
            // However, the dashboard seems designed to show multiple locations.
            // Let's assume we can fetch for the user's store first.
            // If the user is admin/supervisor, they might want to see all, but the current API structure in service.ts
            // seems to return a single record per month/store.

            // Let's try to fetch for the current user's store for all months.
            const promises = months.map(month => getServiceTimeMetrics(month))
            const results = await Promise.all(promises)

            results.forEach(data => {
                if (data) allMonthsData.push(data)
            })

            // Process YTD data
            const processedYTD = processCurrentMonthData(allMonthsData)
            setServiceTimesData(processedYTD)

            // Process monthly evolution data
            const processedMonthly = processMonthlyEvolution(allMonthsData)
            setMonthlyData(processedMonthly)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar tempos de serviço'
            console.error(errorMessage)
            setError(errorMessage)
            toast.error(errorMessage)
            setServiceTimesData([])
            setMonthlyData([])
        } finally {
            setLoading(false)
        }
    }

    const processCurrentMonthData = (data: any[]): ServiceTimeData[] => {
        if (data.length === 0) return []

        // Group by store
        const storeData: Record<string, { lunch: number[]; dinner: number[]; day: number[]; target: number }> = {}

        data.forEach(record => {
            const storeId = record.store_id
            if (!storeData[storeId]) {
                storeData[storeId] = {
                    lunch: [],
                    dinner: [],
                    day: [],
                    target: 180 // Default target
                }
            }

            if (record.almoco_tempo) storeData[storeId].lunch.push(Number(record.almoco_tempo))
            if (record.jantar_tempo) storeData[storeId].dinner.push(Number(record.jantar_tempo))
            if (record.dia_tempo) storeData[storeId].day.push(Number(record.dia_tempo))
        })

        // Calculate averages
        const result = Object.keys(storeData).map((storeId, index) => {
            const store = storeData[storeId]
            const avgLunch = store.lunch.length > 0 ? Math.round(store.lunch.reduce((a, b) => a + b, 0) / store.lunch.length) : 0
            const avgDinner = store.dinner.length > 0 ? Math.round(store.dinner.reduce((a, b) => a + b, 0) / store.dinner.length) : 0
            const avgDay = store.day.length > 0 ? Math.round(store.day.reduce((a, b) => a + b, 0) / store.day.length) : 0

            // Determine location name based on ID (simplified)
            let locationName = `Loja ${index + 1}`
            if (storeId === 'fcf80b5a-b658-48f3-871c-ac62120c5a78') locationName = 'Queluz'
            else if (storeId === 'f86b0b1f-05d0-4310-a655-a92ca1ab68bf') locationName = 'Amadora'

            return {
                location: locationName,
                lunch: avgLunch,
                dinner: avgDinner,
                day: avgDay,
                rank: index + 1, // Placeholder rank
                target: store.target
            }
        })

        return result.sort((a, b) => a.day - b.day).map((item, index) => ({
            ...item,
            rank: index + 1
        }))
    }

    const processMonthlyEvolution = (data: any[]): MonthlyServiceData[] => {
        if (data.length === 0) return []

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
                storeMonthlyData[storeId][monthKey] = Number(record.dia_tempo || 0)
            }
        })

        return Object.keys(storeMonthlyData).map((storeId, index) => {
            let locationName = `Loja ${index + 1}`
            if (storeId === 'fcf80b5a-b658-48f3-871c-ac62120c5a78') locationName = 'Queluz'
            else if (storeId === 'f86b0b1f-05d0-4310-a655-a92ca1ab68bf') locationName = 'Amadora'

            const row: MonthlyServiceData = { location: locationName }

            let ytdSum = 0
            let ytdCount = 0

            shortMonths.forEach(m => {
                const val = storeMonthlyData[storeId][m] || 0
                row[m] = val
                if (val > 0) {
                    ytdSum += val
                    ytdCount++
                }
            })

            row['ytd'] = ytdCount > 0 ? Math.round(ytdSum / ytdCount) : 0
            row['ly'] = 0 // Placeholder
            row['var'] = 0 // Placeholder

            return row
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
