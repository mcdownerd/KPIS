-- Migration Script: Copy user_profiles data to auth.users.user_metadata
-- This eliminates the need to query user_profiles table during authentication

-- Step 1: Update user_metadata for all existing users
DO $$
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN 
        SELECT 
            up.id,
            up.full_name,
            up.role,
            up.store_id,
            up.is_admin,
            s.name as store_name
        FROM user_profiles up
        LEFT JOIN stores s ON s.id = up.store_id
    LOOP
        -- Update the user_metadata in auth.users
        UPDATE auth.users
        SET raw_user_meta_data = jsonb_build_object(
            'full_name', COALESCE(user_record.full_name, ''),
            'role', COALESCE(user_record.role, 'user'),
            'store_id', user_record.store_id,
            'store_name', user_record.store_name,
            'is_admin', COALESCE(user_record.is_admin, false)
        )
        WHERE id = user_record.id;
        
        RAISE NOTICE 'Updated metadata for user: %', user_record.id;
    END LOOP;
END $$;

-- Step 2: Verify the migration
SELECT 
    id,
    email,
    raw_user_meta_data->>'full_name' as full_name,
    raw_user_meta_data->>'role' as role,
    raw_user_meta_data->>'store_id' as store_id,
    raw_user_meta_data->>'is_admin' as is_admin
FROM auth.users
ORDER BY email;
