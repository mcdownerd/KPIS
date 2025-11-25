-- Verificar se o produto "Pão sem glúten" existe no banco de dados
SELECT 
  id,
  name,
  category,
  sub_category,
  store_id,
  dlc_type,
  expiry_date,
  created_at
FROM products
WHERE name ILIKE '%pão sem glúten%' OR name ILIKE '%pao sem gluten%';

-- Se não encontrar, verificar produtos recentemente deletados ou modificados
-- (caso tenha histórico)
SELECT 
  id,
  name,
  category,
  store_id,
  dlc_type
FROM products
ORDER BY updated_at DESC
LIMIT 20;
