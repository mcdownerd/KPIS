-- Comprehensive cleanup for 'outra_loja'
-- We need to remove all dependent data before deleting the store itself.

-- 1. Remove references in user_profiles (or profiles)
UPDATE user_profiles 
SET store_id = NULL 
WHERE store_id::text = 'outra_loja';

-- 2. Remove dependent Products
-- Note: product_history should automatically be deleted due to ON DELETE CASCADE, 
-- but we'll delete explicitly just in case or if the constraint is different.
DELETE FROM product_history 
WHERE product_id IN (SELECT id FROM products WHERE store_id::text = 'outra_loja');

DELETE FROM products 
WHERE store_id::text = 'outra_loja';

-- 3. Remove dependent Utilities
DELETE FROM utilities 
WHERE store_id::text = 'outra_loja';

-- 4. Remove dependent Deliveries
DELETE FROM deliveries 
WHERE store_id::text = 'outra_loja';

-- 5. Remove dependent Cash Register Shifts (if table exists)
-- Using a DO block to avoid error if table doesn't exist is tricky in simple SQL editor,
-- so we will just try to delete if it exists. 
-- If this fails, the user can run the parts that work.
-- However, standard SQL doesn't have "DELETE IF EXISTS".
-- We will assume the table exists based on previous context.
DELETE FROM cash_register_shifts 
WHERE store_id::text = 'outra_loja';

-- 6. Finally, delete the store
DELETE FROM stores 
WHERE id::text = 'outra_loja';
