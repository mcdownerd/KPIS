-- ============================================
-- CRIAR NOVA LOJA E COPIAR PRODUTOS DA AMADORA
-- ============================================

-- Passo 1: Criar a nova loja
-- IMPORTANTE: Altere o nome e localização conforme necessário
INSERT INTO stores (name, location)
VALUES ('Nome da Nova Loja', 'Localização da Loja')
RETURNING id, name, location;

-- Passo 2: COPIE O ID DA LOJA que apareceu acima e cole abaixo onde está 'ID_DA_NOVA_LOJA'

-- Passo 3: Copiar TODOS os produtos da Amadora para a nova loja
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
    'ID_DA_NOVA_LOJA'::uuid as store_id,  -- COLE O ID AQUI
    p.created_by
FROM products p
WHERE p.store_id = 'f86b0bff-05d0-4310-a655-a92ca1ab68bf'::uuid;  -- Amadora

-- Passo 4: Verificar quantos produtos foram copiados
SELECT 
    (SELECT name FROM stores WHERE id = products.store_id) as loja,
    COUNT(*) as total_produtos,
    COUNT(CASE WHEN dlc_type = 'Primária' THEN 1 END) as dlc_primaria,
    COUNT(CASE WHEN dlc_type = 'Secundária' THEN 1 END) as dlc_secundaria
FROM products 
WHERE store_id = 'ID_DA_NOVA_LOJA'::uuid  -- COLE O ID AQUI TAMBÉM
GROUP BY store_id;
