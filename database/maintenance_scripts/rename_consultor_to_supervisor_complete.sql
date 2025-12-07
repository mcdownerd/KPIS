-- Script COMPLETO para renomear 'consultor' para 'supervisor'
-- Este script faz tudo em uma única transação

-- ========================================
-- SOLUÇÃO: Fazer tudo em uma transação
-- ========================================

BEGIN;

-- PASSO 1: Remover a constraint antiga
ALTER TABLE user_profiles
DROP CONSTRAINT IF EXISTS user_profiles_role_check;

-- PASSO 2: Atualizar os dados (consultor → supervisor)
UPDATE user_profiles
SET role = 'supervisor'
WHERE role = 'consultor';

-- PASSO 3: Adicionar nova constraint (sem 'consultor', com 'supervisor')
ALTER TABLE user_profiles
ADD CONSTRAINT user_profiles_role_check 
CHECK (role IN ('admin', 'user', 'gerente', 'supervisor'));

COMMIT;

-- ========================================
-- Verificação
-- ========================================

-- Ver todos os roles atuais
SELECT 
    role,
    COUNT(*) as quantidade
FROM user_profiles
GROUP BY role
ORDER BY role;

-- Deve mostrar:
-- admin: X
-- gerente: X
-- supervisor: X (antigos consultores)
-- user: X

-- Verificar que não há mais consultores
SELECT COUNT(*) as consultores_restantes
FROM user_profiles
WHERE role = 'consultor';

-- Deve retornar: 0

-- Ver a constraint atual
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'user_profiles'::regclass
AND conname = 'user_profiles_role_check';

-- Deve mostrar:
-- CHECK (role IN ('admin', 'user', 'gerente', 'supervisor'))
