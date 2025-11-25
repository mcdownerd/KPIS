-- Mover produtos de DLC NEGATIVA PROTEÍNAS para DLC NEGATIVA PÃES
-- Script de manutenção para reorganização de categorias

BEGIN;

-- Atualizar todos os produtos da categoria PROTEÍNAS para PÃES
UPDATE products
SET category = 'PÃES'
WHERE category ILIKE 'PROTEÍNAS' OR category ILIKE 'PROTEINAS';

-- Verificar quantos produtos foram atualizados
-- (Esta query é apenas informativa, execute separadamente se quiser ver o resultado)
-- SELECT COUNT(*) as produtos_movidos FROM products WHERE category = 'PÃES';

COMMIT;
