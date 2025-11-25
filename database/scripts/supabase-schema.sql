-- ============================================
-- PLANILHA APP MAKER - SUPABASE DATABASE SCHEMA
-- ============================================
-- Este arquivo contém todas as tabelas necessárias para o aplicativo
-- Execute este SQL no Supabase SQL Editor

-- ============================================
-- 1. TABELA DE PERFIS (USUÁRIOS)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'user', -- 'admin' ou 'user'
  store_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- 2. TABELA DE LOJAS
-- ============================================
CREATE TABLE IF NOT EXISTS stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view stores
CREATE POLICY "Anyone can view stores" ON stores
  FOR SELECT USING (true);

-- ============================================
-- 3. TABELA DE PRODUTOS
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id),
  category TEXT NOT NULL,
  sub_category TEXT,
  name TEXT NOT NULL,
  expiry_date DATE NOT NULL,
  expiry_dates TEXT[], -- Array de datas para produtos com múltiplas validades
  dlc_type TEXT CHECK (dlc_type IN ('Primária', 'Secundária')),
  observation TEXT,
  status TEXT CHECK (status IN ('OK', 'WARNING', 'EXPIRED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view products from their store
CREATE POLICY "Users can view products from their store" ON products
  FOR SELECT USING (
    store_id IN (
      SELECT store_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Policy: Users can insert products to their store
CREATE POLICY "Users can insert products to their store" ON products
  FOR INSERT WITH CHECK (
    store_id IN (
      SELECT store_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Policy: Users can update products from their store
CREATE POLICY "Users can update products from their store" ON products
  FOR UPDATE USING (
    store_id IN (
      SELECT store_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Policy: Users can delete products from their store
CREATE POLICY "Users can delete products from their store" ON products
  FOR DELETE USING (
    store_id IN (
      SELECT store_id FROM profiles WHERE id = auth.uid()
    )
  );

-- ============================================
-- 4. TABELA DE HISTÓRICO DE PRODUTOS
-- ============================================
CREATE TABLE IF NOT EXISTS product_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  old_expiry_date DATE,
  new_expiry_date DATE,
  old_expiry_dates_array TEXT[],
  new_expiry_dates_array TEXT[],
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES profiles(id)
);

-- Enable RLS
ALTER TABLE product_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view history of products from their store
CREATE POLICY "Users can view product history from their store" ON product_history
  FOR SELECT USING (
    product_id IN (
      SELECT id FROM products WHERE store_id IN (
        SELECT store_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

-- ============================================
-- 5. TABELA DE CONSUMOS (UTILITIES)
-- ============================================
CREATE TABLE IF NOT EXISTS utilities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id),
  utility_type TEXT NOT NULL, -- 'water', 'electricity', 'gas', etc.
  reading_date DATE NOT NULL,
  reading_value DECIMAL(10, 2) NOT NULL,
  cost DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- Enable RLS
ALTER TABLE utilities ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view utilities from their store
CREATE POLICY "Users can view utilities from their store" ON utilities
  FOR SELECT USING (
    store_id IN (
      SELECT store_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Policy: Users can insert utilities to their store
CREATE POLICY "Users can insert utilities to their store" ON utilities
  FOR INSERT WITH CHECK (
    store_id IN (
      SELECT store_id FROM profiles WHERE id = auth.uid()
    )
  );

-- ============================================
-- 6. TABELA DE ENTREGAS (DELIVERY)
-- ============================================
CREATE TABLE IF NOT EXISTS deliveries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id),
  delivery_date DATE NOT NULL,
  platform TEXT, -- 'Uber Eats', 'Glovo', etc.
  order_count INTEGER,
  total_value DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- Enable RLS
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view deliveries from their store
CREATE POLICY "Users can view deliveries from their store" ON deliveries
  FOR SELECT USING (
    store_id IN (
      SELECT store_id FROM profiles WHERE id = auth.uid()
    )
  );

-- ============================================
-- 7. ÍNDICES PARA MELHOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_expiry_date ON products(expiry_date);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_product_history_product_id ON product_history(product_id);
CREATE INDEX IF NOT EXISTS idx_utilities_store_id ON utilities(store_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_store_id ON deliveries(store_id);

-- ============================================
-- 8. FUNÇÕES E TRIGGERS
-- ============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_utilities_updated_at BEFORE UPDATE ON utilities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deliveries_updated_at BEFORE UPDATE ON deliveries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 9. DADOS INICIAIS (OPCIONAL)
-- ============================================

-- Inserir uma loja de exemplo
INSERT INTO stores (name, location) 
VALUES ('P.Borges - Loja Principal', 'Lisboa')
ON CONFLICT DO NOTHING;

-- ============================================
-- FIM DO SCHEMA
-- ============================================
