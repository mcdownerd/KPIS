-- Add store_id and store_name columns to shift_data table
ALTER TABLE shift_data ADD COLUMN IF NOT EXISTS store_id UUID;
ALTER TABLE shift_data ADD COLUMN IF NOT EXISTS store_name TEXT;

-- Drop existing unique constraint if it exists (assuming based on previous code)
-- We need to handle the case where the constraint name is unknown.
-- This block attempts to drop the constraint by recreating it with the new columns.
-- Ideally, we should find the constraint name first.

-- For now, let's create a new index/constraint for store-based lookups
CREATE INDEX IF NOT EXISTS idx_shift_data_store_year ON shift_data(store_name, year);

-- If we want to enforce uniqueness per store, we need to know if we are migrating from user-based to store-based.
-- Assuming we want to keep user_id for now but allow filtering by store.
