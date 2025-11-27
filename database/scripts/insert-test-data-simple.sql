-- ============================================
-- DADOS DE TESTE - VERSÃO SIMPLIFICADA
-- ============================================
-- IMPORTANTE: Este script usa auth.uid() para pegar automaticamente
-- o store_id do usuário logado

-- ============================================
-- 1. VENDAS (SALES)
-- ============================================
INSERT INTO sales (store_id, sale_date, platform, total_value, created_by)
SELECT 
    up.store_id::uuid,
    '2025-01-15'::date,
    'Delivery',
    7660.00,
    auth.uid()
FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-01-15'::date, 'Sala', 5200.00, auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-02-15'::date, 'Delivery', 9310.00, auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-02-15'::date, 'Sala', 6100.00, auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-03-15'::date, 'Delivery', 10880.00, auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-03-15'::date, 'Sala', 7200.00, auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-04-15'::date, 'Delivery', 7250.00, auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-04-15'::date, 'Sala', 4800.00, auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-05-15'::date, 'Delivery', 19340.00, auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-05-15'::date, 'Sala', 12500.00, auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-06-15'::date, 'Delivery', 13540.00, auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-06-15'::date, 'Sala', 9200.00, auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-07-15'::date, 'Delivery', 14200.00, auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-07-15'::date, 'Sala', 9800.00, auth.uid() FROM user_profiles up WHERE up.id = auth.uid();

-- ============================================
-- 2. TEMPOS DE SERVIÇO (SERVICE_TIMES)
-- ============================================
INSERT INTO service_times (store_id, record_date, lunch_time, dinner_time, day_time, target_time, created_by)
SELECT up.store_id::uuid, '2025-01-15'::date, 97, 105, 108, 110, auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-02-15'::date, 99, 108, 112, 110, auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-03-15'::date, 108, 115, 120, 110, auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-04-15'::date, 117, 122, 125, 110, auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-05-15'::date, 121, 128, 130, 110, auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-06-15'::date, 128, 135, 138, 110, auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-07-15'::date, 135, 140, 142, 110, auth.uid() FROM user_profiles up WHERE up.id = auth.uid();

-- ============================================
-- 3. CUSTOS (COSTS)
-- ============================================
INSERT INTO costs (store_id, record_date, cost_type, percentage, target_percentage, created_by)
SELECT up.store_id::uuid, '2025-01-15'::date, 'comida', 26.78, 26.50, auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-01-15'::date, 'papel', 1.52, 1.50, auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-02-15'::date, 'comida', 27.12, 26.50, auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-02-15'::date, 'papel', 1.68, 1.50, auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-03-15'::date, 'comida', 26.95, 26.50, auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-03-15'::date, 'papel', 1.45, 1.50, auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-04-15'::date, 'comida', 27.50, 26.50, auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-04-15'::date, 'papel', 1.75, 1.50, auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-05-15'::date, 'comida', 26.20, 26.50, auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-05-15'::date, 'papel', 1.38, 1.50, auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-06-15'::date, 'comida', 26.85, 26.50, auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-06-15'::date, 'papel', 1.55, 1.50, auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-07-15'::date, 'comida', 27.10, 26.50, auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-07-15'::date, 'papel', 1.62, 1.50, auth.uid() FROM user_profiles up WHERE up.id = auth.uid();

-- ============================================
-- 4. DESVIOS DE INVENTÁRIO (INVENTORY_DEVIATIONS)
-- ============================================
INSERT INTO inventory_deviations (store_id, record_date, item_name, deviation_value, status, created_by)
SELECT up.store_id::uuid, '2025-07-15'::date, 'Pão Reg', -114, 'critical', auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-07-15'::date, 'Queijo Cheddar', 45, 'ok', auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-07-15'::date, 'Alface', -78, 'warning', auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-07-15'::date, 'Tomate', 32, 'ok', auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-07-15'::date, 'Carne Bovina', -95, 'warning', auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-07-15'::date, 'Batata Frita', 18, 'ok', auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-07-15'::date, 'Coca-Cola', -125, 'critical', auth.uid() FROM user_profiles up WHERE up.id = auth.uid()
UNION ALL
SELECT up.store_id::uuid, '2025-07-15'::date, 'Maionese', 28, 'ok', auth.uid() FROM user_profiles up WHERE up.id = auth.uid();

-- ============================================
-- VERIFICAÇÃO
-- ============================================
SELECT 'Dados inseridos com sucesso!' as mensagem;
SELECT COUNT(*) as total_vendas FROM sales WHERE store_id::text IN (SELECT store_id::text FROM user_profiles WHERE id = auth.uid());
SELECT COUNT(*) as total_service_times FROM service_times WHERE store_id::text IN (SELECT store_id::text FROM user_profiles WHERE id = auth.uid());
SELECT COUNT(*) as total_custos FROM costs WHERE store_id::text IN (SELECT store_id::text FROM user_profiles WHERE id = auth.uid());
SELECT COUNT(*) as total_desvios FROM inventory_deviations WHERE store_id::text IN (SELECT store_id::text FROM user_profiles WHERE id = auth.uid());
