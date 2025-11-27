-- ============================================
-- INSERIR DADOS EXTRAS DE MANUTENÇÃO (UTILITIES & PERFORMANCE)
-- ============================================

-- Store ID Queluz: fcf80b5a-b658-48f3-871c-ac62120c5a78

-- 1. UTILITIES (Água e Eletricidade)
INSERT INTO utilities (store_id, reading_date, utility_type, cost) VALUES
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-01-31', 'water', 450.00),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-01-31', 'electricity', 1200.00),
  
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-02-28', 'water', 480.00),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-02-28', 'electricity', 1150.00),
  
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-03-31', 'water', 460.00),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-03-31', 'electricity', 1180.00),
  
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-04-30', 'water', 490.00),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-04-30', 'electricity', 1250.00),
  
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-05-31', 'water', 510.00),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-05-31', 'electricity', 1300.00),
  
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-06-30', 'water', 530.00),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-06-30', 'electricity', 1400.00),
  
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-31', 'water', 550.00),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-31', 'electricity', 1450.00);

-- 2. PERFORMANCE TRACKING (CMP, PL, Avaliações)
-- CMP: Check Manutenção Preventiva (Meta 96%)
-- PL: Plano de Limpeza (Meta 97%)
-- Avaliações: Rating (Meta 70% ou 4.5 estrelas - vamos usar % aqui para simplificar)

INSERT INTO performance_tracking (store_id, record_date, metric_name, value, status) VALUES
  -- Janeiro
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-01-31', 'CMP', 98.00, 'OK'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-01-31', 'PL', 99.00, 'OK'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-01-31', 'Avaliacoes', 75.00, 'OK'),
  
  -- Fevereiro
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-02-28', 'CMP', 95.00, 'NOK'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-02-28', 'PL', 98.00, 'OK'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-02-28', 'Avaliacoes', 72.00, 'OK'),
  
  -- Março
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-03-31', 'CMP', 100.00, 'OK'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-03-31', 'PL', 96.00, 'NOK'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-03-31', 'Avaliacoes', 68.00, 'NOK'),
  
  -- Abril
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-04-30', 'CMP', 97.00, 'OK'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-04-30', 'PL', 98.00, 'OK'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-04-30', 'Avaliacoes', 78.00, 'OK'),
  
  -- Maio
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-05-31', 'CMP', 99.00, 'OK'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-05-31', 'PL', 99.00, 'OK'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-05-31', 'Avaliacoes', 80.00, 'OK'),
  
  -- Junho
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-06-30', 'CMP', 94.00, 'NOK'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-06-30', 'PL', 95.00, 'NOK'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-06-30', 'Avaliacoes', 70.00, 'OK'),
  
  -- Julho
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-31', 'CMP', 98.00, 'OK'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-31', 'PL', 100.00, 'OK'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-31', 'Avaliacoes', 82.00, 'OK');
