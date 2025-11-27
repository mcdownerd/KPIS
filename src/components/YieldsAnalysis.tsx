import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Loader2, Calendar } from "lucide-react";
import { useYieldsData } from "@/hooks/useYieldsData";

export function YieldsAnalysis() {
    // Automatically select current month (0 = January, 11 = December)
    const currentMonth = new Date().getMonth();
    const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
    const { yieldData, loading, error, refetch } = useYieldsData(parseInt(selectedMonth));

    // Listen for updates from the data entry form
    useEffect(() => {
        const handleUpdate = () => {
            refetch();
        };

        window.addEventListener('yields-updated', handleUpdate);

        return () => {
            window.removeEventListener('yields-updated', handleUpdate);
        };
    }, [refetch]);

    const months = [
        { value: "0", label: "Janeiro" },
        { value: "1", label: "Fevereiro" },
        { value: "2", label: "Março" },
        { value: "3", label: "Abril" },
        { value: "4", label: "Maio" },
        { value: "5", label: "Junho" },
        { value: "6", label: "Julho" },
        { value: "7", label: "Agosto" },
        { value: "8", label: "Setembro" },
        { value: "9", label: "Outubro" },
        { value: "10", label: "Novembro" },
        { value: "11", label: "Dezembro" },
    ];

    if (loading) {
        return (
            <div className="space-y-6">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardContent className="flex items-center justify-center h-[300px]">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardContent className="flex items-center justify-center h-[300px]">
                        <p className="text-sm text-muted-foreground">{error}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
                <Calendar className="h-5 w-5 text-primary" />
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Selecionar mês" />
                    </SelectTrigger>
                    <SelectContent>
                        {months.map((month) => (
                            <SelectItem key={month.value} value={month.value}>
                                {month.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Rendimentos de Produtos
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-border/50">
                                <TableHead className="w-[300px]">Item</TableHead>
                                <TableHead className="text-right">Amadora (20)</TableHead>
                                <TableHead className="text-right">Queluz (32)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {yieldData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                                        Nenhum dado disponível para este mês
                                    </TableCell>
                                </TableRow>
                            ) : (
                                yieldData.map((row, idx) => (
                                    <TableRow key={idx} className="hover:bg-muted/50 border-border/50">
                                        <TableCell className="font-medium">{row.item}</TableCell>
                                        <TableCell className="text-right font-mono">
                                            {row.local20}
                                        </TableCell>
                                        <TableCell className="text-right font-mono">
                                            {row.local32}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
