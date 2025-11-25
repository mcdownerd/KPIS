-- ============================================
-- FIX RLS TIMEOUT & RECURSION
-- ============================================

-- 1. Create a helper function to check admin status without RLS recursion
-- SECURITY DEFINER means it runs with the privileges of the creator (postgres), bypassing RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
$$;

-- 2. Update user_profiles policies
DROP POLICY IF EXISTS "user_profiles_select_own" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_own" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_insert_own" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_delete_admin" ON user_profiles;

-- SELECT: Users see their own profile, Admins see all
CREATE POLICY "user_profiles_select_own"
ON user_profiles
FOR SELECT
USING (
  auth.uid() = id
  OR is_admin()
);

-- UPDATE: Users update own, Admins update all
CREATE POLICY "user_profiles_update_own"
ON user_profiles
FOR UPDATE
USING (
  auth.uid() = id
  OR is_admin()
);

-- INSERT: Users insert own (signup), Admins insert any
CREATE POLICY "user_profiles_insert_own"
ON user_profiles
FOR INSERT
WITH CHECK (
  auth.uid() = id
  OR is_admin()
);

-- DELETE: Admins only
CREATE POLICY "user_profiles_delete_admin"
ON user_profiles
FOR DELETE
USING (is_admin());

-- 3. Update products policies to use is_admin() for better performance
DROP POLICY IF EXISTS "products_select_by_store_or_role" ON products;
DROP POLICY IF EXISTS "products_insert_manager_admin" ON products;
DROP POLICY IF EXISTS "products_update_manager_admin" ON products;
DROP POLICY IF EXISTS "products_delete_admin_only" ON products;

-- SELECT: Store members OR Admins/Consultants
CREATE POLICY "products_select_by_store_or_role"
ON products
FOR SELECT
USING (
  store_id IN (
    SELECT store_id FROM user_profiles WHERE id = auth.uid()
  )
  OR is_admin()
  OR (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'consultor'
);

-- INSERT: Managers/Admins
CREATE POLICY "products_insert_manager_admin"
ON products
FOR INSERT
WITH CHECK (
  is_admin()
  OR (
    (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'gerente'
    AND store_id = products.store_id
  )
);

-- UPDATE: Managers/Admins
CREATE POLICY "products_update_manager_admin"
ON products
FOR UPDATE
USING (
  is_admin()
  OR (
    (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'gerente'
    AND store_id = products.store_id
  )
);

-- DELETE: Admins only
CREATE POLICY "products_delete_admin_only"
ON products
FOR DELETE
USING (is_admin());

-- 4. Update stores policies
DROP POLICY IF EXISTS "stores_select_own_or_admin" ON stores;
DROP POLICY IF EXISTS "stores_insert_admin_only" ON stores;
DROP POLICY IF EXISTS "stores_update_admin_only" ON stores;
DROP POLICY IF EXISTS "stores_delete_admin_only" ON stores;

-- SELECT: Store members OR Admins/Consultants
CREATE POLICY "stores_select_own_or_admin"
ON stores
FOR SELECT
USING (
  id IN (
    SELECT store_id FROM user_profiles WHERE id = auth.uid()
  )
  OR is_admin()
  OR (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'consultor'
);

-- INSERT/UPDATE/DELETE: Admins only
CREATE POLICY "stores_insert_admin_only" ON stores FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "stores_update_admin_only" ON stores FOR UPDATE USING (is_admin());
CREATE POLICY "stores_delete_admin_only" ON stores FOR DELETE USING (is_admin());
