-- ============================================
-- SCRIPT COMPLETO - EXECUTAR NESTA ORDEM
-- ============================================

-- ============================================
-- PARTE 1: VERIFICAR SE JÁ EXISTE user_profiles
-- ============================================
-- Se user_profiles já existe, não precisa criar profiles
-- Vamos criar um alias reverso

DO $$
BEGIN
    -- Verifica se user_profiles existe
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
        -- Se user_profiles existe, cria profiles como alias
        CREATE OR REPLACE VIEW profiles AS SELECT * FROM user_profiles;
        RAISE NOTICE 'View profiles criada apontando para user_profiles';
    ELSE
        -- Se não existe, verifica se profiles existe
        IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
            -- Nenhuma das duas existe, precisa criar
            RAISE EXCEPTION 'Nem profiles nem user_profiles existem. Execute o schema principal primeiro.';
        END IF;
    END IF;
END $$;

-- ============================================
-- PARTE 2: CRIAR TABELAS DO DASHBOARD
-- ============================================

-- 1. SALES
CREATE TABLE IF NOT EXISTS sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  sale_date DATE NOT NULL,
  platform TEXT CHECK (platform IN ('Delivery', 'Sala', 'MOP')),
  total_value DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view sales from their store" ON sales;
CREATE POLICY "Users can view sales from their store" ON sales
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id::text = auth.uid()::text
      AND user_profiles.store_id::uuid = .store_id
    )
  );

DROP POLICY IF EXISTS "Users can insert sales to their store" ON sales;
CREATE POLICY "Users can insert sales to their store" ON sales
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id::text = auth.uid()::text
      AND user_profiles.store_id::uuid = .store_id
    )
  );

-- 2. SERVICE_TIMES
CREATE TABLE IF NOT EXISTS service_times (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  lunch_time INTEGER,
  dinner_time INTEGER,
  day_time INTEGER,
  target_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE service_times ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view service times from their store" ON service_times;
CREATE POLICY "Users can view service times from their store" ON service_times
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id::text = auth.uid()::text 
      AND user_profiles.store_id::uuid = .store_id
    )
  );

DROP POLICY IF EXISTS "Users can insert service times to their store" ON service_times;
CREATE POLICY "Users can insert service times to their store" ON service_times
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id::text = auth.uid()::text 
      AND user_profiles.store_id::uuid = .store_id
    )
  );

-- 3. COSTS
CREATE TABLE IF NOT EXISTS costs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  cost_type TEXT NOT NULL,
  percentage DECIMAL(5, 2) NOT NULL,
  target_percentage DECIMAL(5, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE costs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view costs from their store" ON costs;
CREATE POLICY "Users can view costs from their store" ON costs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id::text = auth.uid()::text 
      AND user_profiles.store_id::uuid = .store_id
    )
  );

DROP POLICY IF EXISTS "Users can insert costs to their store" ON costs;
CREATE POLICY "Users can insert costs to their store" ON costs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id::text = auth.uid()::text 
      AND user_profiles.store_id::uuid = .store_id
    )
  );

-- 4. INVENTORY_DEVIATIONS
CREATE TABLE IF NOT EXISTS inventory_deviations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  item_name TEXT NOT NULL,
  deviation_value INTEGER NOT NULL,
  status TEXT CHECK (status IN ('ok', 'warning', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE inventory_deviations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view inventory deviations from their store" ON inventory_deviations;
CREATE POLICY "Users can view inventory deviations from their store" ON inventory_deviations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id::text = auth.uid()::text 
      AND user_profiles.store_id::uuid = .store_id
    )
  );

DROP POLICY IF EXISTS "Users can insert inventory deviations to their store" ON inventory_deviations;
CREATE POLICY "Users can insert inventory deviations to their store" ON inventory_deviations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id::text = auth.uid()::text 
      AND user_profiles.store_id::uuid = .store_id
    )
  );

-- 5. HR_METRICS
CREATE TABLE IF NOT EXISTS hr_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  metric_type TEXT NOT NULL,
  value DECIMAL(10, 2) NOT NULL,
  target_value DECIMAL(10, 2),
  additional_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE hr_metrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view hr metrics from their store" ON hr_metrics;
CREATE POLICY "Users can view hr metrics from their store" ON hr_metrics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id::text = auth.uid()::text 
      AND user_profiles.store_id::uuid = .store_id
    )
  );

DROP POLICY IF EXISTS "Users can insert hr metrics to their store" ON hr_metrics;
CREATE POLICY "Users can insert hr metrics to their store" ON hr_metrics
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id::text = auth.uid()::text 
      AND user_profiles.store_id::uuid = .store_id
    )
  );

-- 6. MAINTENANCE
CREATE TABLE IF NOT EXISTS maintenance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  breakdown_date DATE NOT NULL,
  equipment_name TEXT NOT NULL,
  cause TEXT,
  parts_replaced TEXT,
  cost DECIMAL(10, 2),
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE maintenance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view maintenance from their store" ON maintenance;
CREATE POLICY "Users can view maintenance from their store" ON maintenance
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id::text = auth.uid()::text 
      AND user_profiles.store_id::uuid = .store_id
    )
  );

DROP POLICY IF EXISTS "Users can insert maintenance to their store" ON maintenance;
CREATE POLICY "Users can insert maintenance to their store" ON maintenance
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id::text = auth.uid()::text 
      AND user_profiles.store_id::uuid = .store_id
    )
  );

-- 7. PERFORMANCE_TRACKING
CREATE TABLE IF NOT EXISTS performance_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  metric_name TEXT NOT NULL,
  value DECIMAL(10, 2),
  status TEXT CHECK (status IN ('OK', 'NOK')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE performance_tracking ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view performance tracking from their store" ON performance_tracking;
CREATE POLICY "Users can view performance tracking from their store" ON performance_tracking
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id::text = auth.uid()::text 
      AND user_profiles.store_id::uuid = .store_id
    )
  );

DROP POLICY IF EXISTS "Users can insert performance tracking to their store" ON performance_tracking;
CREATE POLICY "Users can insert performance tracking to their store" ON performance_tracking
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id::text = auth.uid()::text 
      AND user_profiles.store_id::uuid = .store_id
    )
  );

-- ============================================
-- PARTE 3: ÍNDICES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_sales_store_date ON sales(store_id, sale_date);
CREATE INDEX IF NOT EXISTS idx_service_times_store_date ON service_times(store_id, record_date);
CREATE INDEX IF NOT EXISTS idx_costs_store_date ON costs(store_id, record_date);
CREATE INDEX IF NOT EXISTS idx_inventory_deviations_store_date ON inventory_deviations(store_id, record_date);
CREATE INDEX IF NOT EXISTS idx_hr_metrics_store_date ON hr_metrics(store_id, record_date);
CREATE INDEX IF NOT EXISTS idx_maintenance_store_date ON maintenance(store_id, breakdown_date);
CREATE INDEX IF NOT EXISTS idx_performance_tracking_store_date ON performance_tracking(store_id, record_date);

-- ============================================
-- PARTE 4: TRIGGERS (se a função existir)
-- ============================================
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        DROP TRIGGER IF EXISTS update_sales_updated_at ON sales;
        CREATE TRIGGER update_sales_updated_at BEFORE UPDATE ON sales
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        DROP TRIGGER IF EXISTS update_service_times_updated_at ON service_times;
        CREATE TRIGGER update_service_times_updated_at BEFORE UPDATE ON service_times
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        DROP TRIGGER IF EXISTS update_costs_updated_at ON costs;
        CREATE TRIGGER update_costs_updated_at BEFORE UPDATE ON costs
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        DROP TRIGGER IF EXISTS update_inventory_deviations_updated_at ON inventory_deviations;
        CREATE TRIGGER update_inventory_deviations_updated_at BEFORE UPDATE ON inventory_deviations
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        DROP TRIGGER IF EXISTS update_hr_metrics_updated_at ON hr_metrics;
        CREATE TRIGGER update_hr_metrics_updated_at BEFORE UPDATE ON hr_metrics
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        DROP TRIGGER IF EXISTS update_maintenance_updated_at ON maintenance;
        CREATE TRIGGER update_maintenance_updated_at BEFORE UPDATE ON maintenance
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        DROP TRIGGER IF EXISTS update_performance_tracking_updated_at ON performance_tracking;
        CREATE TRIGGER update_performance_tracking_updated_at BEFORE UPDATE ON performance_tracking
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- ============================================
-- FIM - Tabelas criadas com sucesso!
-- ============================================
