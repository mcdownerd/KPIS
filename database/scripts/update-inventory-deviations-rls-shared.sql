-- Update RLS policies for inventory_deviations to allow cross-store viewing
-- Users can view deviations from ALL stores (not just their own)
-- But can only insert/update/delete for their own store

-- Drop existing view policy
DROP POLICY IF EXISTS "Users can view inventory deviations from their store" ON inventory_deviations;

-- Create new policy that allows viewing ALL stores
CREATE POLICY "Users can view inventory deviations from all stores"
  ON inventory_deviations
  FOR SELECT
  USING (true);  -- Allow viewing all records

-- Keep insert/update/delete restricted to user's own store
DROP POLICY IF EXISTS "Users can insert inventory deviations for their store" ON inventory_deviations;
CREATE POLICY "Users can insert inventory deviations for their store"
  ON inventory_deviations
  FOR INSERT
  WITH CHECK (
    store_id IN (
      SELECT store_id FROM user_profiles WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update inventory deviations from their store" ON inventory_deviations;
CREATE POLICY "Users can update inventory deviations from their store"
  ON inventory_deviations
  FOR UPDATE
  USING (
    store_id IN (
      SELECT store_id FROM user_profiles WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete inventory deviations from their store" ON inventory_deviations;
CREATE POLICY "Users can delete inventory deviations from their store"
  ON inventory_deviations
  FOR DELETE
  USING (
    store_id IN (
      SELECT store_id FROM user_profiles WHERE id = auth.uid()
    )
  );
