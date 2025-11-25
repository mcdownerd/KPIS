-- Add missing location column to stores table

ALTER TABLE stores 
ADD COLUMN IF NOT EXISTS location TEXT;

-- Verify the table structure now
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'stores'
ORDER BY ordinal_position;
