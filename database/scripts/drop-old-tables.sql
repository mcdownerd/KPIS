-- ============================================
-- DROPAR TABELAS ANTIGAS E RECRIAR
-- ============================================

-- Dropar tabelas antigas (se existirem)
DROP TABLE IF EXISTS service_times CASCADE;
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS costs CASCADE;
DROP TABLE IF EXISTS inventory_deviations CASCADE;
DROP TABLE IF EXISTS hr_metrics CASCADE;
DROP TABLE IF EXISTS maintenance CASCADE;
DROP TABLE IF EXISTS performance_tracking CASCADE;

-- Agora execute novamente o script: step1-create-tables.sql
-- Depois execute: step2-add-rls.sql
-- E por fim: insert-test-data-simple.sql
