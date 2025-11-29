import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, CheckCircle2, Calendar, Loader2 } from "lucide-react";
import { useInventoryDeviationsData } from "@/hooks/useInventoryDeviationsData";

interface DeviationData {
  item: string;
  local20: number;
  local32: number;
  status20: "ok" | "warning" | "critical";
  status32: "ok" | "warning" | "critical";
}

const getStatusBadge = (status: string, value: number) => {
  if (status === "ok") {
    return <Badge variant="outline" className="bg-success/10 text-success border-success/20">Normal</Badge>;
  } else if (status === "warning") {
    return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">Atenção</Badge>;
  } else {
    return <Badge variant="destructive">Crítico</Badge>;
  }
};

export function InventoryDeviations() {
  // Automatically select current month (0 = January, 11 = December)
  const currentMonth = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const { deviationData, summary, loading, error, refetch } = useInventoryDeviationsData(parseInt(selectedMonth));

  // Listen for updates from the data entry form
  useEffect(() => {
    const handleUpdate = () => {
      refetch();
    };

    window.addEventListener('inventory-deviations-updated', handleUpdate);

    return () => {
      window.removeEventListener('inventory-deviations-updated', handleUpdate);
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
        <Card className="border-border/50 bg-card/50">
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
        <Card className="border-border/50 bg-card/50">
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
          <CardTitle>Desvios de Inventário ({months.find(m => m.value === selectedMonth)?.label})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Amadora</TableHead>
                <TableHead>Status Amadora</TableHead>
                <TableHead className="text-right">Queluz</TableHead>
                <TableHead>Status Queluz</TableHead>
                <TableHead>Ação Requerida</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deviationData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Nenhum desvio registrado
                  </TableCell>
                </TableRow>
              ) : (
                deviationData.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{item.item}</TableCell>
                    <TableCell className={`text-right font-mono ${Math.abs(item.local20) > 100 ? "text-destructive font-semibold" : ""
                      }`}>
                      {item.local20 > 0 ? '+' : ''}{item.local20}
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status20, item.local20)}</TableCell>
                    <TableCell className={`text-right font-mono ${Math.abs(item.local32) > 100 ? "text-destructive font-semibold" : ""
                      }`}>
                      {item.local32 > 0 ? '+' : ''}{item.local32}
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status32, item.local32)}</TableCell>
                    <TableCell className="text-xs">
                      {(item.status20 === "critical" || item.status32 === "critical") && (
                        <span className="text-destructive">Revisar inventário</span>
                      )}
                      {(item.status20 === "warning" || item.status32 === "warning") &&
                        item.status20 !== "critical" && item.status32 !== "critical" && (
                          <span className="text-warning">Monitorar</span>
                        )}
                      {item.status20 === "ok" && item.status32 === "ok" && (
                        <span className="text-muted-foreground">-</span>
                      )}
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
