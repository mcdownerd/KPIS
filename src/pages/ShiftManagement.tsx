import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Save, Trash2, Download, Upload, ChevronLeft, ChevronRight, FileUp, Loader2, Home, ArrowLeft } from 'lucide-react';
import * as XLSX from 'xlsx';
import { getShiftData, saveAllShiftData, saveAppConfig, getAppConfig } from '@/lib/api/shifts';
import type { ShiftData as APIShiftData, AppConfig as APIAppConfig } from '@/lib/api/shifts';

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
    GERENTES: ['William', 'Patricia', 'Diogo', 'Paula', 'Janice', 'Isaac', 'Uilson', 'Bruna', 'Outro'],
    CORES_GERENTES: {
        'William': '#E0F2FE',
        'Patricia': '#FCE7F3',
        'Diogo': '#DCFCE7',
        'Paula': '#FEF3C7',
        'Janice': '#E0E7FF',
        'Isaac': '#F3E8FF',
        'Uilson': '#FFE4E6',
        'Bruna': '#FEF9C3',
        'Outro': '#F3F4F6'
    }
};

const STORAGE_KEY = 'shift_management_data_2025';
const CONFIG_KEY = 'shift_app_config';

// ============= TYPES =============
interface ManagerConfig {
    name: string;
    color: string;
}

interface ExcelMapping {
    excelUser: string;
    managerName: string;
}

interface AppConfig {
    gerentes: ManagerConfig[];
    mappings: ExcelMapping[];
}

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

const STORES = ['Amadora', 'Queluz'];

const ShiftManagement = () => {
    const { toast } = useToast();
    const [mesAtual, setMesAtual] = useState(0);
    const [diaAtual, setDiaAtual] = useState(1);
    const [dados, setDados] = useState<Record<string, ShiftData>>({});
    const [activeTab, setActiveTab] = useState('tabela');
    const [importedData, setImportedData] = useState({ vendas: false, perdas: false, tempos: false });
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedStore, setSelectedStore] = useState('Amadora');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Configuration State
    const [config, setConfig] = useState<AppConfig>({
        gerentes: CONSTANTES.GERENTES.map(name => ({
            name,
            color: (CONSTANTES.CORES_GERENTES as any)[name] || '#F3F4F6'
        })),
        mappings: [
            { excelUser: 'fer', managerName: 'Janice' },
            { excelUser: 'isa', managerName: 'Isaac' },
            { excelUser: 'noa', managerName: 'Uilson' },
            { excelUser: 'wil', managerName: 'William' },
            { excelUser: 'bru', managerName: 'Bruna' }
        ]
    });

    const queryClient = useQueryClient();

    // Load shift data with React Query (with automatic caching)
    const { data: shiftDataFromQuery, isLoading } = useQuery({
        queryKey: ['shiftData', selectedStore],
        queryFn: async () => {
            try {
                return await getShiftData(new Date().getFullYear(), selectedStore);
            } catch (error) {
                console.error("Erro ao carregar shift data:", error);
                // Fallback to localStorage with store-specific key
                const savedData = localStorage.getItem(`${STORAGE_KEY}_${selectedStore}`);
                if (savedData) {
                    return JSON.parse(savedData);
                }
                // Try legacy key for Amadora if new key doesn't exist
                if (selectedStore === 'Amadora') {
                    const legacyData = localStorage.getItem(STORAGE_KEY);
                    if (legacyData) return JSON.parse(legacyData);
                }
                return {};
            }
        },
        staleTime: 5 * 60 * 1000, // Cache por 5 minutos
        gcTime: 10 * 60 * 1000,
    });

    // Initialize dados state from query data
    useEffect(() => {
        if (shiftDataFromQuery) {
            setDados(shiftDataFromQuery);
        } else {
            setDados({}); // Reset if no data
        }
    }, [shiftDataFromQuery]);

    // Load config from localStorage (only once)
    useEffect(() => {
        const savedConfigLocal = localStorage.getItem(CONFIG_KEY);
        if (savedConfigLocal) {
            try {
                setConfig(JSON.parse(savedConfigLocal));
            } catch (e) {
                console.error("Erro ao carregar config local", e);
            }
        }
    }, []);

    const salvarDados = async (novosDados: Record<string, ShiftData>) => {
        setDados(novosDados);

        // Update React Query cache immediately for instant UI update
        queryClient.setQueryData(['shiftData', selectedStore], novosDados);

        try {
            // Save to Supabase
            await saveAllShiftData(novosDados, new Date().getFullYear(), selectedStore);

            // Also save to localStorage as backup
            localStorage.setItem(`${STORAGE_KEY}_${selectedStore}`, JSON.stringify(novosDados));
        } catch (error) {
            console.error("Erro ao salvar no Supabase:", error);
            toast({
                variant: "destructive",
                title: "Erro ao salvar",
                description: "Dados salvos localmente, mas não sincronizados com a nuvem."
            });

            // Still save to localStorage
            localStorage.setItem(`${STORAGE_KEY}_${selectedStore}`, JSON.stringify(novosDados));
        }
    };

    const saveConfigFunc = async (newConfig: AppConfig) => {
        setConfig(newConfig);

        try {
            // Save to Supabase
            await saveAppConfig(newConfig);

            // Also save to localStorage as backup
            localStorage.setItem(CONFIG_KEY, JSON.stringify(newConfig));

            toast({ title: "Configurações salvas!" });
        } catch (error) {
            console.error("Erro ao salvar config no Supabase:", error);
            toast({
                variant: "destructive",
                title: "Erro ao salvar configurações",
                description: "Configurações salvas localmente, mas não sincronizadas."
            });

            // Still save to localStorage
            localStorage.setItem(CONFIG_KEY, JSON.stringify(newConfig));
        }
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

    // ============= EXCEL IMPORT FUNCTIONS =============

    const parseExcelDate = (dateStr: string): { dia: number, mes: number } | null => {
        // Format: DDMMYYYY (ex: 11122025)
        if (!dateStr || dateStr.length !== 8) return null;
        const dia = parseInt(dateStr.substring(0, 2));
        const mes = parseInt(dateStr.substring(2, 4)) - 1; // 0-indexed
        return { dia, mes };
    };

    const extractHourFromTimestamp = (timestamp: any): number => {
        if (!timestamp) return 0;

        // If it's a Date object (most common from SheetJS)
        if (timestamp instanceof Date) {
            return timestamp.getHours();
        }

        // If it's an Excel serial date (number)
        if (typeof timestamp === 'number') {
            // Excel stores dates as days since 1900-01-01
            // The fractional part represents the time
            const fractionalDay = timestamp - Math.floor(timestamp);
            const hours = Math.floor(fractionalDay * 24);
            return hours;
        }

        // If it's a string, try to extract hour
        const dateStr = timestamp.toString();

        // Try format: "2025-12-10 10:45:00" or "10:45:00"
        const match = dateStr.match(/(\d{1,2}):(\d{2})/);
        if (match) {
            return parseInt(match[1]);
        }

        // Try to parse as Date
        const parsedDate = new Date(dateStr);
        if (!isNaN(parsedDate.getTime())) {
            return parsedDate.getHours();
        }

        return 0;
    };

    const convertToNumber = (value: any): number => {
        if (typeof value === 'number') return value;
        if (typeof value === 'string') {
            const cleaned = value.replace(/[^\d,.-]/g, '').replace(',', '.');
            return parseFloat(cleaned) || 0;
        }
        return 0;
    };

    const importarVendas = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx';
        input.onchange = async (e: any) => {
            const file = e.target.files[0];
            if (!file) return;

            setIsProcessing(true);
            try {
                const data = await file.arrayBuffer();
                const workbook = XLSX.read(data);
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];

                // Extract date from C2
                const dateCell = worksheet['C2'];
                if (!dateCell) throw new Error('Data não encontrada na célula C2');
                const parsedDate = parseExcelDate(dateCell.v?.toString() || '');
                if (!parsedDate) throw new Error('Formato de data inválido');

                // Initialize accumulators
                let manha = { vendas_real: 0, vendas_plan: 0, gcs_real: 0, gcs_plan: 0, horas: 0 };
                let noite = { vendas_real: 0, vendas_plan: 0, gcs_real: 0, gcs_plan: 0, horas: 0 };

                // Process rows 13-200
                for (let row = 13; row <= 200; row++) {
                    const cellB = worksheet[`B${row}`];
                    const cellD = worksheet[`D${row}`];
                    const cellF = worksheet[`F${row}`];
                    const cellN = worksheet[`N${row}`];
                    const cellP = worksheet[`P${row}`];
                    const cellY = worksheet[`Y${row}`]; // Horas

                    // Check if this is a TOTAL row (B empty + D has value)
                    if ((!cellB || !cellB.v) && cellD && cellD.v) {
                        // Get hour from PREVIOUS row (row - 1)
                        const previousCellB = worksheet[`B${row - 1}`];

                        // Skip if previous row doesn't have a timestamp (e.g., grand total row)
                        if (!previousCellB || !previousCellB.v) {
                            console.log(`Linha ${row}: IGNORADA (linha anterior sem timestamp)`);
                            continue;
                        }

                        const hour = extractHourFromTimestamp(previousCellB.v);

                        const vendas_real = convertToNumber(cellD.v);
                        const vendas_plan = convertToNumber(cellF?.v);
                        const gcs_real = convertToNumber(cellN?.v);
                        const gcs_plan = convertToNumber(cellP?.v);

                        console.log(`TOTAL Linha ${row}: Hora ${hour}h → Vendas: €${vendas_real}, GCs: ${gcs_real}`);

                        if (hour < 16) {
                            manha.vendas_real += vendas_real;
                            manha.vendas_plan += vendas_plan;
                            manha.gcs_real += gcs_real;
                            manha.gcs_plan += gcs_plan;
                        } else {
                            noite.vendas_real += vendas_real;
                            noite.vendas_plan += vendas_plan;
                            noite.gcs_real += gcs_real;
                            noite.gcs_plan += gcs_plan;
                        }
                    }
                    // SEPARATE: Extract hours from timestamp rows (B has value + Y has value)
                    else if (cellB && cellB.v && cellY && cellY.v) {
                        const timestamp = cellB.v;
                        // Check if it's a date/timestamp (not a string like "10:00 - 10:59")
                        const isTimestamp = timestamp instanceof Date ||
                            typeof timestamp === 'number' ||
                            (typeof timestamp === 'string' && timestamp.match(/\d{4}-\d{2}-\d{2}/));

                        if (isTimestamp) {
                            const hour = extractHourFromTimestamp(timestamp);
                            const horas = convertToNumber(cellY.v);

                            if (hour < 16) {
                                manha.horas += horas;
                            } else {
                                noite.horas += horas;
                            }
                        }
                    }
                }

                console.log('RESUMO FINAL:');
                console.log(`Manhã: Vendas=${manha.vendas_real}, GCs=${manha.gcs_real}, Horas=${manha.horas}`);
                console.log(`Noite: Vendas=${noite.vendas_real}, GCs=${noite.gcs_real}, Horas=${noite.horas}`);

                // Update form fields
                const chave = `${parsedDate.mes}-${parsedDate.dia}`;
                const dadosAtuais = dados[chave] || {};
                const novosDados = {
                    ...dados,
                    [chave]: {
                        ...dadosAtuais,
                        m_vnd_real: Math.round(manha.vendas_real * 100) / 100, // Round to 2 decimals
                        m_vnd_plan: Math.round(manha.vendas_plan * 100) / 100,
                        m_gcs_real: Math.round(manha.gcs_real),
                        m_gcs_plan: Math.round(manha.gcs_plan),
                        m_horas: Math.round(manha.horas * 10) / 10, // Round to 1 decimal
                        n_vnd_real: Math.round(noite.vendas_real * 100) / 100,
                        n_vnd_plan: Math.round(noite.vendas_plan * 100) / 100,
                        n_gcs_real: Math.round(noite.gcs_real),
                        n_gcs_plan: Math.round(noite.gcs_plan),
                        n_horas: Math.round(noite.horas * 10) / 10,
                    }
                };

                salvarDados(novosDados);
                setImportedData(prev => ({ ...prev, vendas: true }));

                // Navigate to the imported date
                setMesAtual(parsedDate.mes);
                setDiaAtual(parsedDate.dia);

                toast({
                    title: "📊 Vendas importadas!",
                    description: `Manhã: €${manha.vendas_real.toFixed(2)}, ${manha.horas.toFixed(1)}h | Noite: €${noite.vendas_real.toFixed(2)}, ${noite.horas.toFixed(1)}h`
                });
            } catch (error: any) {
                toast({
                    variant: "destructive",
                    title: "Erro ao importar Vendas",
                    description: error.message
                });
            } finally {
                setIsProcessing(false);
            }
        };
        input.click();
    };

    const importarPerdas = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xls,.xlsx';
        input.onchange = async (e: any) => {
            const file = e.target.files[0];
            if (!file) return;

            setIsProcessing(true);
            try {
                const data = await file.arrayBuffer();
                const workbook = XLSX.read(data);
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];

                // Extract date from E2
                const dateCell = worksheet['E2'];
                if (!dateCell) throw new Error('Data não encontrada na célula E2');
                const parsedDate = parseExcelDate(dateCell.v?.toString() || '');
                if (!parsedDate) throw new Error('Formato de data inválido');

                let manha_perdas = 0;
                let noite_perdas = 0;
                let manha_gerente = '';
                let noite_gerente = '';

                // Manager name mapping from config
                const getGerenteFromExcelUser = (user: string) => {
                    const mapping = config.mappings.find(m => m.excelUser.toLowerCase() === user.toLowerCase());
                    return mapping ? mapping.managerName : '';
                };

                // Process rows 13-200
                for (let row = 13; row <= 200; row++) {
                    const cellA = worksheet[`A${row}`];
                    const cellQ = worksheet[`Q${row}`];
                    const cellX = worksheet[`X${row}`]; // Utilizador
                    const cellAB = worksheet[XLSX.utils.encode_cell({ r: row - 1, c: 27 })]; // Column 27 = AB

                    // Filter: column A contains "Perdas"
                    if (cellA && cellA.v && cellA.v.toString().includes('Perdas')) {
                        const hour = extractHourFromTimestamp(cellQ?.v);
                        const valor = convertToNumber(cellAB?.v);
                        const utilizador = cellX?.v?.toString().toLowerCase().trim() || '';

                        // Map utilizador to gerente name
                        const gerente = getGerenteFromExcelUser(utilizador);

                        console.log(`PERDAS Linha ${row}: Utilizador='${utilizador}' → Gerente='${gerente}'`);

                        if (hour < 17) {  // Perdas: manhã até 17h
                            manha_perdas += valor;
                            if (gerente && !manha_gerente) manha_gerente = gerente;
                        } else {
                            noite_perdas += valor;
                            if (gerente && !noite_gerente) noite_gerente = gerente;
                        }
                    }
                }

                console.log(`RESUMO GERENTES: Manhã='${manha_gerente}', Noite='${noite_gerente}'`);

                // Update form fields
                const chave = `${parsedDate.mes}-${parsedDate.dia}`;
                const dadosAtuais = dados[chave] || {};
                const novosDados = {
                    ...dados,
                    [chave]: {
                        ...dadosAtuais,
                        m_perdas_real: Math.round(manha_perdas * 100) / 100,
                        n_perdas_real: Math.round(noite_perdas * 100) / 100,
                        ...(manha_gerente && { m_gerente: manha_gerente }),
                        ...(noite_gerente && { n_gerente: noite_gerente }),
                    }
                };

                salvarDados(novosDados);
                setImportedData(prev => ({ ...prev, perdas: true }));

                // Navigate to the imported date
                setMesAtual(parsedDate.mes);
                setDiaAtual(parsedDate.dia);

                toast({
                    title: "💸 Perdas importadas!",
                    description: `Manhã: €${manha_perdas.toFixed(2)} | Noite: €${noite_perdas.toFixed(2)}`
                });
            } catch (error: any) {
                toast({
                    variant: "destructive",
                    title: "Erro ao importar Perdas",
                    description: error.message
                });
            } finally {
                setIsProcessing(false);
            }
        };
        input.click();
    };

    const importarTempos = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xls,.xlsx';
        input.onchange = async (e: any) => {
            const file = e.target.files[0];
            if (!file) return;

            setIsProcessing(true);
            try {
                const data = await file.arrayBuffer();
                const workbook = XLSX.read(data);
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];

                // Extract date from C2
                const dateCell = worksheet['C2'];
                if (!dateCell) throw new Error('Data não encontrada na célula C2');
                const parsedDate = parseExcelDate(dateCell.v?.toString() || '');
                if (!parsedDate) throw new Error('Formato de data inválido');

                let manha_r2p: number[] = [];
                let manha_tet: number[] = [];
                let noite_r2p: number[] = [];
                let noite_tet: number[] = [];

                // Process rows 13-200
                for (let row = 13; row <= 200; row++) {
                    const cellB = worksheet[`B${row}`];
                    const cellI = worksheet[`I${row}`]; // R2P
                    const cellO = worksheet[`O${row}`]; // TET

                    // Identify totals: column B contains " - " (ex: "10:00 - 10:59")
                    if (cellB && cellB.v && cellB.v.toString().includes(' - ')) {
                        const hourMatch = cellB.v.toString().match(/(\d{1,2}):/);
                        const hour = hourMatch ? parseInt(hourMatch[1]) : 0;

                        const r2p = convertToNumber(cellI?.v);
                        const tet = convertToNumber(cellO?.v);

                        console.log(`TEMPOS Linha ${row}: Hora ${hour}h → R2P: ${r2p}, TET: ${tet}`);

                        if (hour < 16) {
                            if (r2p > 0) manha_r2p.push(r2p);
                            if (tet > 0) manha_tet.push(tet);
                        } else {
                            if (r2p > 0) noite_r2p.push(r2p);
                            if (tet > 0) noite_tet.push(tet);
                        }
                    }
                }

                // Calculate averages
                const avg = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
                const manha_r2p_avg = avg(manha_r2p);
                const manha_tet_avg = avg(manha_tet);
                const noite_r2p_avg = avg(noite_r2p);
                const noite_tet_avg = avg(noite_tet);

                console.log('RESUMO TEMPOS:');
                console.log(`Manhã: R2P=${manha_r2p_avg}, TET=${manha_tet_avg}`);
                console.log(`Noite: R2P=${noite_r2p_avg}, TET=${noite_tet_avg}`);

                // Update form fields
                const chave = `${parsedDate.mes}-${parsedDate.dia}`;
                const dadosAtuais = dados[chave] || {};
                const novosDados = {
                    ...dados,
                    [chave]: {
                        ...dadosAtuais,
                        m_r2p: Math.round(manha_r2p_avg),
                        m_tet: Math.round(manha_tet_avg),
                        n_r2p: Math.round(noite_r2p_avg),
                        n_tet: Math.round(noite_tet_avg),
                    }
                };

                salvarDados(novosDados);
                setImportedData(prev => ({ ...prev, tempos: true }));

                // Navigate to the imported date
                setMesAtual(parsedDate.mes);
                setDiaAtual(parsedDate.dia);

                toast({
                    title: "⏱️ Tempos importados!",
                    description: `Manhã: TET ${Math.round(manha_tet_avg)} / R2P ${Math.round(manha_r2p_avg)} | Noite: TET ${Math.round(noite_tet_avg)} / R2P ${Math.round(noite_r2p_avg)}`
                });
            } catch (error: any) {
                toast({
                    variant: "destructive",
                    title: "Erro ao importar Tempos",
                    description: error.message
                });
            } finally {
                setIsProcessing(false);
            }
        };
        input.click();
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

        config.gerentes.forEach(g => {
            const gerente = g.name;
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
                                        {config.gerentes.map(g => <SelectItem key={g.name} value={g.name}>{g.name}</SelectItem>)}
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
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="icon"
                            asChild
                            className="shrink-0"
                        >
                            <Link to="/">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold">Informações de Turno - {selectedStore} 2025</h1>
                            <Select value={selectedStore} onValueChange={setSelectedStore}>
                                <SelectTrigger className="w-[180px] bg-background">
                                    <SelectValue placeholder="Selecione a Loja" />
                                </SelectTrigger>
                                <SelectContent>
                                    {STORES.map(store => (
                                        <SelectItem key={store} value={store}>{store}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
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

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
                        <p className="text-lg font-semibold">Carregando dados...</p>
                        <p className="text-sm text-muted-foreground">Conectando ao Supabase</p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="bg-[#FFC72C] p-6 rounded-xl shadow-lg text-black">
                        <h3 className="text-xl font-semibold text-center mb-6">
                            Resumo do Dia {diaAtual} de {CONSTANTES.MESES[mesAtual]}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-black/5 backdrop-blur-sm p-4 rounded-xl text-center border border-black/10">
                                <div className="text-xs uppercase font-bold text-black/70 mb-2">Vendas Total</div>
                                <div className="text-2xl font-bold font-mono">{formatarMoeda(calculos.vendasTotal)}</div>
                            </div>
                            <div className="bg-black/5 backdrop-blur-sm p-4 rounded-xl text-center border border-black/10">
                                <div className="text-xs uppercase font-bold text-black/70 mb-2">GC's Total</div>
                                <div className="text-2xl font-bold font-mono">{formatarNumero(calculos.gcsTotal)}</div>
                            </div>
                            <div className="bg-black/5 backdrop-blur-sm p-4 rounded-xl text-center border border-black/10">
                                <div className="text-xs uppercase font-bold text-black/70 mb-2">BM Médio</div>
                                <div className="text-2xl font-bold font-mono">{formatarMoeda(calculos.bmMedio)}</div>
                            </div>
                            <div className="bg-black/5 backdrop-blur-sm p-4 rounded-xl text-center border border-black/10">
                                <div className="text-xs uppercase font-bold text-black/70 mb-2">MO Dia</div>
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
                            <TabsTrigger value="config" className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-base">
                                ⚙️ Configurações
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="config">
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Gerentes Management */}
                                <Card>
                                    <div className="p-4 font-bold border-b">Gerentes e Cores</div>
                                    <CardContent className="p-4 space-y-4">
                                        <div className="space-y-2">
                                            {config.gerentes.map((gerente, index) => (
                                                <div key={index} className="flex items-center gap-2 p-2 border rounded bg-gray-50 dark:bg-gray-800">
                                                    <div className="w-6 h-6 rounded border" style={{ backgroundColor: gerente.color }}></div>
                                                    <Input
                                                        value={gerente.name}
                                                        onChange={(e) => {
                                                            const newGerentes = [...config.gerentes];
                                                            newGerentes[index].name = e.target.value;
                                                            saveConfigFunc({ ...config, gerentes: newGerentes });
                                                        }}
                                                        className="h-8"
                                                    />
                                                    <Input
                                                        type="color"
                                                        value={gerente.color}
                                                        onChange={(e) => {
                                                            const newGerentes = [...config.gerentes];
                                                            newGerentes[index].color = e.target.value;
                                                            saveConfigFunc({ ...config, gerentes: newGerentes });
                                                        }}
                                                        className="w-12 h-8 p-1"
                                                    />
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            const newGerentes = config.gerentes.filter((_, i) => i !== index);
                                                            saveConfigFunc({ ...config, gerentes: newGerentes });
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                        <Button
                                            className="w-full"
                                            variant="outline"
                                            onClick={() => {
                                                saveConfigFunc({
                                                    ...config,
                                                    gerentes: [...config.gerentes, { name: 'Novo Gerente', color: '#ffffff' }]
                                                });
                                            }}
                                        >
                                            + Adicionar Gerente
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Excel Mappings */}
                                <Card>
                                    <div className="p-4 font-bold border-b">Mapeamento Excel (Utilizador → Gerente)</div>
                                    <CardContent className="p-4 space-y-4">
                                        <div className="space-y-2">
                                            {config.mappings.map((mapping, index) => (
                                                <div key={index} className="flex items-center gap-2 p-2 border rounded bg-gray-50 dark:bg-gray-800">
                                                    <Input
                                                        placeholder="ID Excel (ex: fer)"
                                                        value={mapping.excelUser}
                                                        onChange={(e) => {
                                                            const newMappings = [...config.mappings];
                                                            newMappings[index].excelUser = e.target.value;
                                                            saveConfigFunc({ ...config, mappings: newMappings });
                                                        }}
                                                        className="h-8 w-1/3"
                                                    />
                                                    <span className="text-gray-400">→</span>
                                                    <Select
                                                        value={mapping.managerName}
                                                        onValueChange={(val) => {
                                                            const newMappings = [...config.mappings];
                                                            newMappings[index].managerName = val;
                                                            saveConfigFunc({ ...config, mappings: newMappings });
                                                        }}
                                                    >
                                                        <SelectTrigger className="h-8 flex-1">
                                                            <SelectValue placeholder="Selecione..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {config.gerentes.map(g => (
                                                                <SelectItem key={g.name} value={g.name}>{g.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            const newMappings = config.mappings.filter((_, i) => i !== index);
                                                            saveConfigFunc({ ...config, mappings: newMappings });
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                        <Button
                                            className="w-full"
                                            variant="outline"
                                            onClick={() => {
                                                saveConfigFunc({
                                                    ...config,
                                                    mappings: [...config.mappings, { excelUser: '', managerName: '' }]
                                                });
                                            }}
                                        >
                                            + Adicionar Mapeamento
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="tabela">
                            <div className="grid md:grid-cols-2 gap-6">
                                <ShiftTable prefix="m" title="☀️ TURNO DA MANHÃ" bgColor="bg-orange-400 text-black" />
                                <ShiftTable prefix="n" title="🌙 TURNO DA NOITE" bgColor="bg-gray-800 text-white" />
                            </div>
                        </TabsContent>

                        <TabsContent value="analise">
                            <div className="grid md:grid-cols-2 gap-6">
                                {config.gerentes.map(gerenteObj => {
                                    const gerente = gerenteObj.name;
                                    const s = analiseGerentes[gerente];
                                    const cor = gerenteObj.color;

                                    if (!s || s.turnos === 0) return null;

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

                    {/* Excel Import Buttons */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-6 rounded-xl border-2 border-dashed border-blue-300 dark:border-blue-700 mb-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <FileUp className="h-5 w-5" />
                            Importação Automática de Excel
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            <Button
                                onClick={importarVendas}
                                disabled={isProcessing}
                                className={`${importedData.vendas ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                            >
                                {isProcessing ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <span className="mr-2">📊</span>
                                )}
                                Vendas {importedData.vendas && '✓'}
                            </Button>
                            <Button
                                onClick={importarPerdas}
                                disabled={isProcessing}
                                className={`${importedData.perdas ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'} text-white`}
                            >
                                {isProcessing ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <span className="mr-2">💸</span>
                                )}
                                Perdas {importedData.perdas && '✓'}
                            </Button>
                            <Button
                                onClick={importarTempos}
                                disabled={isProcessing}
                                className={`${importedData.tempos ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'} text-white`}
                            >
                                {isProcessing ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <span className="mr-2">⏱️</span>
                                )}
                                TET/R2P {importedData.tempos && '✓'}
                            </Button>
                            {(importedData.vendas || importedData.perdas || importedData.tempos) && (
                                <Button
                                    onClick={() => {
                                        toast({ title: "💾 Dados salvos!", description: "Os dados importados foram guardados automaticamente." });
                                        setImportedData({ vendas: false, perdas: false, tempos: false });
                                    }}
                                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white animate-pulse"
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    💾 Salvar Dados
                                </Button>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">
                            💡 Importe os 3 arquivos Excel para preencher automaticamente os campos. Os dados serão salvos no dia correspondente.
                        </p>
                    </div>

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
                </>
            )}
        </div>
    );
};

export default ShiftManagement;
