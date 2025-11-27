-- ============================================
-- SOLUÇÃO TEMPORÁRIA: DESABILITAR RLS
-- ============================================
-- Use isso APENAS para desenvolvimento/teste
-- Em produção, as RLS policies devem estar ativas

ALTER TABLE sales DISABLE ROW LEVEL SECURITY;
ALTER TABLE service_times DISABLE ROW LEVEL SECURITY;
ALTER TABLE costs DISABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_deviations DISABLE ROW LEVEL SECURITY;
ALTER TABLE hr_metrics DISABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance DISABLE ROW LEVEL SECURITY;
ALTER TABLE performance_tracking DISABLE ROW LEVEL SECURITY;

SELECT 'RLS desabilitado - APENAS PARA TESTE!' as aviso;
