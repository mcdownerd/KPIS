-- ============================================
-- CREATE VIEW FOR COMPATIBILITY
-- ============================================
-- As APIs usam 'user_profiles' mas a tabela se chama 'profiles'
-- Esta view cria um alias para compatibilidade

CREATE OR REPLACE VIEW user_profiles AS
SELECT * FROM profiles;

-- Grant permissions
GRANT SELECT ON user_profiles TO authenticated;
GRANT SELECT ON user_profiles TO anon;
