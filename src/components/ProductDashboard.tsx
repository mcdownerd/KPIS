import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { TrendingDown, TrendingUp, AlertCircle } from "lucide-react";
import { MetricCard } from "./MetricCard";

// Dados de exemplo baseados na planilha
const costsData = [
  { month: "Jan", comida20: 26.78, papel20: 1.52, comida32: 25.26, papel32: 3.11 },
  { month: "Fev", comida20: 26.80, papel20: 1.58, comida32: 25.19, papel32: 3.37 },
  { month: "Mar", comida20: 26.53, papel20: 1.59, comida32: 25.48, papel32: 3.07 },
  { month: "Abr", comida20: 27.04, papel20: 1.61, comida32: 25.78, papel32: 3.58 },
  { month: "Mai", comida20: 27.0, papel20: 1.6, comida32: 27.74, papel32: 3.20 },
  { month: "Jun", comida20: 26.64, papel20: 2.78, comida32: 27.20, papel32: 3.37 },
  { month: "Jul", comida20: 26.64, papel20: 2.78, comida32: 27.36, papel32: 3.21 },
];

const totalCostsData = [
  { month: "Jan", loja20: 30.50, loja32: 30.66 },
  { month: "Fev", loja20: 30.27, loja32: 31.03 },
  { month: "Mar", loja20: 29.76, loja32: 30.85 },
  { month: "Abr", loja20: 30.72, loja32: 31.94 },
  { month: "Mai", loja20: 30.8, loja32: 33.45 },
  { month: "Jun", loja20: 26.37, loja32: 32.78 },
  { month: "Jul", loja20: 26.37, loja32: 32.71 },
];

const deviationsData = [
  { product: "Pão Reg", loja20: -114, loja32: -94 },
  { product: "Carne Reg", loja20: -29, loja32: -43 },
  { product: "C. Royal", loja20: -105, loja32: -20 },
  { product: "CHK Opt", loja20: -43, loja32: -9 },
  { product: "Nuggets", loja20: -299, loja32: 171 },
  { product: "Bacon", loja20: 617, loja32: 328 },
  { product: "Compal", loja20: -20, loja32: -3 },
  { product: "Q. Cheddar", loja20: 82, loja32: -79 },
  { product: "Q. White", loja20: -21, loja32: -100 },
];

const yieldsData = [
  { product: "Batata", loja20: 40.3, loja32: -62.2 },
  { product: "Alface L6", loja20: 92.41, loja32: 18.21 },
  { product: "Sopas", loja20: -42.52, loja32: -19.35 },
  { product: "Cob Chocolate", loja20: 7.9, loja32: -0.81 },
  { product: "Cob Caramelo", loja20: 7.9, loja32: -2.6 },
  { product: "Cob Morango", loja20: -8.2, loja32: -7.41 },
  { product: "Cob Snickers", loja20: 4.7, loja32: 3.34 },
  { product: "Cob Mars", loja20: -11.7, loja32: -8.87 },
  { product: "Leite Sundae", loja20: -31.01, loja32: 32.54 },
];

export function ProductDashboard() {
  return (
    <div className="space-y-6">
      {/* Resumo de Custos */}
      <section>
        <h3 className="mb-4 text-lg font-semibold text-foreground">Custos de Vendas - Resumo Mensal</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="C.Vendas Loja 20 (Julho)"
            value="26.37%"
            target="30.5%"
            trend="down"
            change={4.13}
            subtitle="Abaixo do objetivo"
          />
          <MetricCard
            title="C.Vendas Loja 32 (Out)"
            value="33.52%"
            target="30.7%"
            trend="up"
            change={2.82}
            subtitle="Acima do objetivo"
          />
          <MetricCard
            title="Comida Loja 20 (Maio)"
            value="27.0%"
            target="26.8%"
            trend="neutral"
            subtitle="Próximo do objetivo"
          />
          <MetricCard
            title="Papel Loja 32 (Abr)"
            value="3.58%"
            target="3.2%"
            trend="up"
            change={0.38}
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
            Desvios de Inventário (Janeiro)
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
            <TrendingUp className="mt-1 h-5 w-5 text-warning" />
            <div>
              <p className="font-medium">Loja 32: Custos de Vendas Elevados</p>
              <p className="text-sm text-muted-foreground">
                Custos totais em 33.52% (Outubro), acima da meta de 30.7%. Revisar processos e perdas.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <TrendingDown className="mt-1 h-5 w-5 text-success" />
            <div>
              <p className="font-medium">Loja 20: Melhoria em Junho/Julho</p>
              <p className="text-sm text-muted-foreground">
                Custos reduziram para 26.37%, mantendo qualidade. Analisar práticas implementadas.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-1 h-5 w-5 text-warning" />
            <div>
              <p className="font-medium">Desvios Críticos: CHK Nuggets e Bacon</p>
              <p className="text-sm text-muted-foreground">
                Loja 20 com desvio de -299 Nuggets e +617 Bacon. Verificar processos de inventário.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <TrendingUp className="mt-1 h-5 w-5 text-success" />
            <div>
              <p className="font-medium">Rendimento Positivo: Alface L6 (Loja 20)</p>
              <p className="text-sm text-muted-foreground">
                Rendimento de 92.41 na Alface L6, indicando boa gestão de produto fresco.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-1 h-5 w-5 text-warning" />
            <div>
              <p className="font-medium">Rendimento Negativo: Batata (Loja 32)</p>
              <p className="text-sm text-muted-foreground">
                Rendimento de -62.2 na Batata da Loja 32. Revisar processos de preparação e porcionamento.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
