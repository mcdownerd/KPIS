-- ============================================
-- HABILITAR ESCRITA (INSERT/UPDATE/DELETE) NO RLS
-- ============================================

-- UTILITIES
DROP POLICY IF EXISTS "Users can insert own store utilities" ON utilities;
CREATE POLICY "Users can insert own store utilities" ON utilities
  FOR INSERT WITH CHECK (store_id::text = get_user_store_id());

DROP POLICY IF EXISTS "Users can update own store utilities" ON utilities;
CREATE POLICY "Users can update own store utilities" ON utilities
  FOR UPDATE USING (store_id::text = get_user_store_id());

DROP POLICY IF EXISTS "Users can delete own store utilities" ON utilities;
CREATE POLICY "Users can delete own store utilities" ON utilities
  FOR DELETE USING (store_id::text = get_user_store_id());

-- MAINTENANCE
DROP POLICY IF EXISTS "Users can insert own store maintenance" ON maintenance;
CREATE POLICY "Users can insert own store maintenance" ON maintenance
  FOR INSERT WITH CHECK (store_id::text = get_user_store_id());

DROP POLICY IF EXISTS "Users can update own store maintenance" ON maintenance;
CREATE POLICY "Users can update own store maintenance" ON maintenance
  FOR UPDATE USING (store_id::text = get_user_store_id());

-- PERFORMANCE TRACKING
DROP POLICY IF EXISTS "Users can insert own store performance" ON performance_tracking;
CREATE POLICY "Users can insert own store performance" ON performance_tracking
  FOR INSERT WITH CHECK (store_id::text = get_user_store_id());

DROP POLICY IF EXISTS "Users can update own store performance" ON performance_tracking;
CREATE POLICY "Users can update own store performance" ON performance_tracking
  FOR UPDATE USING (store_id::text = get_user_store_id());

-- INVENTORY DEVIATIONS
DROP POLICY IF EXISTS "Users can insert own store inventory" ON inventory_deviations;
CREATE POLICY "Users can insert own store inventory" ON inventory_deviations
  FOR INSERT WITH CHECK (store_id::text = get_user_store_id());

DROP POLICY IF EXISTS "Users can update own store inventory" ON inventory_deviations;
CREATE POLICY "Users can update own store inventory" ON inventory_deviations
  FOR UPDATE USING (store_id::text = get_user_store_id());

-- HR METRICS
DROP POLICY IF EXISTS "Users can insert own store hr" ON hr_metrics;
CREATE POLICY "Users can insert own store hr" ON hr_metrics
  FOR INSERT WITH CHECK (store_id::text = get_user_store_id());

DROP POLICY IF EXISTS "Users can update own store hr" ON hr_metrics;
CREATE POLICY "Users can update own store hr" ON hr_metrics
  FOR UPDATE USING (store_id::text = get_user_store_id());
