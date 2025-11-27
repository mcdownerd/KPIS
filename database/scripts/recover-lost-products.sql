-- ============================================
-- RECUPERAR PRODUTOS SEM LOJA (store_id NULL)
-- ============================================

-- 1. Ver quantos produtos estão sem loja
SELECT COUNT(*) as produtos_sem_loja
FROM products
WHERE store_id IS NULL;

-- 2. Ver a lista de produtos sem loja
SELECT 
    id,
    name,
    category,
    sub_category,
    dlc_type,
    expiry_date,
    created_at
FROM products
WHERE store_id IS NULL
ORDER BY created_at DESC;

-- 3. ATRIBUIR TODOS OS PRODUTOS SEM LOJA À QUELUZ
UPDATE products
SET store_id = '7df6b644-4830-489c-afd7-a4d81d5f7b86'::uuid  -- Queluz
WHERE store_id IS NULL;

-- 4. Verificar se ainda há produtos sem loja
SELECT COUNT(*) as produtos_sem_loja
FROM products
WHERE store_id IS NULL;

-- 5. Verificar o total da Queluz agora
SELECT 
    (SELECT name FROM stores WHERE id = products.store_id) as loja,
    COUNT(*) as total_produtos,
    COUNT(CASE WHEN dlc_type = 'Primária' THEN 1 END) as dlc_primaria,
    COUNT(CASE WHEN dlc_type = 'Secundária' THEN 1 END) as dlc_secundaria
FROM products 
WHERE store_id = '7df6b644-4830-489c-afd7-a4d81d5f7b86'::uuid
GROUP BY store_id;
