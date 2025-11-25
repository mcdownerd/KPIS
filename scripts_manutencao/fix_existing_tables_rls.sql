-- Fix RLS for tables that exist

-- CASH_REGISTER_SHIFTS
DO $$ 
DECLARE r RECORD;
BEGIN 
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'cash_register_shifts') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON cash_register_shifts';
    END LOOP;
END $$;
CREATE POLICY "cash_register_shifts_all_authenticated" ON cash_register_shifts FOR ALL USING (auth.role() = 'authenticated');

-- PRODUCT_HISTORY
DO $$ 
DECLARE r RECORD;
BEGIN 
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'product_history') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON product_history';
    END LOOP;
END $$;
CREATE POLICY "product_history_all_authenticated" ON product_history FOR ALL USING (auth.role() = 'authenticated');

-- STORES
DO $$ 
DECLARE r RECORD;
BEGIN 
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'stores') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON stores';
    END LOOP;
END $$;
CREATE POLICY "stores_all_authenticated" ON stores FOR ALL USING (auth.role() = 'authenticated');

-- Verify
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('products', 'cash_register_shifts', 'product_history', 'stores', 'user_profiles')
ORDER BY tablename, policyname;
