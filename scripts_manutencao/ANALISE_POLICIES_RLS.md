# 🔒 Análise de Políticas RLS (Row Level Security) - Supabase

## 📊 Resumo Executivo

Analisamos as políticas de segurança (RLS) das suas tabelas no Supabase. Encontramos **problemas de segurança críticos** que precisam ser corrigidos.

### ⚠️ Problemas Encontrados:
1. ❌ Tabela `stores` **SEM RLS** - Totalmente pública!
2. ⚠️ Tabela `products` - Políticas de UPDATE/DELETE incorretas
3. ⚠️ Tabela `products` - Acesso de leitura totalmente público
4. ✅ Tabela `user_profiles` - Políticas corretas

---

## 📋 Análise Detalhada por Tabela

### 1. 📦 Tabela `products`

**Status RLS:** ✅ Habilitado

**Políticas Encontradas:**

| Política | Operação | Condição | Status | Problema |
|----------|----------|----------|--------|----------|
| Enable read access for all users | SELECT | `true` | ⚠️ INSEGURO | Qualquer pessoa pode ler TODOS os produtos |
| Policy_name | SELECT | `true` | ⚠️ DUPLICADO | Política duplicada de leitura |
| Enable insert for authenticated users only | INSERT | `auth.role() = 'authenticated'` | ✅ OK | Apenas usuários logados podem inserir |
| Enable update for users based on email | UPDATE | `auth.uid() = id` | ❌ INCORRETO | `id` é o ID do produto, não do usuário! |
| Enable delete for users based on user_id | DELETE | `auth.uid() = user_id` | ❌ INCORRETO | Coluna `user_id` não existe na tabela! |

**Problemas Identificados:**

1. **Leitura Pública Total**: Qualquer pessoa com a API key pode ler todos os produtos de todas as lojas
2. **UPDATE Incorreto**: A política compara `auth.uid()` com `id` (ID do produto), quando deveria comparar com `created_by` ou verificar o `store_id`
3. **DELETE Incorreto**: Referencia coluna `user_id` que não existe. Deveria usar `created_by` ou `store_id`
4. **Política Duplicada**: Duas políticas SELECT com `true`

---

### 2. 👤 Tabela `user_profiles`

**Status RLS:** ✅ Habilitado

**Políticas Encontradas:**

| Política | Operação | Condição | Status |
|----------|----------|----------|--------|
| Users can view own profile | SELECT | `auth.uid() = id` | ✅ CORRETO |
| Users can update own profile | UPDATE | `auth.uid() = id` | ✅ CORRETO |

**Avaliação:** ✅ **POLÍTICAS CORRETAS**

- Usuários só podem ver e editar seus próprios perfis
- Implementação correta de segurança

**Faltando:**
- Política INSERT (para criação de perfil no registro)
- Política para admins gerenciarem outros perfis

---

### 3. 🏪 Tabela `stores`

**Status RLS:** ❌ **DESABILITADO**

**Políticas Encontradas:** Nenhuma

**Problema Crítico:** 
- ⚠️ **TABELA TOTALMENTE PÚBLICA!**
- Qualquer pessoa com a API key pode:
  - Ler todas as lojas
  - Criar novas lojas
  - Modificar lojas existentes
  - Deletar lojas

**Risco:** 🔴 **CRÍTICO**

---

### 4. 📋 Outras Tabelas (deliveries, utilities, product_history)

**Status:** Não analisadas ainda, mas provavelmente têm problemas similares.

---

## 🔧 Recomendações de Correção

### Prioridade 1: CRÍTICO 🔴

#### 1. Habilitar RLS na tabela `stores`

Execute este SQL no **SQL Editor**:

```sql
-- Habilitar RLS
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem ver lojas
CREATE POLICY "Anyone can view stores" ON stores
  FOR SELECT USING (true);

-- Política: Apenas admins podem criar lojas
CREATE POLICY "Only admins can create stores" ON stores
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Política: Apenas admins podem atualizar lojas
CREATE POLICY "Only admins can update stores" ON stores
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Política: Apenas admins podem deletar lojas
CREATE POLICY "Only admins can delete stores" ON stores
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

### Prioridade 2: ALTO ⚠️

#### 2. Corrigir políticas da tabela `products`

Execute este SQL:

```sql
-- REMOVER políticas incorretas
DROP POLICY IF EXISTS "Enable update for users based on email" ON products;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON products;
DROP POLICY IF EXISTS "Policy_name" ON products;
DROP POLICY IF EXISTS "Enable read access for all users" ON products;

-- CRIAR políticas corretas

-- Leitura: Usuários veem produtos da sua loja
CREATE POLICY "Users can view products from their store" ON products
  FOR SELECT USING (
    store_id IN (
      SELECT store_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- Inserção: Usuários podem adicionar produtos à sua loja
CREATE POLICY "Users can insert products to their store" ON products
  FOR INSERT WITH CHECK (
    store_id IN (
      SELECT store_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- Atualização: Usuários podem atualizar produtos da sua loja
CREATE POLICY "Users can update products from their store" ON products
  FOR UPDATE USING (
    store_id IN (
      SELECT store_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- Exclusão: Usuários podem deletar produtos da sua loja
CREATE POLICY "Users can delete products from their store" ON products
  FOR DELETE USING (
    store_id IN (
      SELECT store_id FROM user_profiles WHERE id = auth.uid()
    )
  );
```

---

### Prioridade 3: MÉDIO 🟡

#### 3. Adicionar políticas faltantes em `user_profiles`

```sql
-- Permitir criação de perfil no registro
CREATE POLICY "Users can create their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Admins podem ver todos os perfis
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins podem atualizar qualquer perfil
CREATE POLICY "Admins can update any profile" ON user_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

### Prioridade 4: MÉDIO 🟡

#### 4. Proteger outras tabelas (deliveries, utilities, product_history)

```sql
-- DELIVERIES
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view deliveries from their store" ON deliveries
  FOR SELECT USING (
    store_id IN (
      SELECT store_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert deliveries to their store" ON deliveries
  FOR INSERT WITH CHECK (
    store_id IN (
      SELECT store_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- UTILITIES
ALTER TABLE utilities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view utilities from their store" ON utilities
  FOR SELECT USING (
    store_id IN (
      SELECT store_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert utilities to their store" ON utilities
  FOR INSERT WITH CHECK (
    store_id IN (
      SELECT store_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- PRODUCT_HISTORY
ALTER TABLE product_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view product history from their store" ON product_history
  FOR SELECT USING (
    product_id IN (
      SELECT id FROM products WHERE store_id IN (
        SELECT store_id FROM user_profiles WHERE id = auth.uid()
      )
    )
  );
```

---

## 🎯 Script Completo de Correção

Para facilitar, aqui está um script SQL completo que corrige TUDO:

```sql
-- ============================================
-- SCRIPT DE CORREÇÃO DE POLÍTICAS RLS
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- 1. CORRIGIR TABELA STORES
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view stores" ON stores;
DROP POLICY IF EXISTS "Only admins can create stores" ON stores;
DROP POLICY IF EXISTS "Only admins can update stores" ON stores;
DROP POLICY IF EXISTS "Only admins can delete stores" ON stores;

CREATE POLICY "Anyone can view stores" ON stores
  FOR SELECT USING (true);

CREATE POLICY "Only admins can create stores" ON stores
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can update stores" ON stores
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can delete stores" ON stores
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 2. CORRIGIR TABELA PRODUCTS
DROP POLICY IF EXISTS "Enable update for users based on email" ON products;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON products;
DROP POLICY IF EXISTS "Policy_name" ON products;
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON products;

CREATE POLICY "Users can view products from their store" ON products
  FOR SELECT USING (
    store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert products to their store" ON products
  FOR INSERT WITH CHECK (
    store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can update products from their store" ON products
  FOR UPDATE USING (
    store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can delete products from their store" ON products
  FOR DELETE USING (
    store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid())
  );

-- 3. MELHORAR TABELA USER_PROFILES
DROP POLICY IF EXISTS "Users can create their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON user_profiles;

CREATE POLICY "Users can create their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update any profile" ON user_profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 4. PROTEGER DELIVERIES
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view deliveries from their store" ON deliveries;
DROP POLICY IF EXISTS "Users can insert deliveries to their store" ON deliveries;

CREATE POLICY "Users can view deliveries from their store" ON deliveries
  FOR SELECT USING (
    store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert deliveries to their store" ON deliveries
  FOR INSERT WITH CHECK (
    store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid())
  );

-- 5. PROTEGER UTILITIES
ALTER TABLE utilities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view utilities from their store" ON utilities;
DROP POLICY IF EXISTS "Users can insert utilities to their store" ON utilities;

CREATE POLICY "Users can view utilities from their store" ON utilities
  FOR SELECT USING (
    store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert utilities to their store" ON utilities
  FOR INSERT WITH CHECK (
    store_id IN (SELECT store_id FROM user_profiles WHERE id = auth.uid())
  );

-- 6. PROTEGER PRODUCT_HISTORY
ALTER TABLE product_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view product history from their store" ON product_history;

CREATE POLICY "Users can view product history from their store" ON product_history
  FOR SELECT USING (
    product_id IN (
      SELECT id FROM products WHERE store_id IN (
        SELECT store_id FROM user_profiles WHERE id = auth.uid()
      )
    )
  );

-- ============================================
-- FIM DO SCRIPT
-- ============================================
```

---

## ✅ Checklist de Execução

- [ ] 1. Copiei o script completo acima
- [ ] 2. Acessei o SQL Editor do Supabase
- [ ] 3. Colei o script no editor
- [ ] 4. Executei o script (Run)
- [ ] 5. Verifiquei que não houve erros
- [ ] 6. Testei a aplicação para confirmar que ainda funciona
- [ ] 7. Verifiquei que usuários só veem dados da sua loja

---

## 🔍 Como Verificar se Funcionou

Após executar o script:

1. Vá em **Table Editor → products → RLS policies**
2. Deve ver 4 políticas novas (view, insert, update, delete)
3. Todas devem verificar `store_id`

4. Vá em **Table Editor → stores → RLS policies**
5. Deve ver "RLS enabled"
6. Deve ver 4 políticas (view, insert, update, delete)

---

## ⚠️ IMPORTANTE - Antes de Executar

**FAÇA BACKUP!** Embora o script seja seguro, é sempre bom ter um backup:

1. Vá em **Database → Backups**
2. Crie um backup manual antes de executar

---

## 📊 Impacto das Mudanças

### Antes:
- ❌ Qualquer um podia ver/modificar lojas
- ❌ Qualquer um podia ver todos os produtos
- ❌ Políticas de UPDATE/DELETE não funcionavam

### Depois:
- ✅ Apenas admins podem gerenciar lojas
- ✅ Usuários só veem produtos da sua loja
- ✅ Políticas corretas baseadas em `store_id`
- ✅ Todas as tabelas protegidas

---

**Quer que eu execute este script para você ou prefere revisar primeiro?** 🔒
