# 🔧 Comandos Úteis - Supabase

## Comandos SQL Úteis

### Ver todos os usuários
```sql
SELECT * FROM profiles;
```

### Ver todas as lojas
```sql
SELECT * FROM stores;
```

### Ver todos os produtos
```sql
SELECT * FROM products;
```

### Tornar um usuário admin
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'seu-email@exemplo.com';
```

### Associar usuário a uma loja
```sql
UPDATE profiles 
SET store_id = 'ID_DA_LOJA_AQUI'
WHERE email = 'seu-email@exemplo.com';
```

### Ver produtos vencendo em breve (próximos 7 dias)
```sql
SELECT * FROM products
WHERE expiry_date <= CURRENT_DATE + INTERVAL '7 days'
ORDER BY expiry_date ASC;
```

### Ver produtos por categoria
```sql
SELECT * FROM products
WHERE category = 'Laticínios'
ORDER BY expiry_date ASC;
```

### Ver histórico de um produto
```sql
SELECT 
  ph.*,
  p.full_name as updated_by_name
FROM product_history ph
LEFT JOIN profiles p ON ph.updated_by = p.id
WHERE ph.product_id = 'ID_DO_PRODUTO_AQUI'
ORDER BY ph.updated_at DESC;
```

### Deletar todos os produtos (CUIDADO!)
```sql
DELETE FROM products;
```

### Resetar sequência de IDs (se necessário)
```sql
-- Não aplicável para UUID, mas útil para outras tabelas
ALTER SEQUENCE products_id_seq RESTART WITH 1;
```

---

## Comandos NPM

### Instalar dependências
```bash
npm install
```

### Rodar em desenvolvimento
```bash
npm run dev
```

### Build para produção
```bash
npm run build
```

### Preview da build
```bash
npm run preview
```

### Lint
```bash
npm run lint
```

---

## Comandos Git

### Ver status
```bash
git status
```

### Adicionar arquivos (NUNCA adicione .env!)
```bash
git add .
```

### Commit
```bash
git commit -m "Configurado Supabase"
```

### Push
```bash
git push
```

### Verificar se .env está ignorado
```bash
git check-ignore .env
# Deve retornar: .env
```

---

## Snippets de Código Úteis

### Verificar se usuário está logado
```tsx
import { useAuth } from '@/hooks/useAuth'

function MeuComponente() {
  const { user, loading } = useAuth()
  
  if (loading) return <div>Carregando...</div>
  if (!user) return <Navigate to="/login" />
  
  return <div>Conteúdo protegido</div>
}
```

### Proteger rota apenas para admin
```tsx
import { useAuth } from '@/hooks/useAuth'

function AdminPage() {
  const { isAdmin, loading } = useAuth()
  
  if (loading) return <div>Carregando...</div>
  if (!isAdmin) return <div>Acesso negado</div>
  
  return <div>Área administrativa</div>
}
```

### Fazer logout
```tsx
import { signOut } from '@/lib/api/auth'
import { useNavigate } from 'react-router-dom'

function LogoutButton() {
  const navigate = useNavigate()
  
  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }
  
  return <Button onClick={handleLogout}>Sair</Button>
}
```

### Buscar produtos com filtro
```tsx
import { getProductsByCategory } from '@/lib/api/products'

async function buscarLaticinios() {
  const produtos = await getProductsByCategory('Laticínios')
  console.log(produtos)
}
```

### Criar produto com validação
```tsx
import { createProduct } from '@/lib/api/products'
import { useToast } from '@/hooks/use-toast'

function AdicionarProduto() {
  const { toast } = useToast()
  
  const adicionar = async () => {
    try {
      const produto = await createProduct({
        category: 'Laticínios',
        name: 'Leite',
        expiry_date: '2025-12-31',
        dlc_type: 'Primária',
        daysToExpiry: 0,
        status: 'OK',
      })
      
      toast({
        title: 'Sucesso!',
        description: 'Produto adicionado',
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar',
        variant: 'destructive',
      })
    }
  }
  
  return <Button onClick={adicionar}>Adicionar</Button>
}
```

---

## Variáveis de Ambiente

### .env (desenvolvimento)
```env
VITE_SUPABASE_URL=https://rftuoqayjybvurdtfjls.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Acessar no código
```tsx
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
```

---

## Troubleshooting

### Erro: "Invalid API key"
- Verifique se a chave no `.env` está correta
- Copie novamente do Supabase (Settings → API)
- Reinicie o servidor

### Erro: "Failed to fetch"
- Verifique sua conexão com internet
- Confirme que o projeto Supabase está ativo
- Verifique a URL do projeto

### Erro: "User not found"
- Certifique-se de que criou o usuário
- Verifique se o email está correto
- Confirme que o usuário está na tabela `profiles`

### Produtos não aparecem
- Verifique se o `store_id` do produto corresponde ao do usuário
- Confirme que as políticas RLS estão ativas
- Teste com um usuário admin

---

## Links Úteis

- **Seu Projeto**: https://supabase.com/dashboard/project/rftuoqayjybvurdtfjls
- **SQL Editor**: https://supabase.com/dashboard/project/rftuoqayjybvurdtfjls/sql
- **Table Editor**: https://supabase.com/dashboard/project/rftuoqayjybvurdtfjls/editor
- **Authentication**: https://supabase.com/dashboard/project/rftuoqayjybvurdtfjls/auth/users
- **API Settings**: https://supabase.com/dashboard/project/rftuoqayjybvurdtfjls/settings/api

---

## Dicas de Performance

### 1. Use React Query para cache
```tsx
import { useQuery } from '@tanstack/react-query'
import { getProducts } from '@/lib/api/products'

function ListaProdutos() {
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })
  
  if (isLoading) return <div>Carregando...</div>
  
  return <div>{data?.map(p => ...)}</div>
}
```

### 2. Limite resultados
```tsx
const { data } = await supabase
  .from('products')
  .select('*')
  .limit(10)
```

### 3. Use paginação
```tsx
const { data } = await supabase
  .from('products')
  .select('*')
  .range(0, 9) // Primeiros 10 itens
```

---

**Mantenha este arquivo como referência rápida! 📌**
