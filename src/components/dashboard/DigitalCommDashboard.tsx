import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useDigitalCommData } from "@/hooks/useDigitalCommData";
import { Loader2, TrendingUp, Cloud } from "lucide-react";
import { upsertDigitalCommMetricsForStore } from "@/lib/api/service";
import { toast } from "sonner";

export function DigitalCommDashboard() {
  const { mloversData: initialData, loading, error, refetch } = useDigitalCommData();
  const [editData, setEditData] = useState<any[]>([]);
  const [savingCell, setSavingCell] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setEditData(JSON.parse(JSON.stringify(initialData)));
    }
  }, [initialData]);

  const handleValueChange = (location: string, month: string, value: string) => {
    setEditData(prev => prev.map(item => {
      if (item.location === location) {
        return { ...item, [month]: value };
      }
      return item;
    }));
  };

  const handleAutoSave = async (location: string, monthKey: string, value: string) => {
    const originalValue = initialData.find(item => item.location === location)?.[monthKey];

    // Only save if value actually changed
    if (parseFloat(value) === parseFloat(originalValue as string)) return;

    const cellId = `${location}-${monthKey}`;
    try {
      setSavingCell(cellId);

      const storeId = location === 'Queluz'
        ? 'fcf80b5a-b658-48f3-871c-ac62120c5a78'
        : 'f86b0b1f-05d0-4310-a655-a92ca1ab68bf';

      const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      const shortMonths = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
      const monthIdx = shortMonths.indexOf(monthKey);

      const val = parseFloat(value);
      if (isNaN(val)) return;

      return upsertDigitalCommMetricsForStore({
        month_name: monthNames[monthIdx],
        record_date: new Date(2025, monthIdx, 1).toISOString().split('T')[0],
        mlovers: val
      }, storeId);

      // Silent success to not annoy user, but refetch to keep data in sync
      refetch();
    } catch (err) {
      console.error(err);
      toast.error(`Erro ao salvar ${monthKey} para ${location}`);
    } finally {
      setSavingCell(null);
    }
  };

  if (loading && editData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  const shortMonths = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Evolução Mensal Mlovers</h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground italic">
          <Cloud className="h-3 w-3" />
          <span>Salvamento automático ativado</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border border-border/50 bg-card/30">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border/50">
              <TableHead className="font-bold text-foreground bg-muted/50">Mlovers</TableHead>
              {shortMonths.map(m => (
                <TableHead key={m} className="text-center capitalize">{m}</TableHead>
              ))}
              <TableHead className="text-center font-bold text-primary bg-primary/5">OBJETIVO</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {editData.map((item) => (
              <TableRow key={item.location} className="border-b border-border/50 hover:bg-muted/10">
                <TableCell className="font-medium bg-muted/20">{item.location}</TableCell>
                {shortMonths.map(m => (
                  <TableCell key={m} className="p-1 relative">
                    <Input
                      type="number"
                      step="0.1"
                      value={item[m] || ''}
                      onChange={(e) => handleValueChange(item.location, m, e.target.value)}
                      onBlur={(e) => handleAutoSave(item.location, m, e.target.value)}
                      className={`h-8 w-16 text-center bg-transparent border-none focus:ring-1 focus:ring-primary/50 transition-colors ${savingCell === `${item.location}-${m}` ? 'opacity-50' : ''
                        }`}
                    />
                    {savingCell === `${item.location}-${m}` && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <Loader2 className="h-3 w-3 animate-spin text-primary" />
                      </div>
                    )}
                  </TableCell>
                ))}
                <TableCell className="text-center font-bold text-primary bg-primary/5">
                  {item.target}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
