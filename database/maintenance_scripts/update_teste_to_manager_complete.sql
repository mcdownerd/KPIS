-- Script COMPLETO para atualizar teste@app.com para gerente
-- Execute TODOS os passos no Supabase SQL Editor

-- ========================================
-- PASSO 1: Verificar o estado ATUAL
-- ========================================
SELECT 
    id,
    full_name,
    email,
    role,
    store_id,
    is_admin,
    created_at
FROM user_profiles
WHERE email = 'teste@app.com';

-- Você deve ver: role = 'user'

-- ========================================
-- PASSO 2: ATUALIZAR para gerente
-- ========================================
UPDATE user_profiles
SET 
    role = 'gerente',
    updated_at = NOW()
WHERE email = 'teste@app.com'
RETURNING id, email, role;

-- Deve retornar: 1 linha com role = 'gerente'

-- ========================================
-- PASSO 3: CONFIRMAR a mudança
-- ========================================
SELECT 
    id,
    full_name,
    email,
    role,
    store_id,
    is_admin
FROM user_profiles
WHERE email = 'teste@app.com';

-- Agora deve mostrar: role = 'gerente'

-- ========================================
-- PASSO 4: Ver TODOS os gerentes
-- ========================================
SELECT 
    email,
    full_name,
    role,
    store_id
FROM user_profiles
WHERE role = 'gerente'
ORDER BY email;

-- Deve aparecer teste@app.com na lista

-- ========================================
-- IMPORTANTE: Depois de executar este script
-- ========================================
-- 1. Vá para a aplicação
-- 2. Clique em "Sair" (logout)
-- 3. Faça login novamente com teste@app.com
-- 4. Acesse a página de Produtos
-- 5. O botão "Deletar" NÃO deve aparecer mais
