-- Tabela para turnos de caixa (Delivery Cash Sheet)
CREATE TABLE IF NOT EXISTS cash_register_shifts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id TEXT REFERENCES stores(id),
  shift_date DATE NOT NULL,
  shift_type TEXT CHECK (shift_type IN ('morning', 'night')),
  operator_name TEXT NOT NULL,
  gcs INTEGER DEFAULT 0,
  sales DECIMAL(10, 2) DEFAULT 0,
  cash DECIMAL(10, 2) DEFAULT 0,
  mb DECIMAL(10, 2) DEFAULT 0,
  mbp DECIMAL(10, 2) DEFAULT 0,
  tr_euro DECIMAL(10, 2) DEFAULT 0,
  difference DECIMAL(10, 2) DEFAULT 0,
  reimbursement_qty INTEGER DEFAULT 0,
  reimbursement_value DECIMAL(10, 2) DEFAULT 0,
  manager_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES user_profiles(id) -- CORRIGIDO: user_profiles
);

-- Enable RLS
ALTER TABLE cash_register_shifts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view cash shifts from their store" ON cash_register_shifts
  FOR SELECT USING (
    store_id IN (
      SELECT store_id FROM user_profiles WHERE id = auth.uid() -- CORRIGIDO: user_profiles
    )
  );

CREATE POLICY "Users can insert cash shifts to their store" ON cash_register_shifts
  FOR INSERT WITH CHECK (
    store_id IN (
      SELECT store_id FROM user_profiles WHERE id = auth.uid() -- CORRIGIDO: user_profiles
    )
  );

CREATE POLICY "Users can update cash shifts from their store" ON cash_register_shifts
  FOR UPDATE USING (
    store_id IN (
      SELECT store_id FROM user_profiles WHERE id = auth.uid() -- CORRIGIDO: user_profiles
    )
  );

CREATE POLICY "Users can delete cash shifts from their store" ON cash_register_shifts
  FOR DELETE USING (
    store_id IN (
      SELECT store_id FROM user_profiles WHERE id = auth.uid() -- CORRIGIDO: user_profiles
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_cash_register_shifts_updated_at BEFORE UPDATE ON cash_register_shifts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Index
CREATE INDEX IF NOT EXISTS idx_cash_register_shifts_store_date ON cash_register_shifts(store_id, shift_date);
