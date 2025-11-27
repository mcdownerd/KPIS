-- ============================================
-- DIAGNÓSTICO: Verificar Dados e Permissões
-- ============================================
-- Execute este script no Supabase SQL Editor

-- 1. Verificar seu usuário e store_id
SELECT 
    'Meu Usuário' as tipo,
    id as user_id, 
    store_id,
    email,
    role
FROM user_profiles 
WHERE id = auth.uid();

-- 2. Verificar se existem dados de vendas (SEM filtro de RLS)
SELECT 
    'Total de Vendas no Banco' as tipo,
    COUNT(*) as total,
    MIN(sale_date) as primeira_venda,
    MAX(sale_date) as ultima_venda
FROM sales;

-- 3. Verificar se VOCÊ consegue ver as vendas (COM RLS)
SELECT 
    'Vendas que EU vejo' as tipo,
    COUNT(*) as total
FROM sales
WHERE store_id::text IN (
    SELECT store_id::text FROM user_profiles WHERE id = auth.uid()
);

-- 4. Verificar dados de service_times
SELECT 
    'Service Times Total' as tipo,
    COUNT(*) as total
FROM service_times;

-- 5. Verificar dados de costs
SELECT 
    'Costs Total' as tipo,
    COUNT(*) as total
FROM costs;

-- 6. Verificar dados de inventory_deviations
SELECT 
    'Inventory Deviations Total' as tipo,
    COUNT(*) as total
FROM inventory_deviations;

-- 7. Listar as primeiras vendas (para debug)
SELECT 
    id,
    store_id,
    sale_date,
    platform,
    total_value
FROM sales
LIMIT 5;
