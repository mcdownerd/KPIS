-- Script para Sincronizar Usuários e Criar Trigger Automático

-- 1. Sincronizar usuários existentes de auth.users para public.user_profiles
INSERT INTO public.user_profiles (id, email, role, full_name, created_at)
SELECT 
    id, 
    email, 
    'user' as role, 
    COALESCE(raw_user_meta_data->>'full_name', 'Usuário sem nome') as full_name,
    created_at
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.user_profiles);

-- 2. Criar função para lidar com novos usuários
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, role, full_name, created_at)
  VALUES (
    new.id, 
    new.email, 
    'user', 
    COALESCE(new.raw_user_meta_data->>'full_name', 'Novo Usuário'),
    new.created_at
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Criar trigger para executar a função sempre que um usuário for criado
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Verificação final
SELECT count(*) as total_auth_users FROM auth.users;
SELECT count(*) as total_profiles FROM public.user_profiles;
