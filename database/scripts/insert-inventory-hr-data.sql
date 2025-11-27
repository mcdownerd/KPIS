-- ============================================
-- INSERIR DADOS DE INVENTÁRIO E RH
-- ============================================

-- Store ID Queluz: fcf80b5a-b658-48f3-871c-ac62120c5a78

-- 1. INVENTORY DEVIATIONS (Desvios de Inventário)
-- Desvios mensais para diferentes itens de inventário

INSERT INTO inventory_deviations (store_id, record_date, item_name, deviation_value, status) VALUES
  -- Janeiro 2025
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-01-31', 'Hambúrgueres', -15, 'ok'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-01-31', 'Batatas Fritas', 8, 'ok'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-01-31', 'Refrigerantes', -5, 'ok'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-01-31', 'Papel Toalha', 12, 'warning'),
  
  -- Fevereiro 2025
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-02-28', 'Hambúrgueres', -8, 'ok'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-02-28', 'Batatas Fritas', 5, 'ok'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-02-28', 'Refrigerantes', 10, 'ok'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-02-28', 'Papel Toalha', -3, 'ok'),
  
  -- Março 2025
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-03-31', 'Hambúrgueres', -12, 'ok'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-03-31', 'Batatas Fritas', 15, 'warning'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-03-31', 'Refrigerantes', -2, 'ok'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-03-31', 'Papel Toalha', 7, 'ok'),
  
  -- Abril 2025
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-04-30', 'Hambúrgueres', -5, 'ok'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-04-30', 'Batatas Fritas', -10, 'ok'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-04-30', 'Refrigerantes', 8, 'ok'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-04-30', 'Papel Toalha', 20, 'warning'),
  
  -- Maio 2025
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-05-31', 'Hambúrgueres', -18, 'ok'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-05-31', 'Batatas Fritas', 3, 'ok'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-05-31', 'Refrigerantes', -7, 'ok'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-05-31', 'Papel Toalha', 5, 'ok'),
  
  -- Junho 2025
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-06-30', 'Hambúrgueres', -10, 'ok'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-06-30', 'Batatas Fritas', 12, 'ok'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-06-30', 'Refrigerantes', -4, 'ok'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-06-30', 'Papel Toalha', 8, 'ok'),
  
  -- Julho 2025
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-31', 'Hambúrgueres', -6, 'ok'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-31', 'Batatas Fritas', -8, 'ok'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-31', 'Refrigerantes', 6, 'ok'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-31', 'Papel Toalha', 10, 'ok');

-- 2. HR METRICS (Métricas de Recursos Humanos)
-- Dados mensais de custo mão de obra, turnover, staffing e produtividade

INSERT INTO hr_metrics (store_id, record_date, metric_type, value, target_value) VALUES
  -- Janeiro 2025
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-01-31', 'labor_cost', 28500.00, 30000.00),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-01-31', 'turnover_rate', 8.5, 10.0),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-01-31', 'staffing_hours', 1850.00, 1800.00),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-01-31', 'productivity', 95.5, 100.0),
  
  -- Fevereiro 2025
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-02-28', 'labor_cost', 29200.00, 30000.00),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-02-28', 'turnover_rate', 7.2, 10.0),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-02-28', 'staffing_hours', 1820.00, 1800.00),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-02-28', 'productivity', 97.8, 100.0),
  
  -- Março 2025
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-03-31', 'labor_cost', 30100.00, 30000.00),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-03-31', 'turnover_rate', 9.1, 10.0),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-03-31', 'staffing_hours', 1900.00, 1800.00),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-03-31', 'productivity', 98.5, 100.0),
  
  -- Abril 2025
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-04-30', 'labor_cost', 29800.00, 30000.00),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-04-30', 'turnover_rate', 6.8, 10.0),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-04-30', 'staffing_hours', 1880.00, 1800.00),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-04-30', 'productivity', 99.2, 100.0),
  
  -- Maio 2025
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-05-31', 'labor_cost', 31200.00, 30000.00),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-05-31', 'turnover_rate', 5.5, 10.0),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-05-31', 'staffing_hours', 1950.00, 1800.00),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-05-31', 'productivity', 101.5, 100.0),
  
  -- Junho 2025
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-06-30', 'labor_cost', 30500.00, 30000.00),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-06-30', 'turnover_rate', 7.9, 10.0),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-06-30', 'staffing_hours', 1920.00, 1800.00),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-06-30', 'productivity', 100.8, 100.0),
  
  -- Julho 2025
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-31', 'labor_cost', 32100.00, 30000.00),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-31', 'turnover_rate', 6.2, 10.0),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-31', 'staffing_hours', 2000.00, 1800.00),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-31', 'productivity', 102.3, 100.0);
