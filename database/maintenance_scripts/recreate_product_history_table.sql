-- Recriar Tabela de Histórico de Produtos (Corrigindo Schema)
BEGIN;

-- 1. Dropar a tabela antiga se existir (para garantir que o schema novo seja aplicado)
DROP TABLE IF EXISTS product_history CASCADE;

-- 2. Criar a tabela com o schema correto
CREATE TABLE product_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id),
  action TEXT NOT NULL CHECK (action IN ('CRIACAO', 'EDICAO', 'EXCLUSAO')),
  changes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Habilitar RLS
ALTER TABLE product_history ENABLE ROW LEVEL SECURITY;

-- 4. Recriar Políticas de Acesso

-- Visualização: Usuários e Gerentes veem histórico de produtos da sua loja
CREATE POLICY "Users and Managers can view history of their store" ON product_history
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_history.product_id
      AND products.store_id IN (
        SELECT store_id FROM user_profiles WHERE id = auth.uid()
      )
    )
  );

-- Visualização: Admins e Consultores veem todo o histórico
CREATE POLICY "Admins and Consultants can view all history" ON product_history
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'consultor')
    )
  );

-- Inserção: Qualquer usuário autenticado pode registrar histórico
CREATE POLICY "Authenticated users can insert history" ON product_history
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- 5. Forçar recarregamento do cache
NOTIFY pgrst, 'reload config';

COMMIT;
