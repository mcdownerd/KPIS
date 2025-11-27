-- ============================================
-- DASHBOARD TABLES - SUPABASE SCHEMA (FIXED)
-- ============================================
-- Tabelas para armazenar dados do dashboard

-- ============================================
-- 1. TABELA DE VENDAS (SALES)
-- ============================================
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

-- Enable RLS
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view sales from their store
CREATE POLICY "Users can view sales from their store" ON sales
  FOR SELECT USING (
    store_id IN (
      SELECT store_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Policy: Users can insert sales to their store
CREATE POLICY "Users can insert sales to their store" ON sales
  FOR INSERT WITH CHECK (
    store_id IN (
      SELECT store_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Policy: Users can update sales from their store
CREATE POLICY "Users can update sales from their store" ON sales
  FOR UPDATE USING (
    store_id IN (
      SELECT store_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Policy: Users can delete sales from their store
CREATE POLICY "Users can delete sales from their store" ON sales
  FOR DELETE USING (
    store_id IN (
      SELECT store_id FROM profiles WHERE id = auth.uid()
    )
  );

-- ============================================
-- 2. TABELA DE TEMPOS DE SERVIÇO (SERVICE_TIMES)
-- ============================================
CREATE TABLE IF NOT EXISTS service_times (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  lunch_time INTEGER, -- tempo em segundos
  dinner_time INTEGER, -- tempo em segundos
  day_time INTEGER, -- tempo em segundos
  target_time INTEGER, -- tempo alvo em segundos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE service_times ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view service times from their store
CREATE POLICY "Users can view service times from their store" ON service_times
  FOR SELECT USING (
    store_id IN (
      SELECT store_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Policy: Users can insert service times to their store
CREATE POLICY "Users can insert service times to their store" ON service_times
  FOR INSERT WITH CHECK (
    store_id IN (
      SELECT store_id FROM profiles WHERE id = auth.uid()
    )
  );

-- ============================================
-- 3. TABELA DE CUSTOS (COSTS)
-- ============================================
CREATE TABLE IF NOT EXISTS costs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  cost_type TEXT NOT NULL, -- 'comida', 'papel', 'refeicoes', 'perdas'
  percentage DECIMAL(5, 2) NOT NULL,
  target_percentage DECIMAL(5, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE costs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view costs from their store
CREATE POLICY "Users can view costs from their store" ON costs
  FOR SELECT USING (
    store_id IN (
      SELECT store_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Policy: Users can insert costs to their store
CREATE POLICY "Users can insert costs to their store" ON costs
  FOR INSERT WITH CHECK (
    store_id IN (
      SELECT store_id FROM profiles WHERE id = auth.uid()
    )
  );

-- ============================================
-- 4. TABELA DE DESVIOS DE INVENTÁRIO (INVENTORY_DEVIATIONS)
-- ============================================
CREATE TABLE IF NOT EXISTS inventory_deviations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  item_name TEXT NOT NULL,
  deviation_value INTEGER NOT NULL, -- valor do desvio (positivo ou negativo)
  status TEXT CHECK (status IN ('ok', 'warning', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE inventory_deviations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view inventory deviations from their store
CREATE POLICY "Users can view inventory deviations from their store" ON inventory_deviations
  FOR SELECT USING (
    store_id IN (
      SELECT store_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Policy: Users can insert inventory deviations to their store
CREATE POLICY "Users can insert inventory deviations to their store" ON inventory_deviations
  FOR INSERT WITH CHECK (
    store_id IN (
      SELECT store_id FROM profiles WHERE id = auth.uid()
    )
  );

-- ============================================
-- 5. TABELA DE RECURSOS HUMANOS (HR_METRICS)
-- ============================================
CREATE TABLE IF NOT EXISTS hr_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  metric_type TEXT NOT NULL, -- 'labor_cost', 'turnover', 'staffing', 'productivity'
  value DECIMAL(10, 2) NOT NULL,
  target_value DECIMAL(10, 2),
  additional_data JSONB, -- para dados extras como horas, vendas, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE hr_metrics ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view HR metrics from their store
CREATE POLICY "Users can view hr metrics from their store" ON hr_metrics
  FOR SELECT USING (
    store_id IN (
      SELECT store_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Policy: Users can insert HR metrics to their store
CREATE POLICY "Users can insert hr metrics to their store" ON hr_metrics
  FOR INSERT WITH CHECK (
    store_id IN (
      SELECT store_id FROM profiles WHERE id = auth.uid()
    )
  );

-- ============================================
-- 6. TABELA DE MANUTENÇÃO (MAINTENANCE)
-- ============================================
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

-- Enable RLS
ALTER TABLE maintenance ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view maintenance from their store
CREATE POLICY "Users can view maintenance from their store" ON maintenance
  FOR SELECT USING (
    store_id IN (
      SELECT store_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Policy: Users can insert maintenance to their store
CREATE POLICY "Users can insert maintenance to their store" ON maintenance
  FOR INSERT WITH CHECK (
    store_id IN (
      SELECT store_id FROM profiles WHERE id = auth.uid()
    )
  );

-- ============================================
-- 7. TABELA DE PERFORMANCE (PERFORMANCE_TRACKING)
-- ============================================
CREATE TABLE IF NOT EXISTS performance_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  metric_name TEXT NOT NULL, -- 'cmp', 'pl', 'aval', 'gastos_gerais'
  value DECIMAL(10, 2),
  status TEXT CHECK (status IN ('OK', 'NOK')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE performance_tracking ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view performance tracking from their store
CREATE POLICY "Users can view performance tracking from their store" ON performance_tracking
  FOR SELECT USING (
    store_id IN (
      SELECT store_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Policy: Users can insert performance tracking to their store
CREATE POLICY "Users can insert performance tracking to their store" ON performance_tracking
  FOR INSERT WITH CHECK (
    store_id IN (
      SELECT store_id FROM profiles WHERE id = auth.uid()
    )
  );

-- ============================================
-- 8. ÍNDICES PARA MELHOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_sales_store_date ON sales(store_id, sale_date);
CREATE INDEX IF NOT EXISTS idx_service_times_store_date ON service_times(store_id, record_date);
CREATE INDEX IF NOT EXISTS idx_costs_store_date ON costs(store_id, record_date);
CREATE INDEX IF NOT EXISTS idx_inventory_deviations_store_date ON inventory_deviations(store_id, record_date);
CREATE INDEX IF NOT EXISTS idx_hr_metrics_store_date ON hr_metrics(store_id, record_date);
CREATE INDEX IF NOT EXISTS idx_maintenance_store_date ON maintenance(store_id, breakdown_date);
CREATE INDEX IF NOT EXISTS idx_performance_tracking_store_date ON performance_tracking(store_id, record_date);

-- ============================================
-- 9. TRIGGERS PARA ATUALIZAR updated_at
-- ============================================
CREATE TRIGGER update_sales_updated_at BEFORE UPDATE ON sales
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_times_updated_at BEFORE UPDATE ON service_times
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_costs_updated_at BEFORE UPDATE ON costs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_deviations_updated_at BEFORE UPDATE ON inventory_deviations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hr_metrics_updated_at BEFORE UPDATE ON hr_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_updated_at BEFORE UPDATE ON maintenance
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_performance_tracking_updated_at BEFORE UPDATE ON performance_tracking
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FIM DO SCHEMA
-- ============================================
