-- ============================================
-- VERIFICAR ESTRUTURA DAS TABELAS
-- ============================================

-- Ver colunas da tabela service_times
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'service_times'
ORDER BY ordinal_position;

-- Ver colunas da tabela sales
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'sales'
ORDER BY ordinal_position;

-- Ver colunas da tabela costs
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'costs'
ORDER BY ordinal_position;

-- Ver colunas da tabela inventory_deviations
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'inventory_deviations'
ORDER BY ordinal_position;
