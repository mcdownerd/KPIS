-- ============================================
-- LIMPAR DADOS ANTIGOS DE DESVIOS DE INVENTÁRIO
-- ============================================

-- Remover todos os registros da tabela inventory_deviations
-- Isso permitirá inserir novos dados com os nomes de produtos corretos (PÃO REG, CARNE REG, etc.)
DELETE FROM inventory_deviations;

-- Verificar se a tabela está vazia
SELECT * FROM inventory_deviations;
