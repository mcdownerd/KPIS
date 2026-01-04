import { Zap } from "lucide-react";
import { QualityMetric } from "@/hooks/useQualityData";
import { useDigitalCommData } from "@/hooks/useDigitalCommData";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { upsertQualityMetricsForStore } from "@/lib/api/service";
import { toast } from "sonner";

interface FastinsightDashboardProps {
    data: QualityMetric[];
    selectedMonth: string;
    onDataChange: () => void;
}

export function FastinsightDashboard({ data, selectedMonth, onDataChange }: FastinsightDashboardProps) {
    const [localData, setLocalData] = useState<{ [key: string]: QualityMetric }>({});

    useEffect(() => {
        const newData: { [key: string]: QualityMetric } = {};
        data.forEach(d => {
            newData[d.store_id] = d;
        });
        setLocalData(newData);
    }, [data]);

    const handleInputChange = async (storeId: string, field: keyof QualityMetric, value: string) => {
        const numValue = value === '' ? null : parseFloat(value);

        // Update local state immediately
        setLocalData(prev => ({
            ...prev,
            [storeId]: {
                ...prev[storeId],
                store_id: storeId,
                month_name: selectedMonth,
                [field]: numValue
            } as QualityMetric
        }));
    };

    const handleInputBlur = async (storeId: string, field: keyof QualityMetric, value: string) => {
        try {
            const numValue = value === '' ? null : parseFloat(value);

            // Prepare data for save
            const currentMetric = localData[storeId] || { store_id: storeId, month_name: selectedMonth };
            const metricToSave = {
                ...currentMetric,
                [field]: numValue
            };

            await upsertQualityMetricsForStore(metricToSave, storeId);
            toast.success("Dados salvos automaticamente");
            onDataChange();
        } catch (error) {
            console.error("Erro ao salvar dados:", error);
            toast.error("Erro ao salvar dados");
        }
    };

    const renderInput = (storeId: string, field: keyof QualityMetric, isNps: boolean = false) => {
        const value = localData[storeId]?.[field];
        const displayValue = value === null || value === undefined ? '' : value.toString();

        return (
            <Input
                type="number"
                step="0.01"
                className={`h-6 w-full text-center bg-transparent border border-zinc-800 hover:border-zinc-600 focus:border-primary rounded-md px-0 text-sm font-bold ${isNps ? 'text-yellow-500' : 'text-white'}`}
                value={displayValue}
                onChange={(e) => handleInputChange(storeId, field, e.target.value)}
                onBlur={(e) => handleInputBlur(storeId, field, e.target.value)}
                placeholder="-"
            />
        );
    };

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <h2 className="text-lg font-bold text-white tracking-tight">FASTINSIGHT</h2>
            </div>

            <div className="rounded-lg overflow-hidden border border-zinc-800">
                <table className="w-full text-center border-collapse">
                    <thead>
                        {/* Top Header Row */}
                        <tr className="bg-zinc-900/80 text-white">
                            <th colSpan={4} className="py-2 px-2 border-b border-zinc-800 text-xs font-bold uppercase tracking-wider">
                                Amadora
                            </th>
                            <th colSpan={1} className="py-2 px-2 border-b border-zinc-800 text-xs font-bold uppercase tracking-wider text-zinc-400">
                                ANO
                            </th>
                            <th colSpan={4} className="py-2 px-2 border-b border-zinc-800 text-xs font-bold uppercase tracking-wider">
                                Queluz
                            </th>
                            <th colSpan={1} className="py-2 px-2 border-b border-zinc-800 text-xs font-bold uppercase tracking-wider text-zinc-400">
                                ANO
                            </th>
                        </tr>
                        {/* Sub Header Row */}
                        <tr className="bg-zinc-900/40 text-zinc-400">
                            <th className="py-2 px-1 text-[10px] font-bold uppercase">SG</th>
                            <th className="py-2 px-1 text-[10px] font-bold uppercase">LIMPEZA</th>
                            <th className="py-2 px-1 text-[10px] font-bold uppercase">SIMPATIA</th>
                            <th className="py-2 px-1 text-[10px] font-bold uppercase">Rapidez</th>
                            <th className="py-2 px-1 text-[10px] font-bold uppercase text-zinc-500">NPS</th>

                            <th className="py-2 px-1 text-[10px] font-bold uppercase">SG</th>
                            <th className="py-2 px-1 text-[10px] font-bold uppercase">LIMPEZA</th>
                            <th className="py-2 px-1 text-[10px] font-bold uppercase">SIMPATIA</th>
                            <th className="py-2 px-1 text-[10px] font-bold uppercase">Rapidez</th>
                            <th className="py-2 px-1 text-[10px] font-bold uppercase text-zinc-500">NPS</th>
                        </tr>
                    </thead>
                    <tbody className="bg-zinc-950/50 text-white">
                        <tr>
                            <td className="py-1 px-1">{renderInput('amadora', 'sg')}</td>
                            <td className="py-1 px-1">{renderInput('amadora', 'precisao')}</td>
                            <td className="py-1 px-1">{renderInput('amadora', 'qualidade')}</td>
                            <td className="py-1 px-1">{renderInput('amadora', 'rapidez')}</td>
                            <td className="py-1 px-1">{renderInput('amadora', 'nps', true)}</td>

                            <td className="py-1 px-1">{renderInput('queluz', 'sg')}</td>
                            <td className="py-1 px-1">{renderInput('queluz', 'precisao')}</td>
                            <td className="py-1 px-1">{renderInput('queluz', 'qualidade')}</td>
                            <td className="py-1 px-1">{renderInput('queluz', 'rapidez')}</td>
                            <td className="py-1 px-1">{renderInput('queluz', 'nps', true)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <MonthlyEvolutionTable />
        </div>
    );
}

function MonthlyEvolutionTable() {
    const { qualityData, refetch } = useDigitalCommData();
    const shortMonths = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const monthHeaders = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    const [localData, setLocalData] = useState<any[]>([]);

    useEffect(() => {
        setLocalData(qualityData);
    }, [qualityData]);

    const calculateYTD = (row: any) => {
        let sum = 0;
        let count = 0;
        shortMonths.forEach(m => {
            const val = parseFloat(row[m]);
            if (!isNaN(val) && val > 0) {
                sum += val;
                count++;
            }
        });
        return count > 0 ? (sum / count).toFixed(2) : '-';
    };

    const handleInputChange = (rowIndex: number, monthKey: string, value: string) => {
        const newData = [...localData];
        newData[rowIndex] = {
            ...newData[rowIndex],
            [monthKey]: value
        };
        setLocalData(newData);
    };

    const handleInputBlur = async (rowIndex: number, monthKey: string, value: string) => {
        try {
            const row = localData[rowIndex];
            const storeId = row.location === 'Queluz' ? 'fcf80b5a-b658-48f3-871c-ac62120c5a78' : 'f86b0b1f-05d0-4310-a655-a92ca1ab68bf'; // Hardcoded IDs based on useDigitalCommData logic
            const monthIndex = shortMonths.indexOf(monthKey);
            const fullMonthName = monthNames[monthIndex];

            const numValue = value === '' ? null : parseFloat(value);

            // We need to fetch the existing record first or just try to update/insert
            // Since upsertQualityMetricsForStore handles logic, we can use it.
            // But wait, upsertQualityMetricsForStore expects a full QualityMetric object.
            // We only have the SG value here.

            // Ideally, we should fetch the full metric for that month/store to preserve other fields (precisao, etc.)
            // However, for this specific table, we are editing SG.
            // Let's assume we want to update SG.

            // A safer approach without fetching everything again is to just update SG if we can.
            // But upsertQualityMetricsForStore replaces the object or updates it.
            // Let's look at upsertQualityMetricsForStore implementation again.
            // It takes (monthName, storeId, data).

            // We need to construct the data object.
            // Since we don't have the other metrics for that specific month in this view (only SG is shown in evolution),
            // we might overwrite other metrics with null if we are not careful.

            // Strategy: Fetch the specific metric for that month/store first, then update.
            // Or, modify the API to support partial updates.
            // Given the constraints, let's try to fetch-then-update inside this handler.

            // Actually, let's use a simpler approach:
            // We will use upsertQualityMetricsForStore but we need to be careful.
            // If we only pass { sg: value }, the other fields might be lost if the API replaces the row.
            // Checking service.ts:
            // .update(data) -> this updates only the fields present in 'data'.
            // So if we pass { sg: 10 }, it should only update sg column.
            // BUT, if it's an INSERT (new record), other fields will be null. That is acceptable.

            await upsertQualityMetricsForStore({ month_name: fullMonthName, sg: numValue } as any, storeId);
            toast.success("SG salvo");
            refetch(); // Refresh data to ensure consistency

        } catch (error) {
            console.error("Erro ao salvar SG:", error);
            toast.error("Erro ao salvar SG");
        }
    };

    return (
        <div className="rounded-lg overflow-hidden border border-zinc-800 mt-6">
            <table className="w-full text-center border-collapse">
                <thead>
                    <tr>
                        <th className="py-1 px-2 border-b border-zinc-800 bg-zinc-900/80 text-[10px] font-bold uppercase text-zinc-300">SG</th>
                        {monthHeaders.map(m => (
                            <th key={m} className="py-1 px-1 border-b border-zinc-800 text-[10px] font-bold uppercase text-zinc-400">{m}</th>
                        ))}
                        <th className="py-1 px-2 border-b border-zinc-800 text-[10px] font-bold uppercase text-white">YTD</th>
                        <th className="py-1 px-2 border-b border-zinc-800 text-[10px] font-bold uppercase text-white">LY</th>
                        <th className="py-1 px-2 border-b border-zinc-800 bg-zinc-950 text-[10px] font-bold uppercase italic" style={{ color: '#16A249' }}>OBJETIVO</th>
                    </tr>
                </thead>
                <tbody className="bg-zinc-950/50 text-white">
                    {localData.map((row, rowIndex) => (
                        <tr key={row.location} className="border-b border-zinc-800 last:border-0">
                            <td className="py-2 px-2 text-xs font-bold bg-zinc-900/30">{row.location}</td>
                            {shortMonths.map(m => (
                                <td key={m} className="py-1 px-1 text-xs">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        className="h-6 w-full text-center bg-transparent border border-zinc-800 hover:border-zinc-600 focus:border-primary rounded-md px-0 text-xs text-white"
                                        value={row[m] ? row[m].toString() : ''}
                                        onChange={(e) => handleInputChange(rowIndex, m, e.target.value)}
                                        onBlur={(e) => handleInputBlur(rowIndex, m, e.target.value)}
                                        placeholder="-"
                                    />
                                </td>
                            ))}
                            <td className="py-2 px-2 text-xs font-bold text-zinc-300">{calculateYTD(row).replace('.', ',')}</td>
                            <td className="py-2 px-2 text-xs font-bold text-zinc-300">
                                {row.location === 'Amadora' ? '95,9' : '95,1'}
                            </td>
                            <td className="py-2 px-2 text-xs font-bold" style={{ color: '#16A249' }}>95</td>
                        </tr>
                    ))}
                    {localData.length === 0 && (
                        <tr>
                            <td colSpan={16} className="py-4 text-xs text-zinc-500">Carregando dados...</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
