-- Make products shared across all stores
-- Users can view all products, but can only modify products from their store

-- 1. Drop existing product policies
DO $$ 
DECLARE 
    r RECORD;
BEGIN 
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'products') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON products';
    END LOOP;
END $$;

-- 2. Create new policies for shared products

-- Everyone can view ALL products (shared across stores)
CREATE POLICY "Users can view all products" ON products
  FOR SELECT USING (true);

-- Users can insert products to their own store
CREATE POLICY "Users can insert products to their store" ON products
  FOR INSERT WITH CHECK (
    store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid())
  );

-- Users can update products from their own store
CREATE POLICY "Users can update products from their store" ON products
  FOR UPDATE USING (
    store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid())
  );

-- Users can delete products from their own store
CREATE POLICY "Users can delete products from their store" ON products
  FOR DELETE USING (
    store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid())
  );
