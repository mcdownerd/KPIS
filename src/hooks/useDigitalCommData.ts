import { useState, useEffect } from 'react'
import { getDigitalCommMetrics, getQualityMetrics, getComplaintsMetrics, getUberMetrics } from '@/lib/api/service'
import { toast } from 'sonner'

interface MonthlyDigitalData {
    location: string;
    [key: string]: string | number;
    target: number;
}

export function useDigitalCommData() {
    const [mloversData, setMloversData] = useState<MonthlyDigitalData[]>([])
    const [googleData, setGoogleData] = useState<MonthlyDigitalData[]>([])
    const [deliveryData, setDeliveryData] = useState<MonthlyDigitalData[]>([])

    // Uber Metrics
    const [uberStarsData, setUberStarsData] = useState<MonthlyDigitalData[]>([])
    const [uberTimesData, setUberTimesData] = useState<MonthlyDigitalData[]>([])
    const [uberInaccuracyData, setUberInaccuracyData] = useState<MonthlyDigitalData[]>([])
    const [uberAvailabilityData, setUberAvailabilityData] = useState<MonthlyDigitalData[]>([])
    const [uberTotalTimeData, setUberTotalTimeData] = useState<MonthlyDigitalData[]>([])

    const [qualityData, setQualityData] = useState<MonthlyDigitalData[]>([])
    const [complaintsData, setComplaintsData] = useState<MonthlyDigitalData[]>([])
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
            const digitalPromises = months.map(month => getDigitalCommMetrics(month))
            const uberPromises = months.map(month => getUberMetrics(month))
            const qualityPromises = months.map(month => getQualityMetrics(month))
            const complaintsPromises = months.map(month => getComplaintsMetrics(month))

            const [digitalResults, uberResults, qualityResults, complaintsResults] = await Promise.all([
                Promise.all(digitalPromises),
                Promise.all(uberPromises),
                Promise.all(qualityPromises),
                Promise.all(complaintsPromises)
            ])

            const allDigitalData: any[] = []
            digitalResults.forEach(data => {
                if (data) Array.isArray(data) ? allDigitalData.push(...data) : allDigitalData.push(data)
            })

            const allUberData: any[] = []
            uberResults.forEach(data => {
                if (data) Array.isArray(data) ? allUberData.push(...data) : allUberData.push(data)
            })

            const allQualityData: any[] = []
            qualityResults.forEach(data => {
                if (data) Array.isArray(data) ? allQualityData.push(...data) : allQualityData.push(data)
            })

            const allComplaintsData: any[] = []
            complaintsResults.forEach(data => {
                if (data) Array.isArray(data) ? allComplaintsData.push(...data) : allComplaintsData.push(data)
            })

            // Process monthly evolution data
            setMloversData(processMonthlyEvolution(allDigitalData, 'mlovers'))
            setGoogleData(processMonthlyEvolution(allDigitalData, 'google_rating'))
            setDeliveryData(processMonthlyEvolution(allDigitalData, 'delivery_rating'))

            // Process Uber Metrics
            setUberStarsData(processMonthlyEvolution(allUberData, 'estrelas'))
            setUberTimesData(processMonthlyEvolution(allUberData, 'tempos'))
            setUberInaccuracyData(processMonthlyEvolution(allUberData, 'inexatidao'))
            setUberAvailabilityData(processMonthlyEvolution(allUberData, 'ava_produto'))
            setUberTotalTimeData(processMonthlyEvolution(allUberData, 'tempo_total'))

            setQualityData(processMonthlyEvolution(allQualityData, 'sg'))
            setComplaintsData(processMonthlyEvolution(allComplaintsData, 'total_complaints'))
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados digitais'
            console.error(errorMessage)
            setError(errorMessage)
            toast.error(errorMessage)
            setMloversData([])
            setGoogleData([])
            setDeliveryData([])
            setQualityData([])
            setComplaintsData([])
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
        uberStarsData,
        uberTimesData,
        uberInaccuracyData,
        uberAvailabilityData,
        uberTotalTimeData,
        deliveryData,
        qualityData,
        complaintsData,
        loading,
        error,
        refetch: loadDigitalData
    }
}
