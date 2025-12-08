-- Script para atualizar a constraint de role na tabela user_profiles
-- Execute este script ANTES de migrar os consultores para supervisores

-- ========================================
-- PASSO 1: Ver a constraint atual
-- ========================================
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'user_profiles'::regclass
AND conname LIKE '%role%';

-- Deve mostrar algo como:
-- CHECK (role IN ('admin', 'user', 'gerente', 'consultor'))

-- ========================================
-- PASSO 2: Remover a constraint antiga
-- ========================================
ALTER TABLE user_profiles
DROP CONSTRAINT IF EXISTS user_profiles_role_check;

-- ========================================
-- PASSO 3: Adicionar nova constraint com 'supervisor'
-- ========================================
ALTER TABLE user_profiles
ADD CONSTRAINT user_profiles_role_check 
CHECK (role IN ('admin', 'user', 'gerente', 'supervisor'));

-- ========================================
-- PASSO 4: Verificar a nova constraint
-- ========================================
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'user_profiles'::regclass
AND conname LIKE '%role%';

-- Deve mostrar:
-- CHECK (role IN ('admin', 'user', 'gerente', 'supervisor'))

-- ========================================
-- AGORA você pode executar o script de migração:
-- migrate_consultor_to_supervisor.sql
-- ========================================
