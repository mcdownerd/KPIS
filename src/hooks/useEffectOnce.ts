import { useEffect, useRef } from 'react';

/**
 * Hook que executa um efeito apenas UMA VEZ, mesmo com remontagens
 * Útil para evitar recarregamentos desnecessários ao navegar entre páginas
 */
export function useEffectOnce(effect: () => void | (() => void), deps: any[] = []) {
    const hasRunRef = useRef(false);
    const cleanupRef = useRef<(() => void) | void>();

    useEffect(() => {
        // Se já executou, não executar novamente
        if (hasRunRef.current) {
            return cleanupRef.current;
        }

        // Marcar como executado
        hasRunRef.current = true;

        // Executar o efeito
        cleanupRef.current = effect();

        // Retornar cleanup se houver
        return cleanupRef.current;
    }, deps);
}

/**
 * Hook que executa um efeito com debounce para evitar múltiplas execuções
 */
export function useEffectDebounced(
    effect: () => void | (() => void),
    deps: any[],
    delay: number = 300
) {
    const cleanupRef = useRef<(() => void) | void>();

    useEffect(() => {
        const timeout = setTimeout(() => {
            // Limpar cleanup anterior se houver
            if (cleanupRef.current) {
                cleanupRef.current();
            }

            // Executar o efeito
            cleanupRef.current = effect();
        }, delay);

        return () => {
            clearTimeout(timeout);
            if (cleanupRef.current) {
                cleanupRef.current();
            }
        };
    }, deps);
}
