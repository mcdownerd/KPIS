-- 1. Adicionar a coluna 'role' se ela não existir
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- 2. Adicionar a coluna 'store_id' se ela não existir (necessária para o admin dashboard)
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS store_id UUID;

-- 3. Atualizar o usuário para admin
UPDATE user_profiles
SET role = 'admin'
WHERE id::text = (
    SELECT id::text FROM auth.users WHERE email = 'admin@app.com'
);
