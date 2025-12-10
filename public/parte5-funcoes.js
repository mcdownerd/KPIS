// ============= PARTE 5: ANÁLISE POR GERENTE =============

// ============= CALCULAR ESTATÍSTICAS DE UM GERENTE =============
function calcularEstatisticasGerente(gerente, mes) {
    const maxDias = CONSTANTES.DIAS_NO_MES[mes];
    const todosDados = obterTodosDados();

    const stats = {
        turnos: 0,
        manha: {
            turnos: 0,
            vendas_total: 0,
            vendas_plan_total: 0,
            gcs_total: 0,
            gcs_plan_total: 0,
            horas_total: 0,
            perdas_total: 0,
            tet_valores: [],
            r2p_valores: []
        },
        noite: {
            turnos: 0,
            vendas_total: 0,
            vendas_plan_total: 0,
            gcs_total: 0,
            gcs_plan_total: 0,
            horas_total: 0,
            perdas_total: 0,
            tet_valores: [],
            r2p_valores: []
        }
    };

    for (let dia = 1; dia <= maxDias; dia++) {
        const chave = `${mes}-${dia}`;
        const dados = todosDados[chave];
        if (!dados) continue;

        if (dados.m_gerente === gerente) {
            stats.manha.turnos++;
            stats.turnos++;
            stats.manha.vendas_total += parseFloat(dados.m_vnd_real) || 0;
            stats.manha.vendas_plan_total += parseFloat(dados.m_vnd_plan) || 0;
            stats.manha.gcs_total += parseInt(dados.m_gcs_real) || 0;
            stats.manha.gcs_plan_total += parseInt(dados.m_gcs_plan) || 0;
            stats.manha.horas_total += parseFloat(dados.m_horas) || 0;
            stats.manha.perdas_total += parseFloat(dados.m_perdas_real) || 0;
            if (dados.m_tet && parseFloat(dados.m_tet) > 0) {
                stats.manha.tet_valores.push(parseFloat(dados.m_tet));
            }
            if (dados.m_r2p && parseFloat(dados.m_r2p) > 0) {
                stats.manha.r2p_valores.push(parseFloat(dados.m_r2p));
            }
        }

        if (dados.n_gerente === gerente) {
            stats.noite.turnos++;
            stats.turnos++;
            stats.noite.vendas_total += parseFloat(dados.n_vnd_real) || 0;
            stats.noite.vendas_plan_total += parseFloat(dados.n_vnd_plan) || 0;
            stats.noite.gcs_total += parseInt(dados.n_gcs_real) || 0;
            stats.noite.gcs_plan_total += parseInt(dados.n_gcs_plan) || 0;
            stats.noite.horas_total += parseFloat(dados.n_horas) || 0;
            stats.noite.perdas_total += parseFloat(dados.n_perdas_real) || 0;
            if (dados.n_tet && parseFloat(dados.n_tet) > 0) {
                stats.noite.tet_valores.push(parseFloat(dados.n_tet));
            }
            if (dados.n_r2p && parseFloat(dados.n_r2p) > 0) {
                stats.noite.r2p_valores.push(parseFloat(dados.n_r2p));
            }
        }
    }

    function calcularMetricas(turno) {
        const resultado = {
            vendas: turno.vendas_total,
            vendas_plan: turno.vendas_plan_total,
            gcs: turno.gcs_total,
            gcs_plan: turno.gcs_plan_total,
            horas: turno.horas_total,
            perdas: turno.perdas_total,
            bm: turno.gcs_total > 0 ? turno.vendas_total / turno.gcs_total : 0,
            bm_plan: turno.gcs_plan_total > 0 ? turno.vendas_plan_total / turno.gcs_plan_total : 0,
            mo: turno.vendas_total > 0 ? ((turno.horas_total * CONSTANTES.VALOR_MO) / turno.vendas_total) * 100 : 0,
            perdas_pct: turno.vendas_total > 0 ? (turno.perdas_total / turno.vendas_total) * 100 : 0,
            tet_medio: turno.tet_valores.length > 0 ? turno.tet_valores.reduce((a, b) => a + b, 0) / turno.tet_valores.length : 0,
            r2p_medio: turno.r2p_valores.length > 0 ? turno.r2p_valores.reduce((a, b) => a + b, 0) / turno.r2p_valores.length : 0
        };
        resultado.bm_dif = resultado.bm - resultado.bm_plan;
        resultado.mo_dif = resultado.mo - CONSTANTES.MO_OBJETIVO;
        resultado.tet_dif = resultado.tet_medio - CONSTANTES.TET_OBJETIVO;
        resultado.r2p_dif = resultado.r2p_medio - CONSTANTES.R2P_OBJETIVO;
        return resultado;
    }

    stats.manha_calc = calcularMetricas(stats.manha);
    stats.noite_calc = calcularMetricas(stats.noite);
    return stats;
}

// ============= RENDERIZAR CARD DO GERENTE =============
function renderizarCardGerente(gerente, stats, cor) {
    if (stats.turnos === 0) {
        return `
      <div class="gerente-card">
        <div class="gerente-header" style="background: ${cor};">
          ${gerente}
        </div>
        <div class="gerente-corpo">
          <div class="gerente-vazio">
            <p>Sem dados neste mês</p>
          </div>
        </div>
      </div>
    `;
    }

    const temManha = stats.manha.turnos > 0;
    const temNoite = stats.noite.turnos > 0;

    let html = `
    <div class="gerente-card">
      <div class="gerente-header" style="background: ${cor};">
        ${gerente}
      </div>
      <div class="gerente-corpo">
        <div class="badge-turnos">📊 ${stats.turnos} turno${stats.turnos !== 1 ? 's' : ''}</div>
  `;

    if (temManha) {
        const m = stats.manha_calc;
        html += `
      <div class="stat-secao">☀️ Manhã (${stats.manha.turnos} turnos)</div>
      <div class="stat-linha">
        <span class="stat-label">Vendas</span>
        <span class="stat-valor azul">${formatarMoeda(m.vendas)}</span>
      </div>
      <div class="stat-linha">
        <span class="stat-label">GC's</span>
        <span class="stat-valor">${formatarNumero(m.gcs, 0)}</span>
      </div>
      <div class="stat-linha">
        <span class="stat-label">BM Médio</span>
        <span class="stat-valor azul">${formatarMoeda(m.bm)}</span>
      </div>
      <div class="stat-linha">
        <span class="stat-label">Horas</span>
        <span class="stat-valor">${formatarNumero(m.horas, 1)}h</span>
      </div>
      <div class="stat-linha">
        <span class="stat-label">MO %</span>
        <span class="stat-valor ${m.mo <= CONSTANTES.MO_OBJETIVO ? 'verde' : 'vermelho'}">
          ${formatarPercentagem(m.mo)}
        </span>
      </div>
      <div class="stat-linha">
        <span class="stat-label">Dif. MO</span>
        <span class="stat-valor ${m.mo_dif <= 0 ? 'verde' : 'vermelho'}">
          ${formatarNumero(m.mo_dif, 2)}
        </span>
      </div>
      <div class="stat-linha">
        <span class="stat-label">Perdas</span>
        <span class="stat-valor">${formatarMoeda(m.perdas)} (${formatarNumero(m.perdas_pct, 2)}%)</span>
      </div>
      ${m.tet_medio > 0 ? `
      <div class="stat-linha">
        <span class="stat-label">TET Médio</span>
        <span class="stat-valor ${m.tet_medio <= CONSTANTES.TET_OBJETIVO ? 'verde' : 'vermelho'}">
          ${formatarNumero(m.tet_medio, 0)}"
        </span>
      </div>
      ` : ''}
      ${m.r2p_medio > 0 ? `
      <div class="stat-linha">
        <span class="stat-label">R2P Médio</span>
        <span class="stat-valor ${m.r2p_medio <= CONSTANTES.R2P_OBJETIVO ? 'verde' : 'vermelho'}">
          ${formatarNumero(m.r2p_medio, 0)}"
        </span>
      </div>
      ` : ''}
    `;
    }

    if (temNoite) {
        const n = stats.noite_calc;
        html += `
      <div class="stat-secao">🌙 Noite (${stats.noite.turnos} turnos)</div>
      <div class="stat-linha">
        <span class="stat-label">Vendas</span>
        <span class="stat-valor azul">${formatarMoeda(n.vendas)}</span>
      </div>
      <div class="stat-linha">
        <span class="stat-label">GC's</span>
        <span class="stat-valor">${formatarNumero(n.gcs, 0)}</span>
      </div>
      <div class="stat-linha">
        <span class="stat-label">BM Médio</span>
        <span class="stat-valor azul">${formatarMoeda(n.bm)}</span>
      </div>
      <div class="stat-linha">
        <span class="stat-label">Horas</span>
        <span class="stat-valor">${formatarNumero(n.horas, 1)}h</span>
      </div>
      <div class="stat-linha">
        <span class="stat-label">MO %</span>
        <span class="stat-valor ${n.mo <= CONSTANTES.MO_OBJETIVO ? 'verde' : 'vermelho'}">
          ${formatarPercentagem(n.mo)}
        </span>
      </div>
      <div class="stat-linha">
        <span class="stat-label">Dif. MO</span>
        <span class="stat-valor ${n.mo_dif <= 0 ? 'verde' : 'vermelho'}">
          ${formatarNumero(n.mo_dif, 2)}
        </span>
      </div>
      <div class="stat-linha">
        <span class="stat-label">Perdas</span>
        <span class="stat-valor">${formatarMoeda(n.perdas)} (${formatarNumero(n.perdas_pct, 2)}%)</span>
      </div>
      ${n.tet_medio > 0 ? `
      <div class="stat-linha">
        <span class="stat-label">TET Médio</span>
        <span class="stat-valor ${n.tet_medio <= CONSTANTES.TET_OBJETIVO ? 'verde' : 'vermelho'}">
          ${formatarNumero(n.tet_medio, 0)}"
        </span>
      </div>
      ` : ''}
      ${n.r2p_medio > 0 ? `
      <div class="stat-linha">
        <span class="stat-label">R2P Médio</span>
        <span class="stat-valor ${n.r2p_medio <= CONSTANTES.R2P_OBJETIVO ? 'verde' : 'vermelho'}">
          ${formatarNumero(n.r2p_medio, 0)}"
        </span>
      </div>
      ` : ''}
    `;
    }

    html += `</div></div>`;
    return html;
}

// ============= ATUALIZAR ANÁLISE DE GERENTES =============
function atualizarAnaliseGerentes() {
    const mesAnalise = parseInt(document.getElementById('select-mes-analise').value);
    const grid = document.getElementById('gerentes-grid');
    if (!grid) return;

    console.log(`📊 Calculando análise: ${CONSTANTES.MESES[mesAnalise]}`);

    let html = '';
    CONSTANTES.GERENTES.forEach(gerente => {
        const stats = calcularEstatisticasGerente(gerente, mesAnalise);
        const cor = CONSTANTES.CORES_GERENTES[gerente];
        html += renderizarCardGerente(gerente, stats, cor);
    });

    grid.innerHTML = html;
    console.log('✅ Análise atualizada');
}

// ============= INICIALIZAR TAB ANÁLISE =============
function inicializarTabAnalise() {
    const select = document.getElementById('select-mes-analise');
    if (select) {
        CONSTANTES.MESES.forEach((mes, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = mes;
            if (index === estado.mesAtual) {
                option.selected = true;
            }
            select.appendChild(option);
        });
        select.addEventListener('change', atualizarAnaliseGerentes);
    }

    const btnRecalcular = document.getElementById('btn-recalcular-analise');
    if (btnRecalcular) {
        btnRecalcular.addEventListener('click', atualizarAnaliseGerentes);
    }

    const btnTabAnalise = document.querySelector('[data-tab="analise"]');
    if (btnTabAnalise) {
        btnTabAnalise.addEventListener('click', () => {
            if (select) {
                select.value = estado.mesAtual;
            }
            atualizarAnaliseGerentes();
        });
    }
}
