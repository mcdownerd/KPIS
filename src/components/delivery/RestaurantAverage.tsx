import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeliveryDay } from "@/types/delivery";

interface RestaurantAverageProps {
  deliveryData: DeliveryDay[];
}

export const RestaurantAverage = ({ deliveryData }: RestaurantAverageProps) => {
  const restaurantStats = useMemo(() => {
    let totalGcs = 0;
    let totalSales = 0;
    let totalCash = 0;
    let totalMb = 0;
    let totalMbp = 0;
    let totalTrEuro = 0;
    let totalDifference = 0;
    let totalReimbursementQty = 0;
    let totalReimbursementValue = 0;
    let totalShifts = 0;

    deliveryData.forEach(day => {
      [...day.morning_shifts, ...day.night_shifts].forEach(shift => {
        if (!shift.operator) return;
        
        totalGcs += shift.gcs;
        totalSales += shift.sales;
        totalCash += shift.cash;
        totalMb += shift.mb;
        totalMbp += shift.mbp;
        totalTrEuro += shift.tr_euro;
        totalDifference += shift.difference;
        totalReimbursementQty += shift.reimbursement_qty;
        totalReimbursementValue += shift.reimbursement_value;
        totalShifts += 1;
      });
    });

    if (totalShifts === 0) return null;

    return {
      avgGcs: totalGcs / totalShifts,
      avgSales: totalSales / totalShifts,
      avgCash: totalCash / totalShifts,
      avgMb: totalMb / totalShifts,
      avgMbp: totalMbp / totalShifts,
      avgTrEuro: totalTrEuro / totalShifts,
      avgDifference: totalDifference / totalShifts,
      avgReimbursementQty: totalReimbursementQty / totalShifts,
      avgReimbursementValue: totalReimbursementValue / totalShifts,
      totalShifts,
      totalDays: deliveryData.length,
    };
  }, [deliveryData]);

  if (!restaurantStats) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground text-center">
          Nenhum dado disponível. Adicione dados na aba "Entrada Diária" para ver as médias.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Resumo Geral</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total de Dias</p>
            <p className="text-2xl font-bold">{restaurantStats.totalDays}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total de Turnos</p>
            <p className="text-2xl font-bold">{restaurantStats.totalShifts}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Média de Turnos/Dia</p>
            <p className="text-2xl font-bold">
              {(restaurantStats.totalShifts / restaurantStats.totalDays).toFixed(1)}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Média do Restaurante por Rúbrica</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Métrica</TableHead>
              <TableHead className="text-right">Média por Turno</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">GC's</TableCell>
              <TableCell className="text-right">{restaurantStats.avgGcs.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Vendas</TableCell>
              <TableCell className="text-right">€ {restaurantStats.avgSales.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Dinheiro</TableCell>
              <TableCell className="text-right">€ {restaurantStats.avgCash.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Multibanco (MB)</TableCell>
              <TableCell className="text-right">€ {restaurantStats.avgMb.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">MB Portátil (MBP)</TableCell>
              <TableCell className="text-right">€ {restaurantStats.avgMbp.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">TR/Euroticket</TableCell>
              <TableCell className="text-right">€ {restaurantStats.avgTrEuro.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Diferença</TableCell>
              <TableCell className={`text-right ${restaurantStats.avgDifference !== 0 ? 'text-destructive font-bold' : ''}`}>
                € {restaurantStats.avgDifference.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Reembolsos (Quantidade)</TableCell>
              <TableCell className="text-right">{restaurantStats.avgReimbursementQty.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Reembolsos (Valor)</TableCell>
              <TableCell className="text-right">€ {restaurantStats.avgReimbursementValue.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>

      <Card className="p-6 bg-muted">
        <h4 className="font-semibold mb-2">Notas:</h4>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>As médias são calculadas com base em todos os turnos registrados</li>
          <li>Diferenças acima de zero indicam valores registrados menores que as vendas</li>
          <li>Use a aba "Análise por Operador" para comparar desempenho individual</li>
        </ul>
      </Card>
    </div>
  );
};
