-- ============================================
-- DASHBOARD TABLES - VERSÃO SIMPLIFICADA
-- ============================================
-- Este script cria as tabelas SEM RLS policies
-- As policies serão adicionadas depois que verificarmos os tipos

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

-- ============================================
-- ÍNDICES
-- ============================================
DO $$
BEGIN
    -- Sales index
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sales') THEN
        CREATE INDEX IF NOT EXISTS idx_sales_store_date ON sales(store_id, sale_date);
    END IF;

    -- Service times index
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_times' AND column_name = 'record_date') THEN
        CREATE INDEX IF NOT EXISTS idx_service_times_store_date ON service_times(store_id, record_date);
    END IF;

    -- Costs index
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'costs' AND column_name = 'record_date') THEN
        CREATE INDEX IF NOT EXISTS idx_costs_store_date ON costs(store_id, record_date);
    END IF;

    -- Inventory deviations index
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inventory_deviations' AND column_name = 'record_date') THEN
        CREATE INDEX IF NOT EXISTS idx_inventory_deviations_store_date ON inventory_deviations(store_id, record_date);
    END IF;

    -- HR metrics index
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hr_metrics' AND column_name = 'record_date') THEN
        CREATE INDEX IF NOT EXISTS idx_hr_metrics_store_date ON hr_metrics(store_id, record_date);
    END IF;

    -- Maintenance index
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'maintenance' AND column_name = 'breakdown_date') THEN
        CREATE INDEX IF NOT EXISTS idx_maintenance_store_date ON maintenance(store_id, breakdown_date);
    END IF;

    -- Performance tracking index
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'performance_tracking' AND column_name = 'record_date') THEN
        CREATE INDEX IF NOT EXISTS idx_performance_tracking_store_date ON performance_tracking(store_id, record_date);
    END IF;
END $$;

-- ============================================
-- TRIGGERS
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
-- SUCESSO!
-- ============================================
-- Tabelas criadas. Agora execute o próximo script para adicionar RLS.
