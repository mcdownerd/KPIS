-- RLS policies for user_profiles (optimized)
-- Execute in Supabase SQL editor

-- Remove any existing policies
DROP POLICY IF EXISTS "user_profiles_select_own" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_insert_own" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_own" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_select_admin" ON user_profiles;

-- Enable RLS (if not already)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- SELECT: user can read own profile, admin can read all
CREATE POLICY "user_profiles_select_own"
ON user_profiles
FOR SELECT
USING (
  auth.uid() = id
  OR (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
);

-- INSERT: allow user to insert own profile (sign‑up)
CREATE POLICY "user_profiles_insert_own"
ON user_profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- UPDATE: allow user to update own profile, admin can update any
CREATE POLICY "user_profiles_update_own"
ON user_profiles
FOR UPDATE
USING (
  auth.uid() = id
  OR (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
);

-- (Optional) DELETE: only admin can delete profiles
CREATE POLICY "user_profiles_delete_admin"
ON user_profiles
FOR DELETE
USING ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');
