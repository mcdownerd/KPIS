import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConsolidatedResult } from "@/hooks/useConsolidatedResults";
import { Input } from "@/components/ui/input";
import { upsertConsolidatedResult } from "@/lib/api/service";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface ResultsComparisonTableProps {
    title: string;
    results: ConsolidatedResult[];
    category: string;
    onUpdate: () => void;
}

export function ResultsComparisonTable({ title, results, category, onUpdate }: ResultsComparisonTableProps) {
    const filteredResults = results.filter(r => r.metric_category === category);
    const [localValues, setLocalValues] = useState<Record<string, any>>({});

    useEffect(() => {
        const newLocalValues: Record<string, any> = {};
        filteredResults.forEach(r => {
            newLocalValues[`${r.id}-pb`] = r.pb_value !== null ? r.pb_value.toString() : "";
            newLocalValues[`${r.id}-region`] = r.region_value !== null ? r.region_value.toString() : "";
            newLocalValues[`${r.id}-typology`] = r.typology_value !== null ? r.typology_value.toString() : "";
            newLocalValues[`${r.id}-national`] = r.national_value !== null ? r.national_value.toString() : "";
        });
        setLocalValues(newLocalValues);
    }, [results]);

    const handleBlur = async (record: ConsolidatedResult, field: string, value: string) => {
        const numValue = value === "" ? null : parseFloat(value.replace(',', '.'));

        try {
            await upsertConsolidatedResult({
                ...record,
                [field]: numValue
            });
            onUpdate();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao salvar valor");
        }
    };

    const getVariation = (v1: number | null, v2: number | null) => {
        if (v1 === null || v2 === null) return null;
        return v1 - v2;
    };

    return (
        <div className="space-y-0 border border-slate-400 w-full max-w-4xl overflow-hidden shadow-sm">
            {/* Header Verde Estilo Excel */}
            <div className="bg-[#A9D08E] py-1 text-center border-b border-slate-400">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-white drop-shadow-sm">{title}</h3>
            </div>

            <div className="overflow-x-auto bg-[#E2EFDA]/30">
                <Table className="border-collapse">
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-slate-400 bg-white">
                            <TableHead className="border-r border-slate-400 font-bold text-slate-800 h-7 text-[10px] px-2"></TableHead>
                            <TableHead className="border-r border-slate-400 text-center font-bold text-slate-800 h-7 text-[10px] px-1">P.Borges</TableHead>
                            <TableHead className="border-r border-slate-400 text-center font-bold text-slate-800 h-7 text-[10px] px-1">Região</TableHead>
                            <TableHead className="border-r border-slate-400 text-center font-bold text-slate-800 h-7 text-[10px] px-1">PBvsRegião</TableHead>
                            <TableHead className="border-r border-slate-400 text-center font-bold text-slate-800 h-7 text-[10px] px-1">Tipologia</TableHead>
                            <TableHead className="border-r border-slate-400 text-center font-bold text-slate-800 h-7 text-[10px] px-1">PBvsTipo</TableHead>
                            <TableHead className="border-r border-slate-400 text-center font-bold text-slate-800 h-7 text-[10px] px-1">Nacional</TableHead>
                            <TableHead className="text-center font-bold text-slate-800 h-7 text-[10px] px-1">PBvsNac</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredResults.map((row) => {
                            const pbVsReg = getVariation(row.pb_value, row.region_value);
                            const pbVsTipo = getVariation(row.pb_value, row.typology_value);
                            const pbVsNac = getVariation(row.pb_value, row.national_value);

                            return (
                                <TableRow key={row.id} className="border-b border-slate-400 hover:bg-[#A9D08E]/10 bg-white/50 h-7 transition-colors">
                                    <TableCell className="border-r border-slate-400 py-0 px-2 text-[10px] font-medium text-slate-700 bg-[#E2EFDA]/50">{row.metric_name}</TableCell>
                                    <TableCell className="border-r border-slate-400 p-0 text-center">
                                        <Input
                                            className="h-6 text-[10px] text-center bg-transparent border-none focus:bg-white p-0 rounded-none"
                                            value={localValues[`${row.id}-pb`] || ""}
                                            onChange={(e) => setLocalValues({ ...localValues, [`${row.id}-pb`]: e.target.value })}
                                            onBlur={(e) => handleBlur(row, 'pb_value', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell className="border-r border-slate-400 p-0 text-center">
                                        <Input
                                            className="h-6 text-[10px] text-center bg-transparent border-none focus:bg-white p-0 rounded-none"
                                            value={localValues[`${row.id}-region`] || ""}
                                            onChange={(e) => setLocalValues({ ...localValues, [`${row.id}-region`]: e.target.value })}
                                            onBlur={(e) => handleBlur(row, 'region_value', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell className="border-r border-slate-400 py-0 px-1 text-center text-[10px] font-bold text-slate-900 bg-[#E2EFDA]/80">
                                        {pbVsReg !== null ? pbVsReg.toFixed(2).replace('.', ',') : ""}
                                    </TableCell>
                                    <TableCell className="border-r border-slate-400 p-0 text-center">
                                        <Input
                                            className="h-6 text-[10px] text-center bg-transparent border-none focus:bg-white p-0 rounded-none"
                                            value={localValues[`${row.id}-typology`] || ""}
                                            onChange={(e) => setLocalValues({ ...localValues, [`${row.id}-typology`]: e.target.value })}
                                            onBlur={(e) => handleBlur(row, 'typology_value', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell className="border-r border-slate-400 py-0 px-1 text-center text-[10px] font-bold text-slate-900 bg-[#E2EFDA]/80">
                                        {pbVsTipo !== null ? pbVsTipo.toFixed(2).replace('.', ',') : ""}
                                    </TableCell>
                                    <TableCell className="border-r border-slate-400 p-0 text-center">
                                        <Input
                                            className="h-6 text-[10px] text-center bg-transparent border-none focus:bg-white p-0 rounded-none"
                                            value={localValues[`${row.id}-national`] || ""}
                                            onChange={(e) => setLocalValues({ ...localValues, [`${row.id}-national`]: e.target.value })}
                                            onBlur={(e) => handleBlur(row, 'national_value', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell className="py-0 px-1 text-center text-[10px] font-bold text-slate-900 bg-[#E2EFDA]/80">
                                        {pbVsNac !== null ? pbVsNac.toFixed(2).replace('.', ',') : ""}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
