-- SOLUÇÃO DEFINITIVA: Permitir que usuários leiam seus próprios perfis
-- Este script garante que qualquer usuário autenticado possa ler seu próprio perfil

-- 1. Remover TODAS as políticas existentes
DROP POLICY IF EXISTS "user_profiles_select_policy" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_insert_policy" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_policy" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_delete_policy" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for authentication" ON user_profiles;

-- 2. Criar política SIMPLES que SEMPRE funciona para o próprio usuário
CREATE POLICY "allow_own_profile_select" ON user_profiles
  FOR SELECT 
  USING (auth.uid() = id);

-- 3. Criar política para admins verem todos os perfis
-- Usando uma subquery simples sem função
CREATE POLICY "allow_admin_select_all" ON user_profiles
  FOR SELECT 
  USING (
    role = 'admin' AND auth.uid() = id
    OR
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() 
      AND up.role = 'admin'
    )
  );

-- 4. Permitir INSERT durante registro
CREATE POLICY "allow_insert_own_profile" ON user_profiles
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- 5. Permitir UPDATE do próprio perfil
CREATE POLICY "allow_update_own_profile" ON user_profiles
  FOR UPDATE 
  USING (auth.uid() = id);

-- 6. Permitir que admins atualizem qualquer perfil
CREATE POLICY "allow_admin_update_all" ON user_profiles
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() 
      AND up.role = 'admin'
    )
  );

-- 7. Garantir que RLS está habilitado
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 8. Verificar políticas criadas
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'user_profiles' ORDER BY policyname;
