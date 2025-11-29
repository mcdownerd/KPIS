-- Verificar produtos de pães na loja de Queluz

-- Primeiro, encontrar o ID da loja de Queluz
SELECT id, name FROM stores WHERE name ILIKE '%queluz%';

-- Depois, buscar todos os produtos de pães dessa loja
-- (substitua 'STORE_ID_AQUI' pelo ID encontrado acima)
SELECT 
  p.id,
  p.name,
  p.category,
  p.sub_category,
  p.dlc_type,
  p.expiry_date,
  p.created_at,
  s.name as loja
FROM products p
LEFT JOIN stores s ON p.store_id = s.id
WHERE s.name ILIKE '%queluz%'
  AND (
    p.category ILIKE '%pães%' 
    OR p.category ILIKE '%paes%'
    OR p.sub_category ILIKE '%pães%'
    OR p.sub_category ILIKE '%paes%'
    OR p.name ILIKE '%pão%'
    OR p.name ILIKE '%pao%'
  )
ORDER BY p.category, p.sub_category, p.name;

-- Ver todas as categorias de produtos em Queluz
SELECT 
  p.category,
  p.sub_category,
  COUNT(*) as total,
  s.name as loja
FROM products p
LEFT JOIN stores s ON p.store_id = s.id
WHERE s.name ILIKE '%queluz%'
GROUP BY p.category, p.sub_category, s.name
ORDER BY p.category, p.sub_category;
