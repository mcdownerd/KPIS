-- Final Robust Fix V4: Simplified Cleanup Logic
-- Replaced complex regex with length check to avoid copy-paste truncation errors.

-- 1. Dynamic Block to Drop ALL Policies on ALL affected tables
DO $$ 
DECLARE 
    r RECORD;
BEGIN 
    -- Drop policies on product_history
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'product_history') THEN
        FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'product_history') LOOP
            EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON product_history';
        END LOOP;
    END IF;

    -- Drop policies on products
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'products') THEN
        FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'products') LOOP
            EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON products';
        END LOOP;
    END IF;

    -- Drop policies on cash_register_shifts
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'cash_register_shifts') THEN
        FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'cash_register_shifts') LOOP
            EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON cash_register_shifts';
        END LOOP;
    END IF;

    -- Drop policies on user_profiles
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_profiles') THEN
        FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'user_profiles') LOOP
            EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON user_profiles';
        END LOOP;
    END IF;
END $$;

-- 2. Drop conflicting Foreign Keys
ALTER TABLE cash_register_shifts DROP CONSTRAINT IF EXISTS cash_register_shifts_store_id_fkey;
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_store_id_fkey;
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_store_id_fkey;

-- 3. Clean up any non-UUID data (Using length check for safety)
-- Valid UUIDs are 36 characters long. Anything else is invalid.
DELETE FROM cash_register_shifts WHERE LENGTH(store_id::text) <> 36;
DELETE FROM products WHERE LENGTH(store_id::text) <> 36;
UPDATE user_profiles SET store_id = NULL WHERE LENGTH(store_id::text) <> 36;

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

-- 7. Re-create Standard Policies

-- Products
CREATE POLICY "Users can view products from their store" ON products FOR SELECT USING (store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid()));
CREATE POLICY "Users can insert products to their store" ON products FOR INSERT WITH CHECK (store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid()));
CREATE POLICY "Users can update products from their store" ON products FOR UPDATE USING (store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid()));
CREATE POLICY "Users can delete products from their store" ON products FOR DELETE USING (store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid()));

-- Product History
CREATE POLICY "Users can view product history from their store" ON product_history FOR SELECT USING (product_id IN (SELECT id FROM products WHERE store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid())));

-- Cash Register Shifts
CREATE POLICY "Users can view cash shifts from their store" ON cash_register_shifts FOR SELECT USING (store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid()));
CREATE POLICY "Users can insert cash shifts to their store" ON cash_register_shifts FOR INSERT WITH CHECK (store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid()));
CREATE POLICY "Users can update cash shifts from their store" ON cash_register_shifts FOR UPDATE USING (store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid()));
CREATE POLICY "Users can delete cash shifts from their store" ON cash_register_shifts FOR DELETE USING (store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid()));

-- User Profiles
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
