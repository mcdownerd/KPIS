import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DeliveryDay, DeliveryShift } from "@/types/delivery";
import { Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DeliveryDayFormProps {
  day: number;
  initialData?: DeliveryDay;
  onSave: (data: DeliveryDay) => void;
}

export const DeliveryDayForm = ({ day, initialData, onSave }: DeliveryDayFormProps) => {
  const { toast } = useToast();
  const [manager, setManager] = useState("");
  const [morningShifts, setMorningShifts] = useState<DeliveryShift[]>([]);
  const [nightShifts, setNightShifts] = useState<DeliveryShift[]>([]);

  useEffect(() => {
    if (initialData) {
      setManager(initialData.manager);
      setMorningShifts(initialData.morning_shifts);
      setNightShifts(initialData.night_shifts);
    } else {
      setManager("");
      setMorningShifts([]);
      setNightShifts([]);
    }
  }, [initialData, day]);

  const createEmptyShift = (): DeliveryShift => ({
    id: Date.now().toString(),
    operator: "",
    gcs: 0,
    sales: 0,
    cash: 0,
    mb: 0,
    mbp: 0,
    tr_euro: 0,
    difference: 0,
    reimbursement_qty: 0,
    reimbursement_value: 0,
    reimbursement_note: "",
  });

  const calculateDifference = (shift: DeliveryShift): number => {
    const totalRegistered = shift.cash + shift.mb + shift.mbp + shift.tr_euro;
    return shift.sales - totalRegistered;
  };

  const updateShift = (
    shifts: DeliveryShift[],
    setShifts: (shifts: DeliveryShift[]) => void,
    index: number,
    field: keyof DeliveryShift,
    value: string | number
  ) => {
    const updated = [...shifts];
    updated[index] = { ...updated[index], [field]: value };

    if (['sales', 'cash', 'mb', 'mbp', 'tr_euro'].includes(field)) {
      updated[index].difference = calculateDifference(updated[index]);
    }

    setShifts(updated);
  };

  const addShift = (shifts: DeliveryShift[], setShifts: (shifts: DeliveryShift[]) => void) => {
    setShifts([...shifts, createEmptyShift()]);
  };

  const removeShift = (shifts: DeliveryShift[], setShifts: (shifts: DeliveryShift[]) => void, index: number) => {
    setShifts(shifts.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave({
      day,
      morning_shifts: morningShifts,
      night_shifts: nightShifts,
      manager,
    });
    toast({
      title: "Dados salvos",
      description: `Dia ${day} salvo com sucesso!`,
    });
  };

  const renderShiftForm = (
    shifts: DeliveryShift[],
    setShifts: (shifts: DeliveryShift[]) => void,
    title: string
  ) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Button size="sm" onClick={() => addShift(shifts, setShifts)}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Turno
        </Button>
      </div>

      {shifts.map((shift, index) => (
        <Card key={shift.id} className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div>
              <Label>Operador</Label>
              <Input
                value={shift.operator}
                onChange={(e) => updateShift(shifts, setShifts, index, "operator", e.target.value)}
                placeholder="Nome"
              />
            </div>
            <div>
              <Label>GC's</Label>
              <Input
                type="number"
                value={shift.gcs || ""}
                onChange={(e) => updateShift(shifts, setShifts, index, "gcs", Number(e.target.value))}
              />
            </div>
            <div>
              <Label>Vendas</Label>
              <Input
                type="number"
                step="0.01"
                value={shift.sales || ""}
                onChange={(e) => updateShift(shifts, setShifts, index, "sales", Number(e.target.value))}
              />
            </div>
            <div>
              <Label>Dinheiro</Label>
              <Input
                type="number"
                step="0.01"
                value={shift.cash || ""}
                onChange={(e) => updateShift(shifts, setShifts, index, "cash", Number(e.target.value))}
              />
            </div>
            <div>
              <Label>MB</Label>
              <Input
                type="number"
                step="0.01"
                value={shift.mb || ""}
                onChange={(e) => updateShift(shifts, setShifts, index, "mb", Number(e.target.value))}
              />
            </div>
            <div>
              <Label>MBP</Label>
              <Input
                type="number"
                step="0.01"
                value={shift.mbp || ""}
                onChange={(e) => updateShift(shifts, setShifts, index, "mbp", Number(e.target.value))}
              />
            </div>
            <div>
              <Label>TR/Euro</Label>
              <Input
                type="number"
                step="0.01"
                value={shift.tr_euro || ""}
                onChange={(e) => updateShift(shifts, setShifts, index, "tr_euro", Number(e.target.value))}
              />
            </div>
            <div>
              <Label>Diferença</Label>
              <Input
                type="number"
                step="0.01"
                value={shift.difference.toFixed(2)}
                readOnly
                className={shift.difference !== 0 ? "bg-destructive/20" : ""}
              />
            </div>
            <div>
              <Label>Reemb. Qtd</Label>
              <Input
                type="number"
                value={shift.reimbursement_qty || ""}
                onChange={(e) => updateShift(shifts, setShifts, index, "reimbursement_qty", Number(e.target.value))}
              />
            </div>
            <div>
              <Label>Reemb. €</Label>
              <Input
                type="number"
                step="0.01"
                value={shift.reimbursement_value || ""}
                onChange={(e) => updateShift(shifts, setShifts, index, "reimbursement_value", Number(e.target.value))}
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="destructive"
                size="icon"
                onClick={() => removeShift(shifts, setShifts, index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Campo de nota de reembolso - aparece quando há reembolso */}
          {(shift.reimbursement_qty > 0 || shift.reimbursement_value > 0) && (
            <div className="mt-4">
              <Label>Nota de Reembolso</Label>
              <Input
                value={shift.reimbursement_note || ""}
                onChange={(e) => updateShift(shifts, setShifts, index, "reimbursement_note", e.target.value)}
                placeholder="Descreva o motivo do reembolso..."
                className="w-full"
              />
            </div>
          )}
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Dia</Label>
            <Input value={`Dia ${day}`} readOnly className="font-bold" />
          </div>
          <div>
            <Label>Gerente</Label>
            <Input
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              placeholder="Nome do gerente"
            />
          </div>
        </div>
      </Card>

      {renderShiftForm(morningShifts, setMorningShifts, "Manhã")}

      <Separator />

      {renderShiftForm(nightShifts, setNightShifts, "Noite")}

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          <Save className="h-4 w-4 mr-2" />
          Salvar Dia {day}
        </Button>
      </div>
    </div>
  );
};
