# ✅ Configuração do Supabase - Resumo

## 🎉 O que foi feito automaticamente:

### 1. Instalação e Configuração Base
- ✅ Instalado `@supabase/supabase-js`
- ✅ Criado arquivo `.env` com suas credenciais
- ✅ Adicionado `.env` ao `.gitignore` (segurança)
- ✅ Configurado cliente Supabase em `src/lib/supabase.ts`

### 2. APIs Criadas

#### Autenticação (`src/lib/api/auth.ts`)
- `signUp()` - Registrar novo usuário
- `signIn()` - Fazer login
- `signOut()` - Fazer logout
- `getCurrentUser()` - Obter usuário atual
- `getCurrentUserProfile()` - Obter perfil completo
- `isUserAdmin()` - Verificar se é admin
- `resetPassword()` - Resetar senha
- `updatePassword()` - Atualizar senha
- `onAuthStateChange()` - Escutar mudanças de autenticação

#### Produtos (`src/lib/api/products.ts`)
- `getProducts()` - Listar todos os produtos
- `getProductById()` - Buscar produto específico
- `createProduct()` - Criar novo produto
- `updateProduct()` - Atualizar produto
- `deleteProduct()` - Deletar produto
- `getProductHistory()` - Ver histórico de alterações
- `getProductsExpiringSoon()` - Produtos vencendo em breve
- `getProductsByCategory()` - Filtrar por categoria
- `searchProducts()` - Buscar por nome

### 3. Componentes e Hooks

#### Hook de Autenticação (`src/hooks/useAuth.ts`)
```tsx
const { user, profile, loading, isAdmin, hasStore } = useAuth()
```

#### Página de Login (`src/pages/Login.tsx`)
- Formulário de login
- Formulário de registro
- Validação de campos
- Mensagens de erro/sucesso

#### Exemplo de Uso (`src/components/examples/ProductsExample.tsx`)
- Demonstra como usar as funções de produtos
- CRUD completo (Create, Read, Update, Delete)

### 4. Banco de Dados

#### Schema SQL (`supabase-schema.sql`)
Tabelas criadas:
- `profiles` - Perfis de usuários
- `stores` - Lojas
- `products` - Produtos e validades
- `product_history` - Histórico de alterações
- `utilities` - Consumos (água, luz, gás)
- `deliveries` - Entregas

Recursos incluídos:
- ✅ Row Level Security (RLS) - Segurança por linha
- ✅ Políticas de acesso - Usuários só veem dados da sua loja
- ✅ Índices para performance
- ✅ Triggers para atualizar timestamps automaticamente
- ✅ Funções auxiliares

---

## 📋 O QUE VOCÊ PRECISA FAZER AGORA:

### Passo 1: Executar o SQL no Supabase ⚠️ IMPORTANTE

1. Acesse: https://supabase.com/dashboard/project/rftuoqayjybvurdtfjls
2. Faça login
3. Vá em **SQL Editor** (menu lateral)
4. Clique em **New Query**
5. Abra o arquivo `supabase-schema.sql`
6. Copie TODO o conteúdo
7. Cole no SQL Editor
8. Clique em **Run** (ou Ctrl+Enter)
9. Aguarde aparecer "Success"

### Passo 2: Verificar Tabelas

1. Vá em **Table Editor**
2. Verifique se as 6 tabelas foram criadas:
   - profiles
   - stores
   - products
   - product_history
   - utilities
   - deliveries

### Passo 3: Criar Usuário Admin

**Opção A: Via Interface**
1. **Authentication → Users → Add user**
2. Preencha email e senha
3. **Table Editor → profiles**
4. Edite o usuário criado
5. Mude `role` para `'admin'`

**Opção B: Via SQL**
```sql
-- Após criar usuário em Authentication → Users
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'seu-email@exemplo.com';
```

### Passo 4: Criar Loja

1. **Table Editor → stores → Insert row**
2. Preencha:
   - `name`: "P.Borges - Loja Principal"
   - `location`: "Lisboa"
3. **Copie o ID gerado** (você vai precisar)

### Passo 5: Associar Usuário à Loja

1. **Table Editor → profiles**
2. Encontre seu usuário
3. Edite `store_id` e cole o ID da loja

### Passo 6: Testar

1. Reinicie o servidor: `npm run dev`
2. Acesse a aplicação
3. Teste o login (se já adicionou a rota)

---

## 🚀 Como Usar nos Componentes

### Exemplo 1: Usar Autenticação

```tsx
import { useAuth } from '@/hooks/useAuth'

function MeuComponente() {
  const { user, profile, loading, isAdmin } = useAuth()

  if (loading) return <div>Carregando...</div>
  if (!user) return <div>Faça login</div>

  return (
    <div>
      <h1>Olá, {profile?.full_name}!</h1>
      {isAdmin && <p>Você é administrador</p>}
    </div>
  )
}
```

### Exemplo 2: Listar Produtos

```tsx
import { useEffect, useState } from 'react'
import { getProducts } from '@/lib/api/products'

function ListaProdutos() {
  const [produtos, setProdutos] = useState([])

  useEffect(() => {
    async function carregar() {
      const data = await getProducts()
      setProdutos(data)
    }
    carregar()
  }, [])

  return (
    <div>
      {produtos.map(p => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  )
}
```

### Exemplo 3: Criar Produto

```tsx
import { createProduct } from '@/lib/api/products'

async function adicionarProduto() {
  const novoProduto = await createProduct({
    category: 'Laticínios',
    name: 'Leite',
    expiry_date: '2025-12-31',
    dlc_type: 'Primária',
    daysToExpiry: 0,
    status: 'OK',
  })
  
  console.log('Produto criado:', novoProduto)
}
```

---

## 📁 Estrutura de Arquivos Criados

```
planilha-app-maker-main-main/
├── .env                          # ⚠️ Credenciais (NÃO commitar!)
├── supabase-schema.sql           # Schema do banco
├── SUPABASE_SETUP.md            # Guia completo
├── RESUMO_SUPABASE.md           # Este arquivo
├── src/
│   ├── lib/
│   │   ├── supabase.ts          # Cliente Supabase
│   │   └── api/
│   │       ├── auth.ts          # Funções de autenticação
│   │       └── products.ts      # Funções de produtos
│   ├── hooks/
│   │   └── useAuth.ts           # Hook de autenticação
│   ├── pages/
│   │   └── Login.tsx            # Página de login
│   └── components/
│       └── examples/
│           └── ProductsExample.tsx  # Exemplo de uso
```

---

## ⚠️ IMPORTANTE - Segurança

### NÃO commitar o arquivo `.env`!
- Já está no `.gitignore`
- Contém credenciais sensíveis
- Se clonar em outro PC, crie novo `.env`

### Credenciais do Supabase
```env
VITE_SUPABASE_URL=https://rftuoqayjybvurdtfjls.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🆘 Problemas Comuns

### "Missing Supabase environment variables"
- Verifique se `.env` existe
- Variáveis devem começar com `VITE_`
- Reinicie o servidor

### "relation does not exist"
- Execute o `supabase-schema.sql` no SQL Editor
- Verifique se as tabelas foram criadas

### "row-level security policy"
- Usuário precisa estar autenticado
- `store_id` precisa estar configurado
- Verifique as políticas RLS

---

## 📚 Documentação

- [Guia Completo](./SUPABASE_SETUP.md)
- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)

---

## ✅ Checklist Final

- [ ] Executei o SQL no Supabase
- [ ] Verifiquei que as 6 tabelas foram criadas
- [ ] Criei um usuário admin
- [ ] Criei uma loja
- [ ] Associei o usuário à loja
- [ ] Reiniciei o servidor (`npm run dev`)
- [ ] Testei o login (se aplicável)

---

**Pronto! Sua aplicação está configurada com Supabase! 🎉**

Se tiver dúvidas, consulte o `SUPABASE_SETUP.md` ou a documentação oficial.
