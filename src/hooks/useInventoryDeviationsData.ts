import { useState, useEffect } from 'react'
import { getInventoryDeviationsByMonth, getInventoryDeviationSummary } from '@/lib/api/inventory'
import { toast } from 'sonner'

interface DeviationData {
    item: string;
    local20: number;
    local32: number;
    status20: 'ok' | 'warning' | 'critical';
    status32: 'ok' | 'warning' | 'critical';
}

interface DeviationSummary {
    ok: number;
    warning: number;
    critical: number;
    total: number;
}

// Hook to fetch and process inventory deviation data
export function useInventoryDeviationsData(month: number = new Date().getMonth(), year: number = new Date().getFullYear()) {
    const [deviationData, setDeviationData] = useState<DeviationData[]>([])
    const [summary, setSummary] = useState<DeviationSummary>({ ok: 0, warning: 0, critical: 0, total: 0 })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadDeviationsData()
    }, [month, year])

    const loadDeviationsData = async () => {
        try {
            setLoading(true)
            setError(null)

            const deviations = await getInventoryDeviationsByMonth(month, year)

            // Process deviations
            const processed = processDeviations(deviations)
            setDeviationData(processed)

            // Calculate summary
            const startDate = new Date(year, month, 1).toISOString().split('T')[0]
            const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0]
            const summaryData = await getInventoryDeviationSummary(startDate, endDate)
            setSummary(summaryData)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar desvios de inventário'
            setError(errorMessage)
            toast.error(errorMessage)
            setDeviationData([])
            setSummary({ ok: 0, warning: 0, critical: 0, total: 0 })
        } finally {
            setLoading(false)
        }
    }

    const processDeviations = (deviations: any[]): DeviationData[] => {
        // Group by item name, storing full objects to access updated_at
        const itemMap = new Map<string, { local20: any[]; local32: any[] }>()

        deviations.forEach(deviation => {
            if (!itemMap.has(deviation.item_name)) {
                itemMap.set(deviation.item_name, { local20: [], local32: [] })
            }

            const item = itemMap.get(deviation.item_name)!

            // Store IDs provided by user
            const queluzId = 'fcf80b5a-b658-48f3-871c-ac62120c5a78';
            const amadoraId = 'f86b0b1f-05d0-4310-a655-a92ca1ab68bf';

            if (deviation.store_id === queluzId) {
                item.local32.push(deviation) // Queluz - store full object
            } else if (deviation.store_id === amadoraId) {
                item.local20.push(deviation) // Amadora - store full object
            }
        })

        // Get the latest value (most recent by updated_at)
        const result: DeviationData[] = []
        itemMap.forEach((values, itemName) => {
            // Sort by updated_at and get the most recent one
            let val20 = 0
            if (values.local20.length > 0) {
                const sorted20 = values.local20.sort((a, b) =>
                    new Date(b.updated_at || b.created_at).getTime() -
                    new Date(a.updated_at || a.created_at).getTime()
                )
                val20 = sorted20[0].deviation_value
            }

            let val32 = 0
            if (values.local32.length > 0) {
                const sorted32 = values.local32.sort((a, b) =>
                    new Date(b.updated_at || b.created_at).getTime() -
                    new Date(a.updated_at || a.created_at).getTime()
                )
                val32 = sorted32[0].deviation_value
            }

            result.push({
                item: itemName,
                local20: val20,
                local32: val32,
                status20: getStatus(val20),
                status32: getStatus(val32)
            })
        })

        return result
    }

    const getStatus = (value: number): 'ok' | 'warning' | 'critical' => {
        const abs = Math.abs(value)
        if (abs <= 50) return 'ok'
        if (abs <= 100) return 'warning'
        return 'critical'
    }

    return {
        deviationData,
        summary,
        loading,
        error,
        refetch: loadDeviationsData
    }
}
