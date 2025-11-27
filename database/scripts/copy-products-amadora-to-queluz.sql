-- ============================================
-- COPIAR PRODUTOS DA AMADORA PARA QUELUZ
-- ============================================
-- Este script copia produtos que existem na Amadora mas não na Queluz

-- Passo 1: Verificar quantos produtos cada loja tem ANTES da cópia
SELECT 
    COUNT(*) as total_produtos, 
    store_id, 
    (SELECT name FROM stores WHERE id = products.store_id) as loja
FROM products 
WHERE store_id IN ('f86b0bff-05d0-4310-a655-a92ca1ab68bf', '7df6b644-4830-489c-afd7-a4d81d5f7b86')
GROUP BY store_id;

-- Passo 2: Copiar produtos da Amadora para Queluz (sem duplicar)
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
WHERE p.store_id = 'f86b0bff-05d0-4310-a655-a92ca1ab68bf'  -- Amadora
AND NOT EXISTS (
    -- Verifica se já existe um produto com o mesmo nome na Queluz
    SELECT 1 
    FROM products p2 
    WHERE p2.store_id = '7df6b644-4830-489c-afd7-a4d81d5f7b86'  -- Queluz
    AND p2.name = p.name
    AND p2.category = p.category
    AND p2.sub_category = p.sub_category
);

-- Passo 3: Verificar quantos produtos cada loja tem DEPOIS da cópia
SELECT 
    COUNT(*) as total_produtos, 
    store_id, 
    (SELECT name FROM stores WHERE id = products.store_id) as loja
FROM products 
WHERE store_id IN ('f86b0bff-05d0-4310-a655-a92ca1ab68bf', '7df6b644-4830-489c-afd7-a4d81d5f7b86')
GROUP BY store_id;
