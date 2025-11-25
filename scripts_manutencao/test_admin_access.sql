-- Script de teste para verificar acesso do admin
-- Execute este script ENQUANTO ESTIVER LOGADO na aplicação

-- 1. Verificar se a função is_admin existe e funciona
SELECT 
    'Função is_admin existe?' as teste,
    EXISTS (
        SELECT 1 FROM pg_proc 
        WHERE proname = 'is_admin' 
        AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    ) as resultado;

-- 2. Testar a função is_admin (execute quando logado)
-- Descomente a linha abaixo e execute quando estiver logado
-- SELECT public.is_admin() as sou_admin;

-- 3. Verificar políticas ativas
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'user_profiles'
ORDER BY policyname;

-- 4. Verificar se RLS está habilitado
SELECT 
    tablename,
    rowsecurity as rls_habilitado
FROM pg_tables
WHERE tablename = 'user_profiles';

-- 5. Tentar ler o perfil diretamente (simula o que o app faz)
-- Descomente e execute quando logado
-- SELECT * FROM user_profiles WHERE id = auth.uid();

-- 6. Verificar se o usuário admin existe
SELECT 
    id,
    email,
    full_name,
    role,
    store_id
FROM user_profiles
WHERE email = 'admin@app.com';

-- 7. SOLUÇÃO TEMPORÁRIA: Desabilitar RLS temporariamente para testar
-- ATENÇÃO: Isso é apenas para diagnóstico! Não deixe assim em produção!
-- Descomente para testar:
-- ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
-- Depois de testar, reabilite:
-- ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
