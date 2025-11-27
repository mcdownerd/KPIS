-- ============================================
-- LIMPAR TODOS OS DADOS DE DESVIOS DE INVENTÁRIO
-- ============================================

-- Este script remove TODOS os registros da tabela inventory_deviations
-- Execute isso no Supabase SQL Editor para começar do zero

DELETE FROM inventory_deviations;

-- Verificar se a tabela está vazia
SELECT COUNT(*) as total_registros FROM inventory_deviations;

-- Deve retornar: total_registros = 0
