// ============= PARTE 7: TURNO DA NOITE =============

// ADICIONAR ao inicializarCampos() - COPIAR ESTE BLOCO:

const camposNoite = [
    'n_vnd_real', 'n_vnd_plan', 'n_gcs_real', 'n_gcs_plan',
    'n_horas', 'n_perdas_real', 'n_perdas_mn', 'n_desinv',
    'n_tet', 'n_r2p', 'n_reemb_qtd', 'n_reemb_val', 'n_gerente'
];

camposNoite.forEach(campoId => {
    const campo = document.getElementById(campoId);
    if (campo) {
        campo.addEventListener('input', () => {
            calcularCampos('n');
            atualizarResumoDia();
            autoSalvar();
        });
    }
});

// ATUALIZAR a função atualizarResumoDia() - SUBSTITUIR POR:

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
