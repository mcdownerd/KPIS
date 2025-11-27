-- ============================================
-- INSERIR DADOS DE MANUTENÇÃO
-- ============================================

-- Store ID de Queluz (hardcoded)
-- fcf80b5a-b658-48f3-871c-ac62120c5a78

INSERT INTO maintenance (store_id, breakdown_date, equipment_name, cause, parts_replaced, cost, status, created_by) VALUES
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-01-10', 'Forno Rational 1', 'Resistência queimada', 'Resistência Inferior', 450.00, 'completed', auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-02-05', 'Máquina de Café', 'Vazamento de água', 'Juntas de vedação', 120.50, 'completed', auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-03-12', 'Arca Frigorífica', 'Motor ruidoso', 'Ventoinha', 280.00, 'completed', auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-04-20', 'Ar Condicionado Sala', 'Não gela', 'Gás Refrigerante', 150.00, 'completed', auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-05-15', 'Fritadeira 2', 'Termostato avariado', 'Termostato Digital', 320.00, 'completed', auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-06-08', 'Máquina de Lavar Loiça', 'Bomba de drenagem', 'Bomba', 410.00, 'completed', auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-01', 'Grelhador', 'Queimador entupido', 'Limpeza profunda', 80.00, 'completed', auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-20', 'POS Balcão', 'Tela touch não responde', 'Tela Touch', 250.00, 'in_progress', auth.uid()),
('fcf80b5a-b658-48f3-871c-ac62120c5a78', '2025-07-25', 'Porta Automática', 'Sensor falhando', NULL, 0.00, 'pending', auth.uid());

-- Reabilitar RLS
ALTER TABLE maintenance ENABLE ROW LEVEL SECURITY;

-- Verificar
SELECT status, COUNT(*) FROM maintenance GROUP BY status;
