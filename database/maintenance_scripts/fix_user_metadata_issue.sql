-- Script para atualizar TANTO user_profiles QUANTO user_metadata
-- O problema é que o código lê de user_metadata, não de user_profiles!

-- ========================================
-- SOLUÇÃO: Usar a função updateUserProfile
-- ========================================
-- Esta função atualiza AMBOS os lugares automaticamente

-- Infelizmente, não podemos atualizar user_metadata via SQL diretamente
-- Precisamos usar a API do Supabase Auth

-- ========================================
-- OPÇÃO 1: Via Admin Dashboard (RECOMENDADO)
-- ========================================
-- 1. Vá para: Supabase Dashboard → Authentication → Users
-- 2. Encontre o usuário teste@app.com
-- 3. Clique nos 3 pontinhos → "Edit user"
-- 4. Vá para a aba "User Metadata"
-- 5. Adicione/edite o campo: role = "gerente"
-- 6. Salve
-- 7. Faça logout/login na aplicação

-- ========================================
-- OPÇÃO 2: Via código (criar um endpoint admin)
-- ========================================
-- Precisaria criar um endpoint que chama updateUserProfile()
-- Mas isso requer ter acesso admin na aplicação

-- ========================================
-- VERIFICAR user_metadata atual
-- ========================================
-- Infelizmente não podemos ver user_metadata via SQL
-- Apenas via Dashboard ou API

-- ========================================
-- ALTERNATIVA: Modificar o código para ler de user_profiles
-- ========================================
-- Podemos mudar getCurrentUserProfile() para buscar da tabela
-- em vez de user_metadata
