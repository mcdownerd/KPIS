# 🚀 Configuração do Supabase - Planilha App Maker

Este guia vai te ajudar a configurar completamente o Supabase para o aplicativo.

## ✅ Status da Configuração

- [x] Cliente Supabase instalado (`@supabase/supabase-js`)
- [x] Arquivo `.env` criado com credenciais
- [x] Cliente Supabase configurado em `src/lib/supabase.ts`
- [x] Funções de API criadas para produtos e autenticação
- [x] Schema SQL preparado
- [ ] **PENDENTE**: Executar SQL no Supabase
- [ ] **PENDENTE**: Testar autenticação
- [ ] **PENDENTE**: Integrar com componentes existentes

---

## 📋 Passo a Passo para Completar a Configuração

### 1️⃣ Executar o Schema SQL no Supabase

1. Acesse seu projeto no Supabase: https://supabase.com/dashboard/project/rftuoqayjybvurdtfjls
2. Faça login se necessário
3. Vá em **SQL Editor** (menu lateral esquerdo)
4. Clique em **New Query**
5. Copie todo o conteúdo do arquivo `supabase-schema.sql`
6. Cole no editor SQL
7. Clique em **Run** (ou pressione Ctrl+Enter)
8. Aguarde a execução (deve aparecer "Success" quando terminar)

### 2️⃣ Verificar as Tabelas Criadas

Após executar o SQL, vá em **Table Editor** e verifique se as seguintes tabelas foram criadas:

- ✅ `profiles` - Perfis de usuários
- ✅ `stores` - Lojas
- ✅ `products` - Produtos e validades
- ✅ `product_history` - Histórico de alterações
- ✅ `utilities` - Consumos (água, luz, gás)
- ✅ `deliveries` - Entregas

### 3️⃣ Configurar Autenticação (Opcional mas Recomendado)

1. Vá em **Authentication → Providers**
2. Habilite **Email** (já deve estar habilitado por padrão)
3. Configure as opções:
   - ✅ Enable email confirmations (se quiser validação por email)
   - ✅ Enable email change confirmations
   - ✅ Secure email change

### 4️⃣ Criar Primeiro Usuário Admin

Você pode criar um usuário admin de duas formas:

**Opção A: Via Interface do Supabase**
1. Vá em **Authentication → Users**
2. Clique em **Add user**
3. Preencha email e senha
4. Após criar, vá em **Table Editor → profiles**
5. Encontre o usuário criado
6. Edite o campo `role` para `'admin'`

**Opção B: Via SQL**
```sql
-- Primeiro, crie o usuário via Authentication → Users
-- Depois, atualize o role:
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'seu-email@exemplo.com';
```

### 5️⃣ Criar uma Loja (Store)

1. Vá em **Table Editor → stores**
2. Clique em **Insert row**
3. Preencha:
   - `name`: Nome da loja (ex: "P.Borges - Loja Principal")
   - `location`: Localização (ex: "Lisboa")
4. Copie o `id` gerado (você vai precisar dele)

### 6️⃣ Associar Usuário à Loja

1. Vá em **Table Editor → profiles**
2. Encontre seu usuário
3. Edite o campo `store_id` e cole o ID da loja que você criou

---

## 🔧 Arquivos Criados

### Configuração Base
- `.env` - Variáveis de ambiente com credenciais do Supabase
- `src/lib/supabase.ts` - Cliente Supabase configurado

### APIs
- `src/lib/api/auth.ts` - Funções de autenticação
  - `signUp()` - Registrar novo usuário
  - `signIn()` - Login
  - `signOut()` - Logout
  - `getCurrentUser()` - Obter usuário atual
  - `getCurrentUserProfile()` - Obter perfil completo
  - `isUserAdmin()` - Verificar se é admin

- `src/lib/api/products.ts` - Funções de produtos
  - `getProducts()` - Listar todos os produtos
  - `getProductById()` - Buscar produto por ID
  - `createProduct()` - Criar novo produto
  - `updateProduct()` - Atualizar produto
  - `deleteProduct()` - Deletar produto
  - `getProductHistory()` - Histórico de alterações
  - `getProductsExpiringSoon()` - Produtos próximos do vencimento
  - `getProductsByCategory()` - Filtrar por categoria
  - `searchProducts()` - Buscar por nome

### Schema
- `supabase-schema.sql` - Schema completo do banco de dados

---

## 🎯 Próximos Passos

Após completar a configuração acima, você pode:

1. **Testar a Autenticação**
   - Criar uma página de login
   - Testar registro de novos usuários
   - Implementar proteção de rotas

2. **Integrar com Componentes Existentes**
   - Atualizar `Products.tsx` para usar `getProducts()`
   - Adicionar formulários de criação/edição
   - Implementar filtros e busca

3. **Adicionar Funcionalidades**
   - Upload de imagens de produtos
   - Notificações de produtos vencendo
   - Relatórios e dashboards

---

## 🔒 Segurança

### Row Level Security (RLS)

O schema já inclui políticas RLS que garantem:
- ✅ Usuários só veem dados da sua loja
- ✅ Apenas admins podem gerenciar usuários
- ✅ Histórico de alterações é rastreado

### Variáveis de Ambiente

⚠️ **IMPORTANTE**: O arquivo `.env` está no `.gitignore` e **NÃO** deve ser commitado ao Git!

Se você clonar o projeto em outro lugar, precisará criar um novo `.env` com:
```env
VITE_SUPABASE_URL=https://rftuoqayjybvurdtfjls.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
```

---

## 📚 Documentação Útil

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

---

## ❓ Problemas Comuns

### Erro: "Missing Supabase environment variables"
- Verifique se o arquivo `.env` existe na raiz do projeto
- Certifique-se de que as variáveis começam com `VITE_`
- Reinicie o servidor de desenvolvimento (`npm run dev`)

### Erro: "relation does not exist"
- Você precisa executar o `supabase-schema.sql` no SQL Editor
- Verifique se todas as tabelas foram criadas em Table Editor

### Erro: "new row violates row-level security policy"
- Certifique-se de que o usuário está autenticado
- Verifique se o `store_id` do usuário está configurado
- Confira as políticas RLS no Supabase

---

## 🎉 Tudo Pronto!

Após seguir todos os passos, sua aplicação estará conectada ao Supabase e pronta para uso!

Se tiver dúvidas, consulte a documentação ou peça ajuda! 🚀
