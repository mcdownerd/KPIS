-- ============================================
-- DEBUG: Verificar seu perfil e dados
-- ============================================

-- 1. Ver seu perfil completo
SELECT 
    id,
    store_id,
    email,
    role,
    pg_typeof(id) as tipo_id,
    pg_typeof(store_id) as tipo_store_id
FROM user_profiles 
WHERE id = auth.uid();

-- 2. Ver quantos registros existem (sem RLS)
SELECT 
    (SELECT COUNT(*) FROM sales) as total_sales,
    (SELECT COUNT(*) FROM service_times) as total_service_times,
    (SELECT COUNT(*) FROM costs) as total_costs,
    (SELECT COUNT(*) FROM inventory_deviations) as total_inventory;

-- 3. Ver os store_ids nas tabelas de vendas
SELECT DISTINCT 
    store_id,
    pg_typeof(store_id) as tipo
FROM sales
LIMIT 5;

-- 4. Testar comparação direta
SELECT 
    COUNT(*) as vendas_visiveis
FROM sales s
WHERE EXISTS (
    SELECT 1 FROM user_profiles up 
    WHERE up.id = auth.uid() 
    AND up.store_id::text = s.store_id::text
);
