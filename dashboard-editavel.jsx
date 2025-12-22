import React, { useState } from 'react';

const DashboardPBorges = () => {
  const [data, setData] = useState({
    financeiro: {
      crescimentoVendas: {
        pborges: 0.1184,
        regiao: 0.0635,
        pbvsRegiao: (0.1184 - 0.0635) * 100, // 5.49
        tipologia: 0.0475,
        pbvsTipo: (0.1184 - 0.0475) * 100, // 7.09
        nacional: 0.073,
        pbvsNac: (0.1184 - 0.073) * 100 // 4.54
      },
      crescimentoGCs: {
        pborges: 0.0411,
        regiao: 0.0231,
        pbvsRegiao: (0.0411 - 0.0231) * 100, // 1.80
        tipologia: 0.0053,
        pbvsTipo: (0.0411 - 0.0053) * 100, // 3.58
        nacional: 0.0263,
        pbvsNac: (0.0411 - 0.0263) * 100 // 1.48
      },
      crescimentoDelivery: {
        pborges: 0.1926,
        regiao: 0.12,
        pbvsRegiao: (0.1926 - 0.12) * 100, // 7.26 (arredonda para 7.74 na imagem)
        tipologia: 0.0483,
        pbvsTipo: (0.1926 - 0.0483) * 100, // 14.43
        nacional: 0.1623,
        pbvsNac: (0.1926 - 0.1623) * 100 // 3.03
      },
      crescimentoGCsDelivery: {
        pborges: 0.1055,
        regiao: 0.091,
        pbvsRegiao: (0.1055 - 0.091) * 100, // 1.45
        tipologia: 0.0318,
        pbvsTipo: (0.1055 - 0.0318) * 100, // 7.37
        nacional: 0.1095,
        pbvsNac: (0.1055 - 0.1095) * 100 // -0.40
      },
      pesoDelivery: {
        pborges: 0.525,
        regiao: 0.289,
        pbvsRegiao: (0.525 - 0.289) * 100, // 23.60
        tipologia: 0.279,
        pbvsTipo: (0.525 - 0.279) * 100, // 24.60
        nacional: 0.181,
        pbvsNac: (0.525 - 0.181) * 100 // 34.40
      },
      pesoMOP: {
        pborges: 0.0036,
        regiao: 0.0072,
        pbvsRegiao: (0.0036 - 0.0072) * 100, // -0.36
        tipologia: 0.007,
        pbvsTipo: (0.0036 - 0.007) * 100, // -0.34
        nacional: 0.0093,
        pbvsNac: (0.0036 - 0.0093) * 100 // -0.57
      }
    },
    pace: {
      atual: 20,
      meta: 32,
      percentualAtual: 88,
      percentualMeta: 94
    },
    operacoes: {
      temposServico: { pborges: 105, objetivo: 95, variacao: 10, ly: 110, ytdVsLy: -5 },
      temposDelivery: { pborges: 366, objetivo: 306, variacao: 60, ly: 408, ytdVsLy: -42 },
      fastinsight: { pborges: 97.4, objetivo: 94.1, variacao: 3.3, ly: 95.1, ytdVsLy: 2.3 },
      turnover: { objetivo: 60, variacao: -60 },
      staffing: { objetivo: 35, variacao: -35 },
      bsv: { objetivo: 100, variacao: -100 }
    },
    vendasYTD: {
      ano2024: 2525592,
      ano2025: 2824671,
      variacao: 299079,
      percentual: 11.84
    },
    dadosMensais: {
      crescimentoVendas: {
        janeiro: null, fevereiro: null, marco: null, abril: null, maio: null,
        junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null,
        ytd: 0.1184, ly: null, variacao: 0.1184
      },
      crescimentoGCs: {
        janeiro: null, fevereiro: null, marco: null, abril: null, maio: null,
        junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null,
        ytd: 0.0411, ly: null, variacao: 0.0411
      },
      crescimentoDelivery: {
        janeiro: null, fevereiro: null, marco: null, abril: null, maio: null,
        junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null,
        ytd: 0.1926, ly: null, variacao: 0.1926
      },
      crescimentoGCsDelivery: {
        janeiro: null, fevereiro: null, marco: null, abril: null, maio: null,
        junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null,
        ytd: 0.1055, ly: null, variacao: 0.1055
      },
      pesoDelivery: {
        janeiro: null, fevereiro: null, marco: null, abril: null, maio: null,
        junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null,
        ytd: null, ly: null, variacao: null
      },
      pesoMOP: {
        janeiro: 0.0039, fevereiro: 0.0033, marco: 0.0034, abril: 0.0038, maio: 0.0038,
        junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null,
        ytd: null, ly: null, variacao: null
      },
      temposServico: {
        janeiro: null, fevereiro: null, marco: null, abril: null, maio: null,
        junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null,
        ytd: null, ly: 128, variacao: null
      },
      temposServicoNacional: {
        janeiro: 130, fevereiro: 136, marco: 150, abril: 156, maio: 162,
        junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null,
        ytd: null, ly: null, variacao: null
      },
      fastinsight: {
        janeiro: 0.981, fevereiro: 0.98, marco: 0.963, abril: 0.974, maio: 0.969,
        junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null,
        ytd: null, ly: null, variacao: 0
      },
      fastinsightNacional: {
        janeiro: 0.952, fevereiro: 0.947, marco: 0.937, abril: 0.935, maio: 0.927,
        junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null,
        ytd: null, ly: null, variacao: 0
      },
      turnover: {
        janeiro: null, fevereiro: null, marco: null, abril: null, maio: null,
        junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null,
        ytd: null, ly: null, variacao: 0
      },
      staffing: {
        janeiro: null, fevereiro: null, marco: null, abril: null, maio: null,
        junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null,
        ytd: null, ly: null, variacao: 0
      }
    },
    vendasDetalhadas: {
      vendasPB: {
        janeiro: null, fevereiro: null, marco: null, abril: null, maio: null,
        junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null,
        ytd: null, ly: 0.1669, variacao: -0.1669
      },
      vendasRegiao: {
        janeiro: null, fevereiro: null, marco: null, abril: null, maio: null,
        junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null,
        ytd: null, ly: 0.1952, variacao: -0.1952
      },
      pbVsRegiao: {
        janeiro: 0, fevereiro: 0, marco: 0, abril: 0, maio: 0,
        junho: 0, julho: 0, agosto: 0, setembro: 0, outubro: 0, novembro: 0, dezembro: 0,
        ytd: 0, ly: null, variacao: null
      },
      vendasTipologia: {
        janeiro: null, fevereiro: null, marco: null, abril: null, maio: null,
        junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null,
        ytd: null, ly: 0.1538, variacao: -0.1538
      },
      pbVsTipologia: {
        janeiro: 0, fevereiro: 0, marco: 0, abril: 0, maio: 0,
        junho: 0, julho: 0, agosto: 0, setembro: 0, outubro: 0, novembro: 0, dezembro: 0,
        ytd: 0, ly: null, variacao: null
      },
      vendasNacional: {
        janeiro: null, fevereiro: null, marco: null, abril: null, maio: null,
        junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null,
        ytd: 0.0852, ly: 0.1952, variacao: -0.11
      },
      pbVsNacional: {
        janeiro: 0, fevereiro: 0, marco: 0, abril: 0, maio: 0,
        junho: 0, julho: 0, agosto: 0, setembro: 0, outubro: 0, novembro: 0, dezembro: 0,
        ytd: -0.0852, ly: null, variacao: -0.0852
      },
      gcsPB: {
        janeiro: null, fevereiro: null, marco: null, abril: null, maio: null,
        junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null,
        ytd: null, ly: 0.1074, variacao: -0.1074
      },
      gcsRegiao: {
        janeiro: null, fevereiro: null, marco: null, abril: null, maio: null,
        junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null,
        ytd: null, ly: 0.1444, variacao: -0.1444
      },
      gcsTipologia: {
        janeiro: null, fevereiro: null, marco: null, abril: null, maio: null,
        junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null,
        ytd: null, ly: 0.0906, variacao: -0.0906
      },
      gcsNacional: {
        janeiro: null, fevereiro: null, marco: null, abril: null, maio: null,
        junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null,
        ytd: null, ly: 0.1444, variacao: -0.1444
      },
      deliveryPB: {
        janeiro: null, fevereiro: null, marco: null, abril: null, maio: null,
        junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null,
        ytd: 0.1926, ly: 0.1274, variacao: 0.0652
      },
      deliveryRegiao: {
        janeiro: null, fevereiro: null, marco: null, abril: null, maio: null,
        junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null,
        ytd: null, ly: 0.0976, variacao: -0.0976
      },
      deliveryNacional: {
        janeiro: null, fevereiro: null, marco: null, abril: null, maio: null,
        junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null,
        ytd: null, ly: 0.1068, variacao: -0.1068
      },
      gcsDeliveryPB: {
        janeiro: null, fevereiro: null, marco: null, abril: null, maio: null,
        junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null,
        ytd: 0.1055, ly: 0.0516, variacao: 0.0539
      },
      gcsDeliveryRegiao: {
        janeiro: null, fevereiro: null, marco: null, abril: null, maio: null,
        junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null,
        ytd: null, ly: 0.0156, variacao: -0.0156
      },
      gcsDeliveryNacional: {
        janeiro: null, fevereiro: null, marco: null, abril: null, maio: null,
        junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null,
        ytd: null, ly: 0.0267, variacao: -0.0267
      }
    }
  });

  const updateFinanceiro = (metrica, campo, valor) => {
    setData(prev => {
      const novoValor = parseFloat(valor) || 0;
      const metricaAtual = prev.financeiro[metrica];
      
      // Atualizar o campo modificado
      const metricaAtualizada = {
        ...metricaAtual,
        [campo]: novoValor
      };
      
      // Recalcular as comparações automaticamente
      // PBvsRegião = (P.Borges - Região) * 100
      metricaAtualizada.pbvsRegiao = (metricaAtualizada.pborges - metricaAtualizada.regiao) * 100;
      
      // PBvsTipo = (P.Borges - Tipologia) * 100
      metricaAtualizada.pbvsTipo = (metricaAtualizada.pborges - metricaAtualizada.tipologia) * 100;
      
      // PBvsNac = (P.Borges - Nacional) * 100
      metricaAtualizada.pbvsNac = (metricaAtualizada.pborges - metricaAtualizada.nacional) * 100;
      
      return {
        ...prev,
        financeiro: {
          ...prev.financeiro,
          [metrica]: metricaAtualizada
        }
      };
    });
  };

  const updateOperacao = (metrica, campo, valor) => {
    setData(prev => {
      const novoValor = parseFloat(valor) || 0;
      const metricaAtual = prev.operacoes[metrica];
      
      // Atualizar o campo modificado
      const metricaAtualizada = {
        ...metricaAtual,
        [campo]: novoValor
      };
      
      // Recalcular automaticamente as variações
      if (metrica === 'temposServico' || metrica === 'temposDelivery') {
        // Variação = P.Borges - Objetivo
        metricaAtualizada.variacao = metricaAtualizada.pborges - metricaAtualizada.objetivo;
        
        // YTD vs LY = P.Borges - LY
        if (metricaAtualizada.ly) {
          metricaAtualizada.ytdVsLy = metricaAtualizada.pborges - metricaAtualizada.ly;
        }
      } else if (metrica === 'fastinsight') {
        // Variação = (P.Borges - Objetivo) * 100
        metricaAtualizada.variacao = (metricaAtualizada.pborges - metricaAtualizada.objetivo) * 100;
        
        // YTD vs LY = (P.Borges - LY) * 100
        if (metricaAtualizada.ly) {
          metricaAtualizada.ytdVsLy = (metricaAtualizada.pborges - metricaAtualizada.ly) * 100;
        }
      } else if (metrica === 'turnover' || metrica === 'staffing' || metrica === 'bsv') {
        // Variação = -Objetivo (em percentagem)
        metricaAtualizada.variacao = -metricaAtualizada.objetivo;
      }
      
      return {
        ...prev,
        operacoes: {
          ...prev.operacoes,
          [metrica]: metricaAtualizada
        }
      };
    });
  };

  const updateDadosMensal = (metrica, campo, valor) => {
    setData(prev => ({
      ...prev,
      dadosMensais: {
        ...prev.dadosMensais,
        [metrica]: {
          ...prev.dadosMensais[metrica],
          [campo]: valor === '' ? null : parseFloat(valor)
        }
      }
    }));
  };

  const updateVendasDetalhadas = (metrica, campo, valor) => {
    setData(prev => ({
      ...prev,
      vendasDetalhadas: {
        ...prev.vendasDetalhadas,
        [metrica]: {
          ...prev.vendasDetalhadas[metrica],
          [campo]: valor === '' ? null : parseFloat(valor)
        }
      }
    }));
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-[1800px] mx-auto" style={{minWidth: '1400px'}}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-1">P.BORGES</h1>
          <p className="text-gray-500 text-sm">Resultados da Organização</p>
        </div>

        {/* Layout: FINANCEIRO (45%) | PACE (10%) | OPERAÇÕES (45%) - SEMPRE NA MESMA LINHA */}
        <div className="flex gap-3 mb-6">
          
          {/* FINANCEIRO - 45% */}
          <div style={{width: '45%'}} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
            <div className="bg-[#9DC183] px-2 py-2 text-center">
              <h2 className="text-[10px] font-bold text-black">FINANCEIRO</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left p-1 bg-zinc-900 text-gray-400 font-medium text-[9px]"></th>
                    <th className="text-center p-1 bg-zinc-900 text-gray-400 font-medium text-[9px]">P.Borges</th>
                    <th className="text-center p-1 bg-zinc-900 text-gray-400 font-medium text-[9px]">Região</th>
                    <th className="text-center p-1 bg-zinc-900 text-gray-400 font-medium text-[9px]">PBvsRegião</th>
                    <th className="text-center p-1 bg-zinc-900 text-gray-400 font-medium text-[9px]">Tipologia</th>
                    <th className="text-center p-1 bg-zinc-900 text-gray-400 font-medium text-[9px]">PBvsTipo</th>
                    <th className="text-center p-1 bg-zinc-900 text-gray-400 font-medium text-[9px]">Nacional</th>
                    <th className="text-center p-1 bg-zinc-900 text-gray-400 font-medium text-[9px]">PBvsNac</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(data.financeiro).map(([key, valores]) => (
                    <tr key={key} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                      <td className="p-1 text-gray-300 font-medium text-[9px] whitespace-nowrap">
                        {key === 'crescimentoVendas' && 'Crescimento de vendas'}
                        {key === 'crescimentoGCs' && "Crescimento de GC's"}
                        {key === 'crescimentoDelivery' && 'Crescimento Delivery'}
                        {key === 'crescimentoGCsDelivery' && "Crescimento GC's Delivery"}
                        {key === 'pesoDelivery' && 'Peso Delivery'}
                        {key === 'pesoMOP' && 'Peso MOP'}
                      </td>
                      <td className="p-0.5">
                        <input type="number" step="0.01" value={(valores.pborges * 100).toFixed(2)} 
                          onChange={(e) => updateFinanceiro(key, 'pborges', parseFloat(e.target.value) / 100)}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded px-1 py-0.5 text-center text-white text-[10px] focus:outline-none focus:border-zinc-600" />
                      </td>
                      <td className="p-0.5">
                        <input type="number" step="0.01" value={(valores.regiao * 100).toFixed(2)}
                          onChange={(e) => updateFinanceiro(key, 'regiao', parseFloat(e.target.value) / 100)}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded px-1 py-0.5 text-center text-white text-[10px] focus:outline-none focus:border-zinc-600" />
                      </td>
                      <td className="p-1 text-center font-mono text-gray-400 text-[10px]">{valores.pbvsRegiao.toFixed(2)}</td>
                      <td className="p-0.5">
                        <input type="number" step="0.01" value={(valores.tipologia * 100).toFixed(2)}
                          onChange={(e) => updateFinanceiro(key, 'tipologia', parseFloat(e.target.value) / 100)}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded px-1 py-0.5 text-center text-white text-[10px] focus:outline-none focus:border-zinc-600" />
                      </td>
                      <td className="p-1 text-center font-mono text-gray-400 text-[10px]">{valores.pbvsTipo.toFixed(2)}</td>
                      <td className="p-0.5">
                        <input type="number" step="0.01" value={(valores.nacional * 100).toFixed(2)}
                          onChange={(e) => updateFinanceiro(key, 'nacional', parseFloat(e.target.value) / 100)}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded px-1 py-0.5 text-center text-white text-[10px] focus:outline-none focus:border-zinc-600" />
                      </td>
                      <td className="p-1 text-center font-mono text-gray-400 text-[10px]">{valores.pbvsNac.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-2 text-[9px] text-gray-500 text-center border-t border-zinc-800">
              Vendas YTD
            </div>
          </div>

          {/* PACE - 10% */}
          <div style={{width: '10%'}} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
            <div className="bg-[#9DC183] px-2 py-1 text-center">
              <h2 className="text-[10px] font-bold text-black">PACE</h2>
            </div>
            <div className="p-2">
              {/* Grid 2x2 */}
              <div className="grid grid-cols-2 gap-1 mb-1">
                <div className="bg-zinc-800 rounded flex items-center justify-center h-16">
                  <span className="text-3xl font-bold text-white">{data.pace.atual}</span>
                </div>
                <div className="bg-zinc-800 rounded flex items-center justify-center h-16">
                  <span className="text-3xl font-bold text-white">{data.pace.meta}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="bg-white rounded flex items-center justify-center h-12">
                  <span className="text-xl font-bold text-black">{data.pace.percentualAtual}%</span>
                </div>
                <div className="bg-white rounded flex items-center justify-center h-12">
                  <span className="text-xl font-bold text-black">{data.pace.percentualMeta}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* OPERAÇÕES - 45% */}
          <div style={{width: '45%'}} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
            <div className="bg-[#9DC183] px-2 py-2 text-center">
              <h2 className="text-[10px] font-bold text-black">OPERAÇÕES</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left p-1 bg-zinc-900 text-gray-400 font-medium text-[9px]"></th>
                    <th className="text-center p-1 bg-zinc-900 text-gray-400 font-medium text-[9px]">P.Borges</th>
                    <th className="text-center p-1 bg-zinc-900 text-gray-400 font-medium text-[9px]">Nacional/Objetivo</th>
                    <th className="text-center p-1 bg-zinc-900 text-gray-400 font-medium text-[9px]">Variação</th>
                    <th className="text-center p-1 bg-zinc-900 text-gray-400 font-medium text-[9px]">LY</th>
                    <th className="text-center p-1 bg-zinc-900 text-gray-400 font-medium text-[9px]">YTD vs LY</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                    <td className="p-1 text-gray-300 font-medium text-[9px]">Tempos de Serviço</td>
                    <td className="p-0.5">
                      <input type="number" value={data.operacoes.temposServico.pborges} onChange={(e) => updateOperacao('temposServico', 'pborges', e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded px-1 py-0.5 text-center text-white text-[10px] focus:outline-none focus:border-zinc-600" />
                    </td>
                    <td className="p-0.5">
                      <input type="number" value={data.operacoes.temposServico.objetivo} onChange={(e) => updateOperacao('temposServico', 'objetivo', e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded px-1 py-0.5 text-center text-white text-[10px] focus:outline-none focus:border-zinc-600" />
                    </td>
                    <td className="p-1 text-center font-mono text-gray-400 text-[10px]">{data.operacoes.temposServico.variacao}</td>
                    <td className="p-1 text-center font-mono text-gray-400 text-[10px]">{data.operacoes.temposServico.ly}</td>
                    <td className="p-1 text-center font-mono text-gray-400 text-[10px]">{data.operacoes.temposServico.ytdVsLy}</td>
                  </tr>
                  <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                    <td className="p-1 text-gray-300 font-medium text-[9px]">Tempos Delivery</td>
                    <td className="p-0.5">
                      <input type="number" value={data.operacoes.temposDelivery.pborges} onChange={(e) => updateOperacao('temposDelivery', 'pborges', e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded px-1 py-0.5 text-center text-white text-[10px] focus:outline-none focus:border-zinc-600" />
                    </td>
                    <td className="p-0.5">
                      <input type="number" value={data.operacoes.temposDelivery.objetivo} onChange={(e) => updateOperacao('temposDelivery', 'objetivo', e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded px-1 py-0.5 text-center text-white text-[10px] focus:outline-none focus:border-zinc-600" />
                    </td>
                    <td className="p-1 text-center font-mono text-gray-400 text-[10px]">{data.operacoes.temposDelivery.variacao}</td>
                    <td className="p-1 text-center font-mono text-gray-400 text-[10px]">{data.operacoes.temposDelivery.ly}</td>
                    <td className="p-1 text-center font-mono text-gray-400 text-[10px]">{data.operacoes.temposDelivery.ytdVsLy}</td>
                  </tr>
                  <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                    <td className="p-1 text-gray-300 font-medium text-[9px]">Fastinsight</td>
                    <td className="p-0.5">
                      <input type="number" step="0.1" value={data.operacoes.fastinsight.pborges} onChange={(e) => updateOperacao('fastinsight', 'pborges', e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded px-1 py-0.5 text-center text-white text-[10px] focus:outline-none focus:border-zinc-600" />
                    </td>
                    <td className="p-0.5">
                      <input type="number" step="0.1" value={data.operacoes.fastinsight.objetivo} onChange={(e) => updateOperacao('fastinsight', 'objetivo', e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded px-1 py-0.5 text-center text-white text-[10px] focus:outline-none focus:border-zinc-600" />
                    </td>
                    <td className="p-1 text-center font-mono text-gray-400 text-[10px]">{data.operacoes.fastinsight.variacao.toFixed(1)}</td>
                    <td className="p-1 text-center font-mono text-gray-400 text-[10px]">{data.operacoes.fastinsight.ly.toFixed(1)}%</td>
                    <td className="p-1 text-center font-mono text-gray-400 text-[10px]">{data.operacoes.fastinsight.ytdVsLy.toFixed(1)}</td>
                  </tr>
                  <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                    <td className="p-1 text-gray-300 font-medium text-[9px]">Turnover</td>
                    <td className="p-1 text-center text-gray-600 text-[10px]">-</td>
                    <td className="p-0.5">
                      <input type="number" value={data.operacoes.turnover.objetivo} onChange={(e) => updateOperacao('turnover', 'objetivo', e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded px-1 py-0.5 text-center text-white text-[10px] focus:outline-none focus:border-zinc-600" />
                    </td>
                    <td className="p-1 text-center font-mono text-gray-400 text-[10px]">{data.operacoes.turnover.variacao}%</td>
                    <td className="p-1 text-center text-gray-600 text-[10px]">-60,00%</td>
                    <td className="p-1 text-center text-gray-600 text-[10px]">-</td>
                  </tr>
                  <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                    <td className="p-1 text-gray-300 font-medium text-[9px]">Staffing</td>
                    <td className="p-1 text-center text-gray-600 text-[10px]">-</td>
                    <td className="p-0.5">
                      <input type="number" value={data.operacoes.staffing.objetivo} onChange={(e) => updateOperacao('staffing', 'objetivo', e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded px-1 py-0.5 text-center text-white text-[10px] focus:outline-none focus:border-zinc-600" />
                    </td>
                    <td className="p-1 text-center font-mono text-gray-400 text-[10px]">{data.operacoes.staffing.variacao}%</td>
                    <td className="p-1 text-center text-gray-600 text-[10px]">-</td>
                    <td className="p-1 text-center text-gray-600 text-[10px]">-35%</td>
                  </tr>
                  <tr className="hover:bg-zinc-800/30">
                    <td className="p-1 text-gray-300 font-medium text-[9px]">BSV</td>
                    <td className="p-1 text-center text-gray-600 text-[10px]">-</td>
                    <td className="p-0.5">
                      <input type="number" value={data.operacoes.bsv.objetivo} onChange={(e) => updateOperacao('bsv', 'objetivo', e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded px-1 py-0.5 text-center text-white text-[10px] focus:outline-none focus:border-zinc-600" />
                    </td>
                    <td className="p-1 text-center font-mono text-gray-400 text-[10px]">{data.operacoes.bsv.variacao}%</td>
                    <td className="p-1 text-center text-gray-600 text-[10px]">-</td>
                    <td className="p-1 text-center text-gray-600 text-[10px]">-100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* TABELA DE DADOS MENSAIS */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden mb-6">
          <div className="bg-[#9DC183] px-3 py-2">
            <h2 className="text-xs font-bold text-black">DADOS MENSAIS</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[10px]">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left p-2 bg-zinc-900 text-gray-400 font-medium"></th>
                  <th className="text-center p-2 bg-zinc-900 text-gray-400 font-medium">Janeiro</th>
                  <th className="text-center p-2 bg-zinc-900 text-gray-400 font-medium">Fevereiro</th>
                  <th className="text-center p-2 bg-zinc-900 text-gray-400 font-medium">Março</th>
                  <th className="text-center p-2 bg-zinc-900 text-gray-400 font-medium">Abril</th>
                  <th className="text-center p-2 bg-zinc-900 text-gray-400 font-medium">Maio</th>
                  <th className="text-center p-2 bg-zinc-900 text-gray-400 font-medium">Junho</th>
                  <th className="text-center p-2 bg-zinc-900 text-gray-400 font-medium">Julho</th>
                  <th className="text-center p-2 bg-zinc-900 text-gray-400 font-medium">Agosto</th>
                  <th className="text-center p-2 bg-zinc-900 text-gray-400 font-medium">Setembro</th>
                  <th className="text-center p-2 bg-zinc-900 text-gray-400 font-medium">Outubro</th>
                  <th className="text-center p-2 bg-zinc-900 text-gray-400 font-medium">Novembro</th>
                  <th className="text-center p-2 bg-zinc-900 text-gray-400 font-medium">Dezembro</th>
                  <th className="text-center p-2 bg-zinc-900 text-gray-400 font-medium">YTD</th>
                  <th className="text-center p-2 bg-zinc-900 text-gray-400 font-medium">LY</th>
                  <th className="text-center p-2 bg-zinc-900 text-gray-400 font-medium">Variação</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="p-2 text-gray-300 font-medium">Crescimento de vendas</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center font-mono text-white">11,84%</td>
                  <td className="p-2 text-center font-mono text-gray-400">-</td>
                  <td className="p-2 text-center font-mono text-white">11,84%</td>
                </tr>
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="p-2 text-gray-300 font-medium">Crescimento de GC's</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center font-mono text-white">4,11%</td>
                  <td className="p-2 text-center font-mono text-gray-400">-</td>
                  <td className="p-2 text-center font-mono text-white">4,11%</td>
                </tr>
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="p-2 text-gray-300 font-medium">Crescimento Delivery</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center font-mono text-white">19,26%</td>
                  <td className="p-2 text-center font-mono text-gray-400">-</td>
                  <td className="p-2 text-center font-mono text-white">19,26%</td>
                </tr>
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="p-2 text-gray-300 font-medium">Crescimento GC's Delivery</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center font-mono text-white">10,55%</td>
                  <td className="p-2 text-center font-mono text-gray-400">-</td>
                  <td className="p-2 text-center font-mono text-white">10,55%</td>
                </tr>
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="p-2 text-gray-300 font-medium">Peso Delivery</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                </tr>
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="p-2 text-gray-300 font-medium">Peso MOP</td>
                  <td className="p-2 text-center font-mono text-white">0,39%</td>
                  <td className="p-2 text-center font-mono text-white">0,33%</td>
                  <td className="p-2 text-center font-mono text-white">0,34%</td>
                  <td className="p-2 text-center font-mono text-white">0,38%</td>
                  <td className="p-2 text-center font-mono text-white">0,38%</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                </tr>
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="p-2 text-gray-300 font-medium">Tempos de Serviço</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                  <td className="p-2 text-center font-mono text-white">128</td>
                  <td className="p-2 text-center bg-red-950/30 text-red-400 text-[9px]">#REF!</td>
                </tr>
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="p-2 text-gray-300 font-medium">Tempos de serviço Nacional</td>
                  <td className="p-2 text-center font-mono text-white">130</td>
                  <td className="p-2 text-center font-mono text-white">135</td>
                  <td className="p-2 text-center font-mono text-white">150</td>
                  <td className="p-2 text-center font-mono text-white">-</td>
                  <td className="p-2 text-center font-mono text-white">162</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                </tr>
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="p-2 text-gray-300 font-medium">Fastinsight</td>
                  <td className="p-2 text-center font-mono text-white">98,1%</td>
                  <td className="p-2 text-center font-mono text-white">98,0%</td>
                  <td className="p-2 text-center font-mono text-white">96,3%</td>
                  <td className="p-2 text-center font-mono text-white">97,4%</td>
                  <td className="p-2 text-center font-mono text-white">96,9%</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center font-mono text-white">0,0%</td>
                </tr>
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="p-2 text-gray-300 font-medium">Fastinsight Nacional</td>
                  <td className="p-2 text-center font-mono text-white">95,2%</td>
                  <td className="p-2 text-center font-mono text-white">94,7%</td>
                  <td className="p-2 text-center font-mono text-white">93,7%</td>
                  <td className="p-2 text-center font-mono text-white">93,5%</td>
                  <td className="p-2 text-center font-mono text-white">92,7%</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                </tr>
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="p-2 text-gray-300 font-medium">Turnover</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                </tr>
                <tr className="hover:bg-zinc-800/30">
                  <td className="p-2 text-gray-300 font-medium">Staffing</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center font-mono text-white">0%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* TABELA DE ANÁLISE DETALHADA DE VENDAS */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden mb-6">
          <div className="bg-[#9DC183] px-3 py-2">
            <h2 className="text-xs font-bold text-black">ANÁLISE DETALHADA DE VENDAS</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[10px]">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left p-2 bg-zinc-900 text-gray-400 font-medium"></th>
                  <th className="text-center p-2 bg-zinc-900 text-gray-400 font-medium">Janeiro</th>
                  <th className="text-center p-2 bg-zinc-900 text-gray-400 font-medium">Fevereiro</th>
                  <th className="text-center p-2 bg-zinc-900 text-gray-400 font-medium">Março</th>
                  <th className="text-center p-2 bg-zinc-900 text-gray-400 font-medium">Abril</th>
                  <th className="text-center p-2 bg-zinc-900 text-gray-400 font-medium">Maio</th>
                  <th className="text-center p-2 bg-zinc-900 text-gray-400 font-medium">Junho</th>
                  <th className="text-center p-2 bg-zinc-900 text-gray-400 font-medium">Julho</th>
                  <th className="text-center p-2 bg-zinc-900 text-gray-400 font-medium">Agosto</th>
                  <th className="text-center p-2 bg-zinc-900 text-gray-400 font-medium">Setembro</th>
                  <th className="text-center p-2 bg-zinc-900 text-gray-400 font-medium">Outubro</th>
                  <th className="text-center p-2 bg-zinc-900 text-gray-400 font-medium">Novembro</th>
                  <th className="text-center p-2 bg-zinc-900 text-gray-400 font-medium">Dezembro</th>
                  <th className="text-center p-2 bg-zinc-900 text-gray-400 font-medium">YTD</th>
                  <th className="text-center p-2 bg-zinc-900 text-gray-400 font-medium">LY</th>
                  <th className="text-center p-2 bg-zinc-900 text-gray-400 font-medium">Variação</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="p-2 text-gray-300 font-semibold">Vendas PB</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center font-mono text-white">16,69%</td>
                  <td className="p-2 text-center font-mono text-red-400">-16,69</td>
                </tr>
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="p-2 text-gray-300 font-medium">Vendas Região</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center font-mono text-white">19,52%</td>
                  <td className="p-2 text-center font-mono text-red-400">-19,52</td>
                </tr>
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="p-2 text-gray-400 font-medium pl-6">PB vs Região</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                </tr>
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="p-2 text-gray-300 font-medium">Vendas Tipologia (Free Stand)</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center font-mono text-white">15,38%</td>
                  <td className="p-2 text-center font-mono text-red-400">-15,38</td>
                </tr>
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="p-2 text-gray-400 font-medium pl-6">PB vs Tipologia</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                </tr>
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="p-2 text-gray-300 font-medium">Vendas Nacional</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center font-mono text-white">8,52%</td>
                  <td className="p-2 text-center font-mono text-white">19,52%</td>
                  <td className="p-2 text-center font-mono text-red-400">-11,00</td>
                </tr>
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="p-2 text-gray-400 font-medium pl-6">PB vs Nacional</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-white">0,00%</td>
                  <td className="p-2 text-center font-mono text-red-400">-8,52%</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center font-mono text-red-400">-8,52</td>
                </tr>
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30 bg-zinc-800/20">
                  <td className="p-2 text-gray-300 font-semibold">GC's PB</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center font-mono text-white">10,74%</td>
                  <td className="p-2 text-center font-mono text-red-400">-10,74</td>
                </tr>
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="p-2 text-gray-300 font-medium">Gc's Região</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center font-mono text-white">14,44%</td>
                  <td className="p-2 text-center font-mono text-red-400">-14,44</td>
                </tr>
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="p-2 text-gray-300 font-medium">Gc's Tipologia</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center font-mono text-white">9,06%</td>
                  <td className="p-2 text-center font-mono text-red-400">-9,06</td>
                </tr>
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="p-2 text-gray-300 font-medium">Gc's Nacional</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center font-mono text-white">14,44%</td>
                  <td className="p-2 text-center font-mono text-red-400">-14,44</td>
                </tr>
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30 bg-zinc-800/20">
                  <td className="p-2 text-gray-300 font-semibold">Delivery PB</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center font-mono text-white">19,26%</td>
                  <td className="p-2 text-center font-mono text-white">12,74%</td>
                  <td className="p-2 text-center font-mono text-green-400">6,52</td>
                </tr>
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="p-2 text-gray-300 font-medium">Delivery Região</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center font-mono text-white">9,76%</td>
                  <td className="p-2 text-center font-mono text-red-400">-9,76</td>
                </tr>
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="p-2 text-gray-300 font-medium">Delivery Nacional</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center font-mono text-white">10,68%</td>
                  <td className="p-2 text-center font-mono text-red-400">-10,68</td>
                </tr>
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30 bg-zinc-800/20">
                  <td className="p-2 text-gray-300 font-semibold">Gc's Delivery PB</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center font-mono text-white">10,55%</td>
                  <td className="p-2 text-center font-mono text-white">5,16%</td>
                  <td className="p-2 text-center font-mono text-green-400">5,39</td>
                </tr>
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                  <td className="p-2 text-gray-300 font-medium">Gc's Delivery Região</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center font-mono text-white">1,56%</td>
                  <td className="p-2 text-center font-mono text-red-400">-1,56</td>
                </tr>
                <tr className="hover:bg-zinc-800/30">
                  <td className="p-2 text-gray-300 font-medium">Gc's Delivery Nacional</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center text-gray-600">-</td>
                  <td className="p-2 text-center font-mono text-white">2,67%</td>
                  <td className="p-2 text-center font-mono text-red-400">-2,67</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Nota */}
        <div className="text-xs text-gray-500 text-center mt-4">
          Dashboard P.BORGES - Última atualização: 1-8
        </div>
      </div>
    </div>
  );
};

export default DashboardPBorges;