-- Teste direto da query que o app está fazendo
-- Execute este script ENQUANTO ESTIVER LOGADO na aplicação

-- 1. Verificar auth.uid() atual
SELECT 
    'Meu user ID:' as info,
    auth.uid() as user_id;

-- 2. Tentar ler o perfil (exatamente como o app faz)
SELECT * 
FROM user_profiles 
WHERE id = auth.uid();

-- 3. Tentar com join de stores (exatamente como o app faz)
SELECT 
    user_profiles.*,
    stores.*
FROM user_profiles
LEFT JOIN stores ON user_profiles.store_id = stores.id
WHERE user_profiles.id = auth.uid();

-- 4. Verificar se há algum problema com a tabela stores
SELECT 
    'Tabela stores existe?' as teste,
    EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'stores'
    ) as resultado;

-- 5. Se stores não existir, o problema é o JOIN
-- Teste sem o join:
SELECT 
    id,
    email,
    full_name,
    role,
    store_id
FROM user_profiles 
WHERE id = auth.uid();
