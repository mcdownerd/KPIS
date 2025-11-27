-- ============================================
-- FIX DE EMERGÊNCIA: DESABILITAR RLS TEMPORARIAMENTE
-- ============================================
-- O objetivo é garantir que o dashboard carregue sem timeouts.
-- Depois reabilitaremos com policies otimizadas.

ALTER TABLE sales DISABLE ROW LEVEL SECURITY;
ALTER TABLE service_times DISABLE ROW LEVEL SECURITY;
ALTER TABLE costs DISABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_deviations DISABLE ROW LEVEL SECURITY;
ALTER TABLE hr_metrics DISABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance DISABLE ROW LEVEL SECURITY;
ALTER TABLE performance_tracking DISABLE ROW LEVEL SECURITY;

-- User Profiles já foi corrigido, mas vamos garantir
-- ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY; 
-- (Melhor manter user_profiles seguro se possível, mas se der erro, descomente acima)

-- Verificar status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('sales', 'service_times', 'costs', 'inventory_deviations', 'hr_metrics', 'maintenance', 'performance_tracking');
