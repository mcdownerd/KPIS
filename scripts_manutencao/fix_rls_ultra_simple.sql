-- SOLUÇÃO MAIS SIMPLES: Desabilitar RLS temporariamente e recriar do zero
-- Execute este script no Supabase SQL Editor

-- PASSO 1: Desabilitar RLS temporariamente
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- PASSO 2: Remover TODAS as políticas
DO $$ 
DECLARE 
    r RECORD;
BEGIN 
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'user_profiles') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON user_profiles';
    END LOOP;
END $$;

-- PASSO 3: Criar política SUPER SIMPLES que sempre permite ler próprio perfil
CREATE POLICY "simple_select_own" ON user_profiles
  FOR SELECT 
  USING (id = auth.uid());

-- PASSO 4: Permitir INSERT
CREATE POLICY "simple_insert" ON user_profiles
  FOR INSERT 
  WITH CHECK (id = auth.uid());

-- PASSO 5: Permitir UPDATE
CREATE POLICY "simple_update" ON user_profiles
  FOR UPDATE 
  USING (id = auth.uid());

-- PASSO 6: Reabilitar RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- PASSO 7: Verificar
SELECT 'Políticas criadas:' as info;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'user_profiles';

SELECT 'RLS Status:' as info;
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'user_profiles';
