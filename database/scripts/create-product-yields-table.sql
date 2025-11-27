-- Create product_yields table
CREATE TABLE IF NOT EXISTS product_yields (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  product_name TEXT NOT NULL,
  yield_value DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE product_yields ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view yields from their store" ON product_yields;
CREATE POLICY "Users can view yields from their store"
  ON product_yields
  FOR SELECT
  USING (
    store_id IN (
      SELECT store_id FROM user_profiles WHERE id = auth.uid()
    )
  );

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

-- Create index
CREATE INDEX IF NOT EXISTS idx_product_yields_store_date ON product_yields(store_id, record_date);

-- Create trigger for updated_at
CREATE TRIGGER update_product_yields_updated_at
  BEFORE UPDATE ON product_yields
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
