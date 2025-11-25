-- Fix Schema Dependencies and Types
-- This script handles the type mismatch between stores.id and referencing tables.

-- 1. Drop conflicting Foreign Keys
ALTER TABLE cash_register_shifts DROP CONSTRAINT IF EXISTS cash_register_shifts_store_id_fkey;
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_store_id_fkey;
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_store_id_fkey;

-- 2. Clean up any non-UUID data in referencing tables
-- Ensure we don't have invalid UUID strings before casting
DELETE FROM cash_register_shifts WHERE store_id::text !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';
DELETE FROM products WHERE store_id::text !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';
UPDATE user_profiles SET store_id = NULL WHERE store_id::text !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';

-- 3. Convert referencing columns to UUID
ALTER TABLE cash_register_shifts ALTER COLUMN store_id TYPE UUID USING store_id::uuid;
ALTER TABLE products ALTER COLUMN store_id TYPE UUID USING store_id::uuid;
ALTER TABLE user_profiles ALTER COLUMN store_id TYPE UUID USING store_id::uuid;

-- 4. Convert stores.id to UUID and set default
ALTER TABLE stores ALTER COLUMN id TYPE UUID USING id::uuid;
ALTER TABLE stores ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 5. Re-add Foreign Keys
ALTER TABLE cash_register_shifts ADD CONSTRAINT cash_register_shifts_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores(id);
ALTER TABLE products ADD CONSTRAINT products_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores(id);
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores(id);
