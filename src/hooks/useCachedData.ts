import { useEffect, useState, useRef } from 'react';

// Cache global em memória (persiste entre remontagens)
const globalCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

interface UseCachedDataOptions<T> {
    cacheKey: string;
    fetchFn: () => Promise<T>;
    fallbackFn?: () => T;
    enabled?: boolean;
}

/**
 * Hook que faz cache de dados em memória para evitar recarregamentos
 * ao minimizar/maximizar a janela ou trocar de aba
 */
export function useCachedData<T>({
    cacheKey,
    fetchFn,
    fallbackFn,
    enabled = true,
}: UseCachedDataOptions<T>) {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const hasFetchedRef = useRef(false);

    useEffect(() => {
        if (!enabled) {
            setIsLoading(false);
            return;
        }

        const loadData = async () => {
            // Verificar se tem cache válido
            const cached = globalCache.get(cacheKey);
            const now = Date.now();

            if (cached && now - cached.timestamp < CACHE_DURATION) {
                // Cache válido - usar sem fazer fetch
                console.log(`[useCachedData] Using cache for: ${cacheKey}`);
                setData(cached.data);
                setIsLoading(false);
                hasFetchedRef.current = true;
                return;
            }

            // Cache expirado ou não existe - fazer fetch
            if (hasFetchedRef.current) {
                // Já fez fetch antes, não fazer de novo (evita recarregar ao remontar)
                console.log(`[useCachedData] Skipping refetch for: ${cacheKey}`);
                return;
            }

            console.log(`[useCachedData] Fetching data for: ${cacheKey}`);
            setIsLoading(true);

            try {
                const result = await fetchFn();
                setData(result);
                setError(null);

                // Salvar no cache global
                globalCache.set(cacheKey, {
                    data: result,
                    timestamp: now,
                });

                hasFetchedRef.current = true;
            } catch (err) {
                console.error(`[useCachedData] Error fetching ${cacheKey}:`, err);
                setError(err as Error);

                // Tentar fallback
                if (fallbackFn) {
                    const fallbackData = fallbackFn();
                    setData(fallbackData);
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [cacheKey, enabled]);

    const invalidateCache = () => {
        globalCache.delete(cacheKey);
        hasFetchedRef.current = false;
    };

    const updateCache = (newData: T) => {
        setData(newData);
        globalCache.set(cacheKey, {
            data: newData,
            timestamp: Date.now(),
        });
    };

    return {
        data,
        isLoading,
        error,
        invalidateCache,
        updateCache,
    };
}
