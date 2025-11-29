-- Generic cleanup for ANY non-UUID store IDs (like '20', 'outra_loja', etc.)

-- 1. Unlink users from invalid stores
UPDATE user_profiles 
SET store_id = NULL 
WHERE store_id::text !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';

-- 2. Delete dependent products (and history if exists) linked to invalid stores
DO $$ 
BEGIN 
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'product_history') THEN
        DELETE FROM product_history 
        WHERE product_id IN (
            SELECT id FROM products 
            WHERE store_id::text !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
        );
    END IF;
END $$;

DELETE FROM products 
WHERE store_id::text !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';

-- 3. Delete the invalid stores themselves
DELETE FROM stores 
WHERE id::text !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';
