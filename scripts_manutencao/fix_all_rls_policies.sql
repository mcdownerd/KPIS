-- Fix RLS policies for all tables to allow authenticated users access
-- This moves authorization to the application layer

-- 1. UTILITIES TABLE
DO $$ 
DECLARE 
    r RECORD;
BEGIN 
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'utilities') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON utilities';
    END LOOP;
END $$;

CREATE POLICY "utilities_all_authenticated" ON utilities
  FOR ALL USING (auth.role() = 'authenticated');

-- 2. DELIVERIES TABLE  
DO $$ 
DECLARE 
    r RECORD;
BEGIN 
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'deliveries') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON deliveries';
    END LOOP;
END $$;

CREATE POLICY "deliveries_all_authenticated" ON deliveries
  FOR ALL USING (auth.role() = 'authenticated');

-- 3. CASH_REGISTER_SHIFTS TABLE
DO $$ 
DECLARE 
    r RECORD;
BEGIN 
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'cash_register_shifts') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON cash_register_shifts';
    END LOOP;
END $$;

CREATE POLICY "cash_register_shifts_all_authenticated" ON cash_register_shifts
  FOR ALL USING (auth.role() = 'authenticated');

-- 4. PRODUCT_HISTORY TABLE
DO $$ 
DECLARE 
    r RECORD;
BEGIN 
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'product_history') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON product_history';
    END LOOP;
END $$;

CREATE POLICY "product_history_all_authenticated" ON product_history
  FOR ALL USING (auth.role() = 'authenticated');

-- 5. STORES TABLE (already done, but let's verify)
DO $$ 
DECLARE 
    r RECORD;
BEGIN 
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'stores') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON stores';
    END LOOP;
END $$;

CREATE POLICY "stores_all_authenticated" ON stores
  FOR ALL USING (auth.role() = 'authenticated');

-- Verify all policies
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('products', 'utilities', 'deliveries', 'cash_register_shifts', 'product_history', 'stores', 'user_profiles')
ORDER BY tablename, policyname;
