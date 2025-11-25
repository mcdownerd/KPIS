-- Verificar status de admin do usuário atual

-- 1. Ver todos os usuários e suas roles
SELECT id, email, full_name, role, store_id 
FROM user_profiles
ORDER BY created_at DESC;

-- 2. Verificar especificamente o usuário admin@app.com
SELECT id, email, full_name, role, store_id 
FROM user_profiles
WHERE email = 'admin@app.com';

-- 3. Se necessário, garantir que o usuário seja admin
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'admin@app.com';
