import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { getAllSalesSummaryMetricsByDateRange } from "@/lib/api/service";
import { Loader2, TrendingUp } from "lucide-react";

interface SalesData {
    month_name: string;
    store_id: string;
    record_date: string;
    totais: number;
    delivery: number;
    percent_delivery: number;
    sala: number;
}

const shortMonths = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

const storeMapping: Record<string, string> = {
    "Amadora (20)": "f86b0b1f-05d0-4310-a655-a92ca1ab68bf",
    "Queluz (32)": "fcf80b5a-b658-48f3-871c-ac62120c5a78",
};

export function SalesEvolutionTable() {
    const [data2024, setData2024] = useState<SalesData[]>([]);
    const [data2019, setData2019] = useState<SalesData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const start2024 = '2024-01-01';
                const end2024 = '2024-12-31';
                const start2019 = '2019-01-01';
                const end2019 = '2019-12-31';

                const [data24, data19] = await Promise.all([
                    getAllSalesSummaryMetricsByDateRange(start2024, end2024),
                    getAllSalesSummaryMetricsByDateRange(start2019, end2019)
                ]);

                setData2024(data24);
                setData2019(data19);
            } catch (error) {
                console.error("Error loading sales evolution data:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const getMonthValue = (data: SalesData[], month: string, storeId: string): number => {
        const record = data.find(d =>
            d.store_id === storeId &&
            (d.month_name.toLowerCase() === month.toLowerCase() || d.month_name.substring(0, 3).toLowerCase() === month.toLowerCase())
        );
        return record ? Number(record.totais) : 0;
    };

    const formatValue = (value: number) => {
        if (!value) return '-';
        return new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0
        }).format(value);
    };

    const renderDataRow = (label: string, storeId: string, year: number) => {
        const data = year === 2024 ? data2024 : data2019;

        return (
            <TableRow className="border-b border-border/50 hover:bg-muted/10 h-9">
                <TableCell className="font-medium bg-muted/20 text-[10px] h-9 py-1 px-2 border-r border-border/50">
                    {label}
                </TableCell>
                {shortMonths.map((month) => {
                    const value = getMonthValue(data, month, storeId);
                    return (
                        <TableCell key={month} className="text-center text-[10px] h-9 py-1 px-1">
                            {formatValue(value)}
                        </TableCell>
                    );
                })}
                <TableCell className="text-center font-bold text-primary bg-primary/5 text-[10px] h-9 py-1 px-2 border-l border-border/50">-</TableCell>
                <TableCell className="text-center font-bold text-[10px] h-9 py-1 px-1 border-l border-border/50">-</TableCell>
                <TableCell className="text-center text-[10px] text-muted-foreground h-9 py-1 px-1 border-l border-border/50">-</TableCell>
            </TableRow>
        );
    };

    const renderDeliveryRow = () => {
        return (
            <TableRow className="hover:bg-transparent border-b border-border/50 bg-muted/50 h-8">
                <TableCell colSpan={15} className="font-bold text-foreground text-[10px] h-8 py-1 px-2 text-center">
                    DELIVERY
                </TableCell>
            </TableRow>
        );
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-4 mt-8">
            <div className="flex items-center gap-2 px-1">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground uppercase tracking-wider">Evolução Relativa de Vendas</h3>
            </div>

            <div className="overflow-x-auto rounded-md border border-border/50 bg-card/30">
                <Table>
                    <TableBody>
                        <TableRow className="hover:bg-transparent border-b border-border/50 bg-muted/50 h-8">
                            <TableHead className="font-bold text-foreground text-[10px] h-8 py-1 px-2 border-r border-border/50">20/32</TableHead>
                            {shortMonths.map(month => (
                                <TableHead key={month} className="text-center text-[10px] h-8 py-1 px-1 capitalize">{month}</TableHead>
                            ))}
                            <TableHead className="text-center font-bold text-primary bg-primary/5 text-[10px] h-8 py-1 px-2 border-l border-border/50">OBJETIVO</TableHead>
                            <TableHead className="text-center font-bold text-[10px] h-8 py-1 px-1 border-l border-border/50">YTD</TableHead>
                            <TableHead className="text-center font-bold text-[10px] h-8 py-1 px-1 border-l border-border/50">LY</TableHead>
                        </TableRow>

                        {renderDataRow("20 vs 2024", storeMapping["Amadora (20)"], 2024)}
                        {renderDeliveryRow()}
                        {renderDataRow("20 vs 2019", storeMapping["Amadora (20)"], 2019)}
                        {renderDataRow("32 vs 2024", storeMapping["Queluz (32)"], 2024)}
                        {renderDeliveryRow()}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
