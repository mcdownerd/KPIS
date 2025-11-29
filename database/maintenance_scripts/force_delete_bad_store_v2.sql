-- Simplified cleanup script
-- We will focus only on the tables we know exist and are causing the foreign key error.

-- 1. Remove references in user_profiles
UPDATE user_profiles 
SET store_id = NULL 
WHERE store_id::text = 'outra_loja';

-- 2. Remove dependent Products and their history
-- We use IF EXISTS logic implicitly by just running the delete. 
-- If the table didn't exist, it would error, but we know 'products' exists from the previous error message.

-- Attempt to delete history first (if the table exists)
DO $$ 
BEGIN 
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'product_history') THEN
        DELETE FROM product_history 
        WHERE product_id IN (SELECT id FROM products WHERE store_id::text = 'outra_loja');
    END IF;
END $$;

-- Delete products linked to the bad store
DELETE FROM products 
WHERE store_id::text = 'outra_loja';

-- 3. Finally, delete the store
DELETE FROM stores 
WHERE id::text = 'outra_loja';
