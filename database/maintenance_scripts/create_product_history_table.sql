-- Tabela de Histórico de Produtos
BEGIN;

CREATE TABLE IF NOT EXISTS product_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id),
  action TEXT NOT NULL CHECK (action IN ('CRIACAO', 'EDICAO', 'EXCLUSAO')),
  changes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE product_history ENABLE ROW LEVEL SECURITY;

-- Políticas de Acesso

-- 1. Visualização:
-- Usuários e Gerentes veem histórico de produtos da sua loja
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

-- Admins e Consultores veem todo o histórico
CREATE POLICY "Admins and Consultants can view all history" ON product_history
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'consultor')
    )
  );

-- 2. Inserção:
-- Qualquer usuário autenticado pode registrar histórico (ao editar/criar)
CREATE POLICY "Authenticated users can insert history" ON product_history
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

COMMIT;
