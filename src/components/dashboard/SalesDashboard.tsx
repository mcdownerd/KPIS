import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAllSalesSummaryMetricsByDateRange } from "@/lib/api/service";
import { Loader2, TrendingUp } from "lucide-react";

interface SalesData {
    month_name: string;
    store_id: string;
    totais: number;
    delivery: number;
    percent_delivery: number;
    sala: number;
    mop: number;
    percent_mop: number;
}

const shortMonths = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

const storeMapping: Record<string, string> = {
    "Amadora (20)": "f86b0b1f-05d0-4310-a655-a92ca1ab68bf",
    "Queluz (32)": "fcf80b5a-b658-48f3-871c-ac62120c5a78",
};

export function SalesDashboard() {
    const [data, setData] = useState<SalesData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const currentYear = new Date().getFullYear();
                const startDate = `${currentYear}-01-01`;
                const endDate = `${currentYear}-12-31`;
                const result = await getAllSalesSummaryMetricsByDateRange(startDate, endDate);
                setData(result);
            } catch (error) {
                console.error("Error loading sales data:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
    };

    const formatPercent = (value: number) => {
        return new Intl.NumberFormat('pt-PT', { style: 'percent', maximumFractionDigits: 1 }).format(value / 100);
    };

    const renderStoreSection = (storeName: string, storeId: string) => {
        const storeData = data.filter(d => d.store_id === storeId);

        // Helper to get value for a month
        const getValue = (month: string, field: keyof SalesData) => {
            const record = storeData.find(d => d.month_name.toLowerCase() === month.toLowerCase() || d.month_name.substring(0, 3).toLowerCase() === month.toLowerCase());
            return record ? Number(record[field]) : 0;
        };

        // Calculate YTD
        const calculateYTD = (field: keyof SalesData) => {
            return storeData.reduce((acc, curr) => acc + Number(curr[field]), 0);
        };

        // Calculate Average % for YTD
        const calculateAvgPercentYTD = (field: keyof SalesData) => {
            if (storeData.length === 0) return 0;
            const sum = storeData.reduce((acc, curr) => acc + Number(curr[field]), 0);
            return sum / storeData.length;
        }

        const ytdTotais = calculateYTD('totais');
        const ytdDelivery = calculateYTD('delivery');
        const ytdPercentDelivery = calculateAvgPercentYTD('percent_delivery');
        const ytdSala = calculateYTD('sala');
        const ytdMop = calculateYTD('mop');
        const ytdPercentMop = calculateAvgPercentYTD('percent_mop');


        return (
            <>
                <TableRow className="hover:bg-transparent border-b border-border/50 bg-muted/50 h-8">
                    <TableHead className="font-bold text-foreground text-[10px] h-8 py-1 px-2 border-r border-border/50">{storeName}</TableHead>
                    {shortMonths.map(month => (
                        <TableHead key={month} className="text-center text-[10px] h-8 py-1 px-1 capitalize">{month}</TableHead>
                    ))}
                <TableHead className="text-center font-bold text-primary bg-primary/5 text-[10px] h-8 py-1 px-2 border-l border-border/50">OBJETIVO</TableHead>
                <TableHead className="text-center font-bold text-[10px] h-8 py-1 px-1 border-l border-border/50">YTD</TableHead>
                <TableHead className="text-center font-bold text-[10px] h-8 py-1 px-1 border-l border-border/50">LY</TableHead>
            </TableRow>

                {/* Totais */}
                <TableRow className="border-b border-border/50 hover:bg-muted/10 h-9">
                    <TableCell className="font-medium bg-muted/20 text-[10px] h-9 py-1 px-2 border-r border-border/50">TOTAIS</TableCell>
                    {shortMonths.map(month => (
                        <TableCell key={month} className="text-center text-[10px] h-9 py-1 px-1">
                            {getValue(month, 'totais') ? formatCurrency(getValue(month, 'totais')) : '-'}
                        </TableCell>
                    ))}
                    <TableCell className="text-center font-bold text-primary bg-primary/5 text-[10px] h-9 py-1 px-2 border-l border-border/50">-</TableCell>
                    <TableCell className="text-center font-bold text-[10px] h-9 py-1 px-1 border-l border-border/50">{formatCurrency(ytdTotais)}</TableCell>
                    <TableCell className="text-center text-[10px] text-muted-foreground h-9 py-1 px-1 border-l border-border/50">-</TableCell>
                </TableRow>

                {/* Delivery */}
                <TableRow className="border-b border-border/50 hover:bg-muted/10 h-9">
                    <TableCell className="font-medium bg-muted/20 text-[10px] h-9 py-1 px-2 border-r border-border/50">DELIVERY</TableCell>
                    {shortMonths.map(month => (
                        <TableCell key={month} className="text-center text-[10px] h-9 py-1 px-1">
                            {getValue(month, 'delivery') ? formatCurrency(getValue(month, 'delivery')) : '-'}
                        </TableCell>
                    ))}
                    <TableCell className="text-center font-bold text-primary bg-primary/5 text-[10px] h-9 py-1 px-2 border-l border-border/50">-</TableCell>
                    <TableCell className="text-center font-bold text-[10px] h-9 py-1 px-1 border-l border-border/50">{formatCurrency(ytdDelivery)}</TableCell>
                    <TableCell className="text-center text-[10px] text-muted-foreground h-9 py-1 px-1 border-l border-border/50">-</TableCell>
                </TableRow>

                {/* % Delivery */}
                <TableRow className="border-b border-border/50 hover:bg-muted/10 h-9">
                    <TableCell className="font-medium bg-muted/20 text-[10px] h-9 py-1 px-2 border-r border-border/50">% DELIVERY</TableCell>
                    {shortMonths.map(month => (
                        <TableCell key={month} className="text-center text-[10px] h-9 py-1 px-1">
                            {getValue(month, 'percent_delivery') ? formatPercent(getValue(month, 'percent_delivery')) : '-'}
                        </TableCell>
                    ))}
                    <TableCell className="text-center font-bold text-primary bg-primary/5 text-[10px] h-9 py-1 px-2 border-l border-border/50">-</TableCell>
                    <TableCell className="text-center font-bold text-[10px] h-9 py-1 px-1 border-l border-border/50">{formatPercent(ytdPercentDelivery)}</TableCell>
                    <TableCell className="text-center text-[10px] text-muted-foreground h-9 py-1 px-1 border-l border-border/50">-</TableCell>
                </TableRow>

                {/* Sala */}
                <TableRow className="border-b border-border/50 hover:bg-muted/10 h-9">
                    <TableCell className="font-medium bg-muted/20 text-[10px] h-9 py-1 px-2 border-r border-border/50">SALA</TableCell>
                    {shortMonths.map(month => (
                        <TableCell key={month} className="text-center text-[10px] h-9 py-1 px-1">
                            {getValue(month, 'sala') ? formatCurrency(getValue(month, 'sala')) : '-'}
                        </TableCell>
                    ))}
                    <TableCell className="text-center font-bold text-primary bg-primary/5 text-[10px] h-9 py-1 px-2 border-l border-border/50">-</TableCell>
                    <TableCell className="text-center font-bold text-[10px] h-9 py-1 px-1 border-l border-border/50">{formatCurrency(ytdSala)}</TableCell>
                    <TableCell className="text-center text-[10px] text-muted-foreground h-9 py-1 px-1 border-l border-border/50">-</TableCell>
                </TableRow>

                {/* MOP */}
                <TableRow className="border-b border-border/50 hover:bg-muted/10 h-9">
                    <TableCell className="font-medium bg-muted/20 text-[10px] h-9 py-1 px-2 border-r border-border/50">MOP</TableCell>
                    {shortMonths.map(month => (
                        <TableCell key={month} className="text-center text-[10px] h-9 py-1 px-1">
                            {getValue(month, 'mop') ? formatCurrency(getValue(month, 'mop')) : '-'}
                        </TableCell>
                    ))}
                    <TableCell className="text-center font-bold text-primary bg-primary/5 text-[10px] h-9 py-1 px-2 border-l border-border/50">-</TableCell>
                    <TableCell className="text-center font-bold text-[10px] h-9 py-1 px-1 border-l border-border/50">{formatCurrency(ytdMop)}</TableCell>
                    <TableCell className="text-center text-[10px] text-muted-foreground h-9 py-1 px-1 border-l border-border/50">-</TableCell>
                </TableRow>

                {/* % MOP */}
                <TableRow className="border-b border-border/50 hover:bg-muted/10 h-9">
                    <TableCell className="font-medium bg-muted/20 text-[10px] h-9 py-1 px-2 border-r border-border/50">% MOP</TableCell>
                    {shortMonths.map(month => (
                        <TableCell key={month} className="text-center text-[10px] h-9 py-1 px-1">
                            {getValue(month, 'percent_mop') ? formatPercent(getValue(month, 'percent_mop')) : '-'}
                        </TableCell>
                    ))}
                    <TableCell className="text-center font-bold text-primary bg-primary/5 text-[10px] h-9 py-1 px-2 border-l border-border/50">-</TableCell>
                    <TableCell className="text-center font-bold text-[10px] h-9 py-1 px-1 border-l border-border/50">{formatPercent(ytdPercentMop)}</TableCell>
                    <TableCell className="text-center text-[10px] text-muted-foreground h-9 py-1 px-1 border-l border-border/50">-</TableCell>
                </TableRow>
            </>
        );
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-4 mt-6">
            <div className="flex items-center gap-2 px-1">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground uppercase tracking-wider">Vendas por Plataforma</h3>
            </div>

            <div className="overflow-x-auto rounded-md border border-border/50 bg-card/30">
                <Table>
                    <TableBody>
                        {renderStoreSection("Amadora", storeMapping["Amadora (20)"])}
                        {renderStoreSection("Queluz", storeMapping["Queluz (32)"])}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

