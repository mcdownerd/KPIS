-- ============================================
-- STEP 2: ADICIONAR RLS POLICIES (FINAL)
-- ============================================
-- Execute este script DEPOIS de criar as tabelas

-- Habilitar RLS em todas as tabelas
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_deviations ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_tracking ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SALES POLICIES
-- ============================================
DROP POLICY IF EXISTS "Users can view sales from their store" ON sales;
CREATE POLICY "Users can view sales from their store" ON sales
  FOR SELECT USING (
    store_id::text IN (
      SELECT store_id::text FROM user_profiles WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert sales to their store" ON sales;
CREATE POLICY "Users can insert sales to their store" ON sales
  FOR INSERT WITH CHECK (
    store_id::text IN (
      SELECT store_id::text FROM user_profiles WHERE id = auth.uid()
    )
  );

-- ============================================
-- SERVICE_TIMES POLICIES
-- ============================================
DROP POLICY IF EXISTS "Users can view service times from their store" ON service_times;
CREATE POLICY "Users can view service times from their store" ON service_times
  FOR SELECT USING (
    store_id::text IN (
      SELECT store_id::text FROM user_profiles WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert service times to their store" ON service_times;
CREATE POLICY "Users can insert service times to their store" ON service_times
  FOR INSERT WITH CHECK (
    store_id::text IN (
      SELECT store_id::text FROM user_profiles WHERE id = auth.uid()
    )
  );

-- ============================================
-- COSTS POLICIES
-- ============================================
DROP POLICY IF EXISTS "Users can view costs from their store" ON costs;
CREATE POLICY "Users can view costs from their store" ON costs
  FOR SELECT USING (
    store_id::text IN (
      SELECT store_id::text FROM user_profiles WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert costs to their store" ON costs;
CREATE POLICY "Users can insert costs to their store" ON costs
  FOR INSERT WITH CHECK (
    store_id::text IN (
      SELECT store_id::text FROM user_profiles WHERE id = auth.uid()
    )
  );

-- ============================================
-- INVENTORY_DEVIATIONS POLICIES
-- ============================================
DROP POLICY IF EXISTS "Users can view inventory deviations from their store" ON inventory_deviations;
CREATE POLICY "Users can view inventory deviations from their store" ON inventory_deviations
  FOR SELECT USING (
    store_id::text IN (
      SELECT store_id::text FROM user_profiles WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert inventory deviations to their store" ON inventory_deviations;
CREATE POLICY "Users can insert inventory deviations to their store" ON inventory_deviations
  FOR INSERT WITH CHECK (
    store_id::text IN (
      SELECT store_id::text FROM user_profiles WHERE id = auth.uid()
    )
  );

-- ============================================
-- HR_METRICS POLICIES
-- ============================================
DROP POLICY IF EXISTS "Users can view hr metrics from their store" ON hr_metrics;
CREATE POLICY "Users can view hr metrics from their store" ON hr_metrics
  FOR SELECT USING (
    store_id::text IN (
      SELECT store_id::text FROM user_profiles WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert hr metrics to their store" ON hr_metrics;
CREATE POLICY "Users can insert hr metrics to their store" ON hr_metrics
  FOR INSERT WITH CHECK (
    store_id::text IN (
      SELECT store_id::text FROM user_profiles WHERE id = auth.uid()
    )
  );

-- ============================================
-- MAINTENANCE POLICIES
-- ============================================
DROP POLICY IF EXISTS "Users can view maintenance from their store" ON maintenance;
CREATE POLICY "Users can view maintenance from their store" ON maintenance
  FOR SELECT USING (
    store_id::text IN (
      SELECT store_id::text FROM user_profiles WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert maintenance to their store" ON maintenance;
CREATE POLICY "Users can insert maintenance to their store" ON maintenance
  FOR INSERT WITH CHECK (
    store_id::text IN (
      SELECT store_id::text FROM user_profiles WHERE id = auth.uid()
    )
  );

-- ============================================
-- PERFORMANCE_TRACKING POLICIES
-- ============================================
DROP POLICY IF EXISTS "Users can view performance tracking from their store" ON performance_tracking;
CREATE POLICY "Users can view performance tracking from their store" ON performance_tracking
  FOR SELECT USING (
    store_id::text IN (
      SELECT store_id::text FROM user_profiles WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert performance tracking to their store" ON performance_tracking;
CREATE POLICY "Users can insert performance tracking to their store" ON performance_tracking
  FOR INSERT WITH CHECK (
    store_id::text IN (
      SELECT store_id::text FROM user_profiles WHERE id = auth.uid()
    )
  );

-- ============================================
-- SUCESSO!
-- ============================================
-- RLS policies adicionadas com sucesso!
