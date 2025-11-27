import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pie, PieChart, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts";
import { useSalesByPlatformData } from "@/hooks/useSalesByPlatformData";
import { Loader2 } from "lucide-react";

export function SalesByPlatform() {
  const { platformData, salesByMonth, totalSales, loading } = useSalesByPlatformData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Calculate percentages for the summary card
  const deliveryData = platformData.find(p => p.name === 'Delivery');
  const salaData = platformData.find(p => p.name === 'Sala');
  const mopData = platformData.find(p => p.name === 'MOP');

  const deliveryPercent = deliveryData ? deliveryData.value : 0;
  const salaPercent = salaData ? salaData.value : 0;
  const mopPercent = mopData ? mopData.value : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Distribuição por Plataforma (YTD)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  formatter={(value: number) => `${value}%`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Vendas Totais por Localização</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Amadora</span>
                <span className="text-2xl font-bold">€0.00</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Delivery: 0% | Sala: 0% | MOP: 0%
              </div>
              <div className="mt-2 h-2 rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "0%" }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Queluz</span>
                <span className="text-2xl font-bold">€{(totalSales / 1000).toFixed(1)}K</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Delivery: {deliveryPercent}% | Sala: {salaPercent}% | MOP: {mopPercent}%
              </div>
              <div className="mt-2 h-2 rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-chart-2" style={{ width: "100%" }} />
              </div>
            </div>

            <div className="pt-4 border-t border-border/50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total YTD</span>
                <span className="text-xl font-bold text-primary">€{(totalSales / 1000).toFixed(1)}K</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Vendas Mensais por Localização</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mês</TableHead>
                <TableHead className="text-right">Amadora Total</TableHead>
                <TableHead className="text-right">Amadora Delivery</TableHead>
                <TableHead className="text-right">% Delivery</TableHead>
                <TableHead className="text-right">Queluz Total</TableHead>
                <TableHead className="text-right">Queluz Delivery</TableHead>
                <TableHead className="text-right">% Delivery</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesByMonth.map((item) => {
                const amadoraPercent = item.amadoraTotal > 0 ? ((item.amadoraDelivery / item.amadoraTotal) * 100).toFixed(1) : "0.0";
                const queluzPercent = item.queluzTotal > 0 ? ((item.queluzDelivery / item.queluzTotal) * 100).toFixed(1) : "0.0";

                return (
                  <TableRow key={item.month}>
                    <TableCell className="font-medium">{item.month}</TableCell>
                    <TableCell className="text-right">€{(item.amadoraTotal / 1000).toFixed(1)}K</TableCell>
                    <TableCell className="text-right">€{(item.amadoraDelivery / 1000).toFixed(1)}K</TableCell>
                    <TableCell className="text-right font-semibold">{amadoraPercent}%</TableCell>
                    <TableCell className="text-right">€{(item.queluzTotal / 1000).toFixed(1)}K</TableCell>
                    <TableCell className="text-right">€{(item.queluzDelivery / 1000).toFixed(1)}K</TableCell>
                    <TableCell className="text-right font-semibold">{queluzPercent}%</TableCell>
                  </TableRow>
                );
              })}
              {salesByMonth.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    Nenhum dado de vendas disponível.
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
