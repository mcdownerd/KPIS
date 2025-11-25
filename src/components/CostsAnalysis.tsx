import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

const costData = [
  { month: "Jan", comida20: 26.78, papel20: 1.52, comida32: 25.26, papel32: 3.11 },
  { month: "Fev", comida20: 26.80, papel20: 1.58, comida32: 25.19, papel32: 3.37 },
  { month: "Mar", comida20: 26.53, papel20: 1.59, comida32: 25.48, papel32: 3.07 },
  { month: "Abr", comida20: 27.04, papel20: 1.61, comida32: 25.78, papel32: 3.58 },
  { month: "Mai", comida20: 27.0, papel20: 1.6, comida32: 27.74, papel32: 3.20 },
];

const costSummary = [
  { categoria: "Comida (20)", objetivo: "26.5%", ytd: "26.78%", status: "warn" },
  { categoria: "Papel (20)", objetivo: "1.5%", ytd: "1.58%", status: "ok" },
  { categoria: "Refeições (20)", objetivo: "0.70%", ytd: "0.79%", status: "warn" },
  { categoria: "Perdas (20)", objetivo: "0.50%", ytd: "0.55%", status: "warn" },
  { categoria: "C.Vendas Total (20)", objetivo: "29.2%", ytd: "30.27%", status: "warn" },
  { categoria: "Comida (32)", objetivo: "26.5%", ytd: "26.85%", status: "ok" },
  { categoria: "Papel (32)", objetivo: "3.0%", ytd: "3.25%", status: "warn" },
  { categoria: "C.Vendas Total (32)", objetivo: "31.5%", ytd: "32.17%", status: "warn" },
];

export function CostsAnalysis() {
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
              {costSummary.map((item, idx) => {
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
                      <div className={`inline-flex h-2 w-2 rounded-full ${
                        item.status === "ok" ? "bg-success" : "bg-warning"
                      }`} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
