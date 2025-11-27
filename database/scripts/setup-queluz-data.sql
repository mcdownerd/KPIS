-- ============================================
-- ATUALIZAR PERFIL E INSERIR DADOS DE TESTE
-- ============================================

-- 1. Atualizar seu perfil com o store_id de Queluz
UPDATE user_profiles 
SET store_id = 'fcf80b5a-b658-48f3-871c-ac62120c5a78'
WHERE id = auth.uid();

-- Verificar se atualizou
SELECT id, store_id, email FROM user_profiles WHERE id = auth.uid();

-- ============================================
-- 2. INSERIR DADOS DE TESTE
-- ============================================

-- VENDAS
INSERT INTO sales (store_id, sale_date, platform, total_value, created_by) VALUES
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-01-15', 'Delivery', 7660.00, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-01-15', 'Sala', 5200.00, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-02-15', 'Delivery', 9310.00, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-02-15', 'Sala', 6100.00, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-03-15', 'Delivery', 10880.00, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-03-15', 'Sala', 7200.00, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-04-15', 'Delivery', 7250.00, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-04-15', 'Sala', 4800.00, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-05-15', 'Delivery', 19340.00, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-05-15', 'Sala', 12500.00, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-06-15', 'Delivery', 13540.00, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-06-15', 'Sala', 9200.00, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-15', 'Delivery', 14200.00, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-15', 'Sala', 9800.00, auth.uid());

-- TEMPOS DE SERVIÇO
INSERT INTO service_times (store_id, record_date, lunch_time, dinner_time, day_time, target_time, created_by) VALUES
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-01-15', 97, 105, 108, 110, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-02-15', 99, 108, 112, 110, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-03-15', 108, 115, 120, 110, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-04-15', 117, 122, 125, 110, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-05-15', 121, 128, 130, 110, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-06-15', 128, 135, 138, 110, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-15', 135, 140, 142, 110, auth.uid());

-- CUSTOS
INSERT INTO costs (store_id, record_date, cost_type, percentage, target_percentage, created_by) VALUES
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-01-15', 'comida', 26.78, 26.50, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-01-15', 'papel', 1.52, 1.50, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-02-15', 'comida', 27.12, 26.50, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-02-15', 'papel', 1.68, 1.50, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-03-15', 'comida', 26.95, 26.50, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-03-15', 'papel', 1.45, 1.50, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-04-15', 'comida', 27.50, 26.50, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-04-15', 'papel', 1.75, 1.50, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-05-15', 'comida', 26.20, 26.50, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-05-15', 'papel', 1.38, 1.50, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-06-15', 'comida', 26.85, 26.50, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-06-15', 'papel', 1.55, 1.50, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-15', 'comida', 27.10, 26.50, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-15', 'papel', 1.62, 1.50, auth.uid());

-- DESVIOS DE INVENTÁRIO
INSERT INTO inventory_deviations (store_id, record_date, item_name, deviation_value, status, created_by) VALUES
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-15', 'Pão Reg', -114, 'critical', auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-15', 'Queijo Cheddar', 45, 'ok', auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-15', 'Alface', -78, 'warning', auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-15', 'Tomate', 32, 'ok', auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-15', 'Carne Bovina', -95, 'warning', auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-15', 'Batata Frita', 18, 'ok', auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-15', 'Coca-Cola', -125, 'critical', auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-15', 'Maionese', 28, 'ok', auth.uid());

-- ============================================
-- 3. REABILITAR RLS
-- ============================================
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_deviations ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. VERIFICAR
-- ============================================
SELECT 'Dados inseridos com sucesso!' as mensagem;
SELECT COUNT(*) as total_vendas FROM sales;
SELECT COUNT(*) as total_service_times FROM service_times;
SELECT COUNT(*) as total_custos FROM costs;
SELECT COUNT(*) as total_desvios FROM inventory_deviations;
