import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Wrench, Zap, Droplet, AlertTriangle, TrendingUp } from "lucide-react";
import { MetricCard } from "./MetricCard";

// Dados exemplo da planilha
const utilityData = [
  { mes: "JAN", aguaAmd: "436.14", eletAmd: "4,369.51", aguaQlz: "386.58", eletQlz: "3,233.03" },
  { mes: "FEV", aguaAmd: "435.07", eletAmd: "3,762.71", aguaQlz: "346.33", eletQlz: "2,882.92" },
  { mes: "MAR", aguaAmd: "393.20", eletAmd: "-", aguaQlz: "393.20", eletQlz: "3,139.06" },
];

const breakdownsAmadora = [
  { equip: "Sonda 4:1", causa: "Teve de ser uma nova, a outra desapareceu", data: "01/02/25", pecas: "-", custo: "372.20€" },
  { equip: "Ecrã uber", causa: "Já tinha +7 anos", data: "01/02/25", pecas: "-", custo: "99.90€" },
  { equip: "Peças", causa: "Reparações pequenas na loja", data: "01/03/25", pecas: "-", custo: "5.50€" },
  { equip: "Borrachas", causa: "Borrachas arcas", data: "01/03/25", pecas: "-", custo: "74.71€" },
  { equip: "Sonda sopa", causa: "Reparação", data: "28/01/25", pecas: "sonda", custo: "449.57€" },
];

const breakdownsQueluz = [
  { equip: "Sonda sopa 1", causa: "Não comunica", data: "-", pecas: "-", custo: "-" },
  { equip: "Máquina de gelados", causa: "Bomba de leite e placa central", data: "17/04/25", pecas: "-", custo: "Sob Orçamento" },
  { equip: "Máquina Take Away", causa: "-", data: "30/04/25", pecas: "Bomba de leite", custo: "2,900.00€" },
  { equip: "Compressor arca BOP Negativa", causa: "-", data: "15/07/25", pecas: "compressor", custo: "791.94€" },
  { equip: "Motor placa Grelhador 2", causa: "-", data: "09/07/25", pecas: "motor", custo: "707.95€" },
];

const performanceData = [
  { mes: "JAN", cmpAmd: "-", plAmd: "-", avalAmd: "-", cmpQlz: "96.63%", plQlz: "100.00%", avalQlz: "-" },
  { mes: "FEV", cmpAmd: "-", plAmd: "-", avalAmd: "-", cmpQlz: "97.21%", plQlz: "100.00%", avalQlz: "-" },
  { mes: "MAR", cmpAmd: "-", plAmd: "-", avalAmd: "-", cmpQlz: "99.26%", plQlz: "100.00%", avalQlz: "-" },
  { mes: "ABR", cmpAmd: "-", plAmd: "-", avalAmd: "-", cmpQlz: "99.73%", plQlz: "100.00%", avalQlz: "-" },
];

const performanceTracking = [
  { mes: "JAN", gastosGerais: "NOK", cmp: "NOK", pl: "NOK", aval: "NOK", total: 3, taxa: "33%" },
  { mes: "FEV", gastosGerais: "NOK", cmp: "NOK", pl: "NOK", aval: "NOK", total: 2, taxa: "22%" },
  { mes: "MAR", gastosGerais: "NOK", cmp: "NOK", pl: "NOK", aval: "NOK", total: 2, taxa: "22%" },
  { mes: "ABR", gastosGerais: "NOK", cmp: "NOK", pl: "NOK", aval: "NOK", total: 2, taxa: "22%" },
];

const performanceTrackingQueluz = [
  { mes: "JAN", gastosGerais: "NOK", cmp: "OK", pl: "OK", aval: "NOK", total: 4, taxa: "44%" },
  { mes: "FEV", gastosGerais: "NOK", cmp: "OK", pl: "OK", aval: "NOK", total: 5, taxa: "56%" },
  { mes: "MAR", gastosGerais: "NOK", cmp: "OK", pl: "OK", aval: "NOK", total: 4, taxa: "44%" },
  { mes: "ABR", gastosGerais: "NOK", cmp: "OK", pl: "OK", aval: "NOK", total: 4, taxa: "44%" },
];

export const MaintenanceDashboard = () => {
  const totalCostAmadora = breakdownsAmadora.reduce((acc, b) => {
    const cost = parseFloat(b.custo.replace(/[^0-9.]/g, ""));
    return acc + (isNaN(cost) ? 0 : cost);
  }, 0);

  const totalCostQueluz = breakdownsQueluz.reduce((acc, b) => {
    const cost = parseFloat(b.custo.replace(/[^0-9.]/g, ""));
    return acc + (isNaN(cost) ? 0 : cost);
  }, 0);

  return (
    <div className="space-y-6">
      {/* KPIs Principais */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
          <Wrench className="h-5 w-5 text-primary" />
          Indicadores de Manutenção - Resumo
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Custos Avarias Amadora"
            value={`${totalCostAmadora.toFixed(2)}€`}
            subtitle={`${breakdownsAmadora.length} avarias registadas`}
          />
          <MetricCard
            title="Custos Avarias Queluz"
            value={`${totalCostQueluz.toFixed(2)}€`}
            subtitle={`${breakdownsQueluz.length} avarias registadas`}
          />
          <MetricCard
            title="CMP Médio Queluz"
            value="98.3%"
            target="96%"
            trend="up"
            subtitle="Objetivo: 96%"
          />
          <MetricCard
            title="Taxa Concretização Média"
            value="38%"
            subtitle="Amadora: 25% | Queluz: 47%"
          />
        </div>
      </section>

      {/* Gastos Gerais */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Gastos Gerais - Água e Eletricidade
            </CardTitle>
            <CardDescription>Consumos mensais por localização</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead rowSpan={2}>Mês</TableHead>
                    <TableHead colSpan={2} className="text-center border-r">Amadora (20)</TableHead>
                    <TableHead colSpan={2} className="text-center">Queluz (32)</TableHead>
                  </TableRow>
                  <TableRow>
                    <TableHead><Droplet className="inline h-4 w-4 mr-1" />Água (€)</TableHead>
                    <TableHead className="border-r"><Zap className="inline h-4 w-4 mr-1" />Elet. (€)</TableHead>
                    <TableHead><Droplet className="inline h-4 w-4 mr-1" />Água (€)</TableHead>
                    <TableHead><Zap className="inline h-4 w-4 mr-1" />Elet. (€)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {utilityData.map((row) => (
                    <TableRow key={row.mes}>
                      <TableCell className="font-medium">{row.mes}</TableCell>
                      <TableCell>{row.aguaAmd} €</TableCell>
                      <TableCell className="border-r">{row.eletAmd === "-" ? "-" : row.eletAmd + " €"}</TableCell>
                      <TableCell>{row.aguaQlz} €</TableCell>
                      <TableCell>{row.eletQlz} €</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Avarias */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Avarias Registadas
            </CardTitle>
            <CardDescription>Histórico de avarias e custos de reparação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-4 text-lg">Amadora (20)</h3>
                <div className="space-y-3">
                  {breakdownsAmadora.map((breakdown, idx) => (
                    <div key={idx} className="p-3 border rounded-lg bg-muted/30">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-sm">{breakdown.equip}</p>
                        <Badge variant="outline">{breakdown.custo}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{breakdown.causa}</p>
                      <p className="text-xs text-muted-foreground">
                        Data: {breakdown.data} {breakdown.pecas !== "-" && `| Peças: ${breakdown.pecas}`}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm font-semibold">Total: {totalCostAmadora.toFixed(2)}€</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4 text-lg">Queluz (32)</h3>
                <div className="space-y-3">
                  {breakdownsQueluz.map((breakdown, idx) => (
                    <div key={idx} className="p-3 border rounded-lg bg-muted/30">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-sm">{breakdown.equip}</p>
                        <Badge variant="outline">{breakdown.custo}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{breakdown.causa || "-"}</p>
                      <p className="text-xs text-muted-foreground">
                        {breakdown.data !== "-" && `Data: ${breakdown.data}`} {breakdown.pecas !== "-" && `| Peças: ${breakdown.pecas}`}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm font-semibold">Total: {totalCostQueluz.toFixed(2)}€</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Desempenho */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Desempenho - CMP, Plano de Limpeza e Avaliações
            </CardTitle>
            <CardDescription>Objetivos: CMP 96%, PL 97%, Avaliações 70%</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-4 text-lg">Amadora (20)</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mês</TableHead>
                      <TableHead>CMP</TableHead>
                      <TableHead>PL</TableHead>
                      <TableHead>Aval.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {performanceData.map((row) => (
                      <TableRow key={row.mes}>
                        <TableCell className="font-medium">{row.mes}</TableCell>
                        <TableCell>{row.cmpAmd}</TableCell>
                        <TableCell>{row.plAmd}</TableCell>
                        <TableCell>{row.avalAmd}</TableCell>
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
                      <TableHead>CMP</TableHead>
                      <TableHead>PL</TableHead>
                      <TableHead>Aval.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {performanceData.map((row) => (
                      <TableRow key={row.mes}>
                        <TableCell className="font-medium">{row.mes}</TableCell>
                        <TableCell>
                          <Badge variant={parseFloat(row.cmpQlz) >= 96 ? "default" : "destructive"}>
                            {row.cmpQlz}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={parseFloat(row.plQlz) >= 97 ? "default" : "destructive"}>
                            {row.plQlz}
                          </Badge>
                        </TableCell>
                        <TableCell>{row.avalQlz}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Performance Tracking 20/32 */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Performance 20/32 - Tracking Mensal</CardTitle>
            <CardDescription>Indicadores de cumprimento de metas (OK/NOK)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-4 text-lg">Amadora (20)</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mês</TableHead>
                      <TableHead>G. Gerais</TableHead>
                      <TableHead>CMP</TableHead>
                      <TableHead>PL</TableHead>
                      <TableHead>Aval.</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Taxa</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {performanceTracking.map((row) => (
                      <TableRow key={row.mes}>
                        <TableCell className="font-medium">{row.mes}</TableCell>
                        <TableCell>
                          <Badge variant={row.gastosGerais === "OK" ? "default" : "destructive"}>
                            {row.gastosGerais}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={row.cmp === "OK" ? "default" : "destructive"}>
                            {row.cmp}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={row.pl === "OK" ? "default" : "destructive"}>
                            {row.pl}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={row.aval === "OK" ? "default" : "destructive"}>
                            {row.aval}
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
              </div>

              <div>
                <h3 className="font-semibold mb-4 text-lg">Queluz (32)</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mês</TableHead>
                      <TableHead>G. Gerais</TableHead>
                      <TableHead>CMP</TableHead>
                      <TableHead>PL</TableHead>
                      <TableHead>Aval.</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Taxa</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {performanceTrackingQueluz.map((row) => (
                      <TableRow key={row.mes}>
                        <TableCell className="font-medium">{row.mes}</TableCell>
                        <TableCell>
                          <Badge variant={row.gastosGerais === "OK" ? "default" : "destructive"}>
                            {row.gastosGerais}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={row.cmp === "OK" ? "default" : "destructive"}>
                            {row.cmp}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={row.pl === "OK" ? "default" : "destructive"}>
                            {row.pl}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={row.aval === "OK" ? "default" : "destructive"}>
                            {row.aval}
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
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
