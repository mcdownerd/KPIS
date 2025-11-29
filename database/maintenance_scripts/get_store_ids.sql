-- Script para descobrir os IDs das lojas cadastradas
-- Execute este script no Supabase SQL Editor

SELECT 
    id as store_id,
    name as store_name,
    location,
    created_at
FROM stores
ORDER BY created_at DESC;

-- Copie o 'store_id' da loja que você quer usar
-- e substitua no seu CSV antes de importar
