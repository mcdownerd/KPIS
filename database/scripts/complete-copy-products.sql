-- ============================================
-- VERIFICAR O QUE ESTÁ FALTANDO COPIAR
-- ============================================

-- 1. Comparar totais
SELECT 
    (SELECT name FROM stores WHERE id = products.store_id) as loja,
    COUNT(*) as total_produtos,
    COUNT(CASE WHEN dlc_type = 'Primária' THEN 1 END) as dlc_primaria,
    COUNT(CASE WHEN dlc_type = 'Secundária' THEN 1 END) as dlc_secundaria
FROM products 
WHERE store_id IN ('f86b0bff-05d0-4310-a655-a92ca1ab68bf', '7df6b644-4830-489c-afd7-a4d81d5f7b86')
GROUP BY store_id
ORDER BY loja;

-- 2. Ver produtos da Amadora que NÃO estão na Queluz
SELECT 
    p.name,
    p.category,
    p.sub_category,
    p.dlc_type,
    p.expiry_date
FROM products p
WHERE p.store_id = 'f86b0bff-05d0-4310-a655-a92ca1ab68bf'::uuid  -- Amadora
AND NOT EXISTS (
    SELECT 1 
    FROM products p2 
    WHERE p2.store_id = '7df6b644-4830-489c-afd7-a4d81d5f7b86'::uuid  -- Queluz
    AND p2.name = p.name
    AND COALESCE(p2.category, '') = COALESCE(p.category, '')
    AND COALESCE(p2.sub_category, '') = COALESCE(p.sub_category, '')
)
ORDER BY p.dlc_type, p.name;

-- 3. COPIAR TODOS OS PRODUTOS RESTANTES
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
    '7df6b644-4830-489c-afd7-a4d81d5f7b86'::uuid as store_id,  -- Queluz
    p.created_by
FROM products p
WHERE p.store_id = 'f86b0bff-05d0-4310-a655-a92ca1ab68bf'::uuid  -- Amadora
AND NOT EXISTS (
    SELECT 1 
    FROM products p2 
    WHERE p2.store_id = '7df6b644-4830-489c-afd7-a4d81d5f7b86'::uuid  -- Queluz
    AND p2.name = p.name
    AND COALESCE(p2.category, '') = COALESCE(p.category, '')
    AND COALESCE(p2.sub_category, '') = COALESCE(p.sub_category, '')
);

-- 4. Verificar resultado final
SELECT 
    (SELECT name FROM stores WHERE id = products.store_id) as loja,
    COUNT(*) as total_produtos,
    COUNT(CASE WHEN dlc_type = 'Primária' THEN 1 END) as dlc_primaria,
    COUNT(CASE WHEN dlc_type = 'Secundária' THEN 1 END) as dlc_secundaria
FROM products 
WHERE store_id IN ('f86b0bff-05d0-4310-a655-a92ca1ab68bf', '7df6b644-4830-489c-afd7-a4d81d5f7b86')
GROUP BY store_id
ORDER BY loja;
