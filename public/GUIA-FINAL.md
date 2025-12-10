# 🚀 GUIA FINAL DE INTEGRAÇÃO (PARTE 6 + TURNO NOITE)

Você tem o HTML do Turno da Noite já integrado! Agora falta o funcionamento (JS) e a Tabela Mensal.

Siga estes passos para finalizar TUDO:

## 1. CSS (Adicionar antes de `</style>`)

```css
/* Estilos da Tabela Mensal */
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
```

## 2. HTML TABELA (Substituir conteúdo de `<div id="tab-tabela">`)

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

## 3. JAVASCRIPT (Adicionar antes de `function calcularCampos(turno)`)

### 3.1 Funções da Tabela Mensal
```javascript
function renderizarTabelaGerente(gerente,stats,cor){const temManha=stats.manha.turnos>0;const temNoite=stats.noite.turnos>0;if(!temManha&&!temNoite)return `<div class="gerente-tabela"><div class="gerente-tabela-header" style="background:${cor};">${gerente}</div><div class="gerente-tabela-corpo" style="padding:40px 20px;text-align:center;color:#9CA3AF;">📭<br>Sem dados</div></div>`;const m=stats.manha_calc;const n=stats.noite_calc;let html=`<div class="gerente-tabela"><div class="gerente-tabela-header" style="background:${cor};">${gerente}</div><div class="gerente-tabela-corpo"><table class="tabela-dados"><thead><tr><th></th><th>Manhã</th><th>Noite</th></tr></thead><tbody>`;html+=`<tr class="linha-destaque"><td class="label-coluna">Gerente:</td><td>${temManha?gerente:'-'}</td><td>${temNoite?gerente:'-'}</td></tr>`;html+=`<tr><td class="label-coluna">Vendas</td><td class="valor-numero">${temManha?formatarMoeda(m.vendas):'-'}</td><td class="valor-numero">${temNoite?formatarMoeda(n.vendas):'-'}</td></tr>`;html+=`<tr><td class="label-coluna">GC's</td><td class="valor-numero">${temManha?formatarNumero(m.gcs,0):'-'}</td><td class="valor-numero">${temNoite?formatarNumero(n.gcs,0):'-'}</td></tr>`;html+=`<tr><td class="label-coluna">BM</td><td class="valor-numero">${temManha?formatarMoeda(m.bm):'-'}</td><td class="valor-numero">${temNoite?formatarMoeda(n.bm):'-'}</td></tr>`;html+=`<tr><td class="label-coluna">Horas</td><td class="valor-numero">${temManha?formatarNumero(m.horas,0):'-'}</td><td class="valor-numero">${temNoite?formatarNumero(n.horas,0):'-'}</td></tr>`;html+=`<tr><td class="label-coluna">MO</td><td class="valor-numero ${temManha?(m.mo<=CONSTANTES.MO_OBJETIVO?'valor-verde':'valor-vermelho'):''}">${temManha?formatarPercentagem(m.mo):'-'}</td><td class="valor-numero ${temNoite?(n.mo<=CONSTANTES.MO_OBJETIVO?'valor-verde':'valor-vermelho'):''}">${temNoite?formatarPercentagem(n.mo):'-'}</td></tr>`;html+=`<tr><td class="label-coluna">Perdas</td><td class="valor-numero">${temManha?formatarMoeda(m.perdas):'-'}</td><td class="valor-numero">${temNoite?formatarMoeda(n.perdas):'-'}</td></tr>`;html+=`</tbody></table></div></div>`;return html}
function atualizarTabelaMensal(){const mesTabela=parseInt(document.getElementById('select-mes-tabela').value);const grid=document.getElementById('tabelas-grid');if(!grid)return;let html='';CONSTANTES.GERENTES.forEach(gerente=>{const stats=calcularEstatisticasGerente(gerente,mesTabela);html+=renderizarTabelaGerente(gerente,stats,CONSTANTES.CORES_GERENTES[gerente])});grid.innerHTML=html}
function inicializarTabTabela(){const select=document.getElementById('select-mes-tabela');if(select){CONSTANTES.MESES.forEach((mes,index)=>{const option=document.createElement('option');option.value=index;option.textContent=mes;if(index===estado.mesAtual)option.selected=true;select.appendChild(option)});select.addEventListener('change',atualizarTabelaMensal)}const btnExportar=document.getElementById('btn-exportar-tabela');if(btnExportar)btnExportar.addEventListener('click',()=>{window.print()});const btnTabTabela=document.querySelector('[data-tab="tabela"]');if(btnTabTabela){btnTabTabela.addEventListener('click',()=>{if(select)select.value=estado.mesAtual;atualizarTabelaMensal()})}}
function mostrarAjuda(){console.log(`📋 GESTÃO DE TURNOS 2025\nUse testarCalculos() para dados de exemplo.`)}
```

### 3.2 ATUALIZAR `atualizarResumoDia` (Substituir a existente)
```javascript
function atualizarResumoDia() {
    document.getElementById('resumo-dia-numero').textContent = estado.diaAtual;
    document.getElementById('resumo-mes-nome').textContent = CONSTANTES.MESES[estado.mesAtual];

    const m_vendas = parseFloat(document.getElementById('m_vnd_real').value) || 0;
    const m_gcs = parseInt(document.getElementById('m_gcs_real').value) || 0;
    const n_vendas = parseFloat(document.getElementById('n_vnd_real').value) || 0;
    const n_gcs = parseInt(document.getElementById('n_gcs_real').value) || 0;

    const vendas_total = m_vendas + n_vendas;
    const gcs_total = m_gcs + n_gcs;
    const bm_medio = gcs_total > 0 ? vendas_total / gcs_total : 0;

    const m_mo_texto = document.getElementById('m_mo_pct').value;
    const m_mo = m_mo_texto ? parseFloat(m_mo_texto.replace('%', '').replace(',', '.')) : 0;
    const n_mo_texto = document.getElementById('n_mo_pct').value;
    const n_mo = n_mo_texto ? parseFloat(n_mo_texto.replace('%', '').replace(',', '.')) : 0;
    
    const mo_media = (m_vendas + n_vendas) > 0 ? 
        ((m_mo * m_vendas + n_mo * n_vendas) / (m_vendas + n_vendas)) : 0;

    document.getElementById('resumo-vendas').textContent = formatarMoeda(vendas_total);
    document.getElementById('resumo-gcs').textContent = formatarNumero(gcs_total, 0);
    document.getElementById('resumo-bm').textContent = formatarMoeda(bm_medio);
    document.getElementById('resumo-mo').textContent = formatarPercentagem(mo_media);
}
```

### 3.3 ATUALIZAR `inicializarCampos` (Substituir a existente)
```javascript
function inicializarCampos() {
    const camposManha = ['m_vnd_real', 'm_vnd_plan', 'm_gcs_real', 'm_gcs_plan', 'm_horas', 'm_perdas_real', 'm_perdas_mn', 'm_desinv', 'm_tet', 'm_r2p', 'm_reemb_qtd', 'm_reemb_val', 'm_gerente'];
    const camposNoite = ['n_vnd_real', 'n_vnd_plan', 'n_gcs_real', 'n_gcs_plan', 'n_horas', 'n_perdas_real', 'n_perdas_mn', 'n_desinv', 'n_tet', 'n_r2p', 'n_reemb_qtd', 'n_reemb_val', 'n_gerente'];

    camposManha.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.addEventListener('input', () => { calcularCampos('m'); atualizarResumoDia(); autoSalvar(); });
    });
    camposNoite.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.addEventListener('input', () => { calcularCampos('n'); atualizarResumoDia(); autoSalvar(); });
    });
}
```

## 4. INICIALIZAÇÃO (No final, dentro de `DOMContentLoaded`)

Adicione estas linhas:
```javascript
inicializarTabTabela();
setTimeout(mostrarAjuda, 2000);
```
