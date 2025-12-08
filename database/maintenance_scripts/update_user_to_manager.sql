-- Script para atualizar seu perfil de "user" para "gerente"
-- Execute este script no Supabase SQL Editor

-- Passo 1: Ver seu perfil atual
SELECT 
    id,
    full_name,
    email,
    role,
    store_id
FROM user_profiles
WHERE email = auth.email(); -- Seu email atual

-- Passo 2: Atualizar para gerente
-- IMPORTANTE: Substitua 'SEU_EMAIL_AQUI' pelo seu email real
UPDATE user_profiles
SET role = 'gerente'
WHERE email = 'SEU_EMAIL_AQUI';

-- Passo 3: Verificar a mudança
SELECT 
    id,
    full_name,
    email,
    role,
    store_id
FROM user_profiles
WHERE email = 'SEU_EMAIL_AQUI';

-- Depois de executar, faça logout e login novamente na aplicação
-- para que o novo role seja carregado
