// ============= PARTE 6: TABELA MENSAL =============

function renderizarTabelaGerente(gerente, stats, cor) {
    const temManha = stats.manha.turnos > 0;
    const temNoite = stats.noite.turnos > 0;

    if (!temManha && !temNoite) {
        return `<div class="gerente-tabela"><div class="gerente-tabela-header" style="background: ${cor};">${gerente}</div><div class="gerente-tabela-corpo" style="padding: 40px 20px; text-align: center; color: #9CA3AF;">📭<br>Sem dados neste mês</div></div>`;
    }

    const m = stats.manha_calc;
    const n = stats.noite_calc;

    let html = `<div class="gerente-tabela"><div class="gerente-tabela-header" style="background: ${cor};">${gerente}</div><div class="gerente-tabela-corpo"><table class="tabela-dados"><thead><tr><th></th><th>Manhã</th><th>Noite</th></tr></thead><tbody>`;

    html += `<tr class="linha-destaque"><td class="label-coluna">Gerente:</td><td>${temManha ? gerente : '<span class="turno-vazio">-</span>'}</td><td>${temNoite ? gerente : '<span class="turno-vazio">-</span>'}</td></tr>`;
    html += `<tr><td class="label-coluna">Vendas</td><td class="valor-numero">${temManha ? formatarMoeda(m.vendas).replace(' €', '') : '-'}</td><td class="valor-numero">${temNoite ? formatarMoeda(n.vendas).replace(' €', '') : '-'}</td></tr>`;
    html += `<tr><td class="label-coluna" style="padding-left: 25px; font-size: 11px;">Real</td><td class="valor-numero">${temManha ? formatarMoeda(m.vendas) : '-'}</td><td class="valor-numero">${temNoite ? formatarMoeda(n.vendas) : '-'}</td></tr>`;
    html += `<tr><td class="label-coluna" style="padding-left: 25px; font-size: 11px;">Planificado</td><td class="valor-numero">${temManha ? formatarMoeda(m.vendas_plan) : '-'}</td><td class="valor-numero">${temNoite ? formatarMoeda(n.vendas_plan) : '-'}</td></tr>`;
    html += `<tr><td class="label-coluna" style="padding-left: 25px; font-size: 11px;">Diferença</td><td class="valor-numero ${temManha ? (m.vendas - m.vendas_plan >= 0 ? 'valor-verde' : 'valor-vermelho') : ''}">${temManha ? formatarMoeda(m.vendas - m.vendas_plan) : '-'}</td><td class="valor-numero ${temNoite ? (n.vendas - n.vendas_plan >= 0 ? 'valor-verde' : 'valor-vermelho') : ''}">${temNoite ? formatarMoeda(n.vendas - n.vendas_plan) : '-'}</td></tr>`;
    html += `<tr><td class="label-coluna">GC's</td><td class="valor-numero">${temManha ? formatarNumero(m.gcs, 0) : '-'}</td><td class="valor-numero">${temNoite ? formatarNumero(n.gcs, 0) : '-'}</td></tr>`;
    html += `<tr><td class="label-coluna">BM</td><td class="valor-numero">${temManha ? formatarMoeda(m.bm) : '-'}</td><td class="valor-numero">${temNoite ? formatarMoeda(n.bm) : '-'}</td></tr>`;
    html += `<tr><td class="label-coluna">Horas</td><td class="valor-numero">${temManha ? formatarNumero(m.horas, 0) : '-'}</td><td class="valor-numero">${temNoite ? formatarNumero(n.horas, 0) : '-'}</td></tr>`;
    html += `<tr><td class="label-coluna">MO</td><td class="valor-numero ${temManha ? (m.mo <= CONSTANTES.MO_OBJETIVO ? 'valor-verde' : 'valor-vermelho') : ''}">${temManha ? formatarPercentagem(m.mo) : '-'}</td><td class="valor-numero ${temNoite ? (n.mo <= CONSTANTES.MO_OBJETIVO ? 'valor-verde' : 'valor-vermelho') : ''}">${temNoite ? formatarPercentagem(n.mo) : '-'}</td></tr>`;
    html += `<tr><td class="label-coluna">Perdas</td><td class="valor-numero">${temManha ? formatarMoeda(m.perdas) : '-'}</td><td class="valor-numero">${temNoite ? formatarMoeda(n.perdas) : '-'}</td></tr>`;
    html += `<tr><td class="label-coluna">Perdas M/N</td><td class="valor-numero">${temManha ? formatarPercentagem(m.perdas_pct) : '-'}</td><td class="valor-numero">${temNoite ? formatarPercentagem(n.perdas_pct) : '-'}</td></tr>`;

    if (m.tet_medio > 0 || n.tet_medio > 0) {
        html += `<tr><td class="label-coluna">TET</td><td class="valor-numero ${temManha && m.tet_medio > 0 ? (m.tet_medio <= CONSTANTES.TET_OBJETIVO ? 'valor-verde' : 'valor-vermelho') : ''}">${temManha && m.tet_medio > 0 ? formatarNumero(m.tet_medio, 0) : '-'}</td><td class="valor-numero ${temNoite && n.tet_medio > 0 ? (n.tet_medio <= CONSTANTES.TET_OBJETIVO ? 'valor-verde' : 'valor-vermelho') : ''}">${temNoite && n.tet_medio > 0 ? formatarNumero(n.tet_medio, 0) : '-'}</td></tr>`;
    }

    if (m.r2p_medio > 0 || n.r2p_medio > 0) {
        html += `<tr><td class="label-coluna">R2P</td><td class="valor-numero ${temManha && m.r2p_medio > 0 ? (m.r2p_medio <= CONSTANTES.R2P_OBJETIVO ? 'valor-verde' : 'valor-vermelho') : ''}">${temManha && m.r2p_medio > 0 ? formatarNumero(m.r2p_medio, 0) : '-'}</td><td class="valor-numero ${temNoite && n.r2p_medio > 0 ? (n.r2p_medio <= CONSTANTES.R2P_OBJETIVO ? 'valor-verde' : 'valor-vermelho') : ''}">${temNoite && n.r2p_medio > 0 ? formatarNumero(n.r2p_medio, 0) : '-'}</td></tr>`;
    }

    html += `<tr><td class="label-coluna">Reembolsos</td><td class="valor-numero" colspan="2" style="text-align: center;">${stats.turnos} turno${stats.turnos !== 1 ? 's' : ''}</td></tr>`;
    html += `</tbody></table></div></div>`;

    return html;
}

function atualizarTabelaMensal() {
    const mesTabela = parseInt(document.getElementById('select-mes-tabela').value);
    const grid = document.getElementById('tabelas-grid');
    if (!grid) return;
    console.log(`📋 Gerando tabela: ${CONSTANTES.MESES[mesTabela]}`);
    let html = '';
    CONSTANTES.GERENTES.forEach(gerente => {
        const stats = calcularEstatisticasGerente(gerente, mesTabela);
        const cor = CONSTANTES.CORES_GERENTES[gerente];
        html += renderizarTabelaGerente(gerente, stats, cor);
    });
    grid.innerHTML = html;
    console.log('✅ Tabela gerada');
}

function inicializarTabTabela() {
    const select = document.getElementById('select-mes-tabela');
    if (select) {
        CONSTANTES.MESES.forEach((mes, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = mes;
            if (index === estado.mesAtual) option.selected = true;
            select.appendChild(option);
        });
        select.addEventListener('change', atualizarTabelaMensal);
    }
    const btnExportar = document.getElementById('btn-exportar-tabela');
    if (btnExportar) {
        btnExportar.addEventListener('click', () => {
            alert('Funcionalidade de exportar PDF em desenvolvimento.\n\nPor agora pode usar Ctrl+P para imprimir a página.');
            window.print();
        });
    }
    const btnTabTabela = document.querySelector('[data-tab="tabela"]');
    if (btnTabTabela) {
        btnTabTabela.addEventListener('click', () => {
            if (select) select.value = estado.mesAtual;
            atualizarTabelaMensal();
        });
    }
}

// ============= UTILIDADES FINAIS =============

function obterEstatisticasGerais() {
    const todosDados = obterTodosDados();
    let totalTurnos = 0;
    let diasComDados = new Set();
    Object.entries(todosDados).forEach(([chave, dados]) => {
        if (dados.m_gerente) { totalTurnos++; diasComDados.add(chave); }
        if (dados.n_gerente) { totalTurnos++; diasComDados.add(chave); }
    });
    console.log('📊 ESTATÍSTICAS GERAIS:');
    console.log(`- Total de dias com dados: ${diasComDados.size}`);
    console.log(`- Total de turnos registados: ${totalTurnos}`);
    console.log(`- Meses com mais dados:`, analisarMeses());
    return { totalDias: diasComDados.size, totalTurnos: totalTurnos };
}

function analisarMeses() {
    const todosDados = obterTodosDados();
    const meses = {};
    CONSTANTES.MESES.forEach((mes, index) => { meses[mes] = 0; });
    Object.keys(todosDados).forEach(chave => {
        const mesIndex = parseInt(chave.split('-')[0]);
        const mesNome = CONSTANTES.MESES[mesIndex];
        meses[mesNome]++;
    });
    return meses;
}

function mostrarAjuda() {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🍔 SISTEMA DE GESTÃO DE TURNOS - AMADORA 2025           ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

📋 FUNÇÕES DISPONÍVEIS NO CONSOLE:

🧪 TESTES:
  testarCalculos()              - Carregar dados de exemplo
  
📊 ESTATÍSTICAS:
  obterEstatisticasGerais()     - Ver resumo geral
  verDadosSalvos()              - Ver todos os dados salvos
  analisarMeses()               - Ver dados por mês
  
🔧 UTILIDADES:
  exportarBackup()              - Exportar backup JSON
  importarBackup()              - Importar backup JSON
  limparTodosDados()            - Apagar todos os dados (CUIDADO!)
  
⌨️ ATALHOS DE TECLADO:
  ←  →                          - Navegar entre dias
  Ctrl/Cmd + S                  - Guardar dados
  Ctrl/Cmd + K                  - Limpar dia
  Alt + 1/2/3                   - Mudar tabs

💡 DICA: Os dados são guardados automaticamente enquanto digita!
  `);
}
