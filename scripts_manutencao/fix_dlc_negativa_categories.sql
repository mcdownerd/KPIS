-- Corrigir produtos com categoria "DLC NEGATIVA" para usar a subcategoria como categoria principal
-- Isso vai mover produtos de "DLC NEGATIVA - PÃES" para apenas "PÃES"

BEGIN;

-- Atualizar produtos onde a categoria é "DLC NEGATIVA" e a subcategoria é "PÃES"
UPDATE products
SET 
  category = sub_category,
  sub_category = NULL
WHERE category ILIKE 'DLC NEGATIVA' 
  AND sub_category ILIKE 'PÃES';

-- Atualizar produtos onde a categoria é "DLC NEGATIVA" mas não tem subcategoria
-- Esses precisam ser categorizados manualmente ou usar uma categoria padrão
UPDATE products
SET category = 'OUTRAS'
WHERE category ILIKE 'DLC NEGATIVA' 
  AND (sub_category IS NULL OR sub_category = '');

-- Padronizar todas as variações de "Pães" para "PÃES" (maiúsculo)
UPDATE products
SET category = 'PÃES'
WHERE category ILIKE 'pães' OR category ILIKE 'paes';

COMMIT;

-- Verificar resultado
SELECT category, sub_category, COUNT(*) as total
FROM products
GROUP BY category, sub_category
ORDER BY category, sub_category;
