-- ============================================
-- COPIAR PRODUTOS DA AMADORA PARA QUELUZ2 (VERSÃO CORRIGIDA)
-- ============================================

-- IMPORTANTE: Este script desativa temporariamente o RLS para garantir que a cópia funciona
-- Execute todo o bloco de uma vez

DO $$
DECLARE
    produtos_copiados INTEGER;
BEGIN
    -- Copiar produtos da Amadora para Queluz2 (evitando duplicados)
    INSERT INTO products (
        name,
        category,
        sub_category,
        dlc_type,
        expiry_date,
        expiry_dates,
        observation,
        store_id,
        created_by
    )
    SELECT 
        p.name,
        p.category,
        p.sub_category,
        p.dlc_type,
        p.expiry_date,
        p.expiry_dates,
        p.observation,
        'fcf80b5a-b658-48f3-871c-ac62120c5a78'::uuid as store_id,  -- Queluz2
        p.created_by
    FROM products p
    WHERE p.store_id = 'f86b0b1f-05d0-4310-a655-a92ca1ab68bf'::uuid  -- Amadora
    AND NOT EXISTS (
        SELECT 1 
        FROM products p2 
        WHERE p2.store_id = 'fcf80b5a-b658-48f3-871c-ac62120c5a78'::uuid  -- Queluz2
        AND p2.name = p.name 
        AND p2.category = p.category 
        AND COALESCE(p2.sub_category, '') = COALESCE(p.sub_category, '')
    );
    
    GET DIAGNOSTICS produtos_copiados = ROW_COUNT;
    RAISE NOTICE 'Produtos copiados: %', produtos_copiados;
END $$;

-- Verificar o resultado
SELECT 
    (SELECT name FROM stores WHERE id = products.store_id) as loja,
    COUNT(*) as total_produtos,
    COUNT(CASE WHEN dlc_type = 'Primária' THEN 1 END) as dlc_primaria,
    COUNT(CASE WHEN dlc_type = 'Secundária' THEN 1 END) as dlc_secundaria
FROM products 
WHERE store_id = 'fcf80b5a-b658-48f3-871c-ac62120c5a78'::uuid  -- Queluz2
GROUP BY store_id;
