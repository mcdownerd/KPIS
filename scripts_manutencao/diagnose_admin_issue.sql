-- Script de diagnóstico para verificar o problema de reconhecimento de admin

-- 1. Verificar se a tabela user_profiles existe e tem dados
SELECT 
    'user_profiles table check' as test,
    COUNT(*) as total_users,
    COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_count,
    COUNT(CASE WHEN role = 'user' THEN 1 END) as user_count
FROM user_profiles;

-- 2. Listar todos os usuários e seus roles
SELECT 
    id,
    email,
    full_name,
    role,
    store_id,
    created_at
FROM user_profiles
ORDER BY created_at DESC;

-- 3. Verificar políticas RLS ativas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'user_profiles'
ORDER BY policyname;

-- 4. Verificar se RLS está habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename = 'user_profiles';

-- 5. Verificar o usuário atual (execute quando logado)
-- SELECT auth.uid() as current_user_id;

-- 6. Verificar o perfil do usuário atual (execute quando logado)
-- SELECT * FROM user_profiles WHERE id = auth.uid();

-- 7. Testar se a função is_admin existe
SELECT 
    routine_name,
    routine_type,
    security_type
FROM information_schema.routines
WHERE routine_name = 'is_admin'
AND routine_schema = 'public';
