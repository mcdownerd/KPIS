-- ============================================
-- DIAGNÓSTICO: Por que os produtos não foram copiados?
-- ============================================

-- 1. Verificar quantos produtos cada loja tem
SELECT 
    (SELECT name FROM stores WHERE id = products.store_id) as loja,
    COUNT(*) as total_produtos
FROM products 
WHERE store_id IN ('f86b0bff-05d0-4310-a655-a92ca1ab68bf', '7df6b644-4830-489c-afd7-a4d81d5f7b86')
GROUP BY store_id;

-- 2. Ver alguns produtos da Amadora
SELECT name, category, sub_category 
FROM products 
WHERE store_id = 'f86b0bff-05d0-4310-a655-a92ca1ab68bf'
LIMIT 10;

-- 3. Ver alguns produtos da Queluz
SELECT name, category, sub_category 
FROM products 
WHERE store_id = '7df6b644-4830-489c-afd7-a4d81d5f7b86'
LIMIT 10;

-- 4. Verificar se há produtos da Amadora que NÃO estão na Queluz
SELECT 
    p.name,
    p.category,
    p.sub_category
FROM products p
WHERE p.store_id = 'f86b0bff-05d0-4310-a655-a92ca1ab68bf'  -- Amadora
AND NOT EXISTS (
    SELECT 1 
    FROM products p2 
    WHERE p2.store_id = '7df6b644-4830-489c-afd7-a4d81d5f7b86'  -- Queluz
    AND p2.name = p.name
    AND p2.category = p.category
    AND p2.sub_category = p.sub_category
)
LIMIT 20;

-- 5. Se quiser copiar TODOS os produtos (mesmo duplicando), use este:
-- ATENÇÃO: Isso vai duplicar produtos! Use apenas se tiver certeza.
/*
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
    '7df6b644-4830-489c-afd7-a4d81d5f7b86' as store_id,  -- Queluz
    p.created_by
FROM products p
WHERE p.store_id = 'f86b0bff-05d0-4310-a655-a92ca1ab68bf';  -- Amadora
*/
