# Guia de Resolução: Problema de Reconhecimento de Admin

## 🔍 Problema Identificado

O sistema está com dificuldade em reconhecer usuários como administradores. Isso geralmente ocorre devido a:

1. **Recursão infinita nas políticas RLS** - As políticas verificam se o usuário é admin consultando a mesma tabela
2. **Dados incorretos no banco** - O campo `role` pode não estar definido como 'admin'
3. **Políticas RLS bloqueando a leitura** - O usuário não consegue ler seu próprio perfil

## 🛠️ Solução Passo a Passo

### Passo 1: Diagnóstico

Execute o script `diagnose_admin_issue.sql` no Supabase SQL Editor para verificar:
- Quantos usuários existem
- Quantos admins existem
- Quais políticas RLS estão ativas
- Se a função `is_admin()` existe

### Passo 2: Aplicar a Correção Principal

Execute o script `fix_admin_recognition_final.sql` no Supabase SQL Editor. Este script:

1. ✅ Cria uma função `is_admin()` com `SECURITY DEFINER` que evita recursão
2. ✅ Remove todas as políticas RLS antigas problemáticas
3. ✅ Cria novas políticas otimizadas sem recursão
4. ✅ Garante que RLS está habilitado

### Passo 3: Verificar/Definir Usuário como Admin

Se o seu usuário ainda não é admin, execute este SQL:

```sql
-- Substitua 'seu-email@exemplo.com' pelo seu email
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'seu-email@exemplo.com';

-- Verificar se funcionou
SELECT id, email, full_name, role, store_id 
FROM user_profiles 
WHERE email = 'seu-email@exemplo.com';
```

### Passo 4: Verificar os Logs no Console

Com os logs de debug adicionados, abra o Console do Navegador (F12) e:

1. Faça login na aplicação
2. Observe os logs que começam com `[AUTH DEBUG]` e `[useAuth]`
3. Verifique se aparece: `✅ USER IS ADMIN`

**Logs esperados para um admin:**
```
[AUTH DEBUG] Current user ID: xxx-xxx-xxx
[AUTH DEBUG] Current user email: seu-email@exemplo.com
[AUTH DEBUG] User profile loaded: { role: 'admin', ... }
[AUTH DEBUG] ✅ USER IS ADMIN
[useAuth] Current state: { isAdmin: true, role: 'admin', ... }
```

### Passo 5: Testar Funcionalidades de Admin

Após aplicar as correções:

1. Faça logout e login novamente
2. Verifique se o card "ADMIN" aparece no dashboard
3. Tente acessar `/admin-dashboard`
4. Verifique se consegue gerenciar usuários

## 🔧 Arquivos Modificados

### Backend (SQL):
- `fix_admin_recognition_final.sql` - Correção principal das políticas RLS
- `diagnose_admin_issue.sql` - Script de diagnóstico

### Frontend (TypeScript):
- `src/lib/api/auth.ts` - Adicionados logs de debug detalhados
- `src/hooks/useAuth.ts` - Adicionados logs de estado

## 📊 Como Funciona a Solução

### Função `is_admin()` com SECURITY DEFINER

```sql
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Por que funciona:**
- `SECURITY DEFINER` executa a função com privilégios do criador (superusuário)
- Evita recursão porque não depende das políticas RLS
- Retorna apenas true/false, sem expor dados

### Políticas RLS Simplificadas

```sql
-- SELECT: Usuários veem seu perfil OU admins veem todos
CREATE POLICY "user_profiles_select_policy" ON user_profiles
  FOR SELECT 
  USING (
    auth.uid() = id OR public.is_admin()
  );
```

**Vantagens:**
- ✅ Sem recursão
- ✅ Simples e eficiente
- ✅ Fácil de entender e manter

## 🚨 Problemas Comuns e Soluções

### Problema: "Error getting user profile: PGRST116"
**Causa:** Políticas RLS bloqueando acesso
**Solução:** Execute `fix_admin_recognition_final.sql`

### Problema: "isAdmin: false" mesmo sendo admin
**Causa:** Campo `role` não está definido como 'admin'
**Solução:** Execute o UPDATE no Passo 3

### Problema: Logs não aparecem
**Causa:** Cache do navegador
**Solução:** Ctrl+Shift+R para hard refresh

### Problema: "Function is_admin() does not exist"
**Causa:** Script não foi executado completamente
**Solução:** Execute novamente `fix_admin_recognition_final.sql`

## ✅ Checklist de Verificação

- [ ] Script `diagnose_admin_issue.sql` executado
- [ ] Script `fix_admin_recognition_final.sql` executado sem erros
- [ ] Campo `role` do usuário definido como 'admin'
- [ ] Logout e login realizados
- [ ] Logs `[AUTH DEBUG]` aparecem no console
- [ ] Log mostra `✅ USER IS ADMIN`
- [ ] Card "ADMIN" visível no dashboard
- [ ] Acesso a `/admin-dashboard` funciona

## 📞 Próximos Passos

Se após seguir todos os passos o problema persistir:

1. Compartilhe os logs do console (F12 → Console)
2. Execute e compartilhe o resultado de `diagnose_admin_issue.sql`
3. Verifique se há erros no terminal do servidor

## 🎯 Resultado Esperado

Após aplicar todas as correções:
- ✅ Usuários admin são reconhecidos corretamente
- ✅ Políticas RLS funcionam sem recursão
- ✅ Logs de debug ajudam a identificar problemas
- ✅ Sistema funciona de forma estável e previsível
