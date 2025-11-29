import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { useCostsData } from "@/hooks/useCostsData";
import { Loader2 } from "lucide-react";

export function CostsAnalysis() {
  const { costData, costSummary, loading, error } = useCostsData();

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Evolução de Custos de Vendas</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[350px]">
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
          <CardHeader>
            <CardTitle>Evolução de Custos de Vendas</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[350px]">
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Evolução de Custos de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={costData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis
                dataKey="month"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                formatter={(value: number) => `${value}%`}
              />
              <Legend />
              <Bar dataKey="comida20" fill="hsl(var(--chart-1))" name="Comida (20)" />
              <Bar dataKey="comida32" fill="hsl(var(--chart-2))" name="Comida (32)" />
              <Bar dataKey="papel20" fill="hsl(var(--chart-4))" name="Papel (20)" />
              <Bar dataKey="papel32" fill="hsl(var(--chart-5))" name="Papel (32)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Resumo de Custos YTD</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead>Objetivo</TableHead>
                <TableHead>YTD Atual</TableHead>
                <TableHead>Variação</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {costSummary.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Nenhum dado disponível
                  </TableCell>
                </TableRow>
              ) : (
                costSummary.map((item, idx) => {
                  const objetivoNum = parseFloat(item.objetivo.replace('%', ''));
                  const ytdNum = parseFloat(item.ytd.replace('%', ''));
                  const variacao = ytdNum - objetivoNum;

                  return (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{item.categoria}</TableCell>
                      <TableCell>{item.objetivo}</TableCell>
                      <TableCell>{item.ytd}</TableCell>
                      <TableCell className={variacao > 0 ? "text-destructive" : "text-success"}>
                        {variacao > 0 ? '+' : ''}{variacao.toFixed(2)}%
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex h-2 w-2 rounded-full ${item.status === "ok" ? "bg-success" : "bg-warning"
                          }`} />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
