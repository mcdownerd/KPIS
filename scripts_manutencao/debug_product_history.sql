-- Forçar recarregamento do cache do schema do Supabase (PostgREST)
NOTIFY pgrst, 'reload config';

-- Verificar se as colunas foram criadas corretamente
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'product_history'
ORDER BY ordinal_position;
