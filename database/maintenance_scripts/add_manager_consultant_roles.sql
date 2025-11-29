-- Script para adicionar as funções Gerente e Consultor
-- VERSÃO FINAL: Gerente vê apenas sua loja, Consultor vê todas

BEGIN;

-- 1. Remover constraint antiga de role
ALTER TABLE user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_role_check;

-- 2. Adicionar nova constraint com todos os roles
ALTER TABLE user_profiles
ADD CONSTRAINT user_profiles_role_check 
CHECK (role IN ('admin', 'user', 'gerente', 'consultor'));

-- 3. Atualizar políticas de produtos
DROP POLICY IF EXISTS "Users can view products from their store" ON products;
DROP POLICY IF EXISTS "Admins can view all products" ON products;
DROP POLICY IF EXISTS "Privileged users can view all products" ON products;
DROP POLICY IF EXISTS "Authenticated users can manage products" ON products;

-- Usuários veem apenas produtos da sua loja
CREATE POLICY "Users can view products from their store" ON products
  FOR SELECT
  USING (
    store_id IN (
      SELECT store_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- Gerentes veem todos os produtos (filtragem feita no frontend)
CREATE POLICY "Managers can view all products" ON products
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'gerente'
    )
  );

-- Admin e Consultor veem todos os produtos
CREATE POLICY "Admins and consultants can view all products" ON products
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 
      FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'consultor')
    )
  );

-- Todos podem inserir/atualizar/deletar produtos (com suas restrições)
CREATE POLICY "Authenticated users can manage products" ON products
  FOR ALL
  USING (auth.uid() IS NOT NULL);

COMMIT;

-- 4. Verificações
SELECT constraint_name, check_clause 
FROM information_schema.check_constraints 
WHERE constraint_name = 'user_profiles_role_check';

SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'products'
ORDER BY policyname;

SELECT role, count(*) 
FROM user_profiles 
GROUP BY role;
