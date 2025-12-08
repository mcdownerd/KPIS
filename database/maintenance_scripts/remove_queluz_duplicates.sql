-- Script para identificar e remover produtos duplicados da loja de Queluz
-- Este script mantém apenas o registro mais recente de cada produto duplicado

-- Passo 1: Identificar a loja de Queluz
SELECT 
    id as store_id,
    name as store_name,
    location
FROM stores
WHERE name ILIKE '%queluz%'
ORDER BY created_at DESC;

-- Passo 2: Verificar produtos duplicados em Queluz
-- (Produtos com mesmo nome, categoria e subcategoria)
WITH queluz_store AS (
    SELECT id FROM stores WHERE name ILIKE '%queluz%' LIMIT 1
),
duplicates_analysis AS (
    SELECT 
        p.name,
        p.category,
        p.sub_category,
        COUNT(*) as quantidade_duplicados,
        MIN(p.created_at) as primeira_criacao,
        MAX(p.created_at) as ultima_criacao,
        ARRAY_AGG(p.id ORDER BY p.created_at DESC) as product_ids
    FROM products p
    WHERE p.store_id = (SELECT id FROM queluz_store)
    GROUP BY p.name, p.category, p.sub_category
    HAVING COUNT(*) > 1
)
SELECT 
    name as produto,
    category as categoria,
    sub_category as subcategoria,
    quantidade_duplicados,
    primeira_criacao,
    ultima_criacao,
    product_ids
FROM duplicates_analysis
ORDER BY quantidade_duplicados DESC, name;

-- Passo 3: Contar total de produtos duplicados que serão removidos
WITH queluz_store AS (
    SELECT id FROM stores WHERE name ILIKE '%queluz%' LIMIT 1
),
duplicates AS (
    SELECT 
        p.id,
        ROW_NUMBER() OVER (
            PARTITION BY 
                p.store_id,
                p.name,
                p.category,
                p.sub_category
            ORDER BY p.created_at DESC
        ) as row_num
    FROM products p
    WHERE p.store_id = (SELECT id FROM queluz_store)
)
SELECT 
    COUNT(*) as total_duplicados_a_remover
FROM duplicates
WHERE row_num > 1;

-- Passo 4: REMOVER produtos duplicados (mantém o mais recente)
-- ATENÇÃO: Este comando irá APAGAR dados permanentemente!
-- Descomente apenas quando tiver certeza de que quer executar

/*
BEGIN;

WITH queluz_store AS (
    SELECT id FROM stores WHERE name ILIKE '%queluz%' LIMIT 1
),
duplicates AS (
    SELECT 
        p.id,
        ROW_NUMBER() OVER (
            PARTITION BY 
                p.store_id,
                p.name,
                p.category,
                p.sub_category
            ORDER BY p.created_at DESC
        ) as row_num
    FROM products p
    WHERE p.store_id = (SELECT id FROM queluz_store)
)
DELETE FROM products
WHERE id IN (
    SELECT id FROM duplicates WHERE row_num > 1
);

COMMIT;
*/

-- Passo 5: Verificação pós-limpeza
-- Execute após remover os duplicados para confirmar
WITH queluz_store AS (
    SELECT id FROM stores WHERE name ILIKE '%queluz%' LIMIT 1
)
SELECT 
    COUNT(*) as total_produtos_queluz,
    COUNT(DISTINCT name) as produtos_unicos_por_nome,
    COUNT(DISTINCT (name, category, sub_category)) as produtos_unicos_completos
FROM products
WHERE store_id = (SELECT id FROM queluz_store);

-- Passo 6: Ver produtos restantes agrupados
WITH queluz_store AS (
    SELECT id FROM stores WHERE name ILIKE '%queluz%' LIMIT 1
)
SELECT 
    category,
    sub_category,
    COUNT(*) as quantidade
FROM products
WHERE store_id = (SELECT id FROM queluz_store)
GROUP BY category, sub_category
ORDER BY category, sub_category;
