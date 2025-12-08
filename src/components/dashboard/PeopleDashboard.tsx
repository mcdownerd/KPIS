import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/MetricCard";
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

  // Get latest values for summary cards (excluding future months)
  const today = new Date();
  const currentMonthStr = today.toISOString().slice(0, 7); // YYYY-MM

  const validLaborData = laborData.filter(d => d.rawDate <= today.toISOString());
  const validTurnoverData = turnoverData.filter(d => d.rawDate <= today.toISOString());
  const validStaffingData = staffingData.filter(d => d.rawDate <= today.toISOString());
  const validPerformanceData = performanceData.filter(d => d.rawDate <= today.toISOString());

  const latestLabor = validLaborData[validLaborData.length - 1] || { mo: 0, prod: 0 };
  const latestTurnover = validTurnoverData[validTurnoverData.length - 1] || { value: 0 };
  const latestStaffing = validStaffingData[validStaffingData.length - 1] || { value: 0 };
  const latestPerformance = validPerformanceData[validPerformanceData.length - 1] || { value: 0 };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Custo Mão de Obra"
          value={`€${latestLabor.custo_total?.toLocaleString('pt-PT', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) || '0'}`}
          target="€30,000"
          trend={(latestLabor.custo_total || 0) <= 30000 ? "up" : "down"}
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
                <TableHead className="text-right">Vendas Amadora</TableHead>
                <TableHead className="text-right">Horas Amadora</TableHead>
                <TableHead className="text-right">Prod. Amadora</TableHead>
                <TableHead className="text-right">Turnover Amadora</TableHead>
                <TableHead className="text-right">Staffing Amadora</TableHead>

                <TableHead className="text-right border-l pl-4">Vendas Queluz</TableHead>
                <TableHead className="text-right">Horas Queluz</TableHead>
                <TableHead className="text-right">Prod. Queluz</TableHead>
                <TableHead className="text-right">Turnover Queluz</TableHead>
                <TableHead className="text-right">Staffing Queluz</TableHead>

                <TableHead className="text-right border-l pl-4 font-bold">Total Vendas</TableHead>
                <TableHead className="text-right font-bold">Total Horas</TableHead>
                <TableHead className="text-right font-bold">Prod. Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {laborData.map((item, index) => {
                const turnover = turnoverData[index];
                const staffing = staffingData[index];

                return (
                  <TableRow key={item.month}>
                    <TableCell className="font-medium">{item.month}</TableCell>

                    {/* Amadora */}
                    <TableCell className="text-right">€{item.vendas_amadora.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.horas_amadora.toLocaleString()}</TableCell>
                    <TableCell className="text-right">€{item.prod_amadora.toFixed(1)}</TableCell>
                    <TableCell className="text-right">{turnover?.amadora?.toFixed(1)}%</TableCell>
                    <TableCell className="text-right">{staffing?.amadora?.toFixed(0)}%</TableCell>

                    {/* Queluz */}
                    <TableCell className="text-right border-l pl-4">€{item.vendas_queluz.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.horas_queluz.toLocaleString()}</TableCell>
                    <TableCell className="text-right">€{item.prod_queluz.toFixed(1)}</TableCell>
                    <TableCell className="text-right">{turnover?.queluz?.toFixed(1)}%</TableCell>
                    <TableCell className="text-right">{staffing?.queluz?.toFixed(0)}%</TableCell>

                    {/* Totals */}
                    <TableCell className="text-right border-l pl-4 font-bold">€{item.vendas.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-bold">{item.horas.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-bold">€{item.prod.toFixed(1)}</TableCell>
                  </TableRow>
                );
              })}
              {laborData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={13} className="text-center py-4 text-muted-foreground">
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
