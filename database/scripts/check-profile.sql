-- ============================================
-- VERIFICAR SEU PERFIL
-- ============================================

SELECT 
    id,
    store_id,
    email,
    role,
    full_name
FROM user_profiles 
WHERE id = auth.uid();

-- Ver TODOS os user_profiles
SELECT 
    id,
    store_id,
    email,
    role
FROM user_profiles
LIMIT 10;

-- Ver todas as stores
SELECT * FROM stores;
