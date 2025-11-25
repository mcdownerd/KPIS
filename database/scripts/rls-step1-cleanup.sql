-- PASSO 1: LIMPAR POLÍTICAS ANTIGAS
-- Execute este script primeiro

-- Limpar user_profiles
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_select_own" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_own" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_insert_own" ON user_profiles;

-- Limpar products
DROP POLICY IF EXISTS "Users can view products from their store" ON products;
DROP POLICY IF EXISTS "Users can insert products to their store" ON products;
DROP POLICY IF EXISTS "Users can update products from their store" ON products;
DROP POLICY IF EXISTS "Users can delete products from their store" ON products;
DROP POLICY IF EXISTS "products_select_by_store_or_role" ON products;
DROP POLICY IF EXISTS "products_insert_manager_admin" ON products;
DROP POLICY IF EXISTS "products_update_manager_admin" ON products;
DROP POLICY IF EXISTS "products_delete_admin_only" ON products;

-- Limpar stores
DROP POLICY IF EXISTS "Users can view their own store" ON stores;
DROP POLICY IF EXISTS "Admins can view all stores" ON stores;
DROP POLICY IF EXISTS "stores_select_own_or_admin" ON stores;
DROP POLICY IF EXISTS "stores_insert_admin_only" ON stores;
DROP POLICY IF EXISTS "stores_update_admin_only" ON stores;
DROP POLICY IF EXISTS "stores_delete_admin_only" ON stores;
