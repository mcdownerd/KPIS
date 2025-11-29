import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Wrench, Zap, Droplet, AlertTriangle, TrendingUp, Loader2 } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { useMaintenanceData, Breakdown } from "@/hooks/useMaintenanceData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateMaintenance } from "@/lib/api/maintenance";
import { toast } from "sonner";

export const MaintenanceDashboard = () => {
  const { breakdowns, utilityData, performanceData, summary, loading, refetch } = useMaintenanceData();
  const [selectedBreakdown, setSelectedBreakdown] = useState<Breakdown | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleCardClick = (breakdown: Breakdown) => {
    setSelectedBreakdown(breakdown);
    setNewStatus(breakdown.status);
    setIsDialogOpen(true);
  };

  const handleSaveStatus = async () => {
    if (!selectedBreakdown) return;

    try {
      setIsUpdating(true);

      // Map UI status to API status
      const apiStatus = newStatus === 'Pendente' ? 'pending' :
        newStatus === 'Em Resolução' ? 'in_progress' : 'completed';

      await updateMaintenance(selectedBreakdown.id, { status: apiStatus });

      toast.success("Status atualizado com sucesso!");
      setIsDialogOpen(false);
      refetch(); // Refresh data
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Filter breakdowns for Queluz (assuming current user is Queluz)
  const breakdownsQueluz = breakdowns;

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
            value="0.00€"
            subtitle="0 avarias registadas"
          />
          <MetricCard
            title="Custos Avarias Queluz"
            value={`${summary.totalCost.toFixed(2)}€`}
            subtitle={`${summary.totalBreakdowns} avarias registadas`}
          />
          <MetricCard
            title="Avarias Pendentes"
            value={`${summary.pending}`}
            target="0"
            trend={summary.pending === 0 ? "up" : "down"}
            subtitle="Avarias em aberto"
          />
          <MetricCard
            title="Tempo Médio Resolução"
            value={`${summary.avgResolutionTime}h`}
            subtitle="Estimado"
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
                      <TableCell>{row.aguaAmd}</TableCell>
                      <TableCell className="border-r">{row.eletAmd}</TableCell>
                      <TableCell>{row.aguaQlz} €</TableCell>
                      <TableCell>{row.eletQlz} €</TableCell>
                    </TableRow>
                  ))}
                  {utilityData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        Nenhum dado de utilidades disponível.
                      </TableCell>
                    </TableRow>
                  )}
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
            <CardDescription>Clique em uma avaria para alterar o status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-4 text-lg">Amadora (20)</h3>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Sem acesso aos dados.</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4 text-lg">Queluz (32)</h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {breakdownsQueluz.map((breakdown, idx) => (
                    <div
                      key={idx}
                      className="p-3 border rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleCardClick(breakdown)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-sm">{breakdown.equipamento}</p>
                        <Badge variant="outline">{breakdown.custo.toFixed(2)}€</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{breakdown.problema || "-"}</p>
                      <div className="text-xs text-muted-foreground">
                        Data: {breakdown.data} | Status: <Badge variant={breakdown.status === 'Concluído' ? 'default' : breakdown.status === 'Em Resolução' ? 'secondary' : 'destructive'} className="text-[10px] h-5 px-1">{breakdown.status}</Badge>
                      </div>
                    </div>
                  ))}
                  {breakdownsQueluz.length === 0 && (
                    <p className="text-sm text-muted-foreground">Nenhuma avaria registrada.</p>
                  )}
                </div>
                <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm font-semibold">Total: {summary.totalCost.toFixed(2)}€</p>
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
                    {performanceData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                          Sem dados.
                        </TableCell>
                      </TableRow>
                    )}
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
                    {performanceData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                          Sem dados.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Edit Status Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atualizar Status da Avaria</DialogTitle>
            <DialogDescription>
              Altere o status da avaria para {selectedBreakdown?.equipamento}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Em Resolução">Em Resolução</SelectItem>
                  <SelectItem value="Concluído">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveStatus} disabled={isUpdating}>
              {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
