import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/MetricCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ComposedChart } from "recharts";
import { useHRData } from "@/hooks/useHRData";
import { Loader2 } from "lucide-react";

export function PeopleDashboard() {
  const { laborData, turnoverData, staffingData, performanceData, loading } = useHRData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Get latest values for summary cards
  const latestLabor = laborData[laborData.length - 1] || { mo: 0, prod: 0 };
  const latestTurnover = turnoverData[turnoverData.length - 1] || { value: 0 };
  const latestStaffing = staffingData[staffingData.length - 1] || { value: 0 };
  const latestPerformance = performanceData[performanceData.length - 1] || { value: 0 };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Custo Mão de Obra"
          value={`€${latestLabor.mo.toLocaleString('pt-PT', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          target="€30,000"
          trend={latestLabor.mo <= 30000 ? "up" : "down"}
          subtitle="Último mês"
        />
        <MetricCard
          title="Turnover"
          value={`${latestTurnover.value.toFixed(1)}%`}
          target="2.0%"
          trend={latestTurnover.value <= 2 ? "up" : "down"}
          subtitle="Último mês"
        />
        <MetricCard
          title="Staffing"
          value={`${latestStaffing.value.toFixed(0)}h`}
          target="1,800h"
          trend={latestStaffing.value <= 1800 ? "up" : "down"}
          subtitle="Horas mensais"
        />
        <MetricCard
          title="Produtividade"
          value={`${latestPerformance.value.toFixed(1)}%`}
          target="100.0%"
          trend={latestPerformance.value >= 100 ? "up" : "down"}
          subtitle="Último mês"
        />
      </div>

      {/* Labor Cost Analysis */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Evolução Custo Mão de Obra</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={laborData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis yAxisId="left" className="text-xs" />
                <YAxis yAxisId="right" orientation="right" className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="vendas" name="Vendas (€)" fill="#8884d8" barSize={20} />
                <Line yAxisId="right" type="monotone" dataKey="mo" name="MO %" stroke="#ff7300" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Produtividade (Vendas/Hora)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={laborData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" domain={[30, 60]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="prod" name="Produtividade" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Turnover & Staffing */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Evolução Turnover</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={turnoverData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="value" name="Turnover %" stroke="#ff0000" strokeWidth={2} />
                <Line type="monotone" dataKey="target" name="Meta" stroke="#82ca9d" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Evolução Staffing</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={staffingData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" domain={[50, 110]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="value" name="Staffing %" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="target" name="Meta" stroke="#82ca9d" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Detalhe Mensal de Mão de Obra</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mês</TableHead>
                <TableHead className="text-right">Vendas</TableHead>
                <TableHead className="text-right">Horas</TableHead>
                <TableHead className="text-right">Produtividade</TableHead>
                <TableHead className="text-right">MO %</TableHead>
                <TableHead className="text-right">Turnover</TableHead>
                <TableHead className="text-right">Staffing</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {laborData.map((item, index) => {
                const turnover = turnoverData[index]?.value || 0;
                const staffing = staffingData[index]?.value || 0;

                return (
                  <TableRow key={item.month}>
                    <TableCell className="font-medium">{item.month}</TableCell>
                    <TableCell className="text-right">€{item.vendas.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.horas}</TableCell>
                    <TableCell className="text-right">€{item.prod.toFixed(1)}</TableCell>
                    <TableCell className="text-right">{item.mo.toFixed(1)}%</TableCell>
                    <TableCell className="text-right">{turnover.toFixed(1)}%</TableCell>
                    <TableCell className="text-right">{staffing.toFixed(0)}%</TableCell>
                  </TableRow>
                );
              })}
              {laborData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    Nenhum dado de RH disponível.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
