import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Loader2, Cloud } from "lucide-react";
import { useComplaintsData } from "@/hooks/useComplaintsData";
import { upsertComplaintsMetricsForStore } from "@/lib/api/service";
import { toast } from "sonner";

interface ComplaintsRatioTableProps {
    selectedMonth: string;
}

export function ComplaintsRatioTable({ selectedMonth }: ComplaintsRatioTableProps) {
    // --- RATIO TABLE STATE ---
    const [data, setData] = useState({
        gcs: {
            amadora: 0,
            queluz: 0,
            pborges: 0
        },
        amadora: {
            qualidade: { sala: 0, delivery: 0 },
            servico: { sala: 0, delivery: 0 },
            limpeza: { sala: 0, delivery: 0 }
        },
        queluz: {
            qualidade: { sala: 0, delivery: 0 },
            servico: { sala: 0, delivery: 0 },
            limpeza: { sala: 0, delivery: 0 }
        },
        ly: {
            amadora: { sala: 0, delivery: 0, gcs: 0 },
            queluz: { sala: 0, delivery: 0, gcs: 0 },
            pborges: { sala: 0, delivery: 0, gcs: 0 }
        }
    });

    // --- EVOLUTION TABLE STATE ---
    const { complaintsData: initialEvolutionData, loading, error, refetch } = useComplaintsData();
    const [evolutionData, setEvolutionData] = useState<any[]>([]);
    const [savingCell, setSavingCell] = useState<string | null>(null);

    useEffect(() => {
        if (initialEvolutionData) {
            setEvolutionData(JSON.parse(JSON.stringify(initialEvolutionData)));
        }
    }, [initialEvolutionData]);

    // --- RATIO HELPERS ---
    const updateData = (path: string[], value: string) => {
        const numValue = value === '' ? 0 : parseFloat(value);
        setData(prev => {
            const newData = { ...prev };
            let current: any = newData;
            for (let i = 0; i < path.length - 1; i++) {
                current = current[path[i]];
            }
            current[path[path.length - 1]] = numValue;
            return newData;
        });
    };

    const calculateTotal = (storeData: any) => {
        return (
            storeData.qualidade.sala + storeData.qualidade.delivery +
            storeData.servico.sala + storeData.servico.delivery +
            storeData.limpeza.sala + storeData.limpeza.delivery
        );
    };

    const calculateRatio = (totalComplaints: number, gcs: number) => {
        if (gcs === 0) return 0;
        return (totalComplaints / gcs) * 100000;
    };

    const amadoraTotal = calculateTotal(data.amadora);
    const queluzTotal = calculateTotal(data.queluz);

    const amadoraRatio = calculateRatio(amadoraTotal, data.gcs.amadora);
    const queluzRatio = calculateRatio(queluzTotal, data.gcs.queluz);

    // LY Calculations
    const lyAmadoraTotal = data.ly.amadora.sala + data.ly.amadora.delivery;
    const lyAmadoraRatio = calculateRatio(lyAmadoraTotal, data.ly.amadora.gcs);

    const lyQueluzTotal = data.ly.queluz.sala + data.ly.queluz.delivery;
    const lyQueluzRatio = calculateRatio(lyQueluzTotal, data.ly.queluz.gcs);

    const lyPBorgesTotal = data.ly.pborges.sala + data.ly.pborges.delivery;
    const lyPBorgesRatio = calculateRatio(lyPBorgesTotal, data.ly.pborges.gcs);


    // --- EVOLUTION HELPERS ---
    const handleEvolutionValueChange = (location: string, month: string, value: string) => {
        setEvolutionData(prev => prev.map(item => {
            if (item.location === location) {
                return { ...item, [month]: value };
            }
            return item;
        }));
    };

    const handleEvolutionAutoSave = async (location: string, monthKey: string, value: string) => {
        const originalValue = initialEvolutionData.find(item => item.location === location)?.[monthKey];

        if (parseInt(value) === parseInt(originalValue as string)) return;

        const cellId = `${location}-${monthKey}`;
        try {
            setSavingCell(cellId);

            const storeId = location === 'Queluz'
                ? 'fcf80b5a-b658-48f3-871c-ac62120c5a78'
                : 'f86b0b1f-05d0-4310-a655-a92ca1ab68bf';

            const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
            const shortMonths = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
            const monthIdx = shortMonths.indexOf(monthKey);

            const val = parseInt(value);
            if (isNaN(val)) return;

            await upsertComplaintsMetricsForStore({
                month_name: monthNames[monthIdx],
                record_date: new Date(2025, monthIdx, 1).toISOString().split('T')[0],
                total_complaints: val
            }, storeId);

            refetch();
            toast.success("Reclamação salva");
        } catch (err) {
            console.error(err);
            toast.error(`Erro ao salvar reclamações para ${location}`);
        } finally {
            setSavingCell(null);
        }
    };

    const shortMonths = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    const monthHeaders = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];


    return (
        <Card className="border-zinc-800 bg-zinc-950/50 mt-6">
            <CardHeader className="py-3 px-4 border-b border-zinc-800 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-white" />
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-white">Rácio de Reclamações</CardTitle>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground italic">
                    <Cloud className="h-3 w-3" />
                    <span>Salvamento automático (Evolução)</span>
                </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
                <div className="min-w-[800px]">
                    {/* --- RATIO TABLE --- */}
                    <table className="w-full text-center border-collapse text-xs">
                        <thead>
                            <tr className="bg-zinc-900/80 text-white font-bold uppercase">
                                <th className="py-2 px-2 text-left w-48">RÁCIO DE RECLAMAÇÕES</th>
                                <th className="py-2 px-2 w-24">BUZZMONITOR</th>
                                <th className="py-2 px-2 w-24">Amadora</th>
                                <th className="py-2 px-2 w-20">SALA</th>
                                <th className="py-2 px-2 w-20">DELIVERY</th>
                                <th className="py-2 px-2 w-20">TOTAL</th>
                                <th className="py-2 px-2 w-24">Queluz</th>
                                <th className="py-2 px-2 w-20">SALA</th>
                                <th className="py-2 px-2 w-20">DELIVERY</th>
                                <th className="py-2 px-2 w-20">TOTAL</th>
                                <th className="py-2 px-2 w-24">LY</th>
                                <th className="py-2 px-2 w-24">AMADORA</th>
                                <th className="py-2 px-2 w-24">QUELUZ</th>
                                <th className="py-2 px-2 w-24">PBORGES</th>
                            </tr>
                        </thead>
                        <tbody className="text-zinc-300">
                            {/* Row 1: GCs Amadora */}
                            <tr className="border-b border-zinc-800">
                                <td className="py-1 px-2 text-left font-bold bg-zinc-900/50">GC's Amadora</td>
                                <td className="py-1 px-1">
                                    <Input
                                        type="number"
                                        className="h-6 text-center bg-transparent border border-zinc-800 hover:border-zinc-600 focus:border-primary rounded-md p-0 text-xs font-bold"
                                        value={data.gcs.amadora || ''}
                                        onChange={(e) => updateData(['gcs', 'amadora'], e.target.value)}
                                    />
                                </td>
                                <td className="py-1 px-2 font-bold">QUALIDADE</td>
                                <td className="py-1 px-1">
                                    <Input
                                        type="number"
                                        className="h-6 text-center bg-transparent border border-zinc-800 hover:border-zinc-600 rounded-md p-0 text-xs"
                                        value={data.amadora.qualidade.sala || ''}
                                        onChange={(e) => updateData(['amadora', 'qualidade', 'sala'], e.target.value)}
                                    />
                                </td>
                                <td className="py-1 px-1">
                                    <Input
                                        type="number"
                                        className="h-6 text-center bg-transparent border border-zinc-800 hover:border-zinc-600 rounded-md p-0 text-xs"
                                        value={data.amadora.qualidade.delivery || ''}
                                        onChange={(e) => updateData(['amadora', 'qualidade', 'delivery'], e.target.value)}
                                    />
                                </td>
                                <td className="py-1 px-2 font-bold bg-zinc-900/30">
                                    {data.amadora.qualidade.sala + data.amadora.qualidade.delivery}
                                </td>
                                <td className="py-1 px-2 font-bold">QUALIDADE</td>
                                <td className="py-1 px-1">
                                    <Input
                                        type="number"
                                        className="h-6 text-center bg-transparent border border-zinc-800 hover:border-zinc-600 rounded-md p-0 text-xs"
                                        value={data.queluz.qualidade.sala || ''}
                                        onChange={(e) => updateData(['queluz', 'qualidade', 'sala'], e.target.value)}
                                    />
                                </td>
                                <td className="py-1 px-1">
                                    <Input
                                        type="number"
                                        className="h-6 text-center bg-transparent border border-zinc-800 hover:border-zinc-600 rounded-md p-0 text-xs"
                                        value={data.queluz.qualidade.delivery || ''}
                                        onChange={(e) => updateData(['queluz', 'qualidade', 'delivery'], e.target.value)}
                                    />
                                </td>
                                <td className="py-1 px-2 font-bold bg-zinc-900/30">
                                    {data.queluz.qualidade.sala + data.queluz.qualidade.delivery}
                                </td>
                                <td className="py-1 px-2 font-bold bg-zinc-900/50">SALA</td>
                                <td className="py-1 px-1">
                                    <Input
                                        type="number"
                                        className="h-6 text-center bg-transparent border border-zinc-800 hover:border-zinc-600 rounded-md p-0 text-xs"
                                        value={data.ly.amadora.sala || ''}
                                        onChange={(e) => updateData(['ly', 'amadora', 'sala'], e.target.value)}
                                    />
                                </td>
                                <td className="py-1 px-1">
                                    <Input
                                        type="number"
                                        className="h-6 text-center bg-transparent border border-zinc-800 hover:border-zinc-600 rounded-md p-0 text-xs"
                                        value={data.ly.queluz.sala || ''}
                                        onChange={(e) => updateData(['ly', 'queluz', 'sala'], e.target.value)}
                                    />
                                </td>
                                <td className="py-1 px-1">
                                    <Input
                                        type="number"
                                        className="h-6 text-center bg-transparent border border-zinc-800 hover:border-zinc-600 rounded-md p-0 text-xs"
                                        value={data.ly.pborges.sala || ''}
                                        onChange={(e) => updateData(['ly', 'pborges', 'sala'], e.target.value)}
                                    />
                                </td>
                            </tr>

                            {/* Row 2: GCs Queluz */}
                            <tr className="border-b border-zinc-800">
                                <td className="py-1 px-2 text-left font-bold bg-zinc-900/50">GC's Queluz</td>
                                <td className="py-1 px-1">
                                    <Input
                                        type="number"
                                        className="h-6 text-center bg-transparent border border-zinc-800 hover:border-zinc-600 focus:border-primary rounded-md p-0 text-xs font-bold"
                                        value={data.gcs.queluz || ''}
                                        onChange={(e) => updateData(['gcs', 'queluz'], e.target.value)}
                                    />
                                </td>
                                <td className="py-1 px-2 font-bold">SERVIÇO</td>
                                <td className="py-1 px-1">
                                    <Input
                                        type="number"
                                        className="h-6 text-center bg-transparent border border-zinc-800 hover:border-zinc-600 rounded-md p-0 text-xs"
                                        value={data.amadora.servico.sala || ''}
                                        onChange={(e) => updateData(['amadora', 'servico', 'sala'], e.target.value)}
                                    />
                                </td>
                                <td className="py-1 px-1">
                                    <Input
                                        type="number"
                                        className="h-6 text-center bg-transparent border border-zinc-800 hover:border-zinc-600 rounded-md p-0 text-xs"
                                        value={data.amadora.servico.delivery || ''}
                                        onChange={(e) => updateData(['amadora', 'servico', 'delivery'], e.target.value)}
                                    />
                                </td>
                                <td className="py-1 px-2 font-bold bg-zinc-900/30">
                                    {data.amadora.servico.sala + data.amadora.servico.delivery}
                                </td>
                                <td className="py-1 px-2 font-bold">SERVIÇO</td>
                                <td className="py-1 px-1">
                                    <Input
                                        type="number"
                                        className="h-6 text-center bg-transparent border border-zinc-800 hover:border-zinc-600 rounded-md p-0 text-xs"
                                        value={data.queluz.servico.sala || ''}
                                        onChange={(e) => updateData(['queluz', 'servico', 'sala'], e.target.value)}
                                    />
                                </td>
                                <td className="py-1 px-1">
                                    <Input
                                        type="number"
                                        className="h-6 text-center bg-transparent border border-zinc-800 hover:border-zinc-600 rounded-md p-0 text-xs"
                                        value={data.queluz.servico.delivery || ''}
                                        onChange={(e) => updateData(['queluz', 'servico', 'delivery'], e.target.value)}
                                    />
                                </td>
                                <td className="py-1 px-2 font-bold bg-zinc-900/30">
                                    {data.queluz.servico.sala + data.queluz.servico.delivery}
                                </td>
                                <td className="py-1 px-2 font-bold bg-zinc-900/50">DELIVERY</td>
                                <td className="py-1 px-1">
                                    <Input
                                        type="number"
                                        className="h-6 text-center bg-transparent border border-zinc-800 hover:border-zinc-600 rounded-md p-0 text-xs"
                                        value={data.ly.amadora.delivery || ''}
                                        onChange={(e) => updateData(['ly', 'amadora', 'delivery'], e.target.value)}
                                    />
                                </td>
                                <td className="py-1 px-1">
                                    <Input
                                        type="number"
                                        className="h-6 text-center bg-transparent border border-zinc-800 hover:border-zinc-600 rounded-md p-0 text-xs"
                                        value={data.ly.queluz.delivery || ''}
                                        onChange={(e) => updateData(['ly', 'queluz', 'delivery'], e.target.value)}
                                    />
                                </td>
                                <td className="py-1 px-1">
                                    <Input
                                        type="number"
                                        className="h-6 text-center bg-transparent border border-zinc-800 hover:border-zinc-600 rounded-md p-0 text-xs"
                                        value={data.ly.pborges.delivery || ''}
                                        onChange={(e) => updateData(['ly', 'pborges', 'delivery'], e.target.value)}
                                    />
                                </td>
                            </tr>

                            {/* Row 3: P.Borges */}
                            <tr className="border-b border-zinc-800">
                                <td className="py-1 px-2 text-left font-bold bg-zinc-900/50">P.Borges</td>
                                <td className="py-1 px-1">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        className="h-6 text-center bg-transparent border border-zinc-800 hover:border-zinc-600 focus:border-primary rounded-md p-0 text-xs font-bold"
                                        value={data.gcs.pborges || ''}
                                        onChange={(e) => updateData(['gcs', 'pborges'], e.target.value)}
                                    />
                                </td>
                                <td className="py-1 px-2 font-bold">LIMPEZA</td>
                                <td className="py-1 px-1">
                                    <Input
                                        type="number"
                                        className="h-6 text-center bg-transparent border border-zinc-800 hover:border-zinc-600 rounded-md p-0 text-xs"
                                        value={data.amadora.limpeza.sala || ''}
                                        onChange={(e) => updateData(['amadora', 'limpeza', 'sala'], e.target.value)}
                                    />
                                </td>
                                <td className="py-1 px-1">
                                    <Input
                                        type="number"
                                        className="h-6 text-center bg-transparent border border-zinc-800 hover:border-zinc-600 rounded-md p-0 text-xs"
                                        value={data.amadora.limpeza.delivery || ''}
                                        onChange={(e) => updateData(['amadora', 'limpeza', 'delivery'], e.target.value)}
                                    />
                                </td>
                                <td className="py-1 px-2 font-bold bg-zinc-900/30">
                                    {data.amadora.limpeza.sala + data.amadora.limpeza.delivery}
                                </td>
                                <td className="py-1 px-2 font-bold">LIMPEZA</td>
                                <td className="py-1 px-1">
                                    <Input
                                        type="number"
                                        className="h-6 text-center bg-transparent border border-zinc-800 hover:border-zinc-600 rounded-md p-0 text-xs"
                                        value={data.queluz.limpeza.sala || ''}
                                        onChange={(e) => updateData(['queluz', 'limpeza', 'sala'], e.target.value)}
                                    />
                                </td>
                                <td className="py-1 px-1">
                                    <Input
                                        type="number"
                                        className="h-6 text-center bg-transparent border border-zinc-800 hover:border-zinc-600 rounded-md p-0 text-xs"
                                        value={data.queluz.limpeza.delivery || ''}
                                        onChange={(e) => updateData(['queluz', 'limpeza', 'delivery'], e.target.value)}
                                    />
                                </td>
                                <td className="py-1 px-2 font-bold bg-zinc-900/30">
                                    {data.queluz.limpeza.sala + data.queluz.limpeza.delivery}
                                </td>
                                <td className="py-1 px-2 font-bold bg-zinc-900/50">GC'S</td>
                                <td className="py-1 px-1">
                                    <Input
                                        type="number"
                                        className="h-6 text-center bg-transparent border border-zinc-800 hover:border-zinc-600 rounded-md p-0 text-xs"
                                        value={data.ly.amadora.gcs || ''}
                                        onChange={(e) => updateData(['ly', 'amadora', 'gcs'], e.target.value)}
                                    />
                                </td>
                                <td className="py-1 px-1">
                                    <Input
                                        type="number"
                                        className="h-6 text-center bg-transparent border border-zinc-800 hover:border-zinc-600 rounded-md p-0 text-xs"
                                        value={data.ly.queluz.gcs || ''}
                                        onChange={(e) => updateData(['ly', 'queluz', 'gcs'], e.target.value)}
                                    />
                                </td>
                                <td className="py-1 px-1">
                                    <Input
                                        type="number"
                                        className="h-6 text-center bg-transparent border border-zinc-800 hover:border-zinc-600 rounded-md p-0 text-xs"
                                        value={data.ly.pborges.gcs || ''}
                                        onChange={(e) => updateData(['ly', 'pborges', 'gcs'], e.target.value)}
                                    />
                                </td>
                            </tr>

                            {/* Row 4: Rácio */}
                            <tr className="border-b border-zinc-800 font-bold">
                                <td className="py-1 px-2 text-left bg-zinc-900/50">RÁCIO</td>
                                <td className="py-1 px-1">
                                    {/* Placeholder */}
                                </td>
                                <td className="py-1 px-2 bg-zinc-900/50">RÁCIO</td>
                                <td className="py-1 px-1 bg-zinc-900/30">
                                    -
                                </td>
                                <td className="py-1 px-1 bg-zinc-900/30">
                                    -
                                </td>
                                <td className="py-1 px-2 bg-zinc-900/50 text-sm">
                                    {amadoraRatio.toFixed(2).replace('.', ',')}
                                </td>
                                <td className="py-1 px-2 bg-zinc-900/50">RÁCIO</td>
                                <td className="py-1 px-1 bg-zinc-900/30">
                                    -
                                </td>
                                <td className="py-1 px-1 bg-zinc-900/30">
                                    -
                                </td>
                                <td className="py-1 px-2 bg-zinc-900/50 text-sm">
                                    {queluzRatio.toFixed(2).replace('.', ',')}
                                </td>
                                <td className="py-1 px-2 bg-zinc-900/50">RÁCIO</td>
                                <td className="py-1 px-1 bg-zinc-900/30 text-sm">
                                    {lyAmadoraRatio.toFixed(2).replace('.', ',')}
                                </td>
                                <td className="py-1 px-1 bg-zinc-900/30 text-sm">
                                    {lyQueluzRatio.toFixed(2).replace('.', ',')}
                                </td>
                                <td className="py-1 px-1 bg-zinc-900/30 text-sm">
                                    {lyPBorgesRatio.toFixed(2).replace('.', ',')}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* --- EVOLUTION TABLE (Merged) --- */}
                    <div className="mt-4">
                        <table className="w-full text-center border-collapse text-xs">
                            <thead>
                                <tr className="bg-zinc-900/40 text-zinc-400">
                                    <th className="py-2 px-2 text-left w-48 font-bold text-white">Reclamações</th>
                                    {monthHeaders.map(m => (
                                        <th key={m} className="py-2 px-1 text-center font-bold uppercase text-[10px]">{m}</th>
                                    ))}
                                    <th className="py-2 px-2 border-zinc-800 text-center font-bold italic bg-zinc-950" style={{ color: '#16A249' }}>OBJETIVO</th>
                                </tr>
                            </thead>
                            <tbody className="text-zinc-300">
                                {evolutionData.map((item) => (
                                    <tr key={item.location} className="border-b border-zinc-800 last:border-0 hover:bg-zinc-900/20">
                                        <td className="py-1 px-2 text-left font-bold bg-zinc-900/30">{item.location}</td>
                                        {shortMonths.map(m => (
                                            <td key={m} className="py-1 px-1 relative">
                                                <div className="flex items-center justify-center">
                                                    <Input
                                                        type="number"
                                                        step="1"
                                                        value={item[m] ?? 0}
                                                        onChange={(e) => handleEvolutionValueChange(item.location, m, e.target.value)}
                                                        onBlur={(e) => handleEvolutionAutoSave(item.location, m, e.target.value)}
                                                        className={`h-6 w-full text-center bg-transparent border border-zinc-800 hover:border-zinc-600 focus:border-primary rounded-md p-0 text-xs ${savingCell === `${item.location}-${m}` ? 'opacity-50' : ''}`}
                                                    />
                                                </div>
                                                {savingCell === `${item.location}-${m}` && (
                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                        <Loader2 className="h-3 w-3 animate-spin text-primary" />
                                                    </div>
                                                )}
                                            </td>
                                        ))}
                                        <td className="py-1 px-2 text-center font-bold bg-zinc-950" style={{ color: '#16A249' }}>
                                            {Number(item.target).toFixed(2).replace('.', ',')}
                                        </td>
                                    </tr>
                                ))}
                                {loading && evolutionData.length === 0 && (
                                    <tr>
                                        <td colSpan={14} className="py-4 text-center text-zinc-500">
                                            <Loader2 className="h-4 w-4 animate-spin inline mr-2" /> Carregando...
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
