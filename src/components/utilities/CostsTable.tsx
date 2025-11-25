import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DailyCosts } from "@/types/utilities";
import { formatCurrency } from "@/utils/utilitiesCalculations";

interface CostsTableProps {
  costs: DailyCosts[];
}

export const CostsTable = ({ costs }: CostsTableProps) => {
  return (
    <div className="rounded-lg border bg-card overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[80px]">Dia</TableHead>
            <TableHead className="min-w-[120px] text-right">Eletricidade</TableHead>
            <TableHead className="min-w-[120px] text-right">Água</TableHead>
            <TableHead className="min-w-[120px] text-right">Total Diário</TableHead>
            <TableHead className="min-w-[140px] text-right">Acum. Eletricidade</TableHead>
            <TableHead className="min-w-[120px] text-right">Acum. Água</TableHead>
            <TableHead className="min-w-[140px] text-right">Total Acumulado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {costs.map((cost) => (
            <TableRow key={cost.day}>
              <TableCell className="font-medium">{cost.day}</TableCell>
              <TableCell className="text-right">{formatCurrency(cost.electricityCost)}</TableCell>
              <TableCell className="text-right">{formatCurrency(cost.waterCost)}</TableCell>
              <TableCell className="text-right font-semibold">{formatCurrency(cost.totalCost)}</TableCell>
              <TableCell className="text-right text-muted-foreground">{formatCurrency(cost.accumulatedElectricity)}</TableCell>
              <TableCell className="text-right text-muted-foreground">{formatCurrency(cost.accumulatedWater)}</TableCell>
              <TableCell className="text-right font-bold">{formatCurrency(cost.accumulatedTotal)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
