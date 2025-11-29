-- Fix infinite recursion in user_profiles RLS policies

-- 1. Drop ALL existing policies
DO $$ 
DECLARE 
    r RECORD;
BEGIN 
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'user_profiles') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON user_profiles';
    END LOOP;
END $$;

-- 2. Create SIMPLE policies without recursion

-- Users can view their own profile (no recursion)
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile (no recursion)
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow inserts for new user registration
CREATE POLICY "Enable insert for authentication" ON user_profiles
  FOR INSERT WITH CHECK (true);

-- 3. Verify policies
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE tablename = 'user_profiles';
