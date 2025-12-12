-- ============================================
-- SHIFT MANAGEMENT - SUPABASE TABLES
-- ============================================

-- Table: shift_data
-- Stores daily shift information
CREATE TABLE IF NOT EXISTS shift_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  date_key TEXT NOT NULL,
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
  
  -- Morning shift data
  m_gerente TEXT,
  m_vnd_real NUMERIC,
  m_vnd_plan NUMERIC,
  m_gcs_real INTEGER,
  m_gcs_plan INTEGER,
  m_horas NUMERIC,
  m_perdas_real NUMERIC,
  m_perdas_mn NUMERIC,
  m_desinv NUMERIC,
  m_tet INTEGER,
  m_r2p INTEGER,
  m_reemb_qtd INTEGER,
  m_reemb_val NUMERIC,
  
  -- Night shift data
  n_gerente TEXT,
  n_vnd_real NUMERIC,
  n_vnd_plan NUMERIC,
  n_gcs_real INTEGER,
  n_gcs_plan INTEGER,
  n_horas NUMERIC,
  n_perdas_real NUMERIC,
  n_perdas_mn NUMERIC,
  n_desinv NUMERIC,
  n_tet INTEGER,
  n_r2p INTEGER,
  n_reemb_qtd INTEGER,
  n_reemb_val NUMERIC,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, date_key, year)
);

-- Table: app_config
-- Stores manager configurations and Excel mappings
CREATE TABLE IF NOT EXISTS app_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  gerentes JSONB NOT NULL DEFAULT '[]',
  mappings JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE shift_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

-- RLS Policies for shift_data
CREATE POLICY "Users can view their own shift data"
  ON shift_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own shift data"
  ON shift_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shift data"
  ON shift_data FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shift data"
  ON shift_data FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for app_config
CREATE POLICY "Users can view their own config"
  ON app_config FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own config"
  ON app_config FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own config"
  ON app_config FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_shift_data_user_year ON shift_data(user_id, year);
CREATE INDEX idx_shift_data_date_key ON shift_data(date_key);
CREATE INDEX idx_app_config_user ON app_config(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_shift_data_updated_at BEFORE UPDATE ON shift_data
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_app_config_updated_at BEFORE UPDATE ON app_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
