-- Script para remover produtos duplicados
-- Mantém apenas o registro mais recente de cada produto idêntico na mesma loja

BEGIN;

WITH duplicates AS (
    SELECT id,
           ROW_NUMBER() OVER (
               PARTITION BY 
                   store_id, 
                   name, 
                   category, 
                   sub_category, 
                   expiry_date, 
                   dlc_type, 
                   observation
               ORDER BY created_at DESC
           ) as row_num
    FROM products
)
DELETE FROM products
WHERE id IN (
    SELECT id FROM duplicates WHERE row_num > 1
);

COMMIT;

-- Verificação pós-limpeza
SELECT count(*) as total_produtos_restantes FROM products;
