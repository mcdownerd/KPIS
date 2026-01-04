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
          <TableRow className="h-8">
            <TableHead className="min-w-[80px] h-8 py-1.5 px-2">Dia</TableHead>
            <TableHead className="min-w-[120px] h-8 py-1.5 px-2">Contagem</TableHead>
            <TableHead className="min-w-[100px] text-right h-8 py-1.5 px-2">M³ Gastos</TableHead>
            <TableHead className="min-w-[100px] text-right h-8 py-1.5 px-2">€ Gastos</TableHead>
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
              <TableRow key={reading.day} className="h-9">
                <TableCell className="font-medium h-9 py-1 px-2">{reading.day}</TableCell>
                <TableCell className="h-9 py-1 px-2">
                  <Input
                    type="number"
                    value={reading.reading ?? ''}
                    onChange={(e) => onReadingChange(reading.day, e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full h-7 text-xs"
                    placeholder="Contagem"
                  />
                </TableCell>
                <TableCell className="text-right font-medium h-9 py-1 px-2">{m3Used.toFixed(0)}</TableCell>
                <TableCell className="text-right font-medium h-9 py-1 px-2">{formatCurrency(euroSpent)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
