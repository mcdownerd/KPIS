-- Script para atualizar role 'consultor' para 'supervisor' no Supabase
-- Execute este script no Supabase SQL Editor

-- ========================================
-- PASSO 1: Verificar consultores atuais
-- ========================================
SELECT 
    id,
    email,
    full_name,
    role,
    store_id
FROM user_profiles
WHERE role = 'consultor';

-- Deve mostrar todos os usuários com role 'consultor'

-- ========================================
-- PASSO 2: Atualizar para supervisor
-- ========================================
UPDATE user_profiles
SET role = 'supervisor'
WHERE role = 'consultor'
RETURNING id, email, full_name, role;

-- Deve retornar todos os usuários atualizados

-- ========================================
-- PASSO 3: Confirmar que não há mais consultores
-- ========================================
SELECT 
    id,
    email,
    full_name,
    role
FROM user_profiles
WHERE role = 'consultor';

-- Deve retornar 0 linhas (vazio)

-- ========================================
-- PASSO 4: Verificar supervisores
-- ========================================
SELECT 
    id,
    email,
    full_name,
    role,
    store_id
FROM user_profiles
WHERE role = 'supervisor'
ORDER BY email;

-- Deve mostrar todos os supervisores (incluindo os antigos consultores)

-- ========================================
-- PASSO 5: Ver todos os roles atuais
-- ========================================
SELECT 
    role,
    COUNT(*) as quantidade
FROM user_profiles
GROUP BY role
ORDER BY role;

-- Deve mostrar:
-- admin: X
-- gerente: X
-- supervisor: X (incluindo antigos consultores)
-- user: X

-- ========================================
-- IMPORTANTE: Depois de executar
-- ========================================
-- Os usuários que eram 'consultor' agora são 'supervisor'
-- Eles NÃO precisam fazer logout/login porque o código
-- agora lê de user_profiles (não de user_metadata)
