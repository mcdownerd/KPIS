-- ============================================
-- RE-ENABLE RLS AND RESTORE SECURITY
-- ============================================

-- 1. Re-enable Row Level Security
ALTER TABLE shift_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

-- 2. Re-add foreign key constraints
ALTER TABLE shift_data 
  ADD CONSTRAINT shift_data_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE app_config 
  ADD CONSTRAINT app_config_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Done! Now each user will only see their own data.
