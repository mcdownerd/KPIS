import React, { useRef, useEffect } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';

interface CacheNode {
    pathname: string;
    element: React.ReactElement | null;
}

/**
 * KeepAlive component - mantém componentes de rota montados em cache
 * para evitar recarregamentos ao navegar entre páginas
 */
export function KeepAlive() {
    const location = useLocation();
    const outlet = useOutlet();
    const cacheRef = useRef<Map<string, CacheNode>>(new Map());

    useEffect(() => {
        // Salvar o componente atual no cache
        if (outlet) {
            cacheRef.current.set(location.pathname, {
                pathname: location.pathname,
                element: outlet,
            });
        }
    }, [location.pathname, outlet]);

    // Buscar do cache ou usar o outlet atual
    const cachedNode = cacheRef.current.get(location.pathname);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            {Array.from(cacheRef.current.values()).map((node) => (
                <div
                    key={node.pathname}
                    style={{
                        display: node.pathname === location.pathname ? 'block' : 'none',
                        width: '100%',
                        height: '100%',
                    }}
                >
                    {node.element}
                </div>
            ))}
        </div>
    );
}
