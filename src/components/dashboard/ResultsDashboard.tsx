import React, { useState, useEffect } from 'react';
import { TrendingUp, Save, BarChart3, Clock, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { KPIEngine } from "@/lib/kpi-engine";
import { getSalesSummaryMetrics } from "@/lib/api/service";

export function ResultsDashboard() {
    const engine = new KPIEngine();
    const kpiData = engine.calculateResults();
    const [isLoaded, setIsLoaded] = useState(false);
    const [localData, setLocalData] = useState({
        financeiro: {
            crescimentoVendas: { pborges: 10.94, regiao: 6.35, pbvsRegiao: 4.59, tipologia: 4.75, pbvsTipo: 6.19, nacional: 7.30, pbvsNac: 3.64 },
            crescimentoGCs: { pborges: 4.11, regiao: 2.31, pbvsRegiao: 1.80, tipologia: 0.53, pbvsTipo: 3.58, nacional: 2.63, pbvsNac: 1.48 },
            crescimentoDelivery: { pborges: 19.26, regiao: 11.52, pbvsRegiao: 7.74, tipologia: 4.83, pbvsTipo: 14.43, nacional: 16.23, pbvsNac: 3.03 },
            crescimentoGCsDelivery: { pborges: 10.55, regiao: 9.10, pbvsRegiao: 1.45, tipologia: 3.18, pbvsTipo: 7.37, nacional: 10.95, pbvsNac: -0.40 },
            pesoDelivery: { pborges: 52.50, regiao: 28.90, pbvsRegiao: 23.60, tipologia: 27.90, pbvsTipo: 24.60, nacional: 18.10, pbvsNac: 34.40 },
            pesoMOP: { pborges: 0.36, regiao: 0.72, pbvsRegiao: -0.36, tipologia: 0.70, pbvsTipo: -0.34, nacional: 0.93, pbvsNac: -0.57 }
        },
        pace: kpiData.resultadosOrganizacao.pace,
        operacoes: {
            temposServico: { pborges: 0, objetivo: 95, variacao: -95, ly: 128, ytdVsLy: -128 },
            temposDelivery: { pborges: 366, objetivo: 306, variacao: 60, ly: 408, ytdVsLy: -42 },
            fastinsight: { pborges: 97.4, objetivo: 94.1, variacao: 3.3, ly: 95.1, ytdVsLy: 2.3 },
            turnover: { pborges: 0, objetivo: 60, variacao: -60, ly: -60, ytdVsLy: 60 },
            staffing: { pborges: 0, objetivo: 35, variacao: -35, ly: 0, ytdVsLy: 0 },
            bsv: { pborges: 0, objetivo: 100, variacao: -100, ly: 0, ytdVsLy: 0 }
        },
        dadosMensais: {
            ...kpiData.dadosMensais,
            pesoDelivery: { janeiro: null, fevereiro: null, marco: null, abril: null, maio: null, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: 0, ly: 0, variacao: 0 },
            temposServico: { janeiro: null, fevereiro: null, marco: null, abril: null, maio: null, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: 0, ly: 0, variacao: 0 }
        },
        vendasDetalhadas: {
            vendasPB: { janeiro: 7.66, fevereiro: 9.31, marco: 10.88, abril: 7.25, maio: 19.34, junho: 13.54, julho: 14.20, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: 10.94, ly: 16.69, variacao: -5.75 },
            vendasRegiao: { janeiro: 8.12, fevereiro: 10.33, marco: 14.08, abril: 5.91, maio: 14.15, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: 10.49, ly: 19.52, variacao: -9.03 },
            pbVsRegiao: { janeiro: -0.46, fevereiro: -1.02, marco: -3.20, abril: 1.34, maio: 5.19, junho: 13.54, julho: 14.20, agosto: 0, setembro: 0, outubro: 0, novembro: 0, dezembro: 0, ytd: 0.45, ly: 0, variacao: 0.45 },
            vendasTipologia: { janeiro: 3.47, fevereiro: 6.88, marco: 5.72, abril: 2.10, maio: 10.88, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: 5.82, ly: 15.38, variacao: -9.56 },
            pbVsTipologia: { janeiro: 4.19, fevereiro: 2.43, marco: 5.16, abril: 5.15, maio: 8.46, junho: 13.54, julho: 14.20, agosto: 0, setembro: 0, outubro: 0, novembro: 0, dezembro: 0, ytd: 5.12, ly: 0, variacao: 5.12 },
            vendasNacional: { janeiro: 1.47, fevereiro: 6.47, marco: 3.10, abril: -2.58, maio: 6.05, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: 8.52, ly: 19.52, variacao: -11.00 },
            pbVsNacional: { janeiro: 6.19, fevereiro: 2.84, marco: 7.78, abril: 9.83, maio: 13.29, junho: 13.54, julho: 14.20, agosto: 0, setembro: 0, outubro: 0, novembro: 0, dezembro: 0, ytd: 2.42, ly: 0, variacao: 2.42 },
            gcsPB: { janeiro: -1.65, fevereiro: 4.74, marco: 0.70, abril: -0.34, maio: 9.65, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: 2.61, ly: 10.74, variacao: -8.13 },
            gcsRegiao: { janeiro: 2.81, fevereiro: 8.13, marco: 6.34, abril: 0.41, maio: 7.43, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: 4.94, ly: 14.44, variacao: -9.50 },
            gcsTipologia: { janeiro: -0.28, fevereiro: 5.17, marco: -2.43, abril: -1.29, maio: 4.63, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: 1.08, ly: 9.06, variacao: -7.98 },
            gcsNacional: { janeiro: 1.47, fevereiro: 6.47, marco: 3.10, abril: -2.58, maio: 6.05, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: 2.79, ly: 14.44, variacao: -11.65 },
            deliveryPB: { janeiro: 13.05, fevereiro: 9.47, marco: 19.42, abril: 13.07, maio: 29.68, junho: 24.37, julho: 24.77, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: 19.26, ly: 12.74, variacao: 6.52 },
            deliveryRegiao: { janeiro: 11.39, fevereiro: 10.85, marco: 20.38, abril: 9.87, maio: 21.67, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: 9.76, ly: 0, variacao: -9.76 },
            deliveryNacional: { janeiro: 13.17, fevereiro: 13.14, marco: 18.39, abril: 12.45, maio: 24.11, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: 10.68, ly: 0, variacao: -10.68 },
            gcsDeliveryPB: { janeiro: 5.16, fevereiro: 3.59, marco: 10.96, abril: 8.48, maio: 24.03, junho: 23.24, julho: 24.19, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: 10.55, ly: 5.16, variacao: 5.39 },
            gcsDeliveryRegiao: { janeiro: 5.01, fevereiro: 5.73, marco: 11.76, abril: 4.66, maio: 17.16, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: 1.56, ly: 0, variacao: -1.56 },
            gcsDeliveryNacional: { janeiro: 6.56, fevereiro: 6.87, marco: 8.33, abril: 7.42, maio: 18.63, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: 2.67, ly: 0, variacao: -2.67 }
        }
    });

    // Load from LocalStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('kpi_dashboard_data');
        if (saved) {
            try {
                setLocalData(JSON.parse(saved));
            } catch (e) {
                console.error("Error loading from LocalStorage", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to LocalStorage on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('kpi_dashboard_data', JSON.stringify(localData));
        }
    }, [localData, isLoaded]);

    // Helper to format values for display
    const formatDisplay = (val: any) => {
        if (val === null || val === undefined || val === '') return '-';
        if (typeof val === 'string') return val;
        return val.toFixed(2).replace('.', ',');
    };

    // Update local state when inputs change (this logic will need to be moved to the engine eventually)
    const updateOperacao = (metric: keyof typeof localData.operacoes, field: string, value: string) => {
        setLocalData(prev => {
            const metricaAtual = { ...prev.operacoes[metric] };
            (metricaAtual as any)[field] = value;

            // Helper to parse and round
            const parse = (val: any) => typeof val === 'string' ? parseFloat(val.replace(',', '.')) || 0 : (val || 0);
            const round = (val: number) => Math.round(val * 100) / 100;

            const pbVal = parse(metricaAtual.pborges);
            const objVal = parse(metricaAtual.objetivo);
            const lyVal = parse(metricaAtual.ly);

            // Recalculate variations using direct subtraction
            metricaAtual.variacao = round(pbVal - objVal);
            metricaAtual.ytdVsLy = round(pbVal - lyVal);

            return {
                ...prev,
                operacoes: {
                    ...prev.operacoes,
                    [metric]: metricaAtual
                }
            };
        });
    };
    const updateFinanceiro = (metric: string, field: string, value: string) => {
        setLocalData(prev => {
            const metricaAtual = { ...(prev.financeiro as any)[metric] };
            metricaAtual[field] = value;

            // Helper to parse and round
            const parse = (val: any) => typeof val === 'string' ? parseFloat(val.replace(',', '.')) || 0 : (val || 0);
            const round = (val: number) => Math.round(val * 100) / 100;

            const pbVal = parse(metricaAtual.pborges);
            const regVal = parse(metricaAtual.regiao);
            const tipVal = parse(metricaAtual.tipologia);
            const nacVal = parse(metricaAtual.nacional);

            // Recalculate variations using direct subtraction
            metricaAtual.pbvsRegiao = round(pbVal - regVal);
            metricaAtual.pbvsTipo = round(pbVal - tipVal);
            metricaAtual.pbvsNac = round(pbVal - nacVal);

            const newState = {
                ...prev,
                financeiro: {
                    ...prev.financeiro,
                    [metric]: metricaAtual
                }
            };

            // Sync with Dados Mensais YTD if field is pborges
            if (field === 'pborges') {
                if ((prev.dadosMensais as any)[metric]) {
                    const metricaMensal = { ...(prev.dadosMensais as any)[metric] };
                    metricaMensal.ytd = round(pbVal);
                    metricaMensal.variacao = round((metricaMensal.ytd || 0) - parse(metricaMensal.ly));

                    newState.dadosMensais = {
                        ...prev.dadosMensais,
                        [metric]: metricaMensal
                    };
                }

                // Special sync for Vendas PB if metric is crescimentoVendas
                if (metric === 'crescimentoVendas') {
                    const metricaVendasPB = { ...prev.vendasDetalhadas.vendasPB };
                    metricaVendasPB.ytd = round(pbVal);
                    metricaVendasPB.variacao = round((metricaVendasPB.ytd || 0) - parse(metricaVendasPB.ly));

                    newState.vendasDetalhadas = {
                        ...prev.vendasDetalhadas,
                        vendasPB: metricaVendasPB
                    };
                }
            }

            return newState;
        });
    };

    const updatePace = (field: string, value: string) => {
        setLocalData(prev => ({
            ...prev,
            pace: {
                ...prev.pace,
                [field]: value === '' ? 0 : Math.round(parseFloat(value.replace(',', '.')) * 100) / 100
            }
        }));
    };

    const updateDadosMensais = (metric: string, month: string, value: string) => {
        setLocalData(prev => {
            const metricaAtual = { ...prev.dadosMensais[metric as keyof typeof prev.dadosMensais] };

            if (month === 'ly') {
                metricaAtual.ly = value as any;
            } else {
                (metricaAtual as any)[month] = value;
            }

            // Helper to parse and round
            const parse = (val: any) => typeof val === 'string' ? parseFloat(val.replace(',', '.')) || 0 : (val || 0);
            const round = (val: number) => Math.round(val * 100) / 100;

            // Calculate YTD (average of non-null months)
            // Skip calculation for metrics linked to Financeiro (P.Borges)
            const linkedMetrics = ['crescimentoVendas', 'crescimentoGCs', 'crescimentoDelivery', 'crescimentoGCsDelivery', 'pesoDelivery', 'pesoMOP'];

            if (!linkedMetrics.includes(metric)) {
                const valoresMeses = months
                    .map(m => parse((metricaAtual as any)[m]))
                    .filter(v => v !== null && v !== undefined && !isNaN(v));

                if (valoresMeses.length > 0) {
                    metricaAtual.ytd = round(valoresMeses.reduce((a, b) => a + b, 0) / valoresMeses.length);
                } else {
                    metricaAtual.ytd = 0;
                }
            } else {
                // For linked metrics, YTD comes from Financeiro
                const pbVal = (prev.financeiro as any)[metric]?.pborges;
                metricaAtual.ytd = round(parse(pbVal));
            }

            // Calculate Var (YTD - LY)
            const lyVal = parse(metricaAtual.ly);
            metricaAtual.variacao = round((metricaAtual.ytd || 0) - lyVal);

            const newState = {
                ...prev,
                dadosMensais: {
                    ...prev.dadosMensais,
                    [metric]: metricaAtual
                }
            };

            // Sync Crescimento de vendas with Vendas PB (only months, not LY)
            if (metric === 'crescimentoVendas' && month !== 'ly') {
                const metricaVendasPB = { ...prev.vendasDetalhadas.vendasPB };
                (metricaVendasPB as any)[month] = value;

                // Recalculate YTD for Vendas PB based on synced month
                const valoresMesesPB = months
                    .map(m => {
                        const val = (metricaVendasPB as any)[m];
                        return typeof val === 'string' ? parseFloat(val.replace(',', '.')) : val;
                    })
                    .filter(v => v !== null && v !== undefined && !isNaN(v));

                if (valoresMesesPB.length > 0) {
                    metricaVendasPB.ytd = round(valoresMesesPB.reduce((a, b) => a + b, 0) / valoresMesesPB.length);
                } else {
                    metricaVendasPB.ytd = 0;
                }

                // Recalculate variation for Vendas PB using its own LY
                const lyValPB = parse(metricaVendasPB.ly);
                metricaVendasPB.variacao = round((metricaVendasPB.ytd || 0) - lyValPB);

                newState.vendasDetalhadas = {
                    ...prev.vendasDetalhadas,
                    vendasPB: metricaVendasPB
                };
            }

            return newState;
        });
    };

    const updateVendasDetalhadas = (metric: string, month: string, value: string) => {
        setLocalData(prev => {
            const metricaAtual = { ...prev.vendasDetalhadas[metric as keyof typeof prev.vendasDetalhadas] };

            if (month === 'ly') {
                metricaAtual.ly = value as any;
            } else if (month === 'ytd') {
                metricaAtual.ytd = value as any;
            } else {
                (metricaAtual as any)[month] = value;
            }

            // Helper to parse and round
            const parse = (val: any) => typeof val === 'string' ? parseFloat(val.replace(',', '.')) || 0 : (val || 0);
            const round = (val: number) => Math.round(val * 100) / 100;

            // Calculate YTD (average of non-null months) only if NOT manually editing YTD
            if (month !== 'ytd') {
                const valoresMeses = months
                    .map(m => parse((metricaAtual as any)[m]))
                    .filter(v => v !== null && v !== undefined && !isNaN(v));

                if (valoresMeses.length > 0) {
                    metricaAtual.ytd = round(valoresMeses.reduce((a, b) => a + b, 0) / valoresMeses.length);
                } else {
                    metricaAtual.ytd = 0;
                }
            }

            // Calculate Var (YTD - LY)
            const ytdVal = parse(metricaAtual.ytd);
            const lyVal = parse(metricaAtual.ly);
            metricaAtual.variacao = round(ytdVal - lyVal);

            const newState = {
                ...prev,
                vendasDetalhadas: {
                    ...prev.vendasDetalhadas,
                    [metric]: metricaAtual
                }
            };

            // Sync Vendas PB with Crescimento de vendas (only months, not LY)
            if (metric === 'vendasPB' && month !== 'ly') {
                const metricaCrescimento = { ...prev.dadosMensais.crescimentoVendas };
                (metricaCrescimento as any)[month] = value;

                // YTD for Crescimento de vendas comes from Financeiro, but let's keep months in sync
                // Recalculate variation for Crescimento de vendas using its own LY
                const lyValCres = parse(metricaCrescimento.ly);
                metricaCrescimento.variacao = round((metricaCrescimento.ytd || 0) - lyValCres);

                newState.dadosMensais = {
                    ...prev.dadosMensais,
                    crescimentoVendas: metricaCrescimento
                };
            }

            // Recalculate PB vs Região if either vendasPB or vendasRegiao changes
            if (metric === 'vendasPB' || metric === 'vendasRegiao') {
                const pb = metric === 'vendasPB' ? metricaAtual : prev.vendasDetalhadas.vendasPB;
                const reg = metric === 'vendasRegiao' ? metricaAtual : prev.vendasDetalhadas.vendasRegiao;
                const vs = { ...prev.vendasDetalhadas.pbVsRegiao };

                // Helper to parse values and round to 2 decimal places
                const parse = (val: any) => typeof val === 'string' ? parseFloat(val.replace(',', '.')) || 0 : (val || 0);
                const round = (val: number) => Math.round(val * 100) / 100;

                // Recalculate months
                months.forEach(m => {
                    (vs as any)[m] = round(parse((pb as any)[m]) - parse((reg as any)[m]));
                });

                // Recalculate YTD and LY
                vs.ytd = round(parse(pb.ytd) - parse(reg.ytd)) as any;
                vs.ly = round(parse(pb.ly) - parse(reg.ly)) as any;

                // Recalculate variation
                vs.variacao = round((typeof vs.ytd === 'string' ? parse(vs.ytd) : (vs.ytd as number)) -
                    (typeof vs.ly === 'string' ? parse(vs.ly) : (vs.ly as number)));

                newState.vendasDetalhadas = {
                    ...newState.vendasDetalhadas,
                    pbVsRegiao: vs
                };
            }

            // Recalculate PB vs Tipologia if either vendasPB or vendasTipologia changes
            if (metric === 'vendasPB' || metric === 'vendasTipologia') {
                const pb = metric === 'vendasPB' ? metricaAtual : prev.vendasDetalhadas.vendasPB;
                const tip = metric === 'vendasTipologia' ? metricaAtual : prev.vendasDetalhadas.vendasTipologia;
                const vs = { ...prev.vendasDetalhadas.pbVsTipologia };

                // Helper to parse and round
                const parse = (val: any) => typeof val === 'string' ? parseFloat(val.replace(',', '.')) || 0 : (val || 0);
                const round = (val: number) => Math.round(val * 100) / 100;

                // Recalculate months
                months.forEach(m => {
                    (vs as any)[m] = round(parse((pb as any)[m]) - parse((tip as any)[m]));
                });

                // Recalculate YTD and LY
                vs.ytd = round(parse(pb.ytd) - parse(tip.ytd)) as any;
                vs.ly = round(parse(pb.ly) - parse(tip.ly)) as any;

                // Recalculate variation
                vs.variacao = round((typeof vs.ytd === 'string' ? parse(vs.ytd) : (vs.ytd as number)) -
                    (typeof vs.ly === 'string' ? parse(vs.ly) : (vs.ly as number)));

                newState.vendasDetalhadas = {
                    ...newState.vendasDetalhadas,
                    pbVsTipologia: vs
                };
            }

            // Recalculate PB vs Nacional if either vendasPB or vendasNacional changes
            if (metric === 'vendasPB' || metric === 'vendasNacional') {
                const pb = metric === 'vendasPB' ? metricaAtual : prev.vendasDetalhadas.vendasPB;
                const nac = metric === 'vendasNacional' ? metricaAtual : prev.vendasDetalhadas.vendasNacional;
                const vs = { ...prev.vendasDetalhadas.pbVsNacional };

                // Helper to parse and round
                const parse = (val: any) => typeof val === 'string' ? parseFloat(val.replace(',', '.')) || 0 : (val || 0);
                const round = (val: number) => Math.round(val * 100) / 100;

                // Recalculate months
                months.forEach(m => {
                    (vs as any)[m] = round(parse((pb as any)[m]) - parse((nac as any)[m]));
                });

                // Recalculate YTD and LY
                vs.ytd = round(parse(pb.ytd) - parse(nac.ytd)) as any;
                vs.ly = round(parse(pb.ly) - parse(nac.ly)) as any;

                // Recalculate variation
                vs.variacao = round((typeof vs.ytd === 'string' ? parse(vs.ytd) : (vs.ytd as number)) -
                    (typeof vs.ly === 'string' ? parse(vs.ly) : (vs.ly as number)));

                newState.vendasDetalhadas = {
                    ...newState.vendasDetalhadas,
                    pbVsNacional: vs
                };
            }

            return newState;
        });
    };

    const months = ["janeiro", "fevereiro", "marco", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

    // Removed automatic calculation to allow manual input and fixed values




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
                                        <th className="text-center p-2 text-muted-foreground font-medium">Tipologia</th>
                                        <th className="text-center p-2 text-muted-foreground font-medium">PB vs Tipologia</th>
                                        <th className="text-center p-2 text-muted-foreground font-medium">Nac</th>
                                        <th className="text-center p-2 text-muted-foreground font-medium">PB vs Nac</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(localData.financeiro).map(([key, valores]: [string, any]) => (
                                        <tr key={key} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                                            <td className="p-2 font-medium text-foreground whitespace-nowrap">
                                                {key === 'crescimentoVendas' && 'Crescimento de vendas'}
                                                {key === 'crescimentoGCs' && "Crescimento de GC's"}
                                                {key === 'crescimentoDelivery' && 'Crescimento Delivery'}
                                                {key === 'crescimentoGCsDelivery' && "Crescimento GC's Delivery"}
                                                {key === 'pesoDelivery' && 'Peso Delivery'}
                                                {key === 'pesoMOP' && 'Peso MOP'}
                                            </td>
                                            <td className="p-1">
                                                <Input type="number" step="any" value={valores.pborges || ''} onChange={(e) => updateFinanceiro(key, 'pborges', e.target.value)} className="h-7 w-16 text-center text-[11px] bg-background/50" />
                                            </td>
                                            <td className="p-1">
                                                <Input type="number" step="any" value={valores.regiao || ''} onChange={(e) => updateFinanceiro(key, 'regiao', e.target.value)} className="h-7 w-16 text-center text-[11px] bg-background/50" />
                                            </td>
                                            <td className={`p-2 text-center font-mono ${(valores.pbvsRegiao || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>{formatDisplay(valores.pbvsRegiao)}</td>
                                            <td className="p-1">
                                                <Input type="number" step="any" value={valores.tipologia || ''} onChange={(e) => updateFinanceiro(key, 'tipologia', e.target.value)} className="h-7 w-16 text-center text-[11px] bg-background/50" />
                                            </td>
                                            <td className={`p-2 text-center font-mono ${(valores.pbvsTipo || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>{formatDisplay(valores.pbvsTipo)}</td>
                                            <td className="p-1">
                                                <Input type="number" step="any" value={valores.nacional || ''} onChange={(e) => updateFinanceiro(key, 'nacional', e.target.value)} className="h-7 w-16 text-center text-[11px] bg-background/50" />
                                            </td>
                                            <td className={`p-2 text-center font-mono ${(valores.pbvsNac || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>{formatDisplay(valores.pbvsNac)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

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
                                <span className="text-base font-bold text-[#38761d] dark:text-white">{formatDisplay(localData.pace.atual)}</span>
                            </div>
                            <div className="py-2 text-center">
                                <span className="text-base font-bold text-[#38761d] dark:text-white">{formatDisplay(localData.pace.meta)}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 flex-1 bg-[#d9ead3] dark:bg-zinc-900">
                            <div className="py-4 flex items-center justify-center border-r border-[#93c47d] dark:border-border/50">
                                <Input
                                    type="number"
                                    value={localData.pace.percentualAtual || ''}
                                    onChange={(e) => updatePace('percentualAtual', e.target.value)}
                                    className="h-8 w-16 text-center text-lg font-bold bg-transparent border-zinc-800 rounded-full text-[#38761d] dark:text-white"
                                />
                            </div>
                            <div className="py-4 flex items-center justify-center">
                                <Input
                                    type="number"
                                    value={localData.pace.percentualMeta || ''}
                                    onChange={(e) => updatePace('percentualMeta', e.target.value)}
                                    className="h-8 w-16 text-center text-lg font-bold bg-transparent border-zinc-800 rounded-full text-[#38761d] dark:text-white"
                                />
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
                                        <td className="p-2 font-bold text-white">Tempos de Serviço</td>
                                        <td className="p-1">
                                            <Input type="number" value={localData.operacoes.temposServico.pborges || ''} onChange={(e) => updateOperacao('temposServico', 'pborges', e.target.value)} className="h-7 w-16 text-center text-[11px] bg-zinc-900/50 border-zinc-800 rounded-full" />
                                        </td>
                                        <td className="p-1">
                                            <Input type="number" value={localData.operacoes.temposServico.objetivo || ''} onChange={(e) => updateOperacao('temposServico', 'objetivo', e.target.value)} className="h-7 w-16 text-center text-[11px] bg-zinc-900/50 border-zinc-800 rounded-full" />
                                        </td>
                                        <td className="p-2 text-center font-bold text-white">{formatDisplay(localData.operacoes.temposServico.variacao)}</td>
                                        <td className="p-1">
                                            <Input type="number" value={localData.operacoes.temposServico.ly || ''} onChange={(e) => updateOperacao('temposServico', 'ly', e.target.value)} className="h-7 w-16 text-center text-[11px] bg-zinc-900/50 border-zinc-800 rounded-full" />
                                        </td>
                                        <td className="p-2 text-center font-bold text-white">{formatDisplay(localData.operacoes.temposServico.ytdVsLy)}</td>
                                    </tr>
                                    <tr className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                                        <td className="p-2 font-bold text-white">Tempos Delivery</td>
                                        <td className="p-1">
                                            <Input type="number" value={localData.operacoes.temposDelivery.pborges || ''} onChange={(e) => updateOperacao('temposDelivery', 'pborges', e.target.value)} className="h-7 w-16 text-center text-[11px] bg-zinc-900/50 border-zinc-800 rounded-full" />
                                        </td>
                                        <td className="p-1">
                                            <Input type="number" value={localData.operacoes.temposDelivery.objetivo || ''} onChange={(e) => updateOperacao('temposDelivery', 'objetivo', e.target.value)} className="h-7 w-16 text-center text-[11px] bg-zinc-900/50 border-zinc-800 rounded-full" />
                                        </td>
                                        <td className="p-2 text-center font-bold text-white">{formatDisplay(localData.operacoes.temposDelivery.variacao)}</td>
                                        <td className="p-1">
                                            <Input type="number" value={localData.operacoes.temposDelivery.ly || ''} onChange={(e) => updateOperacao('temposDelivery', 'ly', e.target.value)} className="h-7 w-16 text-center text-[11px] bg-zinc-900/50 border-zinc-800 rounded-full" />
                                        </td>
                                        <td className="p-2 text-center font-bold text-white">{formatDisplay(localData.operacoes.temposDelivery.ytdVsLy)}</td>
                                    </tr>
                                    <tr className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                                        <td className="p-2 font-bold text-white">Fastinsight</td>
                                        <td className="p-1">
                                            <Input type="number" step="0.1" value={localData.operacoes.fastinsight.pborges || ''} onChange={(e) => updateOperacao('fastinsight', 'pborges', e.target.value)} className="h-7 w-16 text-center text-[11px] bg-zinc-900/50 border-zinc-800 rounded-full" />
                                        </td>
                                        <td className="p-1">
                                            <Input type="number" step="0.1" value={localData.operacoes.fastinsight.objetivo || ''} onChange={(e) => updateOperacao('fastinsight', 'objetivo', e.target.value)} className="h-7 w-16 text-center text-[11px] bg-zinc-900/50 border-zinc-800 rounded-full" />
                                        </td>
                                        <td className="p-2 text-center font-bold text-white">{formatDisplay(localData.operacoes.fastinsight.variacao)}</td>
                                        <td className="p-1">
                                            <Input type="number" step="0.1" value={localData.operacoes.fastinsight.ly || ''} onChange={(e) => updateOperacao('fastinsight', 'ly', e.target.value)} className="h-7 w-16 text-center text-[11px] bg-zinc-900/50 border-zinc-800 rounded-full" />
                                        </td>
                                        <td className="p-2 text-center font-bold text-white">{formatDisplay(localData.operacoes.fastinsight.ytdVsLy)}</td>
                                    </tr>
                                    <tr className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                                        <td className="p-2 font-bold text-white">Turnover</td>
                                        <td className="p-1">
                                            <Input type="number" value={localData.operacoes.turnover.pborges || ''} onChange={(e) => updateOperacao('turnover', 'pborges', e.target.value)} className="h-7 w-16 text-center text-[11px] bg-zinc-900/50 border-zinc-800 rounded-full" />
                                        </td>
                                        <td className="p-1">
                                            <Input type="number" value={localData.operacoes.turnover.objetivo || ''} onChange={(e) => updateOperacao('turnover', 'objetivo', e.target.value)} className="h-7 w-16 text-center text-[11px] bg-zinc-900/50 border-zinc-800 rounded-full" />
                                        </td>
                                        <td className="p-2 text-center font-bold text-white">{formatDisplay(localData.operacoes.turnover.variacao)}</td>
                                        <td className="p-1">
                                            <Input type="number" value={localData.operacoes.turnover.ly || ''} onChange={(e) => updateOperacao('turnover', 'ly', e.target.value)} className="h-7 w-16 text-center text-[11px] bg-zinc-900/50 border-zinc-800 rounded-full" />
                                        </td>
                                        <td className="p-2 text-center font-bold text-white">{formatDisplay(localData.operacoes.turnover.ytdVsLy)}</td>
                                    </tr>
                                    <tr className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                                        <td className="p-2 font-bold text-white">Staffing</td>
                                        <td className="p-1">
                                            <Input type="number" value={localData.operacoes.staffing.pborges || ''} onChange={(e) => updateOperacao('staffing', 'pborges', e.target.value)} className="h-7 w-16 text-center text-[11px] bg-zinc-900/50 border-zinc-800 rounded-full" />
                                        </td>
                                        <td className="p-1">
                                            <Input type="number" value={localData.operacoes.staffing.objetivo || ''} onChange={(e) => updateOperacao('staffing', 'objetivo', e.target.value)} className="h-7 w-16 text-center text-[11px] bg-zinc-900/50 border-zinc-800 rounded-full" />
                                        </td>
                                        <td className="p-2 text-center font-bold text-white">{formatDisplay(localData.operacoes.staffing.variacao)}</td>
                                        <td className="p-1">
                                            <Input type="number" value={localData.operacoes.staffing.ly || ''} onChange={(e) => updateOperacao('staffing', 'ly', e.target.value)} className="h-7 w-16 text-center text-[11px] bg-zinc-900/50 border-zinc-800 rounded-full" />
                                        </td>
                                        <td className="p-2 text-center font-bold text-white">{formatDisplay(localData.operacoes.staffing.ytdVsLy)}</td>
                                    </tr>
                                    <tr className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                                        <td className="p-2 font-bold text-white">BSV</td>
                                        <td className="p-1">
                                            <Input type="number" value={localData.operacoes.bsv.pborges || ''} onChange={(e) => updateOperacao('bsv', 'pborges', e.target.value)} className="h-7 w-16 text-center text-[11px] bg-zinc-900/50 border-zinc-800 rounded-full" />
                                        </td>
                                        <td className="p-1">
                                            <Input type="number" value={localData.operacoes.bsv.objetivo || ''} onChange={(e) => updateOperacao('bsv', 'objetivo', e.target.value)} className="h-7 w-16 text-center text-[11px] bg-zinc-900/50 border-zinc-800 rounded-full" />
                                        </td>
                                        <td className="p-2 text-center font-bold text-white">{formatDisplay(localData.operacoes.bsv.variacao)}</td>
                                        <td className="p-1">
                                            <Input type="number" value={localData.operacoes.bsv.ly || ''} onChange={(e) => updateOperacao('bsv', 'ly', e.target.value)} className="h-7 w-16 text-center text-[11px] bg-zinc-900/50 border-zinc-800 rounded-full" />
                                        </td>
                                        <td className="p-2 text-center font-bold text-white">{formatDisplay(localData.operacoes.bsv.ytdVsLy)}</td>
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
                                {Object.entries(localData.dadosMensais).map(([key, valores]: [string, any]) => (
                                    <tr key={key} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                                        <td className="p-2 font-medium text-foreground whitespace-nowrap">
                                            {key === 'crescimentoVendas' && 'Crescimento de vendas'}
                                            {key === 'crescimentoGCs' && "Crescimento de GC's"}
                                            {key === 'crescimentoDelivery' && 'Crescimento Delivery'}
                                            {key === 'crescimentoGCsDelivery' && "Crescimento GC's Delivery"}
                                            {key === 'pesoDelivery' && 'Peso Delivery'}
                                            {key === 'pesoMOP' && 'Peso MOP'}
                                            {key === 'temposServico' && 'Tempos de Serviço'}
                                            {key === 'temposServicoNacional' && 'Tempos de serviço Nacional'}
                                            {key === 'fastinsight' && 'Fastinsight'}
                                            {key === 'fastinsightNacional' && 'Fastinsight Nacional'}
                                            {key === 'turnover' && 'Turnover'}
                                            {key === 'staffing' && 'Staffing'}
                                        </td>
                                        {months.map(m => (
                                            <td key={m} className="p-1 text-center">
                                                <Input
                                                    className="h-6 w-full min-w-[50px] px-1 text-center text-[10px] bg-zinc-900/50 border-zinc-800 rounded-full"
                                                    value={valores[m] ?? ''}
                                                    onChange={(e) => updateDadosMensais(key, m, e.target.value)}
                                                />
                                            </td>
                                        ))}
                                        <td className="p-2 text-center font-bold text-white">
                                            {formatDisplay(valores.ytd)}
                                        </td>
                                        <td className="p-1 text-center">
                                            <Input
                                                className="h-6 w-16 px-1 text-center text-[10px] bg-zinc-900/50 border-zinc-800 rounded-full"
                                                value={valores.ly ?? ''}
                                                onChange={(e) => updateDadosMensais(key, 'ly', e.target.value)}
                                            />
                                        </td>
                                        <td className="p-2 text-center font-bold text-white">
                                            {formatDisplay(valores.variacao)}
                                        </td>
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
                                {Object.entries(localData.vendasDetalhadas).map(([key, valores]: [string, any]) => (
                                    <tr key={key} className={`border-b border-border/50 hover:bg-muted/50 transition-colors ${['pbVsRegiao', 'pbVsTipologia', 'pbVsNacional', 'deliveryPB', 'gcsDeliveryPB'].includes(key) ? 'bg-primary/5' : ''}`}>
                                        <td className={`p-2 text-foreground whitespace-nowrap ${key.includes('vs') ? 'pl-6 text-muted-foreground' : 'font-medium'}`}>
                                            {key === 'vendasPB' && 'Vendas PB'}
                                            {key === 'vendasRegiao' && 'Vendas Região'}
                                            {key === 'pbVsRegiao' && 'PB vs Região'}
                                            {key === 'vendasTipologia' && 'Vendas Tipologia (Free Stand)'}
                                            {key === 'pbVsTipologia' && 'PB vs Tipologia'}
                                            {key === 'vendasNacional' && 'Vendas Nacional'}
                                            {key === 'pbVsNacional' && 'PB vs Nacional'}
                                            {key === 'gcsPB' && "GC's PB"}
                                            {key === 'gcsRegiao' && "Gc's Região"}
                                            {key === 'gcsTipologia' && "Gc's Tipologia"}
                                            {key === 'gcsNacional' && "Gc's Nacional"}
                                            {key === 'deliveryPB' && 'Delivery PB'}
                                            {key === 'deliveryRegiao' && 'Delivery Região'}
                                            {key === 'deliveryNacional' && 'Delivery Nacional'}
                                            {key === 'gcsDeliveryPB' && "Gc's Delivery PB"}
                                            {key === 'gcsDeliveryRegiao' && "Gc's Delivery Região"}
                                            {key === 'gcsDeliveryNacional' && "Gc's Delivery Nacional"}
                                        </td>
                                        {months.map(m => {
                                            const val = valores[m];
                                            const numVal = typeof val === 'string' ? parseFloat(val.replace(',', '.')) : val;
                                            const colorClass = numVal > 0 ? 'text-green-500' : numVal < 0 ? 'text-red-500' : '';
                                            
                                            return (
                                                <td key={m} className="p-1 text-center text-muted-foreground">
                                                    {['pbVsRegiao', 'pbVsTipologia', 'pbVsNacional', 'deliveryPB', 'gcsDeliveryPB'].includes(key) ? (
                                                        <span className={`text-[10px] font-medium ${colorClass}`}>{formatDisplay(val)}</span>
                                                    ) : (
                                                        <Input
                                                            className="h-6 w-full min-w-[50px] px-1 text-center text-[10px] bg-zinc-900/50 border-zinc-800 rounded-full"
                                                            value={val ?? ''}
                                                            onChange={(e) => updateVendasDetalhadas(key, m, e.target.value)}
                                                        />
                                                    )}
                                                </td>
                                            );
                                        })}
                                        <td className="p-1 text-center">
                                            {['pbVsRegiao', 'pbVsTipologia', 'pbVsNacional', 'deliveryPB', 'gcsDeliveryPB'].includes(key) ? (
                                                <span className={`text-[10px] font-bold ${valores.ytd > 0 ? 'text-green-500' : valores.ytd < 0 ? 'text-red-500' : 'text-white'}`}>{formatDisplay(valores.ytd)}</span>
                                            ) : (
                                                <Input
                                                    className="h-6 w-16 px-1 text-center text-[10px] bg-zinc-900/50 border-zinc-800 rounded-full font-bold text-white"
                                                    value={valores.ytd ?? ''}
                                                    onChange={(e) => updateVendasDetalhadas(key, 'ytd', e.target.value)}
                                                />
                                            )}
                                        </td>
                                        <td className="p-1 text-center">
                                            {['pbVsRegiao', 'pbVsTipologia', 'pbVsNacional', 'deliveryPB', 'gcsDeliveryPB'].includes(key) ? (
                                                <span className={`text-[10px] font-bold ${valores.ly > 0 ? 'text-green-500' : valores.ly < 0 ? 'text-red-500' : 'text-white'}`}>{formatDisplay(valores.ly)}</span>
                                            ) : (
                                                <Input
                                                    className="h-6 w-16 px-1 text-center text-[10px] bg-zinc-900/50 border-zinc-800 rounded-full"
                                                    value={valores.ly ?? ''}
                                                    onChange={(e) => updateVendasDetalhadas(key, 'ly', e.target.value)}
                                                />
                                            )}
                                        </td>
                                        <td className={`p-2 text-center font-bold ${valores.variacao < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                            {formatDisplay(valores.variacao)}
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
