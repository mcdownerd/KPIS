-- ============================================
-- TEMPORARIAMENTE DESABILITAR RLS PARA TESTE
-- ============================================

-- Desabilitar RLS
ALTER TABLE sales DISABLE ROW LEVEL SECURITY;
ALTER TABLE service_times DISABLE ROW LEVEL SECURITY;
ALTER TABLE costs DISABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_deviations DISABLE ROW LEVEL SECURITY;

-- Agora verificar se você vê os dados
SELECT COUNT(*) as total_vendas FROM sales;
SELECT COUNT(*) as total_service_times FROM service_times;
SELECT COUNT(*) as total_custos FROM costs;
SELECT COUNT(*) as total_desvios FROM inventory_deviations;

-- Ver os primeiros registros
SELECT * FROM sales LIMIT 3;
