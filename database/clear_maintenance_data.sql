-- SCRIPT PARA LIMPAR DADOS DA LOJA QUELUZ
-- ID da Loja Queluz: fcf80b5a-b658-48f3-871c-ac62120c5a78

BEGIN;

-- 1. Limpar Manutenção (Queluz)
DELETE FROM maintenance 
WHERE store_id = 'fcf80b5a-b658-48f3-871c-ac62120c5a78';

-- 2. Limpar Gastos Gerais (Queluz)
DELETE FROM utilities 
WHERE store_id = 'fcf80b5a-b658-48f3-871c-ac62120c5a78';

-- 3. Limpar Desempenho (Queluz)
DELETE FROM performance_tracking 
WHERE store_id = 'fcf80b5a-b658-48f3-871c-ac62120c5a78';

COMMIT;

-- Confirmação (opcional, para ver se limpou)
-- SELECT count(*) FROM maintenance WHERE store_id = 'fcf80b5a-b658-48f3-871c-ac62120c5a78';
