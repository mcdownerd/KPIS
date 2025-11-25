-- PASSO 3: POLÍTICAS PARA user_profiles
-- Execute após o Passo 2

CREATE POLICY "user_profiles_select_own"
ON user_profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "user_profiles_update_own"
ON user_profiles
FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "user_profiles_insert_own"
ON user_profiles
FOR INSERT
WITH CHECK (auth.uid() = id);
