import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, CheckCircle2, Calendar } from "lucide-react";

interface DeviationData {
  item: string;
  local20: number;
  local32: number;
  status20: "ok" | "warning" | "critical";
  status32: "ok" | "warning" | "critical";
}

const deviationData: DeviationData[] = [
  { item: "Pão Reg", local20: -114, local32: -94, status20: "warning", status32: "warning" },
  { item: "Carne Reg", local20: -29, local32: -43, status20: "ok", status32: "warning" },
  { item: "Carne Royal", local20: -105, local32: -20, status20: "critical", status32: "ok" },
  { item: "Chk Opt", local20: -43, local32: -9, status20: "warning", status32: "ok" },
  { item: "Chk Nuggets", local20: -299, local32: 171, status20: "critical", status32: "critical" },
  { item: "Bacon Fatias", local20: 617, local32: 328, status20: "critical", status32: "critical" },
  { item: "Compal", local20: -20, local32: -3, status20: "ok", status32: "ok" },
  { item: "Queijo Cheddar", local20: 82, local32: -79, status20: "warning", status32: "warning" },
  { item: "Queijo White", local20: -21, local32: -100, status20: "ok", status32: "warning" },
];

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
  const [selectedMonth, setSelectedMonth] = useState("janeiro");

  const months = [
    { value: "janeiro", label: "Janeiro" },
    { value: "fevereiro", label: "Fevereiro" },
    { value: "marco", label: "Março" },
    { value: "abril", label: "Abril" },
    { value: "maio", label: "Maio" },
    { value: "junho", label: "Junho" },
    { value: "julho", label: "Julho" },
    { value: "agosto", label: "Agosto" },
    { value: "setembro", label: "Setembro" },
    { value: "outubro", label: "Outubro" },
    { value: "novembro", label: "Novembro" },
    { value: "dezembro", label: "Dezembro" },
  ];

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

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              Itens Normais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Dentro do padrão</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Atenção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Requer monitoramento</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Crítico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Ação imediata necessária</p>
          </CardContent>
        </Card>
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
                <TableHead className="text-right">Local 20</TableHead>
                <TableHead>Status 20</TableHead>
                <TableHead className="text-right">Local 32</TableHead>
                <TableHead>Status 32</TableHead>
                <TableHead>Ação Requerida</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deviationData.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{item.item}</TableCell>
                  <TableCell className={`text-right font-mono ${
                    Math.abs(item.local20) > 100 ? "text-destructive font-semibold" : ""
                  }`}>
                    {item.local20 > 0 ? '+' : ''}{item.local20}
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status20, item.local20)}</TableCell>
                  <TableCell className={`text-right font-mono ${
                    Math.abs(item.local32) > 100 ? "text-destructive font-semibold" : ""
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
