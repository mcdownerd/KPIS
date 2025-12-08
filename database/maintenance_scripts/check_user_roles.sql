-- Script para verificar o role do usuário atual
-- Execute este script no Supabase SQL Editor para verificar seu perfil

-- Ver todos os perfis de usuário e seus roles
SELECT 
    id,
    full_name,
    email,
    role,
    store_id,
    is_admin,
    created_at
FROM user_profiles
ORDER BY created_at DESC;

-- Se você souber seu email, pode filtrar assim:
-- SELECT * FROM user_profiles WHERE email = 'seu-email@exemplo.com';

-- Ver quais roles existem no sistema
SELECT DISTINCT role, COUNT(*) as quantidade
FROM user_profiles
GROUP BY role
ORDER BY role;
