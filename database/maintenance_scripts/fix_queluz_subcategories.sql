-- Verificar produtos da loja de Queluz que não têm subcategoria
SELECT 
  p.id,
  p.name,
  p.category,
  p.sub_category,
  s.name as loja
FROM products p
LEFT JOIN stores s ON p.store_id = s.id
WHERE s.name ILIKE '%queluz%'
  AND p.category = 'DLC NEGATIVA'
ORDER BY p.sub_category NULLS FIRST, p.name;

-- Se você quiser adicionar subcategoria "PÃES" aos produtos que não têm subcategoria
-- e que são pães (baseado no nome), execute:
/*
UPDATE products p
SET sub_category = 'PÃES'
FROM stores s
WHERE p.store_id = s.id
  AND s.name ILIKE '%queluz%'
  AND p.category = 'DLC NEGATIVA'
  AND (p.sub_category IS NULL OR p.sub_category = '')
  AND (p.name ILIKE '%pão%' OR p.name ILIKE '%pao%');
*/
