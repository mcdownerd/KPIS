-- ============================================
-- COPIAR PRODUTOS - VERSÃO FORÇADA
-- ============================================
-- Este script força a cópia dos produtos que não existem na Queluz

-- IMPORTANTE: Execute este script como ADMIN no Supabase

-- Copiar produtos da Amadora para Queluz
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

-- Verificar resultado
SELECT 
    (SELECT name FROM stores WHERE id = products.store_id) as loja,
    COUNT(*) as total_produtos
FROM products 
WHERE store_id IN ('f86b0bff-05d0-4310-a655-a92ca1ab68bf', '7df6b644-4830-489c-afd7-a4d81d5f7b86')
GROUP BY store_id
ORDER BY loja;
