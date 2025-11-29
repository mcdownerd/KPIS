-- Create tables for Service Data Persistence
-- Includes: Service Times, Quality, Complaints, Digital Communication, Uber Metrics, Sales Summary

-- 1. Service Time Metrics
DROP TABLE IF EXISTS service_time_metrics CASCADE;
CREATE TABLE service_time_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  month_name TEXT NOT NULL, -- e.g., 'Janeiro'
  
  -- Almoço
  almoco_tempo INTEGER,
  almoco_var INTEGER,
  almoco_rank INTEGER,
  
  -- Jantar
  jantar_tempo INTEGER,
  jantar_var INTEGER,
  jantar_rank INTEGER,
  
  -- Dia
  dia_tempo INTEGER,
  dia_var INTEGER,
  dia_rank INTEGER,
  
  -- Delivery
  delivery_tempo INTEGER,
  delivery_var INTEGER,
  delivery_rank INTEGER,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- 2. Quality Metrics (FastInsight)
DROP TABLE IF EXISTS quality_metrics CASCADE;
CREATE TABLE quality_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  month_name TEXT NOT NULL,
  
  sg DECIMAL(5, 2),
  precisao DECIMAL(5, 2),
  qualidade DECIMAL(5, 2),
  rapidez DECIMAL(5, 2),
  nps DECIMAL(5, 2),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- 3. Complaints Metrics
DROP TABLE IF EXISTS complaints_metrics CASCADE;
CREATE TABLE complaints_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  month_name TEXT NOT NULL,
  
  -- Qualidade
  qualidade_sala INTEGER,
  qualidade_delivery INTEGER,
  
  -- Serviço
  servico_sala INTEGER,
  servico_delivery INTEGER,
  
  -- Limpeza
  limpeza_sala INTEGER,
  limpeza_delivery INTEGER,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- 4. Digital Communication Metrics
DROP TABLE IF EXISTS digital_communication_metrics CASCADE;
CREATE TABLE digital_communication_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  month_name TEXT NOT NULL,
  
  google_rating DECIMAL(3, 1),
  uber_rating DECIMAL(3, 1),
  delivery_rating DECIMAL(3, 1),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- 5. Uber Metrics
DROP TABLE IF EXISTS uber_metrics CASCADE;
CREATE TABLE uber_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  month_name TEXT NOT NULL,
  
  estrelas DECIMAL(3, 1),
  tempos INTEGER,
  inexatidao DECIMAL(5, 2),
  ava_produto DECIMAL(3, 1),
  tempo_total INTEGER,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- 6. Sales Summary Metrics
DROP TABLE IF EXISTS sales_summary_metrics CASCADE;
CREATE TABLE sales_summary_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  month_name TEXT NOT NULL,
  
  totais DECIMAL(10, 2),
  delivery DECIMAL(10, 2),
  percent_delivery DECIMAL(5, 2),
  sala DECIMAL(10, 2),
  mop DECIMAL(10, 2),
  percent_mop DECIMAL(5, 2),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE service_time_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_communication_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE uber_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_summary_metrics ENABLE ROW LEVEL SECURITY;

-- Helper function to create standard policies
CREATE OR REPLACE FUNCTION create_service_policies(table_name text) RETURNS void AS $$
BEGIN
    -- View Policy: Allow all authenticated users to view
    EXECUTE format('DROP POLICY IF EXISTS "Users can view %I from all stores" ON %I', table_name, table_name);
    EXECUTE format('CREATE POLICY "Users can view %I from all stores" ON %I FOR SELECT USING (true)', table_name, table_name);

    -- Insert Policy: Only for own store
    EXECUTE format('DROP POLICY IF EXISTS "Users can insert %I for their store" ON %I', table_name, table_name);
    EXECUTE format('CREATE POLICY "Users can insert %I for their store" ON %I FOR INSERT WITH CHECK (store_id::text IN (SELECT store_id::text FROM user_profiles WHERE id::text = auth.uid()::text))', table_name, table_name);

    -- Update Policy: Only for own store
    EXECUTE format('DROP POLICY IF EXISTS "Users can update %I from their store" ON %I', table_name, table_name);
    EXECUTE format('CREATE POLICY "Users can update %I from their store" ON %I FOR UPDATE USING (store_id::text IN (SELECT store_id::text FROM user_profiles WHERE id::text = auth.uid()::text))', table_name, table_name);

    -- Delete Policy: Only for own store
    EXECUTE format('DROP POLICY IF EXISTS "Users can delete %I from their store" ON %I', table_name, table_name);
    EXECUTE format('CREATE POLICY "Users can delete %I from their store" ON %I FOR DELETE USING (store_id::text IN (SELECT store_id::text FROM user_profiles WHERE id::text = auth.uid()::text))', table_name, table_name);
END;
$$ LANGUAGE plpgsql;

SELECT create_service_policies('service_time_metrics');
SELECT create_service_policies('quality_metrics');
SELECT create_service_policies('complaints_metrics');
SELECT create_service_policies('digital_communication_metrics');
SELECT create_service_policies('uber_metrics');
SELECT create_service_policies('sales_summary_metrics');
