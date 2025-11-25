-- Diagnostic and Fix for Stores Table

-- 1. Add missing timestamp columns with defaults
ALTER TABLE stores 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE stores 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Ensure the columns have defaults set
ALTER TABLE stores 
ALTER COLUMN created_at SET DEFAULT NOW();

ALTER TABLE stores 
ALTER COLUMN updated_at SET DEFAULT NOW();

-- 3. Ensure id has a default UUID generator
ALTER TABLE stores 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 4. Verify the table structure
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'stores'
ORDER BY ordinal_position;
