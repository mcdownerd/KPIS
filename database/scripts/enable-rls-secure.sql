-- ============================================
-- REABILITAR RLS COM SEGURANÇA (NO RECURSION)
-- ============================================

-- 1. Habilitar RLS em todas as tabelas
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_deviations ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE utilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 2. Limpar policies antigas para evitar conflitos
DROP POLICY IF EXISTS "Users can view own store sales" ON sales;
DROP POLICY IF EXISTS "Users can view own store service_times" ON service_times;
DROP POLICY IF EXISTS "Users can view own store costs" ON costs;
DROP POLICY IF EXISTS "Users can view own store inventory" ON inventory_deviations;
DROP POLICY IF EXISTS "Users can view own store hr" ON hr_metrics;
DROP POLICY IF EXISTS "Users can view own store maintenance" ON maintenance;
DROP POLICY IF EXISTS "Users can view own store performance" ON performance_tracking;
DROP POLICY IF EXISTS "Users can view own store utilities" ON utilities;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;

-- 3. Criar Policy Simples para User Profiles
-- Usuário só vê seu próprio perfil. Sem joins.
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- 4. Criar Policies Otimizadas para Tabelas de Dados
-- Usam a função get_user_store_id() que evita recursão.

CREATE POLICY "Users can view own store sales" ON sales
  FOR SELECT USING (store_id::text = get_user_store_id());

CREATE POLICY "Users can view own store service_times" ON service_times
  FOR SELECT USING (store_id::text = get_user_store_id());

CREATE POLICY "Users can view own store costs" ON costs
  FOR SELECT USING (store_id::text = get_user_store_id());

CREATE POLICY "Users can view own store inventory" ON inventory_deviations
  FOR SELECT USING (store_id::text = get_user_store_id());

CREATE POLICY "Users can view own store hr" ON hr_metrics
  FOR SELECT USING (store_id::text = get_user_store_id());

CREATE POLICY "Users can view own store maintenance" ON maintenance
  FOR SELECT USING (store_id::text = get_user_store_id());

CREATE POLICY "Users can view own store performance" ON performance_tracking
  FOR SELECT USING (store_id::text = get_user_store_id());

CREATE POLICY "Users can view own store utilities" ON utilities
  FOR SELECT USING (store_id::text = get_user_store_id());

-- 5. Policies de Inserção/Atualização (Opcional, mas recomendado)
-- Permite inserir apenas na sua própria loja

CREATE POLICY "Users can insert own store sales" ON sales
  FOR INSERT WITH CHECK (store_id::text = get_user_store_id());

-- (Repetir para outras tabelas conforme necessidade de escrita)
-- Por enquanto, focamos em LEITURA (SELECT) para o dashboard funcionar.
