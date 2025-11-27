-- ============================================
-- APAGAR LOJA QUELUZ ORIGINAL E SEUS PRODUTOS
-- ============================================
-- ATENÇÃO: Esta operação é IRREVERSÍVEL!
-- Certifique-se de que já copiou os produtos necessários antes de executar!

-- Passo 1: Ver quantos produtos serão apagados
SELECT 
    (SELECT name FROM stores WHERE id = products.store_id) as loja,
    COUNT(*) as total_produtos_a_apagar,
    COUNT(CASE WHEN dlc_type = 'Primária' THEN 1 END) as dlc_primaria,
    COUNT(CASE WHEN dlc_type = 'Secundária' THEN 1 END) as dlc_secundaria
FROM products 
WHERE store_id = '7df6b644-4830-489c-afd7-a4d81d5f7b86'::uuid  -- Queluz original
GROUP BY store_id;

-- Passo 2: APAGAR todos os produtos da loja Queluz original
DELETE FROM products
WHERE store_id = '7df6b644-4830-489c-afd7-a4d81d5f7b86'::uuid;  -- Queluz original

-- Passo 3: Verificar se os produtos foram apagados
SELECT COUNT(*) as produtos_restantes
FROM products
WHERE store_id = '7df6b644-4830-489c-afd7-a4d81d5f7b86'::uuid;  -- Queluz original

-- Passo 4: APAGAR a loja Queluz original
DELETE FROM stores
WHERE id = '7df6b644-4830-489c-afd7-a4d81d5f7b86'::uuid;  -- Queluz original

-- Passo 5: Verificar se a loja foi apagada
SELECT 
    id,
    name,
    location
FROM stores
ORDER BY name;

-- Passo 6: Verificar o estado final - deve ter apenas Amadora e Queluz2
SELECT 
    s.id,
    s.name as loja,
    COUNT(p.id) as total_produtos,
    COUNT(CASE WHEN p.dlc_type = 'Primária' THEN 1 END) as dlc_primaria,
    COUNT(CASE WHEN p.dlc_type = 'Secundária' THEN 1 END) as dlc_secundaria
FROM stores s
LEFT JOIN products p ON p.store_id = s.id
GROUP BY s.id, s.name
ORDER BY s.name;
