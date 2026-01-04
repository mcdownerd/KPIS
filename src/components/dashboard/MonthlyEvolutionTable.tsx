import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConsolidatedResult } from "@/hooks/useConsolidatedResults";
import { Input } from "@/components/ui/input";
import { upsertConsolidatedResult } from "@/lib/api/service";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface MonthlyEvolutionTableProps {
    results: ConsolidatedResult[];
    onUpdate: () => void;
}

export function MonthlyEvolutionTable({ results, onUpdate }: MonthlyEvolutionTableProps) {
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    const metrics = [
        { name: "Crescimento de vendas", category: "financeiro" },
        { name: "Crescimento de GC's", category: "financeiro" },
        { name: "Crescimento Delivery", category: "financeiro" },
        { name: "Crescimento GC's Delivery", category: "financeiro" },
        { name: "Peso Delivery", category: "financeiro" },
        { name: "Peso MOP", category: "financeiro" },
        { name: "Tempos de Serviço", category: "operacoes" },
        { name: "Tempos de serviço Nacional", category: "operacoes" },
        { name: "Fastinsight", category: "operacoes" },
        { name: "Fastinsight Nacional", category: "operacoes" },
        { name: "Turnover", category: "operacoes" },
        { name: "Staffing", category: "operacoes" }
    ];

    const [localValues, setLocalValues] = useState<Record<string, string>>({});

    useEffect(() => {
        const newLocalValues: Record<string, string> = {};
        results.forEach(r => {
            const key = `${r.metric_name}-${r.month_name}`;
            newLocalValues[key] = r.pb_value !== null ? r.pb_value.toString() : "";
        });
        setLocalValues(newLocalValues);
    }, [results]);

    const handleBlur = async (metric: string, category: string, month: string, value: string) => {
        const numValue = value === "" ? null : parseFloat(value.replace(',', '.'));

        const monthIdx = months.indexOf(month);
        const recordDate = new Date(2025, monthIdx, 1).toISOString().split('T')[0];

        try {
            await upsertConsolidatedResult({
                month_name: month,
                record_date: recordDate,
                metric_category: category,
                metric_name: metric,
                pb_value: numValue
            });
            onUpdate();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao salvar valor");
        }
    };

    const getYTD = (metric: string) => {
        const relevantResults = results.filter(r => r.metric_name === metric && r.pb_value !== null);
        if (relevantResults.length === 0) return "-";

        const sum = relevantResults.reduce((acc, curr) => acc + (curr.pb_value || 0), 0);
        const avg = sum / relevantResults.length;

        const isTime = metric.includes("Tempos");
        return isTime ? avg.toFixed(0) : `${avg.toFixed(2)}%`;
    };

    return (
        <div className="overflow-x-auto border border-slate-400 shadow-sm mt-4 bg-white">
            <Table className="border-collapse">
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-slate-400 bg-[#E2EFDA]/50">
                        <TableHead className="border-r border-slate-400 font-bold text-slate-800 h-8 text-[10px] uppercase sticky left-0 bg-[#E2EFDA] z-20 min-w-[180px] px-2">Métrica</TableHead>
                        {months.map(m => (
                            <TableHead key={m} className="border-r border-slate-400 text-center font-bold text-slate-800 h-8 text-[10px] uppercase min-w-[70px] px-1">{m}</TableHead>
                        ))}
                        <TableHead className="border-r border-slate-400 text-center font-bold text-primary bg-primary/5 h-8 text-[10px] uppercase min-w-[70px] px-1">YTD</TableHead>
                        <TableHead className="border-r border-slate-400 text-center font-bold text-slate-800 h-8 text-[10px] uppercase min-w-[70px] px-1">LY</TableHead>
                        <TableHead className="text-center font-bold text-slate-800 h-8 text-[10px] uppercase min-w-[70px] px-1">Variação</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {metrics.map((mInfo) => (
                        <TableRow key={mInfo.name} className="border-b border-slate-400 hover:bg-[#A9D08E]/10 h-8 transition-colors">
                            <TableCell className="border-r border-slate-400 py-1.5 px-2 text-[10px] font-medium sticky left-0 bg-white z-10">{mInfo.name}</TableCell>
                            {months.map(m => {
                                const key = `${mInfo.name}-${m}`;
                                return (
                                    <TableCell key={m} className="border-r border-slate-400 p-0 text-center">
                                        <Input
                                            className="h-7 text-[10px] text-center bg-transparent border border-slate-300/50 focus:bg-[#E2EFDA]/20 p-0 rounded-none"
                                            value={localValues[key] || ""}
                                            onChange={(e) => setLocalValues({ ...localValues, [key]: e.target.value })}
                                            onBlur={(e) => handleBlur(mInfo.name, mInfo.category, m, e.target.value)}
                                            placeholder="-"
                                        />
                                    </TableCell>
                                );
                            })}
                            <TableCell className="border-r border-slate-400 py-1.5 text-center text-[10px] font-bold bg-primary/5 text-primary">{getYTD(mInfo.name)}</TableCell>
                            <TableCell className="border-r border-slate-400 py-1.5 text-center text-[10px]">-</TableCell>
                            <TableCell className="py-1.5 text-center text-[10px]">-</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
