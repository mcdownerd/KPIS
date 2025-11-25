import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { WaterReading } from "@/types/utilities";
import { formatCurrency } from "@/utils/utilitiesCalculations";

interface WaterTableProps {
  readings: WaterReading[];
  onReadingChange: (day: number, value: number | null) => void;
  waterPricePerM3: number;
}

export const WaterTable = ({ readings, onReadingChange, waterPricePerM3 }: WaterTableProps) => {
  return (
    <div className="rounded-lg border bg-card overflow-x-auto">
      <div className="p-4 border-b">
        <p className="text-sm font-medium">Preço M³: {formatCurrency(waterPricePerM3)}</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[80px]">Dia</TableHead>
            <TableHead className="min-w-[120px]">Contagem</TableHead>
            <TableHead className="min-w-[100px] text-right">M³ Gastos</TableHead>
            <TableHead className="min-w-[100px] text-right">€ Gastos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {readings.map((reading, index) => {
            const previousReading = index > 0 ? readings[index - 1] : null;
            const m3Used = reading.reading && previousReading?.reading
              ? reading.reading - previousReading.reading
              : 0;
            const euroSpent = m3Used * waterPricePerM3;

            return (
              <TableRow key={reading.day}>
                <TableCell className="font-medium">{reading.day}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={reading.reading ?? ''}
                    onChange={(e) => onReadingChange(reading.day, e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full"
                    placeholder="Contagem"
                  />
                </TableCell>
                <TableCell className="text-right font-medium">{m3Used.toFixed(0)}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(euroSpent)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
