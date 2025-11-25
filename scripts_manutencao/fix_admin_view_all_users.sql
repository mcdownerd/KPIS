-- Script para permitir que admins vejam TODOS os usuários no Painel Administrativo

-- 1. Remover todas as políticas existentes de user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for authentication" ON user_profiles;

-- 2. Criar políticas mais simples e diretas

-- Permitir que qualquer usuário autenticado veja seu próprio perfil
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT 
  USING (auth.uid() = id);

-- Permitir que usuários atualizem seu próprio perfil
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE 
  USING (auth.uid() = id);

-- CRÍTICO: Permitir que admins vejam TODOS os perfis (sem subquery recursiva)
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT 
  USING (
    (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
  );

-- Permitir que admins atualizem TODOS os perfis
CREATE POLICY "Admins can update all profiles" ON user_profiles
  FOR UPDATE 
  USING (
    (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
  );

-- Permitir inserção de novos perfis (para registro)
CREATE POLICY "Enable insert for authentication" ON user_profiles
  FOR INSERT 
  WITH CHECK (true);

-- 3. Verificar políticas criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'user_profiles'
ORDER BY policyname;

-- 4. Testar se admin consegue ver todos os usuários
SELECT id, email, role, full_name, store_id 
FROM user_profiles 
ORDER BY created_at DESC;
