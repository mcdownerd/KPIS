-- ============================================
-- CORRIGIR RLS DE USER_PROFILES (TIMEOUT FIX)
-- ============================================

-- 1. Desabilitar RLS temporariamente para garantir acesso
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- 2. Remover policies antigas que podem estar causando recursão
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for own profile" ON user_profiles;

-- 3. Criar policy SIMPLES e DIRETA sem joins ou subqueries complexas
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- 4. Reabilitar RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 5. Verificar se funciona (simulação)
-- Isso deve ser rápido e retornar 1 linha para o usuário atual
-- SELECT * FROM user_profiles WHERE id = auth.uid();
