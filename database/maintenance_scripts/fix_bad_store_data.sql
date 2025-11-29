-- 1. Remove references to the invalid store in user_profiles
UPDATE user_profiles 
SET store_id = NULL 
WHERE store_id::text = 'outra_loja';

-- 2. Delete the store with the invalid ID
DELETE FROM stores 
WHERE id::text = 'outra_loja';

-- 3. Ensure timestamp columns exist (in case they are missing)
ALTER TABLE stores 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
