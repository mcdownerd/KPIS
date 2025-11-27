-- ============================================
-- APAGAR LOJA QUELUZ ORIGINAL (COMPLETO)
-- ============================================
-- Este script resolve TODAS as dependências antes de apagar a loja
-- ATENÇÃO: Esta operação é IRREVERSÍVEL!

-- Passo 1: Ver quais utilizadores estão associados à Queluz original
SELECT 
    id,
    email,
    full_name,
    role,
    (SELECT name FROM stores WHERE id = user_profiles.store_id) as loja_atual
FROM user_profiles
WHERE store_id = '7df6b644-4830-489c-afd7-a4d81d5f7b86'::uuid  -- Queluz original
ORDER BY email;

-- Passo 2: REATRIBUIR todos os utilizadores da Queluz original para a Queluz2
UPDATE user_profiles
SET store_id = 'fcf80b5a-b658-48f3-871c-ac62120c5a78'::uuid  -- Queluz2
WHERE store_id = '7df6b644-4830-489c-afd7-a4d81d5f7b86'::uuid;  -- Queluz original

-- Passo 3: Verificar se os utilizadores foram reatribuídos
SELECT 
    id,
    email,
    full_name,
    role,
    (SELECT name FROM stores WHERE id = user_profiles.store_id) as loja_atual
FROM user_profiles
WHERE store_id = 'fcf80b5a-b658-48f3-871c-ac62120c5a78'::uuid  -- Queluz2
ORDER BY email;

-- Passo 4: Ver quantos produtos serão apagados da Queluz original
SELECT 
    (SELECT name FROM stores WHERE id = products.store_id) as loja,
    COUNT(*) as total_produtos_a_apagar,
    COUNT(CASE WHEN dlc_type = 'Primária' THEN 1 END) as dlc_primaria,
    COUNT(CASE WHEN dlc_type = 'Secundária' THEN 1 END) as dlc_secundaria
FROM products 
WHERE store_id = '7df6b644-4830-489c-afd7-a4d81d5f7b86'::uuid  -- Queluz original
GROUP BY store_id;

-- Passo 5: APAGAR todos os produtos da loja Queluz original
DELETE FROM products
WHERE store_id = '7df6b644-4830-489c-afd7-a4d81d5f7b86'::uuid;  -- Queluz original

-- Passo 6: Verificar se os produtos foram apagados
SELECT COUNT(*) as produtos_restantes_queluz_original
FROM products
WHERE store_id = '7df6b644-4830-489c-afd7-a4d81d5f7b86'::uuid;  -- Queluz original

-- Passo 7: APAGAR a loja Queluz original
DELETE FROM stores
WHERE id = '7df6b644-4830-489c-afd7-a4d81d5f7b86'::uuid;  -- Queluz original

-- Passo 8: Verificar se a loja foi apagada - deve mostrar apenas Amadora e Queluz2
SELECT 
    id,
    name,
    location,
    created_at
FROM stores
ORDER BY name;

-- Passo 9: RESUMO FINAL - Ver todas as lojas com seus produtos e utilizadores
SELECT 
    s.name as loja,
    COUNT(DISTINCT p.id) as total_produtos,
    COUNT(DISTINCT u.id) as total_utilizadores,
    COUNT(CASE WHEN p.dlc_type = 'Primária' THEN 1 END) as dlc_primaria,
    COUNT(CASE WHEN p.dlc_type = 'Secundária' THEN 1 END) as dlc_secundaria
FROM stores s
LEFT JOIN products p ON p.store_id = s.id
LEFT JOIN user_profiles u ON u.store_id = s.id
GROUP BY s.id, s.name
ORDER BY s.name;
