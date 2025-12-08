-- Script para atualizar teste@app.com de "user" para "gerente"
-- Execute este script no Supabase SQL Editor

-- Passo 1: Ver o perfil atual
SELECT 
    id,
    full_name,
    email,
    role,
    store_id,
    is_admin
FROM user_profiles
WHERE email = 'teste@app.com';

-- Passo 2: Atualizar para gerente
UPDATE user_profiles
SET role = 'gerente'
WHERE email = 'teste@app.com';

-- Passo 3: Verificar a mudança
SELECT 
    id,
    full_name,
    email,
    role,
    store_id,
    is_admin
FROM user_profiles
WHERE email = 'teste@app.com';

-- ✅ Depois de executar:
-- 1. Faça LOGOUT da aplicação
-- 2. Faça LOGIN novamente
-- 3. Acesse a página de Produtos
-- 4. Verifique que o botão "Deletar" não aparece mais
