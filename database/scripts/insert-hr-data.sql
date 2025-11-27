-- ============================================
-- INSERIR DADOS DE RH (PEOPLE)
-- ============================================

-- Store ID de Queluz (hardcoded para garantir)
-- fcf80b5a-b658-48f3-871c-ac62120c5a78

-- 1. LABOR COSTS (Custo Mão de Obra)
-- Jan a Jul 2025
INSERT INTO hr_metrics (store_id, record_date, metric_type, value, target_value, additional_data, created_by) VALUES
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-01-15', 'labor_cost', 18.5, 18.0, '{"vendas": 12800, "horas": 320, "prod": 40.0, "mo": 18.5}', auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-02-15', 'labor_cost', 17.8, 18.0, '{"vendas": 15410, "horas": 350, "prod": 44.0, "mo": 17.8}', auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-03-15', 'labor_cost', 18.2, 18.0, '{"vendas": 18080, "horas": 410, "prod": 44.1, "mo": 18.2}', auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-04-15', 'labor_cost', 17.5, 18.0, '{"vendas": 12050, "horas": 280, "prod": 43.0, "mo": 17.5}', auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-05-15', 'labor_cost', 16.9, 18.0, '{"vendas": 31840, "horas": 650, "prod": 49.0, "mo": 16.9}', auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-06-15', 'labor_cost', 17.2, 18.0, '{"vendas": 22740, "horas": 500, "prod": 45.5, "mo": 17.2}', auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-15', 'labor_cost', 18.1, 18.0, '{"vendas": 24000, "horas": 550, "prod": 43.6, "mo": 18.1}', auth.uid());

-- 2. TURNOVER
INSERT INTO hr_metrics (store_id, record_date, metric_type, value, target_value, created_by) VALUES
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-01-15', 'turnover', 5.0, 2.0, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-02-15', 'turnover', 4.2, 2.0, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-03-15', 'turnover', 3.5, 2.0, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-04-15', 'turnover', 2.8, 2.0, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-05-15', 'turnover', 2.1, 2.0, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-06-15', 'turnover', 1.5, 2.0, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-15', 'turnover', 1.2, 2.0, auth.uid());

-- 3. STAFFING (Nível de Pessoal)
INSERT INTO hr_metrics (store_id, record_date, metric_type, value, target_value, created_by) VALUES
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-01-15', 'staffing', 85, 100, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-02-15', 'staffing', 88, 100, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-03-15', 'staffing', 92, 100, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-04-15', 'staffing', 95, 100, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-05-15', 'staffing', 98, 100, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-06-15', 'staffing', 100, 100, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-15', 'staffing', 100, 100, auth.uid());

-- 4. PRODUCTIVITY / PERFORMANCE (Estrelas/Rating)
INSERT INTO hr_metrics (store_id, record_date, metric_type, value, target_value, created_by) VALUES
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-01-15', 'productivity', 3.8, 4.5, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-02-15', 'productivity', 4.0, 4.5, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-03-15', 'productivity', 4.2, 4.5, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-04-15', 'productivity', 4.3, 4.5, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-05-15', 'productivity', 4.5, 4.5, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-06-15', 'productivity', 4.6, 4.5, auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-15', 'productivity', 4.7, 4.5, auth.uid());

-- Reabilitar RLS (caso esteja desabilitado)
ALTER TABLE hr_metrics ENABLE ROW LEVEL SECURITY;

-- Verificar
SELECT metric_type, COUNT(*) FROM hr_metrics GROUP BY metric_type;
