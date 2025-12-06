# Permissões por Role - Sistema Atualizado

## ❌ Não Existe Role "Consultor"

O sistema atual possui apenas 4 roles:
- `admin`
- `supervisor`
- `gerente`
- `user`

---

## 📋 Permissões Detalhadas

### 1. **Admin** (`admin`)
**Status**: Acesso total ao sistema

| Funcionalidade | Permissão |
|----------------|-----------|
| Criar produtos | ✅ |
| Editar produtos (completo) | ✅ |
| Deletar produtos | ✅ |
| Ver produtos | ✅ Todas as lojas |
| Filtrar por loja | ✅ |
| Dashboard administrativo | ✅ |
| Gerenciar usuários | ✅ |
| Aprovar novos usuários | ✅ |
| Ver histórico | ✅ |
| Editar categorias | ✅ |
| **Requer store_id** | ❌ Não |

---

### 2. **Supervisor** (`supervisor`)
**Status**: Quase admin, sem gerenciar usuários

| Funcionalidade | Permissão |
|----------------|-----------|
| Criar produtos | ✅ |
| Editar produtos (completo) | ✅ |
| Deletar produtos | ✅ |
| Ver produtos | ✅ Todas as lojas |
| Filtrar por loja | ✅ |
| Dashboard administrativo | ❌ |
| Gerenciar usuários | ❌ |
| Ver histórico | ✅ |
| **Requer store_id** | ❌ Não |

---

### 3. **Gerente** (`gerente`)
**Status**: Apenas visualização e edição de datas

| Funcionalidade | Permissão |
|----------------|-----------|
| Criar produtos | ❌ |
| Editar produtos (completo) | ❌ |
| Editar datas de validade | ✅ Apenas datas |
| Deletar produtos | ❌ |
| Ver produtos | ✅ Sua loja apenas |
| Dashboard administrativo | ✅ Limitado |
| Ver histórico | ✅ |
| **Requer store_id** | ✅ **SIM** |

**Campos editáveis no diálogo:**
- ✅ Data de validade
- ✅ Observação
- ❌ Nome, Categoria, Subcategoria, Tipo DLC (bloqueados)

---

### 4. **User** (`user`)
**Status**: Operações normais, mas **REQUER APROVAÇÃO**

#### 🔒 **User SEM store_id** (Não aprovado)
**Bloqueado até admin aprovar**

| Funcionalidade | Permissão |
|----------------|-----------|
| Acessar aplicação | ❌ **BLOQUEADO** |
| Ver produtos | ❌ |
| Criar/Editar/Deletar | ❌ |

**Mensagem exibida:**
```
Acesso Restrito
Você precisa estar associado a uma loja para acessar esta página.
Entre em contato com o administrador.
```

#### ✅ **User COM store_id** (Aprovado)
**Acesso normal após aprovação**

| Funcionalidade | Permissão |
|----------------|-----------|
| Criar produtos | ✅ |
| Editar produtos (completo) | ✅ |
| Deletar produtos | ✅ |
| Ver produtos | ✅ Sua loja apenas |
| Dashboard administrativo | ❌ |
| Ver histórico | ✅ |
| **Requer store_id** | ✅ **SIM** |

---

## 🔐 Fluxo de Aprovação

1. **Novo usuário se registra** → `role: 'user'`, `store_id: null`
2. **Tenta acessar aplicação** → Vê mensagem de "Acesso Restrito"
3. **Admin aprova** → Atribui `store_id` ao usuário
4. **Usuário faz logout/login** → Agora tem acesso completo à sua loja

---

## 📊 Resumo Comparativo

| Role | Acesso sem store_id | Criar | Editar | Deletar | Ver Lojas | Admin Dashboard |
|------|---------------------|-------|--------|---------|-----------|-----------------|
| **admin** | ✅ | ✅ | ✅ | ✅ | Todas | ✅ |
| **supervisor** | ✅ | ✅ | ✅ | ✅ | Todas | ❌ |
| **gerente** | ❌ | ❌ | Só datas | ❌ | Sua loja | ✅ Limitado |
| **user** | ❌ | ✅* | ✅* | ✅* | Sua loja | ❌ |

\* Apenas após aprovação (ter `store_id`)

---

## 🛠️ Implementação Técnica

### Proteção de Rotas
Todas as rotas principais agora têm `requireStore`:

```typescript
<Route path="/" element={<ProtectedRoute requireStore><StoreDashboard /></ProtectedRoute>} />
<Route path="/products" element={<ProtectedRoute requireStore><Products /></ProtectedRoute>} />
<Route path="/utilities" element={<ProtectedRoute requireStore><Utilities /></ProtectedRoute>} />
<Route path="/cash-register" element={<ProtectedRoute requireStore><DeliveryCashSheet /></ProtectedRoute>} />
```

### Exceções
- `/admin` - Requer `requireAdmin` (não `requireStore`)
- `/login` - Público
