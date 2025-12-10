# 🚀 INTEGRAÇÃO PARTE 6 - GUIA RÁPIDO

## PASSO 1: ADICIONAR CSS (antes da linha 695)

Encontre a linha 695 que tem `</style>` e ANTES dela, adicione:

```css
.tabela-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:30px;padding:20px;background:white;border-radius:15px;box-shadow:0 2px 10px rgba(0,0,0,0.05)}
.tabela-header h2{margin:0;font-size:24px;color:#111827}
.tabela-controles{display:flex;align-items:center;gap:15px}
.tabela-controles label{font-weight:600;color:#374151}
.select-mes-tabela{padding:10px 20px;border:2px solid #D1D5DB;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;background:white;transition:all 0.2s}
.select-mes-tabela:focus{outline:none;border-color:#7C3AED}
.tabelas-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:25px}
@media(max-width:1400px){.tabelas-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:900px){.tabelas-grid{grid-template-columns:1fr}}
.gerente-tabela{background:white;border-radius:15px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.1)}
.gerente-tabela-header{padding:15px;color:white;text-align:center;font-weight:700;font-size:16px;text-transform:uppercase;letter-spacing:1px}
.gerente-tabela-corpo{padding:0}
.tabela-dados{width:100%;border-collapse:collapse;font-size:12px}
.tabela-dados th{background:#F3F4F6;padding:10px 8px;text-align:center;font-weight:700;text-transform:uppercase;font-size:10px;color:#6B7280;border-bottom:2px solid #E5E7EB}
.tabela-dados td{padding:8px;text-align:center;border-bottom:1px solid #F3F4F6}
.tabela-dados tr:last-child td{border-bottom:none}
.tabela-dados .label-coluna{text-align:left;font-weight:600;color:#374151;padding-left:15px}
.tabela-dados .valor-numero{font-family:'JetBrains Mono',monospace;font-weight:600;color:#111827}
.tabela-dados .valor-verde{color:#10B981;font-weight:700}
.tabela-dados .valor-vermelho{color:#EF4444;font-weight:700}
.tabela-dados .turno-vazio{color:#9CA3AF;font-style:italic}
.tabela-dados .linha-destaque td{background:#F9FAFB;font-weight:700}
```

---

## PASSO 2: ADICIONAR HTML DO TAB

Encontre `<div id="tab-tabela" class="tab-conteudo">` e substitua TODO o conteúdo interno por:

```html
<div class="tabela-header">
    <h2>📊 Tabela Resumo Mensal</h2>
    <div class="tabela-controles">
        <label for="select-mes-tabela">Mês:</label>
        <select id="select-mes-tabela" class="select-mes-tabela"></select>
        <button class="btn-primario" id="btn-exportar-tabela">📥 Exportar PDF</button>
    </div>
</div>
<div class="tabelas-grid" id="tabelas-grid"></div>
```

---

## PASSO 3: ADICIONAR JAVASCRIPT

Encontre a linha que tem `// ============= CALCULAR TODOS OS CAMPOS DE UM TURNO =============`

ANTES dessa linha, adicione:

```javascript
function renderizarTabelaGerente(gerente,stats,cor){const temManha=stats.manha.turnos>0;const temNoite=stats.noite.turnos>0;if(!temManha&&!temNoite)return `<div class="gerente-tabela"><div class="gerente-tabela-header" style="background:${cor};">${gerente}</div><div class="gerente-tabela-corpo" style="padding:40px 20px;text-align:center;color:#9CA3AF;">📭<br>Sem dados</div></div>`;const m=stats.manha_calc;const n=stats.noite_calc;let html=`<div class="gerente-tabela"><div class="gerente-tabela-header" style="background:${cor};">${gerente}</div><div class="gerente-tabela-corpo"><table class="tabela-dados"><thead><tr><th></th><th>Manhã</th><th>Noite</th></tr></thead><tbody>`;html+=`<tr class="linha-destaque"><td class="label-coluna">Gerente:</td><td>${temManha?gerente:'-'}</td><td>${temNoite?gerente:'-'}</td></tr>`;html+=`<tr><td class="label-coluna">Vendas</td><td class="valor-numero">${temManha?formatarMoeda(m.vendas):'-'}</td><td class="valor-numero">${temNoite?formatarMoeda(n.vendas):'-'}</td></tr>`;html+=`<tr><td class="label-coluna">GC's</td><td class="valor-numero">${temManha?formatarNumero(m.gcs,0):'-'}</td><td class="valor-numero">${temNoite?formatarNumero(n.gcs,0):'-'}</td></tr>`;html+=`<tr><td class="label-coluna">BM</td><td class="valor-numero">${temManha?formatarMoeda(m.bm):'-'}</td><td class="valor-numero">${temNoite?formatarMoeda(n.bm):'-'}</td></tr>`;html+=`<tr><td class="label-coluna">Horas</td><td class="valor-numero">${temManha?formatarNumero(m.horas,0):'-'}</td><td class="valor-numero">${temNoite?formatarNumero(n.horas,0):'-'}</td></tr>`;html+=`<tr><td class="label-coluna">MO</td><td class="valor-numero ${temManha?(m.mo<=CONSTANTES.MO_OBJETIVO?'valor-verde':'valor-vermelho'):''}">${temManha?formatarPercentagem(m.mo):'-'}</td><td class="valor-numero ${temNoite?(n.mo<=CONSTANTES.MO_OBJETIVO?'valor-verde':'valor-vermelho'):''}">${temNoite?formatarPercentagem(n.mo):'-'}</td></tr>`;html+=`<tr><td class="label-coluna">Perdas</td><td class="valor-numero">${temManha?formatarMoeda(m.perdas):'-'}</td><td class="valor-numero">${temNoite?formatarMoeda(n.perdas):'-'}</td></tr>`;html+=`</tbody></table></div></div>`;return html}
function atualizarTabelaMensal(){const mesTabela=parseInt(document.getElementById('select-mes-tabela').value);const grid=document.getElementById('tabelas-grid');if(!grid)return;console.log(`📋 Gerando tabela: ${CONSTANTES.MESES[mesTabela]}`);let html='';CONSTANTES.GERENTES.forEach(gerente=>{const stats=calcularEstatisticasGerente(gerente,mesTabela);html+=renderizarTabelaGerente(gerente,stats,CONSTANTES.CORES_GERENTES[gerente])});grid.innerHTML=html;console.log('✅ Tabela gerada')}
function inicializarTabTabela(){const select=document.getElementById('select-mes-tabela');if(select){CONSTANTES.MESES.forEach((mes,index)=>{const option=document.createElement('option');option.value=index;option.textContent=mes;if(index===estado.mesAtual)option.selected=true;select.appendChild(option)});select.addEventListener('change',atualizarTabelaMensal)}const btnExportar=document.getElementById('btn-exportar-tabela');if(btnExportar)btnExportar.addEventListener('click',()=>{alert('Use Ctrl+P para imprimir');window.print()});const btnTabTabela=document.querySelector('[data-tab="tabela"]');if(btnTabTabela){btnTabTabela.addEventListener('click',()=>{if(select)select.value=estado.mesAtual;atualizarTabelaMensal()})}}
function obterEstatisticasGerais(){const todosDados=obterTodosDados();let totalTurnos=0;let diasComDados=new Set();Object.entries(todosDados).forEach(([chave,dados])=>{if(dados.m_gerente){totalTurnos++;diasComDados.add(chave)}if(dados.n_gerente){totalTurnos++;diasComDados.add(chave)}});console.log('📊 ESTATÍSTICAS GERAIS:');console.log(`- Dias com dados: ${diasComDados.size}`);console.log(`- Total turnos: ${totalTurnos}`);return{totalDias:diasComDados.size,totalTurnos}}
function mostrarAjuda(){console.log(`
╔══════════════════════════════════════════════════╗
║  🍔 GESTÃO DE TURNOS - AMADORA 2025             ║
╚══════════════════════════════════════════════════╝

📋 FUNÇÕES:
  testarCalculos()          - Dados de exemplo
  obterEstatisticasGerais() - Resumo geral
  verDadosSalvos()          - Ver dados
  exportarBackup()          - Exportar JSON
  
⌨️ ATALHOS:
  ←  →      - Navegar dias
  Ctrl+S    - Guardar
  Alt+1/2/3 - Mudar tabs
`)}
```

---

## PASSO 4: ADICIONAR INICIALIZAÇÃO

Encontre `document.addEventListener('DOMContentLoaded'` e dentro dele, DEPOIS de `inicializarTabAnalise();` adicione:

```javascript
inicializarTabTabela();
setTimeout(mostrarAjuda, 2000);
```

---

## ✅ VERIFICAR

1. Abrir shift-management.html no browser
2. Console (F12) não deve ter erros
3. Clicar no tab "Tabela Mensal"
4. Ver 6 tabelas coloridas
5. Testar dropdown de mês
6. Console: `obterEstatisticasGerais()`

---

## 🎉 PRONTO!

Sistema 100% completo com todas as 7 partes! 🚀
