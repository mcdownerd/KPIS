import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Save, Trash2, Download, Upload, ChevronLeft, ChevronRight } from 'lucide-react';

// ============= CONSTANTES =============
const CONSTANTES = {
    TET_OBJETIVO: 150,
    R2P_OBJETIVO: 90,
    MO_OBJETIVO: 10.5,
    VALOR_MO: 7.40,
    PERDAS_PCT: 0.5,
    MESES: [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    DIAS_NO_MES: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    GERENTES: ['William', 'Patricia', 'Diogo', 'Paula', 'Outro'],
    CORES_GERENTES: {
        'William': '#E0F2FE',
        'Patricia': '#FCE7F3',
        'Diogo': '#DCFCE7',
        'Paula': '#FEF3C7',
        'Outro': '#F3F4F6'
    }
};

const STORAGE_KEY = 'shift_management_data_2025';

// ============= TYPES =============
interface ShiftData {
    m_gerente?: string;
    m_vnd_real?: number;
    m_vnd_plan?: number;
    m_gcs_real?: number;
    m_gcs_plan?: number;
    m_horas?: number;
    m_perdas_real?: number;
    m_perdas_mn?: number;
    m_desinv?: number;
    m_tet?: number;
    m_r2p?: number;
    m_reemb_qtd?: number;
    m_reemb_val?: number;
    n_gerente?: string;
    n_vnd_real?: number;
    n_vnd_plan?: number;
    n_gcs_real?: number;
    n_gcs_plan?: number;
    n_horas?: number;
    n_perdas_real?: number;
    n_perdas_mn?: number;
    n_desinv?: number;
    n_tet?: number;
    n_r2p?: number;
    n_reemb_qtd?: number;
    n_reemb_val?: number;
}

// ============= HELPER FUNCTIONS =============
const formatarMoeda = (valor: number | undefined) => {
    if (valor === undefined) return '€0,00';
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(valor);
};

const formatarPercentagem = (valor: number | undefined) => {
    if (valor === undefined) return '0,00%';
    return new Intl.NumberFormat('pt-PT', { style: 'percent', minimumFractionDigits: 2 }).format(valor / 100);
};

const formatarNumero = (valor: number | undefined, decimais = 0) => {
    if (valor === undefined) return '0';
    return new Intl.NumberFormat('pt-PT', { minimumFractionDigits: decimais, maximumFractionDigits: decimais }).format(valor);
};

const ShiftManagement = () => {
    const { toast } = useToast();
    const [mesAtual, setMesAtual] = useState(0);
    const [diaAtual, setDiaAtual] = useState(1);
    const [dados, setDados] = useState<Record<string, ShiftData>>({});
    const [activeTab, setActiveTab] = useState('tabela');

    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                setDados(JSON.parse(savedData));
            } catch (e) {
                console.error("Erro ao carregar dados", e);
            }
        }
    }, []);

    const salvarDados = (novosDados: Record<string, ShiftData>) => {
        setDados(novosDados);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(novosDados));
    };

    const chaveDia = `${mesAtual}-${diaAtual}`;
    const dadosDia = dados[chaveDia] || {};

    const handleInputChange = (campo: keyof ShiftData, valor: string) => {
        const numValue = valor === '' ? undefined : parseFloat(valor);
        const finalValue = (campo === 'm_gerente' || campo === 'n_gerente') ? valor : numValue;

        const novosDados = {
            ...dados,
            [chaveDia]: {
                ...dadosDia,
                [campo]: finalValue
            }
        };
        salvarDados(novosDados);
    };

    const limparDadosDia = () => {
        if (confirm(`Tem certeza que deseja limpar os dados de ${diaAtual} de ${CONSTANTES.MESES[mesAtual]}?`)) {
            const novosDados = { ...dados };
            delete novosDados[chaveDia];
            salvarDados(novosDados);
            toast({ title: "Dados limpos com sucesso!" });
        }
    };

    const exportarBackup = () => {
        const json = JSON.stringify(dados, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-turnos-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast({ title: "Backup exportado com sucesso!" });
    };

    const importarBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const novosDados = JSON.parse(event.target?.result as string);
                if (confirm('Importar este backup vai SUBSTITUIR todos os dados atuais. Continuar?')) {
                    salvarDados(novosDados);
                    toast({ title: "Backup importado com sucesso!" });
                }
            } catch (error) {
                console.error('Erro ao importar:', error);
                toast({ variant: "destructive", title: "Erro ao importar backup", description: "Arquivo inválido." });
            }
        };
        reader.readAsText(file);
    };

    const maxDias = CONSTANTES.DIAS_NO_MES[mesAtual];

    const selecionarDia = (dia: number) => {
        if (dia >= 1 && dia <= maxDias) {
            setDiaAtual(dia);
        }
    };

    const selecionarMes = (mes: number) => {
        setMesAtual(mes);
        const maxDiasNovoMes = CONSTANTES.DIAS_NO_MES[mes];
        if (diaAtual > maxDiasNovoMes) {
            setDiaAtual(maxDiasNovoMes);
        }
    };

    const calculos = useMemo(() => {
        const d = dadosDia;

        const calcTurno = (prefix: 'm' | 'n') => {
            const vndReal = d[`${prefix}_vnd_real`] || 0;
            const vndPlan = d[`${prefix}_vnd_plan`] || 0;
            const gcsReal = d[`${prefix}_gcs_real`] || 0;
            const gcsPlan = d[`${prefix}_gcs_plan`] || 0;
            const horas = d[`${prefix}_horas`] || 0;
            const perdasReal = d[`${prefix}_perdas_real`] || 0;
            const tet = d[`${prefix}_tet`] || 0;
            const r2p = d[`${prefix}_r2p`] || 0;
            const reembQtd = d[`${prefix}_reemb_qtd`] || 0;
            const reembVal = d[`${prefix}_reemb_val`] || 0;

            // 1. VENDAS - Diferença
            const vndDif = vndReal - vndPlan;

            // 2. GC'S - Diferença
            const gcsDif = gcsReal - gcsPlan;

            // 3. BM (Bilhete Médio)
            const bmReal = gcsReal > 0 ? vndReal / gcsReal : 0;
            const bmPlan = gcsPlan > 0 ? vndPlan / gcsPlan : 0;
            const bmDif = bmReal - bmPlan;

            // 4. HORAS
            const horasPlan = vndReal > 0 ? (vndReal * 0.105) / CONSTANTES.VALOR_MO : 0;
            const horasDif = horas - horasPlan;

            // 5. MO% (Mão de Obra)
            const moReal = vndReal > 0 ? ((horas * CONSTANTES.VALOR_MO) / vndReal) * 100 : 0;
            const moDif = moReal - CONSTANTES.MO_OBJETIVO;

            // 6. PERDAS
            const perdasPlan = vndReal * 0.005;
            const perdasDif = perdasReal - perdasPlan;

            // 7. TET (Tempo médio de atendimento)
            const tetDif = tet - CONSTANTES.TET_OBJETIVO;

            // 8. R2P (Ready to Present)
            const r2pDif = r2p - CONSTANTES.R2P_OBJETIVO;

            // 9. REEMBOLSOS - Média
            const reembMedia = reembQtd > 0 ? reembVal / reembQtd : 0;

            return {
                vndDif, gcsDif, bmReal, bmPlan, bmDif, horasPlan, horasDif,
                moReal, moDif, perdasPlan, perdasDif, tetDif, r2pDif, reembMedia
            };
        };

        const manha = calcTurno('m');
        const noite = calcTurno('n');

        const m_vendas = d.m_vnd_real || 0;
        const n_vendas = d.n_vnd_real || 0;
        const vendasTotal = m_vendas + n_vendas;

        const m_gcs = d.m_gcs_real || 0;
        const n_gcs = d.n_gcs_real || 0;
        const gcsTotal = m_gcs + n_gcs;

        const m_horas = d.m_horas || 0;
        const n_horas = d.n_horas || 0;
        const horasTotal = m_horas + n_horas;

        const bmMedio = gcsTotal > 0 ? vendasTotal / gcsTotal : 0;
        const moDia = vendasTotal > 0 ? ((horasTotal * CONSTANTES.VALOR_MO) / vendasTotal) * 100 : 0;

        return { manha, noite, vendasTotal, gcsTotal, bmMedio, moDia };
    }, [dadosDia]);

    const analiseGerentes = useMemo(() => {
        const stats: Record<string, any> = {};

        CONSTANTES.GERENTES.forEach(gerente => {
            let turnos = 0;
            let manha = { turnos: 0, vendas: 0, gcs: 0, horas: 0, perdas: 0, tet: [] as number[], r2p: [] as number[] };
            let noite = { turnos: 0, vendas: 0, gcs: 0, horas: 0, perdas: 0, tet: [] as number[], r2p: [] as number[] };

            const maxDias = CONSTANTES.DIAS_NO_MES[mesAtual];
            for (let dia = 1; dia <= maxDias; dia++) {
                const chave = `${mesAtual}-${dia}`;
                const d = dados[chave];
                if (!d) continue;

                if (d.m_gerente === gerente) {
                    turnos++;
                    manha.turnos++;
                    manha.vendas += d.m_vnd_real || 0;
                    manha.gcs += d.m_gcs_real || 0;
                    manha.horas += d.m_horas || 0;
                    manha.perdas += d.m_perdas_real || 0;
                    if (d.m_tet) manha.tet.push(d.m_tet);
                    if (d.m_r2p) manha.r2p.push(d.m_r2p);
                }

                if (d.n_gerente === gerente) {
                    turnos++;
                    noite.turnos++;
                    noite.vendas += d.n_vnd_real || 0;
                    noite.gcs += d.n_gcs_real || 0;
                    noite.horas += d.n_horas || 0;
                    noite.perdas += d.n_perdas_real || 0;
                    if (d.n_tet) noite.tet.push(d.n_tet);
                    if (d.n_r2p) noite.r2p.push(d.n_r2p);
                }
            }

            const calcMetricas = (t: typeof manha) => {
                const bm = t.gcs > 0 ? t.vendas / t.gcs : 0;
                const mo = t.vendas > 0 ? ((t.horas * CONSTANTES.VALOR_MO) / t.vendas) * 100 : 0;
                const moDif = mo - CONSTANTES.MO_OBJETIVO;
                const perdasPct = t.vendas > 0 ? (t.perdas / t.vendas) * 100 : 0;
                const tetMedio = t.tet.length > 0 ? t.tet.reduce((a, b) => a + b, 0) / t.tet.length : 0;
                const r2pMedio = t.r2p.length > 0 ? t.r2p.reduce((a, b) => a + b, 0) / t.r2p.length : 0;

                return { ...t, bm, mo, moDif, perdasPct, tetMedio, r2pMedio };
            };

            stats[gerente] = {
                turnos,
                manha: calcMetricas(manha),
                noite: calcMetricas(noite)
            };
        });

        return stats;
    }, [dados, mesAtual]);

    // Componente de Tabela de Turno
    const ShiftTable = ({ prefix, title, bgColor }: { prefix: 'm' | 'n', title: string, bgColor: string }) => {
        const calc = prefix === 'm' ? calculos.manha : calculos.noite;

        return (
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <div className={`${bgColor} p-2 text-center font-bold border-b border-gray-300 dark:border-gray-600`}>
                    {title}
                </div>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600">
                            <th className="p-1 text-left border-r border-gray-300 dark:border-gray-600 w-32">Gerente</th>
                            <th className="p-1 text-center border-r border-gray-300 dark:border-gray-600">Real</th>
                            <th className="p-1 text-center border-r border-gray-300 dark:border-gray-600">Planificado</th>
                            <th className="p-1 text-center">Diferença</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="p-1 border-r border-gray-300 dark:border-gray-600" colSpan={4}>
                                <Select value={dadosDia[`${prefix}_gerente`] || ''} onValueChange={(v) => handleInputChange(`${prefix}_gerente`, v)}>
                                    <SelectTrigger className="h-7 text-xs bg-[#FFF8DC] dark:bg-[#3a3a2a]">
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CONSTANTES.GERENTES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </td>
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="p-1 font-medium border-r border-gray-300 dark:border-gray-600">Vendas (€m)</td>
                            <td className="p-1 border-r border-gray-300 dark:border-gray-600">
                                <Input type="number" placeholder="Real" key={`${prefix}_vnd_real_${chaveDia}`} defaultValue={dadosDia[`${prefix}_vnd_real`] || ''} onBlur={(e) => handleInputChange(`${prefix}_vnd_real`, e.target.value)} className="h-7 text-xs text-right bg-[#FFF8DC] dark:bg-[#3a3a2a]" />
                            </td>
                            <td className="p-1 border-r border-gray-300 dark:border-gray-600">
                                <Input type="number" placeholder="Plan" key={`${prefix}_vnd_plan_${chaveDia}`} defaultValue={dadosDia[`${prefix}_vnd_plan`] || ''} onBlur={(e) => handleInputChange(`${prefix}_vnd_plan`, e.target.value)} className="h-7 text-xs text-right bg-[#FFF8DC] dark:bg-[#3a3a2a]" />
                            </td>
                            <td className={`p-1 text-right text-xs font-bold ${calc.vndDif >= 0 ? 'text-green-600' : 'text-red-600'}`}>{calc.vndDif.toFixed(0)}</td>
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="p-1 font-medium border-r border-gray-300 dark:border-gray-600">GC's</td>
                            <td className="p-1 border-r border-gray-300 dark:border-gray-600">
                                <Input type="number" placeholder="Real" key={`${prefix}_gcs_real_${chaveDia}`} defaultValue={dadosDia[`${prefix}_gcs_real`] || ''} onBlur={(e) => handleInputChange(`${prefix}_gcs_real`, e.target.value)} className="h-7 text-xs text-right bg-[#FFF8DC] dark:bg-[#3a3a2a]" />
                            </td>
                            <td className="p-1 border-r border-gray-300 dark:border-gray-600">
                                <Input type="number" placeholder="Plan" key={`${prefix}_gcs_plan_${chaveDia}`} defaultValue={dadosDia[`${prefix}_gcs_plan`] || ''} onBlur={(e) => handleInputChange(`${prefix}_gcs_plan`, e.target.value)} className="h-7 text-xs text-right bg-[#FFF8DC] dark:bg-[#3a3a2a]" />
                            </td>
                            <td className={`p-1 text-right text-xs font-bold ${calc.gcsDif >= 0 ? 'text-green-600' : 'text-red-600'}`}>{calc.gcsDif.toFixed(0)}</td>
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="p-1 font-medium border-r border-gray-300 dark:border-gray-600">BM</td>
                            <td className="p-1 text-right text-xs border-r border-gray-300 dark:border-gray-600">{formatarMoeda(calc.bmReal)}</td>
                            <td className="p-1 text-right text-xs border-r border-gray-300 dark:border-gray-600">{formatarMoeda(calc.bmPlan)}</td>
                            <td className={`p-1 text-right text-xs font-bold ${calc.bmDif >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatarMoeda(calc.bmDif)}</td>
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="p-1 font-medium border-r border-gray-300 dark:border-gray-600">Horas</td>
                            <td className="p-1 border-r border-gray-300 dark:border-gray-600">
                                <Input type="number" placeholder="Real" key={`${prefix}_horas_${chaveDia}`} defaultValue={dadosDia[`${prefix}_horas`] || ''} onBlur={(e) => handleInputChange(`${prefix}_horas`, e.target.value)} className="h-7 text-xs text-right bg-[#FFF8DC] dark:bg-[#3a3a2a]" />
                            </td>
                            <td className="p-1 text-right text-xs border-r border-gray-300 dark:border-gray-600">{formatarNumero(calc.horasPlan, 2)}</td>
                            <td className={`p-1 text-right text-xs font-bold ${calc.horasDif <= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatarNumero(calc.horasDif, 2)}</td>
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="p-1 font-medium border-r border-gray-300 dark:border-gray-600">MO</td>
                            <td className={`p-1 text-right text-xs font-bold border-r border-gray-300 dark:border-gray-600 ${calc.moReal <= CONSTANTES.MO_OBJETIVO ? 'text-green-600' : 'text-red-600'}`}>{formatarPercentagem(calc.moReal)}</td>
                            <td className="p-1 text-right text-xs border-r border-gray-300 dark:border-gray-600">{formatarPercentagem(CONSTANTES.MO_OBJETIVO)}</td>
                            <td className={`p-1 text-right text-xs font-bold ${calc.moDif <= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatarNumero(calc.moDif, 2)}</td>
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="p-1 font-medium border-r border-gray-300 dark:border-gray-600">Perdas</td>
                            <td className="p-1 border-r border-gray-300 dark:border-gray-600">
                                <Input type="number" placeholder="Real" key={`${prefix}_perdas_real_${chaveDia}`} defaultValue={dadosDia[`${prefix}_perdas_real`] || ''} onBlur={(e) => handleInputChange(`${prefix}_perdas_real`, e.target.value)} className="h-7 text-xs text-right bg-[#FFF8DC] dark:bg-[#3a3a2a]" />
                            </td>
                            <td className="p-1 text-right text-xs border-r border-gray-300 dark:border-gray-600">{formatarMoeda(calc.perdasPlan)}</td>
                            <td className={`p-1 text-right text-xs font-bold ${calc.perdasDif <= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatarMoeda(calc.perdasDif)}</td>
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="p-1 font-medium border-r border-gray-300 dark:border-gray-600">Des Inventario</td>
                            <td className="p-1 border-r border-gray-300 dark:border-gray-600">
                                <Input type="number" placeholder="Real" key={`${prefix}_desinv_${chaveDia}`} defaultValue={dadosDia[`${prefix}_desinv`] || ''} onBlur={(e) => handleInputChange(`${prefix}_desinv`, e.target.value)} className="h-7 text-xs text-right bg-[#FFF8DC] dark:bg-[#3a3a2a]" />
                            </td>
                            <td className="p-1 text-right text-xs border-r border-gray-300 dark:border-gray-600">€</td>
                            <td className="p-1 text-right text-xs">{formatarMoeda(dadosDia[`${prefix}_desinv`] || 0)}</td>
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="p-1 font-medium border-r border-gray-300 dark:border-gray-600">TET</td>
                            <td className="p-1 border-r border-gray-300 dark:border-gray-600">
                                <Input type="number" placeholder="Real" key={`${prefix}_tet_${chaveDia}`} defaultValue={dadosDia[`${prefix}_tet`] || ''} onBlur={(e) => handleInputChange(`${prefix}_tet`, e.target.value)} className="h-7 text-xs text-right bg-[#FFF8DC] dark:bg-[#3a3a2a]" />
                            </td>
                            <td className="p-1 text-right text-xs border-r border-gray-300 dark:border-gray-600">{CONSTANTES.TET_OBJETIVO}</td>
                            <td className={`p-1 text-right text-xs font-bold ${calc.tetDif <= 0 ? 'text-green-600' : 'text-red-600'}`}>{calc.tetDif.toFixed(0)}</td>
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="p-1 font-medium border-r border-gray-300 dark:border-gray-600">R2P</td>
                            <td className="p-1 border-r border-gray-300 dark:border-gray-600">
                                <Input type="number" placeholder="Real" key={`${prefix}_r2p_${chaveDia}`} defaultValue={dadosDia[`${prefix}_r2p`] || ''} onBlur={(e) => handleInputChange(`${prefix}_r2p`, e.target.value)} className="h-7 text-xs text-right bg-[#FFF8DC] dark:bg-[#3a3a2a]" />
                            </td>
                            <td className="p-1 text-right text-xs border-r border-gray-300 dark:border-gray-600">{CONSTANTES.R2P_OBJETIVO}</td>
                            <td className={`p-1 text-right text-xs font-bold ${calc.r2pDif <= 0 ? 'text-green-600' : 'text-red-600'}`}>{calc.r2pDif.toFixed(0)}</td>
                        </tr>
                        <tr>
                            <td className="p-1 font-medium border-r border-gray-300 dark:border-gray-600">Reembolsos</td>
                            <td className="p-1 border-r border-gray-300 dark:border-gray-600">
                                <Input type="number" key={`${prefix}_reemb_qtd_${chaveDia}`} placeholder="Qtd" defaultValue={dadosDia[`${prefix}_reemb_qtd`] || ''} onBlur={(e) => handleInputChange(`${prefix}_reemb_qtd`, e.target.value)} className="h-7 text-xs text-right bg-[#FFF8DC] dark:bg-[#3a3a2a]" />
                            </td>
                            <td className="p-1 border-r border-gray-300 dark:border-gray-600">
                                <Input type="number" key={`${prefix}_reemb_val_${chaveDia}`} placeholder="Valor" defaultValue={dadosDia[`${prefix}_reemb_val`] || ''} onBlur={(e) => handleInputChange(`${prefix}_reemb_val`, e.target.value)} className="h-7 text-xs text-right bg-[#FFF8DC] dark:bg-[#3a3a2a]" />
                            </td>
                            <td className="p-1 text-right text-xs">{formatarMoeda(calc.reembMedia)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="bg-card text-card-foreground p-6 rounded-xl shadow-sm border">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold">Informações de Turno - Amadora 2025</h1>
                    <div className="flex gap-2">
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-500 text-yellow-700 dark:text-yellow-500 px-4 py-2 rounded-lg font-semibold text-sm">
                            MO Objetivo: {formatarPercentagem(CONSTANTES.MO_OBJETIVO)}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-2 mb-6">
                    {CONSTANTES.MESES.map((mes, index) => (
                        <button
                            key={mes}
                            onClick={() => selecionarMes(index)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${index === mesAtual
                                ? 'bg-primary text-primary-foreground shadow-md'
                                : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                                }`}
                        >
                            {mes}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                    <Button variant="outline" size="icon" onClick={() => selecionarDia(diaAtual - 1)} disabled={diaAtual === 1}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex flex-wrap gap-2 flex-1">
                        {Array.from({ length: maxDias }, (_, i) => i + 1).map((dia) => (
                            <button
                                key={dia}
                                onClick={() => selecionarDia(dia)}
                                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all border ${dia === diaAtual
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-background hover:border-primary/50 text-foreground border-input'
                                    }`}
                            >
                                {dia}
                            </button>
                        ))}
                    </div>

                    <Button variant="outline" size="icon" onClick={() => selecionarDia(diaAtual + 1)} disabled={diaAtual === maxDias}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-purple-500 p-6 rounded-xl shadow-lg text-white">
                <h3 className="text-xl font-semibold text-center mb-6">
                    Resumo do Dia {diaAtual} de {CONSTANTES.MESES[mesAtual]}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center border border-white/20">
                        <div className="text-xs uppercase font-bold text-white/80 mb-2">Vendas Total</div>
                        <div className="text-2xl font-bold font-mono">{formatarMoeda(calculos.vendasTotal)}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center border border-white/20">
                        <div className="text-xs uppercase font-bold text-white/80 mb-2">GC's Total</div>
                        <div className="text-2xl font-bold font-mono">{formatarNumero(calculos.gcsTotal)}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center border border-white/20">
                        <div className="text-xs uppercase font-bold text-white/80 mb-2">BM Médio</div>
                        <div className="text-2xl font-bold font-mono">{formatarMoeda(calculos.bmMedio)}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center border border-white/20">
                        <div className="text-xs uppercase font-bold text-white/80 mb-2">MO Dia</div>
                        <div className="text-2xl font-bold font-mono">{formatarPercentagem(calculos.moDia)}</div>
                    </div>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full justify-start mb-6 bg-transparent border-b rounded-none h-auto p-0">
                    <TabsTrigger value="tabela" className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-base">
                        📝 Entrada de Dados
                    </TabsTrigger>
                    <TabsTrigger value="analise" className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-base">
                        👥 Análise Gerentes
                    </TabsTrigger>
                    <TabsTrigger value="anual" className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-base">
                        📅 Resumo Anual
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="tabela">
                    <div className="grid md:grid-cols-2 gap-6">
                        <ShiftTable prefix="m" title="☀️ TURNO DA MANHÃ" bgColor="bg-orange-400 text-black" />
                        <ShiftTable prefix="n" title="🌙 TURNO DA NOITE" bgColor="bg-gray-800 text-white" />
                    </div>
                </TabsContent>

                <TabsContent value="analise">
                    <div className="grid md:grid-cols-2 gap-6">
                        {CONSTANTES.GERENTES.map(gerente => {
                            const s = analiseGerentes[gerente];
                            const cor = CONSTANTES.CORES_GERENTES[gerente as keyof typeof CONSTANTES.CORES_GERENTES];

                            if (s.turnos === 0) return null;

                            return (
                                <Card key={gerente} className="overflow-hidden">
                                    <div className="p-4 text-center font-bold text-lg uppercase" style={{ backgroundColor: cor, color: '#1f2937' }}>
                                        {gerente}
                                    </div>
                                    <CardContent className="p-6 space-y-6">
                                        <div className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold mb-2">
                                            📊 {s.turnos} turno{s.turnos !== 1 ? 's' : ''}
                                        </div>

                                        {s.manha.turnos > 0 && (
                                            <div className="space-y-2">
                                                <div className="text-xs font-bold uppercase text-muted-foreground border-b pb-1">☀️ Manhã ({s.manha.turnos} turnos)</div>
                                                <div className="grid grid-cols-2 gap-y-1 text-sm">
                                                    <div className="text-muted-foreground">Vendas</div>
                                                    <div className="text-right font-mono font-bold text-blue-600 dark:text-blue-400">{formatarMoeda(s.manha.vendas)}</div>
                                                    <div className="text-muted-foreground">GC's</div>
                                                    <div className="text-right font-mono">{formatarNumero(s.manha.gcs)}</div>
                                                    <div className="text-muted-foreground">BM Médio</div>
                                                    <div className="text-right font-mono font-bold text-blue-600 dark:text-blue-400">{formatarMoeda(s.manha.bm)}</div>
                                                    <div className="text-muted-foreground">MO %</div>
                                                    <div className={`text-right font-mono font-bold ${s.manha.mo <= CONSTANTES.MO_OBJETIVO ? 'text-green-600' : 'text-red-600'}`}>
                                                        {formatarPercentagem(s.manha.mo)}
                                                    </div>
                                                    <div className="text-muted-foreground">Dif. MO</div>
                                                    <div className={`text-right font-mono font-bold ${s.manha.moDif <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {formatarNumero(s.manha.moDif, 2)}
                                                    </div>
                                                    <div className="text-muted-foreground">Perdas</div>
                                                    <div className="text-right font-mono">{formatarMoeda(s.manha.perdas)} ({formatarNumero(s.manha.perdasPct, 2)}%)</div>
                                                    {s.manha.tetMedio > 0 && (
                                                        <>
                                                            <div className="text-muted-foreground">TET Médio</div>
                                                            <div className={`text-right font-mono font-bold ${s.manha.tetMedio <= CONSTANTES.TET_OBJETIVO ? 'text-green-600' : 'text-red-600'}`}>
                                                                {formatarNumero(s.manha.tetMedio, 0)}"
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {s.noite.turnos > 0 && (
                                            <div className="space-y-2">
                                                <div className="text-xs font-bold uppercase text-muted-foreground border-b pb-1">🌙 Noite ({s.noite.turnos} turnos)</div>
                                                <div className="grid grid-cols-2 gap-y-1 text-sm">
                                                    <div className="text-muted-foreground">Vendas</div>
                                                    <div className="text-right font-mono font-bold text-blue-600 dark:text-blue-400">{formatarMoeda(s.noite.vendas)}</div>
                                                    <div className="text-muted-foreground">GC's</div>
                                                    <div className="text-right font-mono">{formatarNumero(s.noite.gcs)}</div>
                                                    <div className="text-muted-foreground">BM Médio</div>
                                                    <div className="text-right font-mono font-bold text-blue-600 dark:text-blue-400">{formatarMoeda(s.noite.bm)}</div>
                                                    <div className="text-muted-foreground">MO %</div>
                                                    <div className={`text-right font-mono font-bold ${s.noite.mo <= CONSTANTES.MO_OBJETIVO ? 'text-green-600' : 'text-red-600'}`}>
                                                        {formatarPercentagem(s.noite.mo)}
                                                    </div>
                                                    <div className="text-muted-foreground">Dif. MO</div>
                                                    <div className={`text-right font-mono font-bold ${s.noite.moDif <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {formatarNumero(s.noite.moDif, 2)}
                                                    </div>
                                                    <div className="text-muted-foreground">Perdas</div>
                                                    <div className="text-right font-mono">{formatarMoeda(s.noite.perdas)} ({formatarNumero(s.noite.perdasPct, 2)}%)</div>
                                                    {s.noite.tetMedio > 0 && (
                                                        <>
                                                            <div className="text-muted-foreground">TET Médio</div>
                                                            <div className={`text-right font-mono font-bold ${s.noite.tetMedio <= CONSTANTES.TET_OBJETIVO ? 'text-green-600' : 'text-red-600'}`}>
                                                                {formatarNumero(s.noite.tetMedio, 0)}"
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}

                        {Object.values(analiseGerentes).every(s => s.turnos === 0) && (
                            <div className="col-span-2 text-center p-12 text-muted-foreground bg-muted/50 rounded-xl border-2 border-dashed">
                                <div className="text-4xl mb-4">📭</div>
                                <p>Sem dados registados para este mês.</p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="anual">
                    <div className="bg-[#2D3748] p-6 rounded-xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {CONSTANTES.GERENTES.map(gerente => {
                                const s = analiseGerentes[gerente];
                                const cor = CONSTANTES.CORES_GERENTES[gerente as keyof typeof CONSTANTES.CORES_GERENTES];

                                return (
                                    <div key={gerente} className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg">
                                        <div className="p-3 text-center font-bold uppercase text-sm" style={{ backgroundColor: cor, color: '#1f2937' }}>
                                            {gerente}
                                        </div>
                                        {s.turnos === 0 ? (
                                            <div className="p-8 text-center text-gray-400">
                                                <div className="text-3xl mb-2">📭</div>
                                                <div className="text-sm">Sem dados</div>
                                            </div>
                                        ) : (
                                            <table className="w-full text-xs">
                                                <thead>
                                                    <tr className="bg-gray-100 dark:bg-gray-800">
                                                        <th className="p-2 text-left border-b-2 border-gray-300 dark:border-gray-600"></th>
                                                        <th className="p-2 text-center border-b-2 border-gray-300 dark:border-gray-600 font-bold">Manhã</th>
                                                        <th className="p-2 text-center border-b-2 border-gray-300 dark:border-gray-600 font-bold">Noite</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="p-2 font-semibold">Vendas</td>
                                                        <td className="p-2 text-center">{s.manha.turnos > 0 ? formatarMoeda(s.manha.vendas) : '-'}</td>
                                                        <td className="p-2 text-center">{s.noite.turnos > 0 ? formatarMoeda(s.noite.vendas) : '-'}</td>
                                                    </tr>
                                                    <tr className="bg-gray-50 dark:bg-gray-800/50">
                                                        <td className="p-2 font-semibold">GC's</td>
                                                        <td className="p-2 text-center">{s.manha.turnos > 0 ? formatarNumero(s.manha.gcs) : '-'}</td>
                                                        <td className="p-2 text-center">{s.noite.turnos > 0 ? formatarNumero(s.noite.gcs) : '-'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="p-2 font-semibold">BM</td>
                                                        <td className="p-2 text-center">{s.manha.turnos > 0 ? formatarMoeda(s.manha.bm) : '-'}</td>
                                                        <td className="p-2 text-center">{s.noite.turnos > 0 ? formatarMoeda(s.noite.bm) : '-'}</td>
                                                    </tr>
                                                    <tr className="bg-gray-50 dark:bg-gray-800/50">
                                                        <td className="p-2 font-semibold">Horas</td>
                                                        <td className="p-2 text-center">{s.manha.turnos > 0 ? formatarNumero(s.manha.horas, 0) : '-'}</td>
                                                        <td className="p-2 text-center">{s.noite.turnos > 0 ? formatarNumero(s.noite.horas, 0) : '-'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="p-2 font-semibold">MO</td>
                                                        <td className={`p-2 text-center font-bold ${s.manha.turnos > 0 ? (s.manha.mo <= CONSTANTES.MO_OBJETIVO ? 'text-green-600' : 'text-red-600') : ''}`}>
                                                            {s.manha.turnos > 0 ? formatarPercentagem(s.manha.mo) : '-'}
                                                        </td>
                                                        <td className={`p-2 text-center font-bold ${s.noite.turnos > 0 ? (s.noite.mo <= CONSTANTES.MO_OBJETIVO ? 'text-green-600' : 'text-red-600') : ''}`}>
                                                            {s.noite.turnos > 0 ? formatarPercentagem(s.noite.mo) : '-'}
                                                        </td>
                                                    </tr>
                                                    <tr className="bg-gray-50 dark:bg-gray-800/50">
                                                        <td className="p-2 font-semibold">Perdas</td>
                                                        <td className="p-2 text-center">{s.manha.turnos > 0 ? formatarMoeda(s.manha.perdas) : '-'}</td>
                                                        <td className="p-2 text-center">{s.noite.turnos > 0 ? formatarMoeda(s.noite.perdas) : '-'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="p-2 font-semibold">Perdas %</td>
                                                        <td className="p-2 text-center">{s.manha.turnos > 0 ? formatarPercentagem(s.manha.perdasPct) : '-'}</td>
                                                        <td className="p-2 text-center">{s.noite.turnos > 0 ? formatarPercentagem(s.noite.perdasPct) : '-'}</td>
                                                    </tr>
                                                    <tr className="bg-gray-50 dark:bg-gray-800/50">
                                                        <td className="p-2 font-semibold">TET</td>
                                                        <td className={`p-2 text-center ${s.manha.turnos > 0 && s.manha.tetMedio > 0 ? (s.manha.tetMedio <= CONSTANTES.TET_OBJETIVO ? 'text-green-600' : 'text-red-600') : ''}`}>
                                                            {s.manha.turnos > 0 && s.manha.tetMedio > 0 ? `${formatarNumero(s.manha.tetMedio, 0)}"` : '-'}
                                                        </td>
                                                        <td className={`p-2 text-center ${s.noite.turnos > 0 && s.noite.tetMedio > 0 ? (s.noite.tetMedio <= CONSTANTES.TET_OBJETIVO ? 'text-green-600' : 'text-red-600') : ''}`}>
                                                            {s.noite.turnos > 0 && s.noite.tetMedio > 0 ? `${formatarNumero(s.noite.tetMedio, 0)}"` : '-'}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="p-2 font-semibold">R2P</td>
                                                        <td className={`p-2 text-center ${s.manha.turnos > 0 && s.manha.r2pMedio > 0 ? (s.manha.r2pMedio <= CONSTANTES.R2P_OBJETIVO ? 'text-green-600' : 'text-red-600') : ''}`}>
                                                            {s.manha.turnos > 0 && s.manha.r2pMedio > 0 ? `${formatarNumero(s.manha.r2pMedio, 0)}"` : '-'}
                                                        </td>
                                                        <td className={`p-2 text-center ${s.noite.turnos > 0 && s.noite.r2pMedio > 0 ? (s.noite.r2pMedio <= CONSTANTES.R2P_OBJETIVO ? 'text-green-600' : 'text-red-600') : ''}`}>
                                                            {s.noite.turnos > 0 && s.noite.r2pMedio > 0 ? `${formatarNumero(s.noite.r2pMedio, 0)}"` : '-'}
                                                        </td>
                                                    </tr>
                                                    <tr className="bg-gray-200 dark:bg-gray-700">
                                                        <td className="p-2 font-semibold">Turnos</td>
                                                        <td className="p-2 text-center font-bold">{s.manha.turnos}</td>
                                                        <td className="p-2 text-center font-bold">{s.noite.turnos}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={() => toast({ title: "Dados guardados!", description: "Os dados são salvos automaticamente." })} className="bg-purple-600 hover:bg-purple-700">
                    <Save className="mr-2 h-4 w-4" /> Guardar Dados
                </Button>
                <Button variant="outline" onClick={limparDadosDia}>
                    <Trash2 className="mr-2 h-4 w-4" /> Limpar Dia
                </Button>
                <Button variant="outline" onClick={exportarBackup}>
                    <Download className="mr-2 h-4 w-4" /> Exportar Backup
                </Button>
                <div className="relative">
                    <input type="file" accept=".json" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={importarBackup} />
                    <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" /> Importar Backup
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ShiftManagement;
