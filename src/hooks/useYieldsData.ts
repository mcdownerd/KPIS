import { useState, useEffect, useCallback } from 'react'
import { getYieldsByMonth } from '@/lib/api/yields'
import { toast } from 'sonner'
import { useAuth } from './useAuth'

export interface YieldItem {
    item: string;
    local20: number;
    local32: number;
}

export function useYieldsData(monthIndex: number) {
    const [yieldData, setYieldData] = useState<YieldItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { profile } = useAuth()

    const loadYields = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const year = new Date().getFullYear()
            const data = await getYieldsByMonth(monthIndex, year)

            // Process data to group by product and store
            // Note: Currently we only have data for the user's store.
            // To show both stores, we would need to fetch data for both stores,
            // which requires admin access or different RLS policies.
            // For now, we'll map the data to the correct column based on the user's store.

            const processed: Record<string, YieldItem> = {}

            // Initialize with known products to ensure they appear even if empty
            const products = [
                'Batata', 'Alface L6', 'Sopas', 'Cob Chocolate',
                'Cob Caramelo', 'Cob Morango', 'Cob Snickers',
                'Cob Mars', 'Leite Sundae'
            ]

            products.forEach(prod => {
                processed[prod] = { item: prod, local20: 0, local32: 0 }
            })

            data.forEach((record: any) => {
                const productName = record.product_name
                if (processed[productName]) {
                    if (record.store_id === 'f86b0b1f-05d0-4310-a655-a92ca1ab68bf') { // Amadora
                        processed[productName].local20 = record.yield_value
                    } else if (record.store_id === 'fcf80b5a-b658-48f3-871c-ac62120c5a78') { // Queluz
                        processed[productName].local32 = record.yield_value
                    }
                }
            })

            setYieldData(Object.values(processed))

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados de rendimentos'
            setError(errorMessage)
            console.error(err)
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [monthIndex, profile])

    useEffect(() => {
        loadYields()
    }, [loadYields])

    return {
        yieldData,
        loading,
        error,
        refetch: loadYields
    }
}
