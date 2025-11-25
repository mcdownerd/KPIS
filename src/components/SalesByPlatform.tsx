import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pie, PieChart, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts";

const platformData = [
  { name: "Delivery", value: 49.3, color: "hsl(var(--chart-1))" },
  { name: "Sala", value: 50.2, color: "hsl(var(--chart-2))" },
  { name: "MOP", value: 0.5, color: "hsl(var(--chart-4))" },
];

const salesByMonth = [
  { 
    month: "Jan", 
    amadoraTotal: 239000, 
    amadoraDelivery: 144575, 
    queluzTotal: 157392, 
    queluzDelivery: 84501 
  },
  { 
    month: "Fev", 
    amadoraTotal: 254163, 
    amadoraDelivery: 130078, 
    queluzTotal: 143161, 
    queluzDelivery: 73776 
  },
  { 
    month: "Mar", 
    amadoraTotal: 247258, 
    amadoraDelivery: 130078, 
    queluzTotal: 153168, 
    queluzDelivery: 81472 
  },
  { 
    month: "Abr", 
    amadoraTotal: 251598, 
    amadoraDelivery: 251, 
    queluzTotal: 142879, 
    queluzDelivery: 69708 
  },
  { 
    month: "Mai", 
    amadoraTotal: 252397, 
    amadoraDelivery: 12894, 
    queluzTotal: 155559, 
    queluzDelivery: 77718 
  },
];

export function SalesByPlatform() {
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
                <span className="text-2xl font-bold">€2.74M</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Delivery: 49.3% | Sala: 50.2% | MOP: 0.2%
              </div>
              <div className="mt-2 h-2 rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "49.3%" }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Queluz</span>
                <span className="text-2xl font-bold">€1.72M</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Delivery: 50% | Sala: 49.5% | MOP: 0.5%
              </div>
              <div className="mt-2 h-2 rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-chart-2" style={{ width: "50%" }} />
              </div>
            </div>

            <div className="pt-4 border-t border-border/50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total YTD</span>
                <span className="text-xl font-bold text-primary">€4.46M</span>
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
                const amadoraPercent = ((item.amadoraDelivery / item.amadoraTotal) * 100).toFixed(1);
                const queluzPercent = ((item.queluzDelivery / item.queluzTotal) * 100).toFixed(1);
                
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
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
