import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeliveryDay, OperatorStats } from "@/types/delivery";

interface OperatorAnalysisProps {
  deliveryData: DeliveryDay[];
}

export const OperatorAnalysis = ({ deliveryData }: OperatorAnalysisProps) => {
  const [selectedOperator, setSelectedOperator] = useState("");

  const operatorStats = useMemo(() => {
    const stats = new Map<string, OperatorStats>();

    deliveryData.forEach(day => {
      [...day.morning_shifts, ...day.night_shifts].forEach(shift => {
        if (!shift.operator) return;

        const existing = stats.get(shift.operator) || {
          operator: shift.operator,
          avg_gcs: 0,
          avg_sales: 0,
          avg_cash: 0,
          avg_mb: 0,
          avg_mbp: 0,
          avg_tr_euro: 0,
          avg_difference: 0,
          avg_reimbursement_qty: 0,
          avg_reimbursement_value: 0,
          total_shifts: 0,
        };

        existing.avg_gcs += shift.gcs;
        existing.avg_sales += shift.sales;
        existing.avg_cash += shift.cash;
        existing.avg_mb += shift.mb;
        existing.avg_mbp += shift.mbp;
        existing.avg_tr_euro += shift.tr_euro;
        existing.avg_difference += shift.difference;
        existing.avg_reimbursement_qty += shift.reimbursement_qty;
        existing.avg_reimbursement_value += shift.reimbursement_value;
        existing.total_shifts += 1;

        stats.set(shift.operator, existing);
      });
    });

    // Calculate averages
    stats.forEach(stat => {
      if (stat.total_shifts > 0) {
        stat.avg_gcs /= stat.total_shifts;
        stat.avg_sales /= stat.total_shifts;
        stat.avg_cash /= stat.total_shifts;
        stat.avg_mb /= stat.total_shifts;
        stat.avg_mbp /= stat.total_shifts;
        stat.avg_tr_euro /= stat.total_shifts;
        stat.avg_difference /= stat.total_shifts;
        stat.avg_reimbursement_qty /= stat.total_shifts;
        stat.avg_reimbursement_value /= stat.total_shifts;
      }
    });

    return Array.from(stats.values());
  }, [deliveryData]);

  const selectedStats = selectedOperator
    ? operatorStats.find(s => s.operator === selectedOperator)
    : null;

  const restaurantAverage = useMemo(() => {
    if (operatorStats.length === 0) return null;

    const filteredStats = selectedOperator
      ? operatorStats.filter(s => s.operator !== selectedOperator)
      : operatorStats;

    if (filteredStats.length === 0) return null;

    const total = filteredStats.reduce(
      (acc, stat) => ({
        gcs: acc.gcs + stat.avg_gcs,
        sales: acc.sales + stat.avg_sales,
        cash: acc.cash + stat.avg_cash,
        mb: acc.mb + stat.avg_mb,
        mbp: acc.mbp + stat.avg_mbp,
        tr_euro: acc.tr_euro + stat.avg_tr_euro,
        difference: acc.difference + stat.avg_difference,
        reimbursement_qty: acc.reimbursement_qty + stat.avg_reimbursement_qty,
        reimbursement_value: acc.reimbursement_value + stat.avg_reimbursement_value,
      }),
      {
        gcs: 0,
        sales: 0,
        cash: 0,
        mb: 0,
        mbp: 0,
        tr_euro: 0,
        difference: 0,
        reimbursement_qty: 0,
        reimbursement_value: 0,
      }
    );

    const count = filteredStats.length;
    return {
      gcs: total.gcs / count,
      sales: total.sales / count,
      cash: total.cash / count,
      mb: total.mb / count,
      mbp: total.mbp / count,
      tr_euro: total.tr_euro / count,
      difference: total.difference / count,
      reimbursement_qty: total.reimbursement_qty / count,
      reimbursement_value: total.reimbursement_value / count,
    };
  }, [operatorStats, selectedOperator]);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <Label>Selecionar Operador</Label>
        <Input
          value={selectedOperator}
          onChange={(e) => setSelectedOperator(e.target.value)}
          placeholder="Digite o nome do operador"
          list="operators"
          className="mt-2"
        />
        <datalist id="operators">
          {operatorStats.map(stat => (
            <option key={stat.operator} value={stat.operator} />
          ))}
        </datalist>
      </Card>

      {selectedStats && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Análise de {selectedStats.operator}</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Métrica</TableHead>
                <TableHead className="text-right">Média</TableHead>
                <TableHead className="text-right">Total de Turnos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>GC's</TableCell>
                <TableCell className="text-right">{selectedStats.avg_gcs.toFixed(2)}</TableCell>
                <TableCell className="text-right" rowSpan={9}>{selectedStats.total_shifts}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Vendas</TableCell>
                <TableCell className="text-right">€ {selectedStats.avg_sales.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Dinheiro</TableCell>
                <TableCell className="text-right">€ {selectedStats.avg_cash.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>MB</TableCell>
                <TableCell className="text-right">€ {selectedStats.avg_mb.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Delivery</TableCell>
                <TableCell className="text-right">€ {selectedStats.avg_mbp.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>TR/Euro</TableCell>
                <TableCell className="text-right">€ {selectedStats.avg_tr_euro.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Diferença</TableCell>
                <TableCell className={`text-right ${selectedStats.avg_difference !== 0 ? 'text-destructive' : ''}`}>
                  € {selectedStats.avg_difference.toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Reembolsos (Qtd)</TableCell>
                <TableCell className="text-right">{selectedStats.avg_reimbursement_qty.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Reembolsos (€)</TableCell>
                <TableCell className="text-right">€ {selectedStats.avg_reimbursement_value.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      )}

      {restaurantAverage && (
        <>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Média do Restaurante</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Métrica</TableHead>
                  <TableHead className="text-right">Média</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>GC's</TableCell>
                  <TableCell className="text-right">{restaurantAverage.gcs.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Vendas</TableCell>
                  <TableCell className="text-right">€ {restaurantAverage.sales.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Dinheiro</TableCell>
                  <TableCell className="text-right">€ {restaurantAverage.cash.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>MB</TableCell>
                  <TableCell className="text-right">€ {restaurantAverage.mb.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Delivery</TableCell>
                  <TableCell className="text-right">€ {restaurantAverage.mbp.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>TR/Euro</TableCell>
                  <TableCell className="text-right">€ {restaurantAverage.tr_euro.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Diferença</TableCell>
                  <TableCell className={`text-right ${restaurantAverage.difference !== 0 ? 'text-destructive' : ''}`}>
                    € {restaurantAverage.difference.toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Reembolsos (Qtd)</TableCell>
                  <TableCell className="text-right">{restaurantAverage.reimbursement_qty.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Reembolsos (€)</TableCell>
                  <TableCell className="text-right">€ {restaurantAverage.reimbursement_value.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>

          {selectedStats && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Comparação: {selectedStats.operator} vs Média</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Métrica</TableHead>
                    <TableHead className="text-right">Operador</TableHead>
                    <TableHead className="text-right">Média</TableHead>
                    <TableHead className="text-right">Diferença</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { label: "GC's", key: "gcs" as const },
                    { label: "Vendas", key: "sales" as const },
                    { label: "Dinheiro", key: "cash" as const },
                    { label: "MB", key: "mb" as const },
                    { label: "Delivery", key: "mbp" as const },
                    { label: "TR/Euro", key: "tr_euro" as const },
                    { label: "Diferença", key: "difference" as const },
                  ].map(({ label, key }) => {
                    const operatorValue = selectedStats[`avg_${key}`];
                    const avgValue = restaurantAverage[key];
                    const diff = operatorValue - avgValue;
                    const isOutOfRange = Math.abs(diff / avgValue) > 0.1; // 10% threshold

                    return (
                      <TableRow key={key}>
                        <TableCell>{label}</TableCell>
                        <TableCell className="text-right">
                          {key === "gcs" ? operatorValue.toFixed(2) : `€ ${operatorValue.toFixed(2)}`}
                        </TableCell>
                        <TableCell className="text-right">
                          {key === "gcs" ? avgValue.toFixed(2) : `€ ${avgValue.toFixed(2)}`}
                        </TableCell>
                        <TableCell className={`text-right ${isOutOfRange ? 'text-destructive font-bold' : ''}`}>
                          {diff > 0 ? '+' : ''}{key === "gcs" ? diff.toFixed(2) : `€ ${diff.toFixed(2)}`}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
