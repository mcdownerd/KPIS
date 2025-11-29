-- Script DEFINITIVO para corrigir recursão infinita nas políticas RLS

-- 1. Remover TODAS as políticas existentes
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for authentication" ON user_profiles;

-- 2. Criar função auxiliar que NÃO sofre de RLS (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM user_profiles 
    WHERE id = user_id AND role = 'admin'
  );
$$;

-- 3. Criar políticas usando a função auxiliar (SEM recursão)

-- Usuários podem ver seu próprio perfil
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT 
  USING (auth.uid() = id);

-- Usuários podem atualizar seu próprio perfil
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE 
  USING (auth.uid() = id);

-- Admins podem ver TODOS os perfis (usando função sem recursão)
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

-- Admins podem atualizar TODOS os perfis
CREATE POLICY "Admins can update all profiles" ON user_profiles
  FOR UPDATE 
  USING (public.is_admin(auth.uid()));

-- Permitir inserção de novos perfis
CREATE POLICY "Enable insert for authentication" ON user_profiles
  FOR INSERT 
  WITH CHECK (true);

-- 4. Verificar políticas criadas
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE tablename = 'user_profiles'
ORDER BY policyname;

-- 5. Verificar se a função foi criada
SELECT proname, prosecdef 
FROM pg_proc 
WHERE proname = 'is_admin';
