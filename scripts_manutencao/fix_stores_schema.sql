-- Fix Stores Table Schema and Defaults

-- 1. Enable pgcrypto for UUID generation (standard in Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Ensure ID column is UUID and has a default value
-- We assume bad data has been cleaned up by the previous script.
ALTER TABLE stores 
ALTER COLUMN id TYPE UUID USING id::uuid;

ALTER TABLE stores 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 3. Ensure timestamp columns have defaults
ALTER TABLE stores 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE stores 
ALTER COLUMN created_at SET DEFAULT NOW();

ALTER TABLE stores 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE stores 
ALTER COLUMN updated_at SET DEFAULT NOW();

-- 4. Ensure name is required
ALTER TABLE stores 
ALTER COLUMN name SET NOT NULL;
