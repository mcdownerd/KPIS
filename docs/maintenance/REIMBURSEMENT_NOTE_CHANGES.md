# Adição de Campo de Nota de Reembolso no Cash Register

## Resumo das Alterações

Foi adicionado um campo de **nota/observação** para reembolsos no sistema de cash-register (Folha de Caixa Delivery). Este campo permite que os usuários deixem anotações explicando o motivo de cada reembolso.

## Alterações Realizadas

### 1. Banco de Dados
- **Arquivo**: `add_reimbursement_note_column.sql`
- **Alteração**: Adicionada coluna `reimbursement_note` (TEXT) na tabela `cash_register_shifts`

### 2. Tipos TypeScript
- **Arquivo**: `src/types/delivery.ts`
- **Alteração**: Adicionado campo opcional `reimbursement_note?: string` na interface `DeliveryShift`

### 3. API
- **Arquivo**: `src/lib/api/cash_register.ts`
- **Alteração**: Adicionado campo opcional `reimbursement_note?: string` na interface `CashRegisterShift`

### 4. Componente de Formulário
- **Arquivo**: `src/components/delivery/DeliveryDayForm.tsx`
- **Alterações**:
  - Adicionado campo `reimbursement_note` ao criar turnos vazios
  - Adicionado campo de input de texto que **aparece automaticamente** quando há reembolso (qty > 0 ou value > 0)
  - O campo ocupa toda a largura e fica abaixo dos outros campos do turno

### 5. Página Principal
- **Arquivo**: `src/pages/DeliveryCashSheet.tsx`
- **Alterações**:
  - Adicionado mapeamento do campo ao carregar dados do banco
  - Adicionado campo ao salvar turnos (manhã e noite)

## Como Aplicar a Migração do Banco de Dados

### Opção 1: Via Supabase Dashboard
1. Acesse o Supabase Dashboard
2. Vá para "SQL Editor"
3. Execute o conteúdo do arquivo `add_reimbursement_note_column.sql`

### Opção 2: Via CLI (se tiver configurado)
```bash
supabase db push
```

## Comportamento da Interface

- O campo de **"Nota de Reembolso"** aparece **automaticamente** quando:
  - `reimbursement_qty > 0` OU
  - `reimbursement_value > 0`
  
- O campo é **opcional** e permite texto livre
- Placeholder: "Descreva o motivo do reembolso..."
- Ocupa toda a largura do card do turno

## Exemplo de Uso

1. Usuário preenche os dados do turno normalmente
2. Ao inserir quantidade ou valor de reembolso, o campo de nota aparece
3. Usuário pode descrever: "Troco errado", "Pedido cancelado", "Erro no sistema", etc.
4. A nota é salva junto com os outros dados do turno

## Compatibilidade

- ✅ Retrocompatível: turnos antigos sem nota continuam funcionando
- ✅ Campo opcional: não é obrigatório preencher
- ✅ Não quebra funcionalidades existentes
