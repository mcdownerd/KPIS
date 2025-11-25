-- Verificação completa do status de admin

-- 1. Ver TODOS os usuários e suas roles
SELECT 
    up.id,
    up.email,
    up.full_name,
    up.role,
    up.store_id,
    up.created_at,
    au.email as auth_email
FROM user_profiles up
LEFT JOIN auth.users au ON up.id = au.id
ORDER BY up.created_at DESC;

-- 2. Forçar atualização para admin (substitua pelo seu email se for diferente)
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'admin@app.com'
RETURNING id, email, role;

-- 3. Se o email estiver diferente, tente por ID do auth.users
UPDATE user_profiles 
SET role = 'admin' 
WHERE id IN (SELECT id FROM auth.users WHERE email = 'admin@app.com')
RETURNING id, email, role;
