-- Allow admins to access all data without needing a store_id

-- 1. Fix products table policies
DO $$ 
DECLARE 
    r RECORD;
BEGIN 
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'products') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON products';
    END LOOP;
END $$;

-- Admins can view all products
CREATE POLICY "Admins can view all products" ON products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can view products from their store
CREATE POLICY "Users can view own store products" ON products
  FOR SELECT USING (
    store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid())
  );

-- Admins can insert any product
CREATE POLICY "Admins can insert products" ON products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can insert products to their store
CREATE POLICY "Users can insert to own store" ON products
  FOR INSERT WITH CHECK (
    store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid())
  );

-- Admins can update any product
CREATE POLICY "Admins can update all products" ON products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can update products from their store
CREATE POLICY "Users can update own store products" ON products
  FOR UPDATE USING (
    store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid())
  );

-- Admins can delete any product
CREATE POLICY "Admins can delete all products" ON products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can delete products from their store
CREATE POLICY "Users can delete own store products" ON products
  FOR DELETE USING (
    store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid())
  );
