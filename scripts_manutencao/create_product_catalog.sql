-- Create a shared product catalog system
-- This allows all stores to use the same product names, but track their own inventory

-- 1. Create product_catalog table (shared product names)
CREATE TABLE IF NOT EXISTS product_catalog (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  sub_category TEXT,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS on product_catalog
ALTER TABLE product_catalog ENABLE ROW LEVEL SECURITY;

-- Everyone can view the catalog
CREATE POLICY "Anyone can view product catalog" ON product_catalog
  FOR SELECT USING (true);

-- Only admins can manage the catalog
CREATE POLICY "Admins can manage product catalog" ON product_catalog
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 3. Add catalog reference to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS catalog_id UUID REFERENCES product_catalog(id);

-- 4. Migrate existing products to catalog (optional - creates catalog entries from existing products)
INSERT INTO product_catalog (category, sub_category, name)
SELECT DISTINCT category, sub_category, name 
FROM products
WHERE NOT EXISTS (
  SELECT 1 FROM product_catalog pc 
  WHERE pc.category = products.category 
  AND pc.name = products.name
);

-- 5. Link existing products to catalog
UPDATE products p
SET catalog_id = (
  SELECT pc.id 
  FROM product_catalog pc 
  WHERE pc.category = p.category 
  AND pc.name = p.name 
  LIMIT 1
)
WHERE catalog_id IS NULL;

-- 6. Create index for better performance
CREATE INDEX IF NOT EXISTS idx_products_catalog_id ON products(catalog_id);
CREATE INDEX IF NOT EXISTS idx_product_catalog_name ON product_catalog(name);

-- 7. Create trigger for updated_at
CREATE TRIGGER update_product_catalog_updated_at 
BEFORE UPDATE ON product_catalog
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
