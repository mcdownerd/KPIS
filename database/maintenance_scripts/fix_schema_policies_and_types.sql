-- Fix Schema: Drop Policies, Fix Types, Restore Policies

-- 1. Drop Policies on tables where we are changing column types
DROP POLICY IF EXISTS "Users can view cash shifts from their store" ON cash_register_shifts;
DROP POLICY IF EXISTS "Users can insert cash shifts to their store" ON cash_register_shifts;
DROP POLICY IF EXISTS "Users can update cash shifts from their store" ON cash_register_shifts;
DROP POLICY IF EXISTS "Users can delete cash shifts from their store" ON cash_register_shifts;

DROP POLICY IF EXISTS "Users can view products from their store" ON products;
DROP POLICY IF EXISTS "Users can insert products to their store" ON products;
DROP POLICY IF EXISTS "Users can update products from their store" ON products;
DROP POLICY IF EXISTS "Users can delete products from their store" ON products;

-- 2. Drop conflicting Foreign Keys
ALTER TABLE cash_register_shifts DROP CONSTRAINT IF EXISTS cash_register_shifts_store_id_fkey;
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_store_id_fkey;
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_store_id_fkey;

-- 3. Clean up any non-UUID data
DELETE FROM cash_register_shifts WHERE store_id::text !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';
DELETE FROM products WHERE store_id::text !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';
UPDATE user_profiles SET store_id = NULL WHERE store_id::text !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';

-- 4. Convert columns to UUID
ALTER TABLE cash_register_shifts ALTER COLUMN store_id TYPE UUID USING store_id::uuid;
ALTER TABLE products ALTER COLUMN store_id TYPE UUID USING store_id::uuid;
ALTER TABLE user_profiles ALTER COLUMN store_id TYPE UUID USING store_id::uuid;

-- 5. Convert stores.id to UUID and set default
ALTER TABLE stores ALTER COLUMN id TYPE UUID USING id::uuid;
ALTER TABLE stores ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 6. Re-add Foreign Keys
ALTER TABLE cash_register_shifts ADD CONSTRAINT cash_register_shifts_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores(id);
ALTER TABLE products ADD CONSTRAINT products_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores(id);
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores(id);

-- 7. Re-create Policies (using the new UUID types)

-- Cash Register Shifts Policies
CREATE POLICY "Users can view cash shifts from their store" ON cash_register_shifts
  FOR SELECT USING (store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert cash shifts to their store" ON cash_register_shifts
  FOR INSERT WITH CHECK (store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update cash shifts from their store" ON cash_register_shifts
  FOR UPDATE USING (store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can delete cash shifts from their store" ON cash_register_shifts
  FOR DELETE USING (store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid()));

-- Products Policies
CREATE POLICY "Users can view products from their store" ON products
  FOR SELECT USING (store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert products to their store" ON products
  FOR INSERT WITH CHECK (store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update products from their store" ON products
  FOR UPDATE USING (store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can delete products from their store" ON products
  FOR DELETE USING (store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid()));
