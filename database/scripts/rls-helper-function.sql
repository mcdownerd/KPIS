-- ============================================
-- FUNÇÃO HELPER PARA RLS (SECURITY DEFINER)
-- ============================================
-- Esta função retorna o store_id do usuário atual de forma segura,
-- ignorando as policies da tabela user_profiles para evitar recursão infinita.

CREATE OR REPLACE FUNCTION get_user_store_id()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER -- Executa com permissões do criador da função (admin), ignorando RLS
SET search_path = public -- Segurança: define o schema
AS $$
DECLARE
  current_store_id text;
BEGIN
  -- Busca o store_id do usuário logado
  SELECT store_id::text INTO current_store_id
  FROM user_profiles
  WHERE id = auth.uid();

  RETURN current_store_id;
END;
$$;

-- Garantir que usuários autenticados possam executar a função
GRANT EXECUTE ON FUNCTION get_user_store_id() TO authenticated;
