import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

const salesData = [
  { month: "Jan", sales: 7.66, delivery: 13.05 },
  { month: "Fev", sales: 9.31, delivery: 9.47 },
  { month: "Mar", sales: 10.88, delivery: 19.42 },
  { month: "Abr", sales: 7.25, delivery: 13.07 },
  { month: "Mai", sales: 19.34, delivery: 29.68 },
  { month: "Jun", sales: 13.54, delivery: 24.37 },
  { month: "Jul", sales: 14.20, delivery: 24.77 },
];

export function SalesChart() {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Crescimento de Vendas (YTD)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
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
            <Line 
              type="monotone" 
              dataKey="sales" 
              stroke="hsl(var(--chart-1))" 
              strokeWidth={2}
              name="Vendas Totais"
              dot={{ fill: "hsl(var(--chart-1))", r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="delivery" 
              stroke="hsl(var(--chart-2))" 
              strokeWidth={2}
              name="Delivery"
              dot={{ fill: "hsl(var(--chart-2))", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
