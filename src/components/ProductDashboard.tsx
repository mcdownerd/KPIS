import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { TrendingDown, TrendingUp, AlertCircle } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { useInventoryDeviationsData } from "@/hooks/useInventoryDeviationsData";

// Dados de exemplo baseados na planilha
const costsData = [];
const totalCostsData = [];
const yieldsData = [];

export function ProductDashboard() {
  const currentMonth = new Date().getMonth();
  const { deviationData } = useInventoryDeviationsData(currentMonth);

  // Transform deviationData for the chart
  const deviationsData = deviationData.map(item => ({
    product: item.item,
    loja20: item.local20,
    loja32: item.local32
  }));
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  return (
    <div className="space-y-6">
      {/* Resumo de Custos */}
      <section>
        <h3 className="mb-4 text-lg font-semibold text-foreground">Custos de Vendas - Resumo Mensal</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="C.Vendas Loja 20"
            value="0.00%"
            target="0.0%"
            trend="neutral"
            change={0}
            subtitle="Abaixo do objetivo"
          />
          <MetricCard
            title="C.Vendas Loja 32"
            value="0.00%"
            target="0.0%"
            trend="neutral"
            change={0}
            subtitle="Acima do objetivo"
          />
          <MetricCard
            title="Comida Loja 20"
            value="0.0%"
            target="0.0%"
            trend="neutral"
            subtitle="Próximo do objetivo"
          />
          <MetricCard
            title="Papel Loja 32"
            value="0.00%"
            target="0.0%"
            trend="neutral"
            change={0}
            subtitle="Monitorar consumo"
          />
        </div>
      </section>

      {/* Gráfico de Evolução de Custos Totais */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Evolução de Custos de Vendas Totais (%)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={totalCostsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis
                dataKey="month"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                domain={[25, 35]}
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
              <Line
                type="monotone"
                dataKey="loja20"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                name="Loja 20"
                dot={{ fill: "hsl(var(--chart-1))", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="loja32"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                name="Loja 32"
                dot={{ fill: "hsl(var(--chart-2))", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Comida vs Papel */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Comparação: Comida vs Papel (%)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={costsData}>
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
              <Line
                type="monotone"
                dataKey="comida20"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                name="Comida Loja 20"
              />
              <Line
                type="monotone"
                dataKey="papel20"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
                name="Papel Loja 20"
              />
              <Line
                type="monotone"
                dataKey="comida32"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                name="Comida Loja 32"
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                dataKey="papel32"
                stroke="hsl(var(--chart-4))"
                strokeWidth={2}
                name="Papel Loja 32"
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Desvios de Inventário */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            Desvios de Inventário ({months[currentMonth]})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={deviationsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis
                dataKey="product"
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Bar dataKey="loja20" fill="hsl(var(--chart-1))" name="Loja 20" />
              <Bar dataKey="loja32" fill="hsl(var(--chart-2))" name="Loja 32" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Rendimentos */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            Rendimentos de Produtos (Janeiro)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={yieldsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis
                dataKey="product"
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Bar dataKey="loja20" fill="hsl(var(--chart-3))" name="Loja 20" />
              <Bar dataKey="loja32" fill="hsl(var(--chart-4))" name="Loja 32" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Alertas */}
      <Card className="border-warning/50 bg-warning/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-warning">
            <AlertCircle className="h-5 w-5" />
            Alertas e Recomendações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-1 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Sem alertas ativos</p>
              <p className="text-sm text-muted-foreground">
                Não há alertas ou recomendações no momento.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
