-- Padronizar estrutura de categorias
-- Mover produtos de categoria "Pães" para "DLC NEGATIVA" com subcategoria "PÃES"

BEGIN;

-- Produtos que estão em categoria "Pães" devem ir para "DLC NEGATIVA - PÃES"
UPDATE products
SET 
  category = 'DLC NEGATIVA',
  sub_category = 'PÃES'
WHERE category ILIKE 'pães' OR category ILIKE 'paes';

-- Padronizar subcategorias para maiúsculo
UPDATE products
SET sub_category = UPPER(sub_category)
WHERE sub_category IS NOT NULL;

-- Padronizar categorias principais
UPDATE products
SET category = UPPER(TRIM(category));

COMMIT;

-- Verificar resultado
SELECT 
  category, 
  sub_category, 
  COUNT(*) as total,
  STRING_AGG(DISTINCT name, ', ') as produtos
FROM products
GROUP BY category, sub_category
ORDER BY category, sub_category;
