import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Users, Clock } from "lucide-react";
import { MetricCard } from "./MetricCard";

const months = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

// Dados exemplo da planilha
const laborData = {
  amadora: {
    jan: { vendas: "286,344.11", horas: 4121, prod: "69.48", mo: "11.05%" },
    fev: { vendas: "251,555.16", horas: 3379, prod: "74.45", mo: "10.16%" },
    mar: { vendas: "149,918.40", horas: 2001, prod: "74.92", mo: "10.37%" },
  },
  queluz: {
    jan: { vendas: "155,938.56", horas: 2425.12, prod: "64.30", mo: "12.16%" },
    fev: { vendas: "141,659.14", horas: 2234, prod: "63.40", mo: "12.15%" },
    mar: { vendas: "153,268.00", horas: 1887.37, prod: "81.21", mo: "13.14%" },
  }
};

const turnoverData = [
  { mes: "JANEIRO", amadora: "0%", queluz: "0%", status: "OK" },
  { mes: "FEVEREIRO", amadora: "0%", queluz: "0%", status: "OK" },
  { mes: "MARÇO", amadora: "0%", queluz: "0%", status: "OK" },
  { mes: "AGOSTO", amadora: "3%", queluz: "15%", status: "OK" },
];

const staffingData = [
  { mes: "JANEIRO", amadoraTotal: "40%", amadoraAlmoco: "23%", amadoraJantar: "58%", queluzTotal: "52%", queluzAlmoco: "45%", queluzJantar: "58%" },
  { mes: "FEVEREIRO", amadoraTotal: "34%", amadoraAlmoco: "31%", amadoraJantar: "38%", queluzTotal: "58%", queluzAlmoco: "46%", queluzJantar: "71%" },
  { mes: "MARÇO", amadoraTotal: "31%", amadoraAlmoco: "25%", amadoraJantar: "38%", queluzTotal: "46%", queluzAlmoco: "48%", queluzJantar: "44%" },
];

const performanceData = [
  { mes: "JAN", mo: "NOK", prod: "OK", turnover: "OK", staffing: "OK", total: 3, taxa: "33%" },
  { mes: "FEV", mo: "NOK", prod: "OK", turnover: "OK", staffing: "NOK", total: 2, taxa: "22%" },
  { mes: "MAR", mo: "NOK", prod: "OK", turnover: "OK", staffing: "NOK", total: 2, taxa: "22%" },
  { mes: "ABR", mo: "NOK", prod: "OK", turnover: "OK", staffing: "OK", total: 3, taxa: "33%" },
];

export const PeopleDashboard = () => {
  return (
    <div className="space-y-6">
      {/* KPIs Principais */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
          <Users className="h-5 w-5 text-primary" />
          Indicadores de Pessoas - Resumo
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Turnover Médio Anual"
            value="9%"
            target="85%"
            trend="up"
            subtitle="Objetivo: 85%"
          />
          <MetricCard
            title="Staffing Médio"
            value="40%"
            target="35%"
            trend="down"
            subtitle="Abaixo do ideal: 35%"
          />
          <MetricCard
            title="Horas Extra (Média)"
            value="6.7h"
            subtitle="Amadora mensal"
          />
          <MetricCard
            title="Taxa Concretização"
            value="30%"
            subtitle="Média anual 20/32"
          />
        </div>
      </section>

      {/* Comparação M.O. Mensal */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              M.O. Mensal - Comparação de Custos
            </CardTitle>
            <CardDescription>Vendas, Horas e Produtividade por Localização</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-4 text-lg">Amadora (20)</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mês</TableHead>
                      <TableHead>Vendas</TableHead>
                      <TableHead>Horas</TableHead>
                      <TableHead>Prod.</TableHead>
                      <TableHead>M.O.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(laborData.amadora).map(([key, data]) => (
                      <TableRow key={key}>
                        <TableCell className="font-medium">{key.toUpperCase()}</TableCell>
                        <TableCell>{data.vendas} €</TableCell>
                        <TableCell>{data.horas}</TableCell>
                        <TableCell>{data.prod} €</TableCell>
                        <TableCell>
                          <Badge variant={parseFloat(data.mo) > 11 ? "destructive" : "default"}>
                            {data.mo}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div>
                <h3 className="font-semibold mb-4 text-lg">Queluz (32)</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mês</TableHead>
                      <TableHead>Vendas</TableHead>
                      <TableHead>Horas</TableHead>
                      <TableHead>Prod.</TableHead>
                      <TableHead>M.O.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(laborData.queluz).map(([key, data]) => (
                      <TableRow key={key}>
                        <TableCell className="font-medium">{key.toUpperCase()}</TableCell>
                        <TableCell>{data.vendas} €</TableCell>
                        <TableCell>{data.horas}</TableCell>
                        <TableCell>{data.prod} €</TableCell>
                        <TableCell>
                          <Badge variant={parseFloat(data.mo) > 11 ? "destructive" : "default"}>
                            {data.mo}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Turnover */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Turnover
            </CardTitle>
            <CardDescription>Taxa de rotatividade de funcionários - Objetivo: 85%</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mês</TableHead>
                  <TableHead>Amadora</TableHead>
                  <TableHead>Queluz</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {turnoverData.map((row) => (
                  <TableRow key={row.mes}>
                    <TableCell className="font-medium">{row.mes}</TableCell>
                    <TableCell>{row.amadora}</TableCell>
                    <TableCell>{row.queluz}</TableCell>
                    <TableCell>
                      <Badge variant="default">{row.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* Staffing */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Staffing (abaixo do ideal)
            </CardTitle>
            <CardDescription>Níveis de pessoal por turno - Objetivo: 35%</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead rowSpan={2}>Mês</TableHead>
                    <TableHead colSpan={3} className="text-center border-r">Amadora (20)</TableHead>
                    <TableHead colSpan={3} className="text-center">Queluz (32)</TableHead>
                  </TableRow>
                  <TableRow>
                    <TableHead>Total</TableHead>
                    <TableHead>Almoço</TableHead>
                    <TableHead className="border-r">Jantar</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Almoço</TableHead>
                    <TableHead>Jantar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffingData.map((row) => (
                    <TableRow key={row.mes}>
                      <TableCell className="font-medium">{row.mes}</TableCell>
                      <TableCell>
                        <Badge variant={parseFloat(row.amadoraTotal) > 35 ? "destructive" : "default"}>
                          {row.amadoraTotal}
                        </Badge>
                      </TableCell>
                      <TableCell>{row.amadoraAlmoco}</TableCell>
                      <TableCell className="border-r">{row.amadoraJantar}</TableCell>
                      <TableCell>
                        <Badge variant={parseFloat(row.queluzTotal) > 35 ? "destructive" : "default"}>
                          {row.queluzTotal}
                        </Badge>
                      </TableCell>
                      <TableCell>{row.queluzAlmoco}</TableCell>
                      <TableCell>{row.queluzJantar}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Performance 20/32 */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Performance 20/32 - Tracking Mensal</CardTitle>
            <CardDescription>Indicadores de cumprimento de metas (OK/NOK)</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mês</TableHead>
                  <TableHead>M.O.</TableHead>
                  <TableHead>Produtividade</TableHead>
                  <TableHead>Turnover</TableHead>
                  <TableHead>Staffing</TableHead>
                  <TableHead>Total OK</TableHead>
                  <TableHead>Taxa Concretização</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {performanceData.map((row) => (
                  <TableRow key={row.mes}>
                    <TableCell className="font-medium">{row.mes}</TableCell>
                    <TableCell>
                      <Badge variant={row.mo === "OK" ? "default" : "destructive"}>
                        {row.mo}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={row.prod === "OK" ? "default" : "destructive"}>
                        {row.prod}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={row.turnover === "OK" ? "default" : "destructive"}>
                        {row.turnover}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={row.staffing === "OK" ? "default" : "destructive"}>
                        {row.staffing}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">{row.total}/4</TableCell>
                    <TableCell>
                      <Badge variant={parseFloat(row.taxa) >= 50 ? "default" : "secondary"}>
                        {row.taxa}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
