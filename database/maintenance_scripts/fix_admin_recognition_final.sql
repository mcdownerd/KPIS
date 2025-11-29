-- Solução definitiva para o problema de reconhecimento de admin
-- Este script corrige a recursão infinita nas políticas RLS

-- 1. Criar uma função auxiliar que verifica se o usuário é admin
-- Esta função usa SECURITY DEFINER para evitar recursão
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Remover todas as políticas existentes da tabela user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for authentication" ON user_profiles;
DROP POLICY IF EXISTS "Users can view profiles from their store" ON user_profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON user_profiles;

-- 3. Criar novas políticas otimizadas SEM recursão

-- SELECT: Usuários podem ver seu próprio perfil OU admins podem ver todos
CREATE POLICY "user_profiles_select_policy" ON user_profiles
  FOR SELECT 
  USING (
    auth.uid() = id OR public.is_admin()
  );

-- INSERT: Permitir inserção durante registro (sem autenticação) OU por admins
CREATE POLICY "user_profiles_insert_policy" ON user_profiles
  FOR INSERT 
  WITH CHECK (
    auth.uid() = id OR public.is_admin()
  );

-- UPDATE: Usuários podem atualizar seu próprio perfil OU admins podem atualizar qualquer perfil
CREATE POLICY "user_profiles_update_policy" ON user_profiles
  FOR UPDATE 
  USING (
    auth.uid() = id OR public.is_admin()
  );

-- DELETE: Apenas admins podem deletar perfis
CREATE POLICY "user_profiles_delete_policy" ON user_profiles
  FOR DELETE 
  USING (
    public.is_admin()
  );

-- 4. Garantir que RLS está habilitado
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 5. Verificar as políticas criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'user_profiles'
ORDER BY policyname;

-- 6. Testar a função is_admin (descomente para testar)
-- SELECT public.is_admin();
