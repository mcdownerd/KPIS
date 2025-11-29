-- Create a helper function to check if user is admin (avoids recursion)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop all existing policies on products
DO $$ 
DECLARE 
    r RECORD;
BEGIN 
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'products') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON products';
    END LOOP;
END $$;

-- Create simple policies using the helper function

-- SELECT: Admins see all, users see their store
CREATE POLICY "products_select_policy" ON products
  FOR SELECT USING (
    is_admin() OR 
    store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid())
  );

-- INSERT: Admins can insert anywhere, users only to their store
CREATE POLICY "products_insert_policy" ON products
  FOR INSERT WITH CHECK (
    is_admin() OR 
    store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid())
  );

-- UPDATE: Admins can update all, users only their store
CREATE POLICY "products_update_policy" ON products
  FOR UPDATE USING (
    is_admin() OR 
    store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid())
  );

-- DELETE: Admins can delete all, users only their store
CREATE POLICY "products_delete_policy" ON products
  FOR DELETE USING (
    is_admin() OR 
    store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid())
  );
