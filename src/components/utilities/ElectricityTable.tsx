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
          <TableRow>
            <TableHead className="min-w-[80px]">Dia</TableHead>
            <TableHead className="min-w-[120px]">VAZIA</TableHead>
            <TableHead className="min-w-[120px]">PONTA</TableHead>
            <TableHead className="min-w-[120px]">CHEIA</TableHead>
            <TableHead className="min-w-[120px]">S.VAZIA</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {readings.map((reading) => (
            <TableRow key={reading.day}>
              <TableCell className="font-medium">{reading.day}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={reading.vazia ?? ''}
                  onChange={(e) => onReadingChange(reading.day, 'vazia', e.target.value ? parseFloat(e.target.value) : null)}
                  className="w-full"
                  placeholder="Contagem"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={reading.ponta ?? ''}
                  onChange={(e) => onReadingChange(reading.day, 'ponta', e.target.value ? parseFloat(e.target.value) : null)}
                  className="w-full"
                  placeholder="Contagem"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={reading.cheia ?? ''}
                  onChange={(e) => onReadingChange(reading.day, 'cheia', e.target.value ? parseFloat(e.target.value) : null)}
                  className="w-full"
                  placeholder="Contagem"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={reading.sVazia ?? ''}
                  onChange={(e) => onReadingChange(reading.day, 'sVazia', e.target.value ? parseFloat(e.target.value) : null)}
                  className="w-full"
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
