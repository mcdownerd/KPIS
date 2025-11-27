-- Verificar o tipo de store_id no seu perfil
SELECT 
    store_id,
    pg_typeof(store_id) as tipo_store_id,
    store_id::text as store_id_text
FROM user_profiles 
WHERE id = auth.uid();

-- Testar se a comparação funciona
SELECT COUNT(*) as teste_com_cast
FROM sales
WHERE store_id::text = (
    SELECT store_id FROM user_profiles WHERE id = auth.uid()
);

-- Ver os dados sem RLS
ALTER TABLE sales DISABLE ROW LEVEL SECURITY;
SELECT COUNT(*) FROM sales;
SELECT store_id, pg_typeof(store_id) FROM sales LIMIT 1;
