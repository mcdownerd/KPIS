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
          <TableRow className="h-8">
            <TableHead className="min-w-[80px] h-8 py-1.5 px-2">Dia</TableHead>
            <TableHead className="min-w-[120px] text-right h-8 py-1.5 px-2">Eletricidade</TableHead>
            <TableHead className="min-w-[120px] text-right h-8 py-1.5 px-2">Água</TableHead>
            <TableHead className="min-w-[120px] text-right h-8 py-1.5 px-2">Total Diário</TableHead>
            <TableHead className="min-w-[140px] text-right h-8 py-1.5 px-2">Acum. Eletricidade</TableHead>
            <TableHead className="min-w-[120px] text-right h-8 py-1.5 px-2">Acum. Água</TableHead>
            <TableHead className="min-w-[140px] text-right h-8 py-1.5 px-2">Total Acumulado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {costs.map((cost) => (
            <TableRow key={cost.day} className="h-8">
              <TableCell className="font-medium h-8 py-1.5 px-2">{cost.day}</TableCell>
              <TableCell className="text-right h-8 py-1.5 px-2">{formatCurrency(cost.electricityCost)}</TableCell>
              <TableCell className="text-right h-8 py-1.5 px-2">{formatCurrency(cost.waterCost)}</TableCell>
              <TableCell className="text-right font-semibold h-8 py-1.5 px-2">{formatCurrency(cost.totalCost)}</TableCell>
              <TableCell className="text-right text-muted-foreground h-8 py-1.5 px-2">{formatCurrency(cost.accumulatedElectricity)}</TableCell>
              <TableCell className="text-right text-muted-foreground h-8 py-1.5 px-2">{formatCurrency(cost.accumulatedWater)}</TableCell>
              <TableCell className="text-right font-bold h-8 py-1.5 px-2">{formatCurrency(cost.accumulatedTotal)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
