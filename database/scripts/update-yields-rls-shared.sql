-- Update RLS policies for product_yields to allow cross-store viewing
-- Users can view yields from ALL stores (not just their own)
-- But can only insert/update/delete for their own store

-- Drop existing view policy
DROP POLICY IF EXISTS "Users can view yields from their store" ON product_yields;

-- Create new policy that allows viewing ALL stores
CREATE POLICY "Users can view yields from all stores"
  ON product_yields
  FOR SELECT
  USING (true);  -- Allow viewing all records

-- Keep insert/update/delete restricted to user's own store
DROP POLICY IF EXISTS "Users can insert yields for their store" ON product_yields;
CREATE POLICY "Users can insert yields for their store"
  ON product_yields
  FOR INSERT
  WITH CHECK (
    store_id IN (
      SELECT store_id FROM user_profiles WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update yields from their store" ON product_yields;
CREATE POLICY "Users can update yields from their store"
  ON product_yields
  FOR UPDATE
  USING (
    store_id IN (
      SELECT store_id FROM user_profiles WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete yields from their store" ON product_yields;
CREATE POLICY "Users can delete yields from their store"
  ON product_yields
  FOR DELETE
  USING (
    store_id IN (
      SELECT store_id FROM user_profiles WHERE id = auth.uid()
    )
  );
