import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ElectricityReading } from "@/types/utilities";

interface ElectricityTableProps {
  readings: ElectricityReading[];
  onReadingChange: (day: number, field: keyof Omit<ElectricityReading, 'day'>, value: number | null) => void;
}

export const ElectricityTable = ({ readings, onReadingChange }: ElectricityTableProps) => {
  return (
    <div className="rounded-lg border bg-card overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="h-8">
            <TableHead className="min-w-[80px] h-8 py-1.5 px-2">Dia</TableHead>
            <TableHead className="min-w-[120px] h-8 py-1.5 px-2">VAZIA</TableHead>
            <TableHead className="min-w-[120px] h-8 py-1.5 px-2">PONTA</TableHead>
            <TableHead className="min-w-[120px] h-8 py-1.5 px-2">CHEIA</TableHead>
            <TableHead className="min-w-[120px] h-8 py-1.5 px-2">S.VAZIA</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {readings.map((reading) => (
            <TableRow key={reading.day} className="h-9">
              <TableCell className="font-medium h-9 py-1 px-2">{reading.day}</TableCell>
              <TableCell className="h-9 py-1 px-2">
                <Input
                  type="number"
                  value={reading.vazia ?? ''}
                  onChange={(e) => onReadingChange(reading.day, 'vazia', e.target.value ? parseFloat(e.target.value) : null)}
                  className="w-full h-7 text-xs"
                  placeholder="Contagem"
                />
              </TableCell>
              <TableCell className="h-9 py-1 px-2">
                <Input
                  type="number"
                  value={reading.ponta ?? ''}
                  onChange={(e) => onReadingChange(reading.day, 'ponta', e.target.value ? parseFloat(e.target.value) : null)}
                  className="w-full h-7 text-xs"
                  placeholder="Contagem"
                />
              </TableCell>
              <TableCell className="h-9 py-1 px-2">
                <Input
                  type="number"
                  value={reading.cheia ?? ''}
                  onChange={(e) => onReadingChange(reading.day, 'cheia', e.target.value ? parseFloat(e.target.value) : null)}
                  className="w-full h-7 text-xs"
                  placeholder="Contagem"
                />
              </TableCell>
              <TableCell className="h-9 py-1 px-2">
                <Input
                  type="number"
                  value={reading.sVazia ?? ''}
                  onChange={(e) => onReadingChange(reading.day, 'sVazia', e.target.value ? parseFloat(e.target.value) : null)}
                  className="w-full h-7 text-xs"
                  placeholder="Contagem"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
