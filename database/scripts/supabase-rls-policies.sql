-- ============================================
-- RLS Policies - KPIS Application
-- ============================================
-- Execute no Supabase SQL Editor

-- ============================================
-- 1. LIMPAR POLÍTICAS ANTIGAS
-- ============================================

DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_select_own" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_own" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_insert_own" ON user_profiles;

DROP POLICY IF EXISTS "Users can view products from their store" ON products;
DROP POLICY IF EXISTS "Users can insert products to their store" ON products;
DROP POLICY IF EXISTS "Users can update products from their store" ON products;
DROP POLICY IF EXISTS "Users can delete products from their store" ON products;
DROP POLICY IF EXISTS "products_select_by_store_or_role" ON products;
DROP POLICY IF EXISTS "products_insert_manager_admin" ON products;
DROP POLICY IF EXISTS "products_update_manager_admin" ON products;
DROP POLICY IF EXISTS "products_delete_admin_only" ON products;

DROP POLICY IF EXISTS "Users can view their own store" ON stores;
DROP POLICY IF EXISTS "Admins can view all stores" ON stores;
DROP POLICY IF EXISTS "stores_select_own_or_admin" ON stores;
DROP POLICY IF EXISTS "stores_insert_admin_only" ON stores;
DROP POLICY IF EXISTS "stores_update_admin_only" ON stores;
DROP POLICY IF EXISTS "stores_delete_admin_only" ON stores;

-- ============================================
-- 2. HABILITAR RLS
-- ============================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. POLÍTICAS PARA user_profiles
-- ============================================

CREATE POLICY "user_profiles_select_own"
ON user_profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "user_profiles_update_own"
ON user_profiles
FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "user_profiles_insert_own"
ON user_profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- ============================================
-- 4. POLÍTICAS PARA products
-- ============================================

-- SELECT: Ver produtos da sua loja OU ser admin/consultor
CREATE POLICY "products_select_by_store_or_role"
ON products
FOR SELECT
USING (
  store_id IN (
    SELECT store_id FROM user_profiles WHERE id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'consultor')
  )
);

-- INSERT: Apenas gerentes e admins
CREATE POLICY "products_insert_manager_admin"
ON products
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'gerente')
    AND (
      store_id = products.store_id
      OR role = 'admin'
    )
  )
);

-- UPDATE: Gerentes e admins da mesma loja
CREATE POLICY "products_update_manager_admin"
ON products
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'gerente')
    AND (
      store_id = products.store_id
      OR role = 'admin'
    )
  )
);

-- DELETE: Apenas admins
CREATE POLICY "products_delete_admin_only"
ON products
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- ============================================
-- 5. POLÍTICAS PARA stores
-- ============================================

-- SELECT: Ver sua loja OU ser admin/consultor
CREATE POLICY "stores_select_own_or_admin"
ON stores
FOR SELECT
USING (
  id IN (
    SELECT store_id FROM user_profiles WHERE id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'consultor')
  )
);

-- INSERT: Apenas admins
CREATE POLICY "stores_insert_admin_only"
ON stores
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- UPDATE: Apenas admins
CREATE POLICY "stores_update_admin_only"
ON stores
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- DELETE: Apenas admins
CREATE POLICY "stores_delete_admin_only"
ON stores
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- ============================================
-- 6. VERIFICAÇÃO
-- ============================================

SELECT 
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
