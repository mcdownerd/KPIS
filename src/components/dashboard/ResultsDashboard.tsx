import React, { useState } from 'react';
import { TrendingUp, Save, BarChart3, Clock, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ResultsDashboard() {
    const [data, setData] = useState({
        financeiro: {
            crescimentoVendas: { pborges: 0.1184, regiao: 0.0635, pbvsRegiao: 5.49, tipologia: 0.0475, pbvsTipo: 7.09, nacional: 0.073, pbvsNac: 4.54 },
            crescimentoGCs: { pborges: 0.0411, regiao: 0.0231, pbvsRegiao: 1.80, tipologia: 0.0053, pbvsTipo: 3.58, nacional: 0.0263, pbvsNac: 1.48 },
            crescimentoDelivery: { pborges: 0.1926, regiao: 0.12, pbvsRegiao: 7.26, tipologia: 0.0483, pbvsTipo: 14.43, nacional: 0.1623, pbvsNac: 3.03 },
            crescimentoGCsDelivery: { pborges: 0.1055, regiao: 0.091, pbvsRegiao: 1.45, tipologia: 0.0318, pbvsTipo: 7.37, nacional: 0.1095, pbvsNac: -0.40 },
            pesoDelivery: { pborges: 0.525, regiao: 0.289, pbvsRegiao: 23.60, tipologia: 0.279, pbvsTipo: 24.60, nacional: 0.181, pbvsNac: 34.40 },
            pesoMOP: { pborges: 0.0036, regiao: 0.0072, pbvsRegiao: -0.36, tipologia: 0.007, pbvsTipo: -0.34, nacional: 0.0093, pbvsNac: -0.57 }
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
        dadosMensais: {
            crescimentoVendas: { janeiro: null, fevereiro: null, marco: null, abril: null, maio: null, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: 0.1184, ly: null, variacao: 0.1184 },
            crescimentoGCs: { janeiro: null, fevereiro: null, marco: null, abril: null, maio: null, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: 0.0411, ly: null, variacao: 0.0411 },
            crescimentoDelivery: { janeiro: null, fevereiro: null, marco: null, abril: null, maio: null, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: 0.1926, ly: null, variacao: 0.1926 },
            crescimentoGCsDelivery: { janeiro: null, fevereiro: null, marco: null, abril: null, maio: null, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: 0.1055, ly: null, variacao: 0.1055 },
            pesoDelivery: { janeiro: null, fevereiro: null, marco: null, abril: null, maio: null, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: null, ly: null, variacao: null },
            pesoMOP: { janeiro: 0.0039, fevereiro: 0.0033, marco: 0.0034, abril: 0.0038, maio: 0.0038, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: null, ly: null, variacao: null },
            temposServico: { janeiro: null, fevereiro: null, marco: null, abril: null, maio: null, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: null, ly: 128, variacao: null },
            temposServicoNacional: { janeiro: 130, fevereiro: 136, marco: 150, abril: 156, maio: 162, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: null, ly: null, variacao: null },
            fastinsight: { janeiro: 0.981, fevereiro: 0.98, marco: 0.963, abril: 0.974, maio: 0.969, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: null, ly: null, variacao: 0 },
            fastinsightNacional: { janeiro: 0.952, fevereiro: 0.947, marco: 0.937, abril: 0.935, maio: 0.927, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: null, ly: null, variacao: 0 },
            turnover: { janeiro: null, fevereiro: null, marco: null, abril: null, maio: null, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: null, ly: null, variacao: 0 },
            staffing: { janeiro: null, fevereiro: null, marco: null, abril: null, maio: null, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: null, ly: null, variacao: 0 }
        },
        vendasDetalhadas: {
            vendasPB: { janeiro: null, fevereiro: null, marco: null, abril: null, maio: null, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: null, ly: 0.1669, variacao: -0.1669 },
            vendasRegiao: { janeiro: null, fevereiro: null, marco: null, abril: null, maio: null, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: null, ly: 0.1952, variacao: -0.1952 },
            pbVsRegiao: { janeiro: 0, fevereiro: 0, marco: 0, abril: 0, maio: 0, junho: 0, julho: 0, agosto: 0, setembro: 0, outubro: 0, novembro: 0, dezembro: 0, ytd: 0, ly: null, variacao: null },
            vendasTipologia: { janeiro: null, fevereiro: null, marco: null, abril: null, maio: null, junho: null, julho: null, agosto: null, SEPTEMBER: null, OCTOBER: null, NOVEMBER: null, DECEMBER: null, ytd: null, ly: 0.1538, variacao: -0.1538 },
            pbVsTipologia: { janeiro: 0, fevereiro: 0, marco: 0, abril: 0, maio: 0, junho: 0, julho: 0, agosto: 0, setembro: 0, outubro: 0, novembro: 0, dezembro: 0, ytd: 0, ly: null, variacao: null },
            vendasNacional: { janeiro: null, fevereiro: null, marco: null, abril: null, maio: null, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: 0.0852, ly: 0.1952, variacao: -0.11 },
            pbVsNacional: { janeiro: 0, fevereiro: 0, marco: 0, abril: 0, maio: 0, junho: 0, julho: 0, agosto: 0, setembro: 0, outubro: 0, novembro: 0, dezembro: 0, ytd: -0.0852, ly: null, variacao: -0.0852 },
            gcsPB: { janeiro: null, fevereiro: null, marco: null, abril: null, maio: null, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: null, ly: 0.1074, variacao: -0.1074 },
            gcsRegiao: { janeiro: null, fevereiro: null, marco: null, abril: null, maio: null, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: null, ly: 0.1444, variacao: -0.1444 },
            gcsTipologia: { janeiro: null, fevereiro: null, marco: null, abril: null, maio: null, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: null, ly: 0.0906, variacao: -0.0906 },
            gcsNacional: { janeiro: null, fevereiro: null, marco: null, abril: null, maio: null, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: null, ly: 0.1444, variacao: -0.1444 },
            deliveryPB: { janeiro: null, fevereiro: null, marco: null, abril: null, maio: null, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: 0.1926, ly: 0.1274, variacao: 0.0652 },
            deliveryRegiao: { janeiro: null, fevereiro: null, marco: null, abril: null, maio: null, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: null, ly: 0.0976, variacao: -0.0976 },
            deliveryNacional: { janeiro: null, fevereiro: null, marco: null, abril: null, maio: null, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: null, ly: 0.1068, variacao: -0.1068 },
            gcsDeliveryPB: { janeiro: null, fevereiro: null, marco: null, abril: null, maio: null, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: 0.1055, ly: 0.0516, variacao: 0.0539 },
            gcsDeliveryRegiao: { janeiro: null, fevereiro: null, marco: null, abril: null, maio: null, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: null, ly: 0.0156, variacao: -0.0156 },
            gcsDeliveryNacional: { janeiro: null, fevereiro: null, marco: null, abril: null, maio: null, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: null, ly: 0.0267, variacao: -0.0267 }
        }
    });

    const updateFinanceiro = (metrica: string, campo: string, valor: string) => {
        setData(prev => {
            const novoValor = parseFloat(valor) || 0;
            const metricaAtual = (prev.financeiro as any)[metrica];
            const metricaAtualizada = { ...metricaAtual, [campo]: novoValor };
            metricaAtualizada.pbvsRegiao = (metricaAtualizada.pborges - metricaAtualizada.regiao) * 100;
            metricaAtualizada.pbvsTipo = (metricaAtualizada.pborges - metricaAtualizada.tipologia) * 100;
            metricaAtualizada.pbvsNac = (metricaAtualizada.pborges - metricaAtualizada.nacional) * 100;
            return { ...prev, financeiro: { ...prev.financeiro, [metrica]: metricaAtualizada } };
        });
    };

    const updateOperacao = (metrica: string, campo: string, valor: string) => {
        setData(prev => {
            const novoValor = parseFloat(valor) || 0;
            const metricaAtual = (prev.operacoes as any)[metrica];
            const metricaAtualizada = { ...metricaAtual, [campo]: novoValor };
            if (metrica === 'temposServico' || metrica === 'temposDelivery') {
                metricaAtualizada.variacao = metricaAtualizada.pborges - metricaAtualizada.objetivo;
                if (metricaAtualizada.ly) metricaAtualizada.ytdVsLy = metricaAtualizada.pborges - metricaAtualizada.ly;
            } else if (metrica === 'fastinsight') {
                metricaAtualizada.variacao = (metricaAtualizada.pborges - metricaAtualizada.objetivo) * 100;
                if (metricaAtualizada.ly) metricaAtualizada.ytdVsLy = (metricaAtualizada.pborges - metricaAtualizada.ly) * 100;
            } else {
                metricaAtualizada.variacao = -metricaAtualizada.objetivo;
            }
            return { ...prev, operacoes: { ...prev.operacoes, [metrica]: metricaAtualizada } };
        });
    };

    const months = ["janeiro", "fevereiro", "marco", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold text-foreground">Resultados da Organização</h2>
                </div>
            </div>

            {/* Top Row: Financeiro | Pace | Operações */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch">
                {/* FINANCEIRO */}
                <Card className="w-full lg:w-[45%] border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="bg-black py-2 border-b border-border/50">
                        <CardTitle className="text-xs font-bold text-white text-center uppercase tracking-wider flex items-center justify-center gap-2">
                            <BarChart3 className="h-3 w-3" /> Financeiro
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-[11px]">
                                <thead>
                                    <tr className="border-b border-border/50 bg-muted/20">
                                        <th className="text-left p-2 text-muted-foreground font-medium">Métrica</th>
                                        <th className="text-center p-2 text-muted-foreground font-medium">P.Borges</th>
                                        <th className="text-center p-2 text-muted-foreground font-medium">Região</th>
                                        <th className="text-center p-2 text-muted-foreground font-medium">PB vs Reg</th>
                                        <th className="text-center p-2 text-muted-foreground font-medium">Tipo</th>
                                        <th className="text-center p-2 text-muted-foreground font-medium">PB vs Tipo</th>
                                        <th className="text-center p-2 text-muted-foreground font-medium">Nac</th>
                                        <th className="text-center p-2 text-muted-foreground font-medium">PB vs Nac</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(data.financeiro).map(([key, valores]: [string, any]) => (
                                        <tr key={key} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                                            <td className="p-2 font-medium text-foreground whitespace-nowrap">
                                                {key === 'crescimentoVendas' && 'Crescimento Vendas'}
                                                {key === 'crescimentoGCs' && "Crescimento de GC's"}
                                                {key === 'crescimentoDelivery' && 'Crescimento Delivery'}
                                                {key === 'crescimentoGCsDelivery' && "GC's Delivery"}
                                                {key === 'pesoDelivery' && 'Peso Delivery'}
                                                {key === 'pesoMOP' && 'Peso MOP'}
                                            </td>
                                            <td className="p-1">
                                                <Input type="number" step="0.01" value={(valores.pborges * 100).toFixed(2)} onChange={(e) => updateFinanceiro(key, 'pborges', e.target.value)} className="h-7 w-16 text-center text-[11px] bg-background/50" />
                                            </td>
                                            <td className="p-1">
                                                <Input type="number" step="0.01" value={(valores.regiao * 100).toFixed(2)} onChange={(e) => updateFinanceiro(key, 'regiao', e.target.value)} className="h-7 w-16 text-center text-[11px] bg-background/50" />
                                            </td>
                                            <td className={`p-2 text-center font-mono ${valores.pbvsRegiao >= 0 ? 'text-green-500' : 'text-red-500'}`}>{valores.pbvsRegiao.toFixed(2)}</td>
                                            <td className="p-1">
                                                <Input type="number" step="0.01" value={(valores.tipologia * 100).toFixed(2)} onChange={(e) => updateFinanceiro(key, 'tipologia', e.target.value)} className="h-7 w-16 text-center text-[11px] bg-background/50" />
                                            </td>
                                            <td className={`p-2 text-center font-mono ${valores.pbvsTipo >= 0 ? 'text-green-500' : 'text-red-500'}`}>{valores.pbvsTipo.toFixed(2)}</td>
                                            <td className="p-1">
                                                <Input type="number" step="0.01" value={(valores.nacional * 100).toFixed(2)} onChange={(e) => updateFinanceiro(key, 'nacional', e.target.value)} className="h-7 w-16 text-center text-[11px] bg-background/50" />
                                            </td>
                                            <td className={`p-2 text-center font-mono ${valores.pbvsNac >= 0 ? 'text-green-500' : 'text-red-500'}`}>{valores.pbvsNac.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* PACE */}
                {/* PACE */}
                <Card className="w-full lg:w-[15%] border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden flex flex-col min-w-[110px]">
                    <CardHeader className="bg-black py-2 border-b border-border/50">
                        <CardTitle className="text-[10px] font-bold text-white text-center uppercase tracking-wider flex items-center justify-center gap-2">
                            <Target className="h-3 w-3" /> PACE
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 flex flex-col">
                        <div className="grid grid-cols-2 bg-[#d9ead3] dark:bg-zinc-900/50 border-b border-[#93c47d] dark:border-border/50">
                            <div className="py-2 text-center border-r border-[#93c47d] dark:border-border/50">
                                <span className="text-base font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] dark:drop-shadow-none">{data.pace.atual}</span>
                            </div>
                            <div className="py-2 text-center">
                                <span className="text-base font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] dark:drop-shadow-none">{data.pace.meta}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 flex-1 bg-white dark:bg-zinc-900">
                            <div className="py-4 flex items-center justify-center border-r border-[#93c47d] dark:border-border/50">
                                <span className="text-lg font-bold text-[#38761d] dark:text-white">{data.pace.percentualAtual}%</span>
                            </div>
                            <div className="py-4 flex items-center justify-center">
                                <span className="text-lg font-bold text-[#38761d] dark:text-white">{data.pace.percentualMeta}%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* OPERAÇÕES */}
                <Card className="w-full lg:w-[40%] border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="bg-black py-2 border-b border-border/50">
                        <CardTitle className="text-[10px] font-bold text-white text-center uppercase tracking-wider flex items-center justify-center gap-2">
                            <Clock className="h-3 w-3" /> Operações
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-[11px]">
                                <thead>
                                    <tr className="border-b border-border/50 bg-muted/20">
                                        <th className="text-left p-2 text-muted-foreground font-medium">Métrica</th>
                                        <th className="text-center p-2 text-muted-foreground font-medium">P.Borges</th>
                                        <th className="text-center p-2 text-muted-foreground font-medium">Objetivo</th>
                                        <th className="text-center p-2 text-muted-foreground font-medium">Var</th>
                                        <th className="text-center p-2 text-muted-foreground font-medium">LY</th>
                                        <th className="text-center p-2 text-muted-foreground font-medium">YTD vs LY</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                                        <td className="p-2 font-bold text-white">Tempos Serviço</td>
                                        <td className="p-1">
                                            <Input type="number" value={data.operacoes.temposServico.pborges} onChange={(e) => updateOperacao('temposServico', 'pborges', e.target.value)} className="h-7 w-16 text-center text-[11px] bg-zinc-900/50 border-zinc-800 rounded-full" />
                                        </td>
                                        <td className="p-1">
                                            <Input type="number" value={data.operacoes.temposServico.objetivo} onChange={(e) => updateOperacao('temposServico', 'objetivo', e.target.value)} className="h-7 w-16 text-center text-[11px] bg-zinc-900/50 border-zinc-800 rounded-full" />
                                        </td>
                                        <td className="p-2 text-center font-bold text-white">{data.operacoes.temposServico.variacao}</td>
                                        <td className="p-2 text-center font-medium text-muted-foreground">{data.operacoes.temposServico.ly}</td>
                                        <td className="p-2 text-center font-bold text-white">{data.operacoes.temposServico.ytdVsLy}</td>
                                    </tr>
                                    <tr className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                                        <td className="p-2 font-bold text-white">Tempos Delivery</td>
                                        <td className="p-1">
                                            <Input type="number" value={data.operacoes.temposDelivery.pborges} onChange={(e) => updateOperacao('temposDelivery', 'pborges', e.target.value)} className="h-7 w-16 text-center text-[11px] bg-zinc-900/50 border-zinc-800 rounded-full" />
                                        </td>
                                        <td className="p-1">
                                            <Input type="number" value={data.operacoes.temposDelivery.objetivo} onChange={(e) => updateOperacao('temposDelivery', 'objetivo', e.target.value)} className="h-7 w-16 text-center text-[11px] bg-zinc-900/50 border-zinc-800 rounded-full" />
                                        </td>
                                        <td className="p-2 text-center font-bold text-white">{data.operacoes.temposDelivery.variacao}</td>
                                        <td className="p-2 text-center font-medium text-muted-foreground">{data.operacoes.temposDelivery.ly}</td>
                                        <td className="p-2 text-center font-bold text-white">{data.operacoes.temposDelivery.ytdVsLy}</td>
                                    </tr>
                                    <tr className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                                        <td className="p-2 font-bold text-white">Fastinsight</td>
                                        <td className="p-1">
                                            <Input type="number" step="0.1" value={data.operacoes.fastinsight.pborges} onChange={(e) => updateOperacao('fastinsight', 'pborges', e.target.value)} className="h-7 w-16 text-center text-[11px] bg-zinc-900/50 border-zinc-800 rounded-full" />
                                        </td>
                                        <td className="p-1">
                                            <Input type="number" step="0.1" value={data.operacoes.fastinsight.objetivo} onChange={(e) => updateOperacao('fastinsight', 'objetivo', e.target.value)} className="h-7 w-16 text-center text-[11px] bg-zinc-900/50 border-zinc-800 rounded-full" />
                                        </td>
                                        <td className="p-2 text-center font-bold text-white">{data.operacoes.fastinsight.variacao.toFixed(1)}</td>
                                        <td className="p-2 text-center font-medium text-muted-foreground">{data.operacoes.fastinsight.ly.toFixed(1)}%</td>
                                        <td className="p-2 text-center font-bold text-white">{data.operacoes.fastinsight.ytdVsLy.toFixed(1)}</td>
                                    </tr>
                                    <tr className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                                        <td className="p-2 font-bold text-white">Turnover</td>
                                        <td className="p-2 text-center text-muted-foreground">-</td>
                                        <td className="p-1">
                                            <Input type="number" value={data.operacoes.turnover.objetivo} onChange={(e) => updateOperacao('turnover', 'objetivo', e.target.value)} className="h-7 w-16 text-center text-[11px] bg-zinc-900/50 border-zinc-800 rounded-full" />
                                        </td>
                                        <td className="p-2 text-center font-bold text-white">{data.operacoes.turnover.variacao}%</td>
                                        <td className="p-2 text-center font-medium text-muted-foreground">-60%</td>
                                        <td className="p-2 text-center text-muted-foreground">-</td>
                                    </tr>
                                    <tr className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                                        <td className="p-2 font-bold text-white">Staffing</td>
                                        <td className="p-2 text-center text-muted-foreground">-</td>
                                        <td className="p-1">
                                            <Input type="number" value={data.operacoes.staffing.objetivo} onChange={(e) => updateOperacao('staffing', 'objetivo', e.target.value)} className="h-7 w-16 text-center text-[11px] bg-zinc-900/50 border-zinc-800 rounded-full" />
                                        </td>
                                        <td className="p-2 text-center font-bold text-white">{data.operacoes.staffing.variacao}%</td>
                                        <td className="p-2 text-center text-muted-foreground">-</td>
                                        <td className="p-2 text-center font-bold text-white">-35%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* DADOS MENSAIS */}
            <Card className="border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
                <CardHeader className="bg-black py-2 border-b border-border/50">
                    <CardTitle className="text-xs font-bold text-white text-center uppercase tracking-wider">Dados Mensais</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-[10px]">
                            <thead>
                                <tr className="border-b border-border/50 bg-muted/20">
                                    <th className="text-left p-2 text-muted-foreground font-medium">Métrica</th>
                                    {months.map(m => <th key={m} className="text-center p-2 text-muted-foreground font-medium capitalize">{m}</th>)}
                                    <th className="text-center p-2 text-muted-foreground font-medium">YTD</th>
                                    <th className="text-center p-2 text-muted-foreground font-medium">LY</th>
                                    <th className="text-center p-2 text-muted-foreground font-medium">Var</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(data.dadosMensais).map(([key, valores]: [string, any]) => (
                                    <tr key={key} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                                        <td className="p-2 font-medium text-foreground whitespace-nowrap capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</td>
                                        {months.map(m => (
                                            <td key={m} className="p-1 text-center">
                                                {valores[m] !== null ? (valores[m] * (key.includes('Tempo') ? 1 : 100)).toFixed(key.includes('Tempo') ? 0 : 1) + (key.includes('Tempo') ? '' : '%') : '-'}
                                            </td>
                                        ))}
                                        <td className="p-2 text-center font-mono text-foreground">{valores.ytd !== null ? (valores.ytd * 100).toFixed(1) + '%' : '-'}</td>
                                        <td className="p-2 text-center font-mono text-muted-foreground">{valores.ly || '-'}</td>
                                        <td className="p-2 text-center font-mono text-foreground">{valores.variacao !== null ? (valores.variacao * 100).toFixed(1) + '%' : '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* ANÁLISE DETALHADA DE VENDAS */}
            <Card className="border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
                <CardHeader className="bg-black py-2 border-b border-border/50">
                    <CardTitle className="text-xs font-bold text-white text-center uppercase tracking-wider">Análise Detalhada de Vendas</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-[10px]">
                            <thead>
                                <tr className="border-b border-border/50 bg-muted/20">
                                    <th className="text-left p-2 text-muted-foreground font-medium">Métrica</th>
                                    {months.map(m => <th key={m} className="text-center p-2 text-muted-foreground font-medium capitalize">{m}</th>)}
                                    <th className="text-center p-2 text-muted-foreground font-medium">YTD</th>
                                    <th className="text-center p-2 text-muted-foreground font-medium">LY</th>
                                    <th className="text-center p-2 text-muted-foreground font-medium">Var</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(data.vendasDetalhadas).map(([key, valores]: [string, any]) => (
                                    <tr key={key} className={`border-b border-border/50 hover:bg-muted/50 transition-colors ${key.includes('PB') ? 'bg-primary/5' : ''}`}>
                                        <td className={`p-2 text-foreground ${key.includes('vs') ? 'pl-6 text-muted-foreground' : 'font-medium'}`}>
                                            {key === 'vendasPB' && 'Vendas PB'}
                                            {key === 'vendasRegiao' && 'Vendas Região'}
                                            {key === 'pbVsRegiao' && 'PB vs Região'}
                                            {key === 'vendasTipologia' && 'Vendas Tipologia'}
                                            {key === 'pbVsTipologia' && 'PB vs Tipologia'}
                                            {key === 'vendasNacional' && 'Vendas Nacional'}
                                            {key === 'pbVsNacional' && 'PB vs Nacional'}
                                            {key === 'gcsPB' && "GC's PB"}
                                            {key === 'gcsRegiao' && "GC's Região"}
                                            {key === 'gcsTipologia' && "GC's Tipologia"}
                                            {key === 'gcsNacional' && "GC's Nacional"}
                                            {key === 'deliveryPB' && 'Delivery PB'}
                                            {key === 'deliveryRegiao' && 'Delivery Região'}
                                            {key === 'deliveryNacional' && 'Delivery Nacional'}
                                            {key === 'gcsDeliveryPB' && "GC's Delivery PB"}
                                            {key === 'gcsDeliveryRegiao' && "GC's Delivery Região"}
                                            {key === 'gcsDeliveryNacional' && "GC's Delivery Nacional"}
                                        </td>
                                        {months.map(m => (
                                            <td key={m} className="p-1 text-center text-muted-foreground">
                                                {valores[m] !== null ? (valores[m] * 100).toFixed(1) + '%' : '-'}
                                            </td>
                                        ))}
                                        <td className="p-2 text-center font-mono text-foreground">{valores.ytd !== null ? (valores.ytd * 100).toFixed(1) + '%' : '-'}</td>
                                        <td className="p-2 text-center font-mono text-muted-foreground">{valores.ly !== null ? (valores.ly * 100).toFixed(1) + '%' : '-'}</td>
                                        <td className={`p-2 text-center font-mono ${valores.variacao < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                            {valores.variacao !== null ? (valores.variacao * 100).toFixed(1) : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                    <Save className="mr-2 h-4 w-4" /> Salvar Alterações
                </Button>
            </div>
        </div>
    );
}
