-- ============================================
-- CRIAR TABELA UTILITIES
-- ============================================

CREATE TABLE IF NOT EXISTS utilities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  utility_type TEXT CHECK (utility_type IN ('water', 'electricity', 'gas')),
  reading_date DATE NOT NULL,
  reading_value DECIMAL(10, 2), -- Leitura do contador
  cost DECIMAL(10, 2),          -- Custo em Euros
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_utilities_store_date ON utilities(store_id, reading_date);

-- Trigger update_at
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        DROP TRIGGER IF EXISTS update_utilities_updated_at ON utilities;
        CREATE TRIGGER update_utilities_updated_at BEFORE UPDATE ON utilities
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- RLS (Desabilitado temporariamente conforme fix de emergência)
ALTER TABLE utilities DISABLE ROW LEVEL SECURITY;
-- Se fosse habilitar:
-- ALTER TABLE utilities ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can view own store utilities" ON utilities FOR SELECT USING (store_id::text = get_user_store_id());
