# APIs do Dashboard - Documentação

## 📦 APIs Criadas

Todas as APIs seguem o mesmo padrão de autenticação e segurança (RLS - Row Level Security).

### 1. **Sales API** (`src/lib/api/sales.ts`)
Gerenciamento de vendas por plataforma (Delivery, Sala, MOP).

**Funções principais:**
- `getSalesByDateRange(startDate, endDate)` - Buscar vendas por período
- `getSalesByMonth(year)` - Buscar vendas por mês
- `createSale(sale)` - Criar registro de venda
- `updateSale(id, updates)` - Atualizar venda
- `deleteSale(id)` - Deletar venda
- `getSalesSummaryByPlatform(startDate, endDate)` - Resumo por plataforma

**Exemplo de uso:**
```typescript
import { getSalesByMonth, createSale } from '@/lib/api/sales'

// Buscar vendas de 2025
const sales = await getSalesByMonth(2025)

// Criar nova venda
await createSale({
  sale_date: '2025-01-15',
  platform: 'Delivery',
  total_value: 1250.50
})
```

---

### 2. **Service Times API** (`src/lib/api/service_times.ts`)
Gerenciamento de tempos de serviço (almoço, jantar, dia).

**Funções principais:**
- `getServiceTimesByDateRange(startDate, endDate)` - Buscar tempos por período
- `getServiceTimesByMonth(month, year)` - Buscar tempos por mês
- `createServiceTime(serviceTime)` - Criar registro
- `updateServiceTime(id, updates)` - Atualizar registro
- `deleteServiceTime(id)` - Deletar registro
- `getAverageServiceTimes(startDate, endDate)` - Médias do período

**Exemplo de uso:**
```typescript
import { createServiceTime, getAverageServiceTimes } from '@/lib/api/service_times'

// Criar registro de tempo de serviço
await createServiceTime({
  record_date: '2025-01-15',
  lunch_time: 108, // em segundos
  dinner_time: 122,
  day_time: 132,
  target_time: 110
})

// Buscar médias
const averages = await getAverageServiceTimes('2025-01-01', '2025-01-31')
```

---

### 3. **Costs API** (`src/lib/api/costs.ts`)
Gerenciamento de custos (comida, papel, refeições, perdas).

**Funções principais:**
- `getCostsByDateRange(startDate, endDate)` - Buscar custos por período
- `getCostsByMonth(month, year)` - Buscar custos por mês
- `getCostsByYear(year)` - Buscar custos por ano
- `createCost(cost)` - Criar registro de custo
- `updateCost(id, updates)` - Atualizar custo
- `deleteCost(id)` - Deletar custo
- `getCostSummary(startDate, endDate)` - Resumo de custos
- `getCostsGroupedByMonth(year)` - Custos agrupados por mês

**Exemplo de uso:**
```typescript
import { createCost, getCostSummary } from '@/lib/api/costs'

// Criar registro de custo
await createCost({
  record_date: '2025-01-15',
  cost_type: 'comida',
  percentage: 26.78,
  target_percentage: 26.5
})

// Buscar resumo
const summary = await getCostSummary('2025-01-01', '2025-12-31')
```

---

### 4. **Inventory API** (`src/lib/api/inventory.ts`)
Gerenciamento de desvios de inventário.

**Funções principais:**
- `getInventoryDeviationsByDateRange(startDate, endDate)` - Buscar desvios
- `getInventoryDeviationsByMonth(month, year)` - Desvios por mês
- `createInventoryDeviation(deviation)` - Criar registro
- `updateInventoryDeviation(id, updates)` - Atualizar
- `deleteInventoryDeviation(id)` - Deletar
- `getInventoryDeviationSummary(startDate, endDate)` - Resumo por status
- `getCriticalDeviations(startDate, endDate)` - Desvios críticos
- `calculateDeviationStatus(value)` - Calcular status do desvio

**Exemplo de uso:**
```typescript
import { createInventoryDeviation, calculateDeviationStatus } from '@/lib/api/inventory'

const deviationValue = -114
const status = calculateDeviationStatus(deviationValue) // 'warning'

await createInventoryDeviation({
  record_date: '2025-01-15',
  item_name: 'Pão Reg',
  deviation_value: deviationValue,
  status
})
```

---

### 5. **HR API** (`src/lib/api/hr.ts`)
Gerenciamento de métricas de RH (M.O., turnover, staffing, produtividade).

**Funções principais:**
- `getHRMetricsByDateRange(startDate, endDate)` - Buscar métricas
- `getHRMetricsByMonth(month, year)` - Métricas por mês
- `getHRMetricsByType(type, startDate, endDate)` - Métricas por tipo
- `createHRMetric(metric)` - Criar métrica
- `updateHRMetric(id, updates)` - Atualizar
- `deleteHRMetric(id)` - Deletar
- `getAverageTurnover(startDate, endDate)` - Média de turnover
- `getAverageStaffing(startDate, endDate)` - Média de staffing
- `getLaborCostSummary(startDate, endDate)` - Resumo de M.O.

**Exemplo de uso:**
```typescript
import { createHRMetric, getLaborCostSummary } from '@/lib/api/hr'

await createHRMetric({
  record_date: '2025-01-15',
  metric_type: 'labor_cost',
  value: 11.05,
  target_value: 10.0,
  additional_data: {
    vendas: 286344.11,
    horas: 4121,
    prod: 69.48,
    mo: 11.05
  }
})

const summary = await getLaborCostSummary('2025-01-01', '2025-12-31')
```

---

### 6. **Maintenance API** (`src/lib/api/maintenance.ts`)
Gerenciamento de avarias e manutenção.

**Funções principais:**
- `getMaintenanceByDateRange(startDate, endDate)` - Buscar manutenções
- `getMaintenanceByMonth(month, year)` - Manutenções por mês
- `getMaintenanceByYear(year)` - Manutenções por ano
- `getMaintenanceByStatus(status)` - Filtrar por status
- `createMaintenance(maintenance)` - Criar registro
- `updateMaintenance(id, updates)` - Atualizar
- `deleteMaintenance(id)` - Deletar
- `getTotalMaintenanceCosts(startDate, endDate)` - Custo total
- `getMaintenanceSummary(startDate, endDate)` - Resumo
- `getPendingMaintenance()` - Manutenções pendentes

**Exemplo de uso:**
```typescript
import { createMaintenance, getMaintenanceSummary } from '@/lib/api/maintenance'

await createMaintenance({
  breakdown_date: '2025-01-15',
  equipment_name: 'Sonda 4:1',
  cause: 'Teve de ser uma nova, a outra desapareceu',
  parts_replaced: '-',
  cost: 372.20,
  status: 'completed'
})

const summary = await getMaintenanceSummary('2025-01-01', '2025-12-31')
```

---

### 7. **Performance API** (`src/lib/api/performance.ts`)
Gerenciamento de tracking de performance (CMP, PL, Avaliações, Gastos Gerais).

**Funções principais:**
- `getPerformanceTrackingByDateRange(startDate, endDate)` - Buscar registros
- `getPerformanceTrackingByMonth(month, year)` - Por mês
- `getPerformanceTrackingByMetric(metric, startDate, endDate)` - Por métrica
- `createPerformanceTracking(tracking)` - Criar registro
- `updatePerformanceTracking(id, updates)` - Atualizar
- `deletePerformanceTracking(id)` - Deletar
- `getPerformanceSummary(startDate, endDate)` - Resumo
- `getMonthlyPerformanceTracking(year)` - Tracking mensal

**Exemplo de uso:**
```typescript
import { createPerformanceTracking, getPerformanceSummary } from '@/lib/api/performance'

await createPerformanceTracking({
  record_date: '2025-01-15',
  metric_name: 'cmp',
  value: 96.63,
  status: 'OK'
})

const summary = await getPerformanceSummary('2025-01-01', '2025-12-31')
```

---

### 8. **Dashboard API** (`src/lib/api/dashboard.ts`)
Métricas gerais do dashboard.

**Funções principais:**
- `getDashboardMetrics(startDate, endDate)` - Métricas do dashboard
- `getAllStores()` - Listar todas as lojas
- `getUserStore()` - Loja do usuário atual

**Exemplo de uso:**
```typescript
import { getDashboardMetrics, getUserStore } from '@/lib/api/dashboard'

const metrics = await getDashboardMetrics('2025-01-01', '2025-12-31')
const userStore = await getUserStore()
```

---

## 🔐 Segurança

Todas as APIs implementam:
- ✅ Autenticação obrigatória via Supabase Auth
- ✅ RLS (Row Level Security) - usuários só acessam dados da sua loja
- ✅ Validação de `store_id` em todas as operações
- ✅ Timestamps automáticos (`created_at`, `updated_at`)
- ✅ Rastreamento de quem criou (`created_by`)

---

## 📊 Próximos Passos

1. **Executar SQL no Supabase**
   - Abrir Supabase Dashboard
   - SQL Editor
   - Executar `database/scripts/dashboard-tables.sql`

2. **Integrar componentes**
   - Atualizar `SalesChart.tsx` para usar `sales.ts`
   - Atualizar `ServiceTimesTable.tsx` para usar `service_times.ts`
   - Atualizar `CostsAnalysis.tsx` para usar `costs.ts`
   - E assim por diante...

3. **Criar formulários de entrada**
   - Formulário para adicionar vendas
   - Formulário para tempos de serviço
   - Formulário para custos
   - Etc.
