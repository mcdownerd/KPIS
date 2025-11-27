-- ============================================
-- INSERIR DADOS DE AVARIAS (MANUTENÇÃO)
-- ============================================

-- Store ID Queluz: fcf80b5a-b658-48f3-871c-ac62120c5a78

INSERT INTO maintenance (store_id, breakdown_date, equipment_name, cause, parts_replaced, cost, status) VALUES
  -- Janeiro 2025
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-01-10', 'Fritadeira 1', 'Termostato avariado', 'Termostato', 150.00, 'completed'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-01-25', 'Arca Frigorífica', 'Fuga de gás', 'Carga de gás', 200.00, 'completed'),
  
  -- Fevereiro 2025
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-02-15', 'Grelhador', 'Resistência queimada', 'Resistência', 300.00, 'completed'),
  
  -- Março 2025
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-03-05', 'Máquina de Café', 'Bomba de água', 'Bomba', 450.00, 'completed'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-03-20', 'Ar Condicionado', 'Filtros sujos', 'Filtros', 120.00, 'completed'),
  
  -- Abril 2025
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-04-12', 'Fritadeira 2', 'Cesto danificado', 'Cesto', 80.00, 'completed'),
  
  -- Maio 2025
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-05-18', 'Torradeira', 'Cabo elétrico', 'Cabo', 50.00, 'completed'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-05-30', 'Máquina de Gelo', 'Motor ventilador', 'Motor', 250.00, 'completed'),
  
  -- Junho 2025
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-06-10', 'Forno', 'Porta desalinhada', 'Dobradiças', 180.00, 'completed'),
  
  -- Julho 2025
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-05', 'Máquina de Lavar', 'Bomba de esgoto', 'Bomba', 220.00, 'completed'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-20', 'Fritadeira 1', 'Manutenção preventiva', 'Óleo e Filtros', 100.00, 'completed'),
  
  -- Avarias Pendentes / Em Resolução (para aparecer no dashboard)
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-28', 'Grelhador', 'Temperatura instável', NULL, 0.00, 'in_progress'),
  ('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-30', 'Arca Congeladora', 'Ruído anormal', NULL, 0.00, 'pending');
