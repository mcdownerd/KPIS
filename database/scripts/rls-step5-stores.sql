-- PASSO 5: POLÍTICAS PARA stores
-- Execute após o Passo 4

-- SELECT: Ver sua loja OU ser admin/consultor
CREATE POLICY "stores_select_own_or_admin"
ON stores
FOR SELECT
USING (
  id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid())
  OR
  (SELECT role FROM user_profiles WHERE id = auth.uid()) IN ('admin', 'consultor')
);

-- INSERT: Apenas admins
CREATE POLICY "stores_insert_admin_only"
ON stores
FOR INSERT
WITH CHECK (
  (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
);

-- UPDATE: Apenas admins
CREATE POLICY "stores_update_admin_only"
ON stores
FOR UPDATE
USING (
  (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
);

-- DELETE: Apenas admins
CREATE POLICY "stores_delete_admin_only"
ON stores
FOR DELETE
USING (
  (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
);
