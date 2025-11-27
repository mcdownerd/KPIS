-- ============================================
-- POPULAR DADOS FALTANTES: FASTINSIGHT, RATING E DELIVERY
-- ============================================

-- Store ID Queluz: fcf80b5a-b658-48f3-871c-ac62120c5a78

-- ============================================
-- 1. ADICIONAR COLUNA DELIVERY_TIME À TABELA SERVICE_TIMES
-- ============================================
ALTER TABLE service_times 
ADD COLUMN IF NOT EXISTS delivery_time INTEGER;

-- ============================================
-- 2. ATUALIZAR DADOS EXISTENTES COM TEMPOS DE DELIVERY
-- ============================================
-- Vamos adicionar tempos de delivery aos registros existentes (Jan-Jul 2025)
UPDATE service_times 
SET delivery_time = 180 
WHERE store_id = 'fcf80b5a-b658-48f3-871c-ac62120c5a78' 
  AND record_date BETWEEN '2025-01-01' AND '2025-07-31';

-- ============================================
-- 3. INSERIR DADOS DE FASTINSIGHT (PERFORMANCE_TRACKING)
-- ============================================
-- Fastinsight: Pontuação de desempenho operacional (Meta: 85%)
INSERT INTO performance_tracking (store_id, record_date, metric_name, value, status) VALUES
  -- Janeiro
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-01-31', 'Fastinsight', 88.00, 'OK'),
  
  -- Fevereiro
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-02-28', 'Fastinsight', 82.00, 'NOK'),
  
  -- Março
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-03-31', 'Fastinsight', 90.00, 'OK'),
  
  -- Abril
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-04-30', 'Fastinsight', 87.00, 'OK'),
  
  -- Maio
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-05-31', 'Fastinsight', 91.00, 'OK'),
  
  -- Junho
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-06-30', 'Fastinsight', 84.00, 'NOK'),
  
  -- Julho
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-31', 'Fastinsight', 89.00, 'OK');

-- ============================================
-- 4. INSERIR DADOS DE AVALIAÇÕES GOOGLE (PERFORMANCE_TRACKING)
-- ============================================
-- Avaliações Google: Rating médio em estrelas convertido para % (Meta: 4.5 = 90%)
-- Fórmula: (rating / 5) * 100
INSERT INTO performance_tracking (store_id, record_date, metric_name, value, status) VALUES
  -- Janeiro (4.6 estrelas = 92%)
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-01-31', 'Avaliações Google', 92.00, 'OK'),
  
  -- Fevereiro (4.4 estrelas = 88%)
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-02-28', 'Avaliações Google', 88.00, 'NOK'),
  
  -- Março (4.7 estrelas = 94%)
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-03-31', 'Avaliações Google', 94.00, 'OK'),
  
  -- Abril (4.5 estrelas = 90%)
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-04-30', 'Avaliações Google', 90.00, 'OK'),
  
  -- Maio (4.8 estrelas = 96%)
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-05-31', 'Avaliações Google', 96.00, 'OK'),
  
  -- Junho (4.3 estrelas = 86%)
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-06-30', 'Avaliações Google', 86.00, 'NOK'),
  
  -- Julho (4.6 estrelas = 92%)
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-31', 'Avaliações Google', 92.00, 'OK');

-- ============================================
-- VERIFICAÇÃO
-- ============================================
-- Para verificar se os dados foram inseridos corretamente:
-- SELECT * FROM performance_tracking WHERE metric_name IN ('Fastinsight', 'Avaliações Google') ORDER BY record_date;
-- SELECT delivery_time FROM service_times WHERE store_id = 'fcf80b5a-b658-48f3-871c-ac62120c5a78' LIMIT 5;
