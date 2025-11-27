-- ============================================
-- ATUALIZAR NOMES DE PRODUTOS NA TABELA INVENTORY_DEVIATIONS
-- ============================================

-- Atualizar os nomes dos produtos para os nomes corretos do Burger King
UPDATE inventory_deviations 
SET item_name = 'PÃO REG'
WHERE item_name = 'Hamburgueres' OR item_name LIKE '%Hamburguer%';

UPDATE inventory_deviations 
SET item_name = 'CARNE REG'
WHERE item_name LIKE '%Batata%Frita%';

UPDATE inventory_deviations 
SET item_name = 'CARNE ROYAL'
WHERE item_name LIKE '%Refrigerante%';

UPDATE inventory_deviations 
SET item_name = 'CHK OPT'
WHERE item_name LIKE '%Papel%Toalha%';

-- Se houver mais produtos, adicione aqui
-- Exemplo:
-- UPDATE inventory_deviations 
-- SET item_name = 'CHK NUGGETS'
-- WHERE item_name = 'Produto Antigo';

-- Verificar os dados atualizados
SELECT DISTINCT item_name, store_id, record_date, deviation_value, status
FROM inventory_deviations
ORDER BY record_date DESC, item_name;
