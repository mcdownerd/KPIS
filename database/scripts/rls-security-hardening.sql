-- ============================================
-- SECURITY HARDENING - FIX VULNERABILITIES
-- ============================================

-- 1. FIX PRIVILEGE ESCALATION IN user_profiles
-- Problem: Users could update their own 'role' or 'store_id' to become admins.
-- Fix: Enforce that non-admins cannot change sensitive fields.

DROP POLICY IF EXISTS "user_profiles_update_own" ON user_profiles;

CREATE POLICY "user_profiles_update_own"
ON user_profiles
FOR UPDATE
USING (
  auth.uid() = id
  OR is_admin()
)
WITH CHECK (
  is_admin() -- Admins can update anything
  OR
  (
    auth.uid() = id
    AND (
      -- The NEW role must match the OLD role (prevent change)
      -- Note: We can't easily access the OLD row in WITH CHECK in standard RLS without triggers,
      -- BUT we can check against the database current state if we assume the update hasn't committed yet?
      -- Actually, WITH CHECK runs against the NEW row.
      -- To prevent changing role, we ensure the NEW role is NOT 'admin' (unless they were already admin, but we are in the non-admin branch).
      -- Better: Ensure the NEW role matches the role stored in the DB for this user?
      -- Wait, if I query the DB in WITH CHECK, I get the committed state (OLD).
      role = (SELECT role FROM user_profiles WHERE id = auth.uid())
      AND
      -- Same for store_id
      store_id = (SELECT store_id FROM user_profiles WHERE id = auth.uid())
    )
  )
);

-- 2. FIX DATA INTEGRITY IN products
-- Problem: Managers could move products to other stores.
-- Fix: Ensure store_id matches the user's store or remains unchanged.

DROP POLICY IF EXISTS "products_update_manager_admin" ON products;

CREATE POLICY "products_update_manager_admin"
ON products
FOR UPDATE
USING (
  is_admin()
  OR (
    (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'gerente'
    AND store_id = products.store_id
  )
)
WITH CHECK (
  is_admin()
  OR (
    (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'gerente'
    AND store_id = (SELECT store_id FROM user_profiles WHERE id = auth.uid())
  )
);

-- 3. FIX DATA INTEGRITY IN stores
-- Ensure only admins can update stores (already covered, but good to double check)
-- "stores_update_admin_only" checks is_admin(). Safe.
