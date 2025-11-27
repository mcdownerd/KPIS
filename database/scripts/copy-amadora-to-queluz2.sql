-- ============================================
-- COPIAR PRODUTOS DA AMADORA PARA QUELUZ2
-- ============================================

-- Passo 1: Ver quantos produtos tem a Amadora
SELECT 
    (SELECT name FROM stores WHERE id = products.store_id) as loja,
    COUNT(*) as total_produtos,
    COUNT(CASE WHEN dlc_type = 'Primária' THEN 1 END) as dlc_primaria,
    COUNT(CASE WHEN dlc_type = 'Secundária' THEN 1 END) as dlc_secundaria
FROM products 
WHERE store_id = 'f86b0b1f-05d0-4310-a655-a92ca1ab68bf'::uuid  -- Amadora
GROUP BY store_id;

-- Passo 2: Ver quantos produtos tem a Queluz2 (antes da cópia)
SELECT 
    (SELECT name FROM stores WHERE id = products.store_id) as loja,
    COUNT(*) as total_produtos,
    COUNT(CASE WHEN dlc_type = 'Primária' THEN 1 END) as dlc_primaria,
    COUNT(CASE WHEN dlc_type = 'Secundária' THEN 1 END) as dlc_secundaria
FROM products 
WHERE store_id = 'fcf80b5a-b658-48f3-871e-ac62120c5a78'::uuid  -- Queluz2
GROUP BY store_id;

-- Passo 3: Copiar produtos da Amadora para Queluz2 (evitando duplicados)
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
    'fcf80b5a-b658-48f3-871e-ac62120c5a78'::uuid as store_id,  -- Queluz2
    p.created_by
FROM products p
WHERE p.store_id = 'f86b0bf1-05d0-4310-a655-a92ca1ab68bf'::uuid  -- Amadora
AND NOT EXISTS (
    -- Evitar duplicados: não copiar se já existe produto com mesmo nome, categoria e subcategoria na Queluz2
    SELECT 1 
    FROM products p2 
    WHERE p2.store_id = 'fcf80b5a-b658-48f3-871e-ac62120c5a78'::uuid  -- Queluz2
    AND p2.name = p.name 
    AND p2.category = p.category 
    AND COALESCE(p2.sub_category, '') = COALESCE(p.sub_category, '')
);

-- Passo 4: Ver quantos produtos foram copiados
SELECT 
    (SELECT name FROM stores WHERE id = products.store_id) as loja,
    COUNT(*) as total_produtos,
    COUNT(CASE WHEN dlc_type = 'Primária' THEN 1 END) as dlc_primaria,
    COUNT(CASE WHEN dlc_type = 'Secundária' THEN 1 END) as dlc_secundaria
FROM products 
WHERE store_id = 'fcf80b5a-b658-48f3-871e-ac62120c5a78'::uuid  -- Queluz2
GROUP BY store_id;

-- Passo 5: Ver a diferença (quantos produtos novos foram adicionados)
SELECT 
    'Produtos copiados da Amadora para Queluz2' as descricao,
    COUNT(*) as quantidade
FROM products 
WHERE store_id = 'fcf80b5a-b658-48f3-871e-ac62120c5a78'::uuid  -- Queluz2
AND created_at > NOW() - INTERVAL '1 minute';  -- Produtos criados no último minuto
