-- 1. Garantir que as colunas existem
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS full_name TEXT;

-- 2. Sincronizar dados da tabela de autenticação (auth.users) para a tabela de perfis (user_profiles)
UPDATE user_profiles
SET 
  email = au.email,
  full_name = COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', 'Usuário')
FROM auth.users au
WHERE user_profiles.id::text = au.id::text;

-- 3. Verificar se funcionou
SELECT id, email, full_name FROM user_profiles;
