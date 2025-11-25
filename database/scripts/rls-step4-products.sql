-- PASSO 4: POLÍTICAS PARA products
-- Execute após o Passo 3

-- SELECT: Ver produtos da sua loja OU ser admin/consultor
CREATE POLICY "products_select_by_store_or_role"
ON products
FOR SELECT
USING (
  store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid())
  OR
  (SELECT role FROM user_profiles WHERE id = auth.uid()) IN ('admin', 'consultor')
);

-- INSERT: Apenas gerentes e admins
CREATE POLICY "products_insert_manager_admin"
ON products
FOR INSERT
WITH CHECK (
  (SELECT role FROM user_profiles WHERE id = auth.uid()) IN ('admin', 'gerente')
);

-- UPDATE: Gerentes e admins
CREATE POLICY "products_update_manager_admin"
ON products
FOR UPDATE
USING (
  (SELECT role FROM user_profiles WHERE id = auth.uid()) IN ('admin', 'gerente')
);

-- DELETE: Apenas admins
CREATE POLICY "products_delete_admin_only"
ON products
FOR DELETE
USING (
  (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
);
