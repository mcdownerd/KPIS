-- Fix Stores Table RLS Policies

-- 1. Check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'stores';

-- 2. Drop existing policies to start fresh
DO $$ 
DECLARE 
    r RECORD;
BEGIN 
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'stores') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON stores';
    END LOOP;
END $$;

-- 3. Create proper policies for stores table
-- Allow everyone to view stores
CREATE POLICY "Anyone can view stores" ON stores
  FOR SELECT USING (true);

-- Allow admins to insert stores
CREATE POLICY "Admins can insert stores" ON stores
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow admins to update stores
CREATE POLICY "Admins can update stores" ON stores
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow admins to delete stores
CREATE POLICY "Admins can delete stores" ON stores
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
