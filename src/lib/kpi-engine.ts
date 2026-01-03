export interface KPIData {
    resultadosOrganizacao: {
        vendas: {
            crescimentoVendas: { pborges: number; regiao?: number; pbvsRegiao?: number; tipologia?: number; pbvsTipo?: number; nacional?: number; pbvsNac?: number; ytd: number; ly: number; variacao: number };
            crescimentoGCs: { pborges: number; regiao?: number; pbvsRegiao?: number; tipologia?: number; pbvsTipo?: number; nacional?: number; pbvsNac?: number; ytd: number; ly: number; variacao: number };
            crescimentoDelivery: { pborges: number; regiao?: number; pbvsRegiao?: number; tipologia?: number; pbvsTipo?: number; nacional?: number; pbvsNac?: number; ytd: number; ly: number; variacao: number };
            crescimentoGCsDelivery: { pborges: number; regiao?: number; pbvsRegiao?: number; tipologia?: number; pbvsTipo?: number; nacional?: number; pbvsNac?: number; ytd: number; ly: number; variacao: number };
            pesoDelivery: { pborges: number; regiao?: number; pbvsRegiao?: number; tipologia?: number; pbvsTipo?: number; nacional?: number; pbvsNac?: number; ytd: number; ly: number; variacao: number };
            pesoMOP: { pborges: number; regiao?: number; pbvsRegiao?: number; tipologia?: number; pbvsTipo?: number; nacional?: number; pbvsNac?: number; ytd: number; ly: number; variacao: number };
        };
        pace: {
            atual: number;
            meta: number;
            percentualAtual: number;
            percentualMeta: number;
        };
        operacoes: {
            temposServico: { pborges: number; objetivo: number; variacao: number; ly: number; ytdVsLy: number };
            temposDelivery: { pborges: number; objetivo: number; variacao: number; ly: number; ytdVsLy: number };
            fastinsight: { pborges: number; objetivo: number; variacao: number; ly: number; ytdVsLy: number };
            turnover: { pborges: number; objetivo: number; variacao: number; ly: number; ytdVsLy: number };
            staffing: { pborges: number; objetivo: number; variacao: number; ly: number; ytdVsLy: number };
            bsv: { pborges: number; objetivo: number; variacao: number; ly: number; ytdVsLy: number };
        };
    };
    servico: {
        amadora: {
            almoco: { tempo: number; objetivo: number; var: number; rank: number; percentil: number };
            jantar: { tempo: number; objetivo: number; var: number; rank: number; percentil: number };
            dia: { tempo: number; objetivo: number; var: number; rank: number; percentil: number };
        };
        queluz: {
            almoco: { tempo: number; objetivo: number; var: number; rank: number; percentil: number };
            jantar: { tempo: number; objetivo: number; var: number; rank: number; percentil: number };
            dia: { tempo: number; objetivo: number; var: number; rank: number; percentil: number };
        };
        delivery: {
            amadora: { tempo: number; var: number; rank: number; percentil: number; nacional: number };
            queluz: { tempo: number; var: number; rank: number; percentil: number };
        };
    };
    dadosMensais: {
        crescimentoVendas: { janeiro: number | null; fevereiro: number | null; marco: number | null; abril: number | null; maio: number | null; junho: number | null; julho: number | null; agosto: number | null; setembro: number | null; outubro: number | null; novembro: number | null; dezembro: number | null; ytd: number; ly: number | null; variacao: number };
        crescimentoGCs: { janeiro: number | null; fevereiro: number | null; marco: number | null; abril: number | null; maio: number | null; junho: number | null; julho: number | null; agosto: number | null; setembro: number | null; outubro: number | null; novembro: number | null; dezembro: number | null; ytd: number; ly: number | null; variacao: number };
        crescimentoDelivery: { janeiro: number | null; fevereiro: number | null; marco: number | null; abril: number | null; maio: number | null; junho: number | null; julho: number | null; agosto: number | null; setembro: number | null; outubro: number | null; novembro: number | null; dezembro: number | null; ytd: number; ly: number | null; variacao: number };
        crescimentoGCsDelivery: { janeiro: number | null; fevereiro: number | null; marco: number | null; abril: number | null; maio: number | null; junho: number | null; julho: number | null; agosto: number | null; setembro: number | null; outubro: number | null; novembro: number | null; dezembro: number | null; ytd: number; ly: number | null; variacao: number };
        pesoDelivery: { janeiro: number | null; fevereiro: number | null; marco: number | null; abril: number | null; maio: number | null; junho: number | null; julho: number | null; agosto: number | null; setembro: number | null; outubro: number | null; novembro: number | null; dezembro: number | null; ytd: number; ly: number | null; variacao: number };
        pesoMOP: { janeiro: number | null; fevereiro: number | null; marco: number | null; abril: number | null; maio: number | null; junho: number | null; julho: number | null; agosto: number | null; setembro: number | null; outubro: number | null; novembro: number | null; dezembro: number | null; ytd: number | null; ly: number | null; variacao: number | null };
        temposServico: { janeiro: number | null; fevereiro: number | null; marco: number | null; abril: number | null; maio: number | null; junho: number | null; julho: number | null; agosto: number | null; setembro: number | null; outubro: number | null; novembro: number | null; dezembro: number | null; ytd: number | null; ly: number | null; variacao: number | null };
        temposServicoNacional: { janeiro: number | null; fevereiro: number | null; marco: number | null; abril: number | null; maio: number | null; junho: number | null; julho: number | null; agosto: number | null; setembro: number | null; outubro: number | null; novembro: number | null; dezembro: number | null; ytd: number | null; ly: number | null; variacao: number | null };
        fastinsight: { janeiro: number | null; fevereiro: number | null; marco: number | null; abril: number | null; maio: number | null; junho: number | null; julho: number | null; agosto: number | null; setembro: number | null; outubro: number | null; novembro: number | null; dezembro: number | null; ytd: number | null; ly: number | null; variacao: number | null };
        fastinsightNacional: { janeiro: number | null; fevereiro: number | null; marco: number | null; abril: number | null; maio: number | null; junho: number | null; julho: number | null; agosto: number | null; setembro: number | null; outubro: number | null; novembro: number | null; dezembro: number | null; ytd: number | null; ly: number | null; variacao: number | null };
        turnover: { janeiro: number | null; fevereiro: number | null; marco: number | null; abril: number | null; maio: number | null; junho: number | null; julho: number | null; agosto: number | null; setembro: number | null; outubro: number | null; novembro: number | null; dezembro: number | null; ytd: number | null; ly: number | null; variacao: number | null };
        staffing: { janeiro: number | null; fevereiro: number | null; marco: number | null; abril: number | null; maio: number | null; junho: number | null; julho: number | null; agosto: number | null; setembro: number | null; outubro: number | null; novembro: number | null; dezembro: number | null; ytd: number | null; ly: number | null; variacao: number | null };
    };
    pessoas: {
        absentismo: { pborges: number; objetivo: number; variacao: number };
        turnover: { pborges: number; objetivo: number; variacao: number };
    };
    produto: {
        cmv: { pborges: number; objetivo: number; variacao: number };
        waste: { pborges: number; objetivo: number; variacao: number };
    };
}

export class KPIEngine {
    private data: any;

    constructor(initialData?: any) {
        this.data = initialData || {};
    }

    public calculateResults(): KPIData {
        // Placeholder for calculation logic
        // This will be populated with the formulas extracted from Excel

        // Example logic based on Excel formulas:
        // G5 = (E5-F5)*100  -> Crescimento Vendas Variacao

        return {
            resultadosOrganizacao: {
                vendas: {
                    crescimentoVendas: { pborges: 10.94, regiao: 6.35, pbvsRegiao: 4.59, tipologia: 4.75, pbvsTipo: 6.19, nacional: 7.30, pbvsNac: 3.64, ytd: 10.94, ly: 16.69, variacao: -5.75 },
                    crescimentoGCs: { pborges: 4.11, regiao: 2.31, pbvsRegiao: 1.80, tipologia: 0.53, pbvsTipo: 3.58, nacional: 2.63, pbvsNac: 1.48, ytd: 4.11, ly: 0, variacao: 4.11 },
                    crescimentoDelivery: { pborges: 19.26, regiao: 11.52, pbvsRegiao: 7.74, tipologia: 4.83, pbvsTipo: 14.43, nacional: 16.23, pbvsNac: 3.03, ytd: 19.26, ly: 0, variacao: 19.26 },
                    crescimentoGCsDelivery: { pborges: 10.55, regiao: 9.10, pbvsRegiao: 1.45, tipologia: 3.18, pbvsTipo: 7.37, nacional: 10.95, pbvsNac: -0.40, ytd: 10.55, ly: 0, variacao: 10.55 },
                    pesoDelivery: { pborges: 52.50, regiao: 28.90, pbvsRegiao: 23.60, tipologia: 27.90, pbvsTipo: 24.60, nacional: 18.10, pbvsNac: 34.40, ytd: 52.50, ly: 0, variacao: 52.50 },
                    pesoMOP: { pborges: 0.36, regiao: 0.72, pbvsRegiao: -0.36, tipologia: 0.70, pbvsTipo: -0.34, nacional: 0.93, pbvsNac: -0.57, ytd: 0.36, ly: 0, variacao: 0.36 }
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
                    turnover: { pborges: 0, objetivo: 60, variacao: -60, ly: 0, ytdVsLy: 0 },
                    staffing: { pborges: 0, objetivo: 35, variacao: -35, ly: 0, ytdVsLy: 0 },
                    bsv: { pborges: 0, objetivo: 100, variacao: -100, ly: 0, ytdVsLy: 0 }
                }
            },
            servico: {
                amadora: {
                    almoco: { tempo: 110, objetivo: 110, var: 0, rank: 0, percentil: 0 },
                    jantar: { tempo: 116, objetivo: 0, var: 0, rank: 0, percentil: 0 },
                    dia: { tempo: 133, objetivo: 0, var: -1, rank: 17, percentil: 0.08 }
                },
                queluz: {
                    almoco: { tempo: 0, objetivo: 110, var: 0, rank: 0, percentil: 0 },
                    jantar: { tempo: 0, objetivo: 0, var: 0, rank: 0, percentil: 0 },
                    dia: { tempo: 107, objetivo: 0, var: 1, rank: 3, percentil: 0.01 }
                },
                delivery: {
                    amadora: { tempo: 81, var: -1, rank: 53, percentil: 0.25, nacional: 170 },
                    queluz: { tempo: 74, var: 2, rank: 29, percentil: 0.13 }
                }
            },
            dadosMensais: {
                crescimentoVendas: { janeiro: 7.66, fevereiro: 9.31, marco: 10.88, abril: 7.25, maio: 19.34, junho: 13.54, julho: 14.20, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: 10.94, ly: 16.69, variacao: -5.75 },
                crescimentoGCs: { janeiro: -1.65, fevereiro: 4.74, marco: 0.70, abril: -0.34, maio: 9.65, junho: 6.45, julho: 8.88, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: 4.11, ly: 0, variacao: 4.11 },
                crescimentoDelivery: { janeiro: 13.05, fevereiro: 9.47, marco: 19.42, abril: 13.07, maio: 29.68, junho: 24.37, julho: 24.77, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: 19.26, ly: 0, variacao: 19.26 },
                crescimentoGCsDelivery: { janeiro: 5.16, fevereiro: 3.59, marco: 10.96, abril: 8.48, maio: 24.03, junho: 23.24, julho: 24.19, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: 10.55, ly: 0, variacao: 10.55 },
                pesoDelivery: { janeiro: null, fevereiro: null, marco: null, abril: null, maio: null, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: 0, ly: 0, variacao: 0 },
                pesoMOP: { janeiro: 0.39, fevereiro: 0.33, marco: 0.34, abril: 0.38, maio: 0.38, junho: 0.19, julho: 0.44, agosto: 0.19, setembro: 0.23, outubro: 0.19, novembro: null, dezembro: null, ytd: 0.31, ly: 0, variacao: 0.31 },
                temposServico: { janeiro: null, fevereiro: null, marco: null, abril: null, maio: null, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: 0, ly: 0, variacao: 0 },
                temposServicoNacional: { janeiro: 130, fevereiro: 136, marco: 150, abril: 156, maio: 162, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: 146.8, ly: 0, variacao: 146.8 },
                fastinsight: { janeiro: 98.1, fevereiro: 98.0, marco: 96.3, abril: 97.4, maio: 96.9, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: 97.34, ly: 0, variacao: 97.34 },
                fastinsightNacional: { janeiro: 95.2, fevereiro: 94.7, marco: 93.7, abril: 93.5, maio: 92.7, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: 93.96, ly: 0, variacao: 93.96 },
                turnover: { janeiro: null, fevereiro: null, marco: null, abril: null, maio: null, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: 0, ly: 0, variacao: 0 },
                staffing: { janeiro: null, fevereiro: null, marco: null, abril: null, maio: null, junho: null, julho: null, agosto: null, setembro: null, outubro: null, novembro: null, dezembro: null, ytd: 0, ly: 0, variacao: 0 }
            },
            pessoas: {
                absentismo: { pborges: 0, objetivo: 0, variacao: 0 },
                turnover: { pborges: 0, objetivo: 0, variacao: 0 }
            },
            produto: {
                cmv: { pborges: 0, objetivo: 0, variacao: 0 },
                waste: { pborges: 0, objetivo: 0, variacao: 0 }
            }
        };
    }
}
