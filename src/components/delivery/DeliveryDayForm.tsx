import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DeliveryDay, DeliveryShift } from "@/types/delivery";
import {
  Plus,
  Trash2,
  Save,
  User,
  Calculator,
  Banknote,
  CreditCard,
  Coins,
  Euro,
  AlertCircle,
  Receipt,
  Wallet,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DeliveryDayFormProps {
  day: number;
  initialData?: DeliveryDay;
  onSave: (data: DeliveryDay) => void;
}

export const DeliveryDayForm = ({ day, initialData, onSave }: DeliveryDayFormProps) => {
  const { toast } = useToast();
  const [managerMorning, setManagerMorning] = useState("");
  const [managerNight, setManagerNight] = useState("");
  const [morningShifts, setMorningShifts] = useState<DeliveryShift[]>([]);
  const [nightShifts, setNightShifts] = useState<DeliveryShift[]>([]);

  useEffect(() => {
    if (initialData) {
      setManagerMorning(initialData.manager_morning);
      setManagerNight(initialData.manager_night);
      setMorningShifts(initialData.morning_shifts);
      setNightShifts(initialData.night_shifts);
    } else {
      setManagerMorning("");
      setManagerNight("");
      setMorningShifts([]);
      setNightShifts([]);
    }
  }, [initialData, day]);

  const createEmptyShift = (): DeliveryShift => ({
    id: `temp-${Date.now()}`,
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

  const [activeInput, setActiveInput] = useState<{
    id: string;
    field: keyof DeliveryShift;
    value: string;
  } | null>(null);

  // Função para avaliar expressões matemáticas (ex: "50+50+80" = 180)
  const evaluateMathExpression = (expression: string): number => {
    try {
      // Remove espaços e valida caracteres permitidos (números, +, -, *, /, ., parênteses)
      const sanitized = expression.replace(/\s/g, '');
      if (!/^[0-9+\-*/.()]+$/.test(sanitized)) {
        return NaN;
      }
      // Avalia a expressão de forma segura
      const result = Function('"use strict"; return (' + sanitized + ')')();
      return typeof result === 'number' && !isNaN(result) ? result : NaN;
    } catch {
      return NaN;
    }
  };

  const calculateDifference = (shift: DeliveryShift): number => {
    const totalRegistered = shift.cash + shift.mb + shift.mbp + shift.tr_euro;
    return totalRegistered - shift.sales;
  };

  const handleInputFocus = (id: string, field: keyof DeliveryShift, value: any) => {
    setActiveInput({ id, field, value: value === 0 ? "" : value?.toString() || "" });
  };

  const handleInputChange = (value: string) => {
    if (activeInput) {
      setActiveInput({ ...activeInput, value });
    }
  };

  const handleInputBlur = (
    shifts: DeliveryShift[],
    setShifts: (shifts: DeliveryShift[]) => void,
    index: number,
    field: keyof DeliveryShift
  ) => {
    if (!activeInput) return;

    const updated = [...shifts];
    const value = activeInput.value;

    // Se for um campo numérico, tenta avaliar como expressão matemática
    if (['gcs', 'sales', 'cash', 'mb', 'mbp', 'tr_euro', 'reimbursement_qty', 'reimbursement_value'].includes(field)) {
      if (value.trim() === "") {
        updated[index] = { ...updated[index], [field]: 0 };
      } else {
        const evaluated = evaluateMathExpression(value);
        if (!isNaN(evaluated)) {
          updated[index] = { ...updated[index], [field]: evaluated };
        } else {
          // Se não for uma expressão válida, tenta converter para número diretamente
          const numValue = Number(value);
          updated[index] = { ...updated[index], [field]: isNaN(numValue) ? 0 : numValue };
        }
      }
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }

    if (['sales', 'cash', 'mb', 'mbp', 'tr_euro'].includes(field)) {
      updated[index].difference = calculateDifference(updated[index]);
    }

    setShifts(updated);
    setActiveInput(null);
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
      manager_morning: managerMorning,
      manager_night: managerNight,
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
  ) => {
    const isMorning = title === "Manhã";
    const titleText = isMorning ? "TURNO DA MANHÃ" : "TURNO DA NOITE";

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-3 tracking-wider text-foreground">
            <Clock className="w-6 h-6" /> {titleText}
          </h3>
          <Button
            size="sm"
            onClick={() => addShift(shifts, setShifts)}
            variant="outline"
            className="bg-background/50 backdrop-blur-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Entrada
          </Button>
        </div>

        <div className="grid gap-6">
          {shifts.map((shift, index) => (
            <Card key={shift.id} className="p-6 relative overflow-visible transition-all bg-card/80 backdrop-blur-sm border-border shadow-sm hover:shadow-md">

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Coluna 1: Operador (Largura maior) */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-widest">Operador</Label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 w-10 flex items-center justify-center rounded-l-md bg-muted/50 transition-colors">
                        <User className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <Input
                        value={shift.operator}
                        onChange={(e) => updateShift(shifts, setShifts, index, "operator", e.target.value)}
                        placeholder="Nome do Operador"
                        className="pl-12 h-12 bg-background/50 transition-all"
                      />
                    </div>
                  </div>

                  {/* Diferença em destaque */}
                  <div className={`p-4 rounded-xl border bg-background/50 flex items-center justify-between ${shift.difference > 0 ? 'border-green-500/30 bg-green-500/5' :
                    shift.difference < 0 ? 'border-red-500/30 bg-red-500/5' :
                      'border-border'
                    }`}>
                    <div>
                      <Label className="text-xs text-muted-foreground uppercase">Diferença</Label>
                      <div className={`text-2xl font-bold font-mono ${shift.difference > 0 ? 'text-green-600 dark:text-green-400' :
                        shift.difference < 0 ? 'text-red-600 dark:text-red-400' :
                          'text-muted-foreground'
                        }`}>
                        {shift.difference > 0 ? '+' : ''}€ {shift.difference.toFixed(2)}
                      </div>
                    </div>
                    {shift.difference !== 0 && (
                      <div className={shift.difference > 0 ? 'text-green-500' : 'text-red-500'}>
                        <AlertCircle className="w-8 h-8 opacity-80" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Coluna 2: Valores Financeiros */}
                <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">GC's</Label>
                    <Input
                      type="text"
                      value={activeInput?.id === shift.id && activeInput?.field === "gcs" ? activeInput.value : (shift.gcs === 0 ? "" : shift.gcs)}
                      onFocus={() => handleInputFocus(shift.id, "gcs", shift.gcs)}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onBlur={() => handleInputBlur(shifts, setShifts, index, "gcs")}
                      className="bg-background/50 font-mono"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Vendas</Label>
                    <Input
                      type="text"
                      value={activeInput?.id === shift.id && activeInput?.field === "sales" ? activeInput.value : (shift.sales === 0 ? "" : `€ ${shift.sales}`)}
                      onFocus={() => handleInputFocus(shift.id, "sales", shift.sales)}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onBlur={() => handleInputBlur(shifts, setShifts, index, "sales")}
                      className="bg-background/50 font-mono font-bold"
                      placeholder="€ 0.00"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Dinheiro</Label>
                    <Input
                      type="text"
                      value={activeInput?.id === shift.id && activeInput?.field === "cash" ? activeInput.value : (shift.cash === 0 ? "" : `€ ${shift.cash}`)}
                      onFocus={() => handleInputFocus(shift.id, "cash", shift.cash)}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onBlur={() => handleInputBlur(shifts, setShifts, index, "cash")}
                      className="bg-background/50 font-mono"
                      placeholder="€ 0.00"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">TR/Euro</Label>
                    <Input
                      type="text"
                      value={activeInput?.id === shift.id && activeInput?.field === "tr_euro" ? activeInput.value : (shift.tr_euro === 0 ? "" : `€ ${shift.tr_euro}`)}
                      onFocus={() => handleInputFocus(shift.id, "tr_euro", shift.tr_euro)}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onBlur={() => handleInputBlur(shifts, setShifts, index, "tr_euro")}
                      className="bg-background/50 font-mono"
                      placeholder="€ 0.00"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">MB</Label>
                    <Input
                      type="text"
                      value={activeInput?.id === shift.id && activeInput?.field === "mb" ? activeInput.value : (shift.mb === 0 ? "" : `€ ${shift.mb}`)}
                      onFocus={() => handleInputFocus(shift.id, "mb", shift.mb)}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onBlur={() => handleInputBlur(shifts, setShifts, index, "mb")}
                      className="bg-background/50 font-mono text-blue-600 dark:text-blue-400"
                      placeholder="€ 0.00"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">MBP</Label>
                    <Input
                      type="text"
                      value={activeInput?.id === shift.id && activeInput?.field === "mbp" ? activeInput.value : (shift.mbp === 0 ? "" : `€ ${shift.mbp}`)}
                      onFocus={() => handleInputFocus(shift.id, "mbp", shift.mbp)}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onBlur={() => handleInputBlur(shifts, setShifts, index, "mbp")}
                      className="bg-background/50 font-mono text-blue-600 dark:text-blue-400"
                      placeholder="€ 0.00"
                    />
                  </div>
                </div>

                {/* Coluna 3: Reembolso e Ações */}
                <div className="lg:col-span-3 space-y-4">
                  <div className="p-3 rounded-lg border border-border bg-muted/20">
                    <Label className="text-xs text-muted-foreground uppercase mb-2 block">Reembolso</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-[10px] text-muted-foreground">Qtd</Label>
                        <Input
                          type="text"
                          value={activeInput?.id === shift.id && activeInput?.field === "reimbursement_qty" ? activeInput.value : (shift.reimbursement_qty === 0 ? "" : shift.reimbursement_qty)}
                          onFocus={() => handleInputFocus(shift.id, "reimbursement_qty", shift.reimbursement_qty)}
                          onChange={(e) => handleInputChange(e.target.value)}
                          onBlur={() => handleInputBlur(shifts, setShifts, index, "reimbursement_qty")}
                          className="h-8 text-xs bg-background/50"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] text-muted-foreground">Valor</Label>
                        <Input
                          type="text"
                          value={activeInput?.id === shift.id && activeInput?.field === "reimbursement_value" ? activeInput.value : (shift.reimbursement_value === 0 ? "" : `€ ${shift.reimbursement_value}`)}
                          onFocus={() => handleInputFocus(shift.id, "reimbursement_value", shift.reimbursement_value)}
                          onChange={(e) => handleInputChange(e.target.value)}
                          onBlur={() => handleInputBlur(shifts, setShifts, index, "reimbursement_value")}
                          className="h-8 text-xs bg-background/50"
                          placeholder="€ 0.00"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-full w-10 h-10"
                      onClick={() => removeShift(shifts, setShifts, index)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Nota de Reembolso */}
              {(shift.reimbursement_qty > 0 || shift.reimbursement_value > 0) && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <Input
                    value={shift.reimbursement_note || ""}
                    onChange={(e) => updateShift(shifts, setShifts, index, "reimbursement_note", e.target.value)}
                    placeholder="Nota de Reembolso..."
                    className="bg-transparent border-none text-sm text-muted-foreground focus:text-foreground placeholder:text-muted-foreground/50"
                  />
                </div>
              )}
            </Card>
          ))}

          {shifts.length === 0 && (
            <div className="text-center py-12 rounded-xl border border-dashed border-border bg-muted/5 hover:bg-muted/10 transition-colors">
              <p className="text-muted-foreground mb-4">Nenhum turno registado</p>
              <Button
                variant="outline"
                onClick={() => addShift(shifts, setShifts)}
              >
                Adicionar Entrada
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Card className="p-6 bg-card/80 backdrop-blur-md border-border shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div>
            <Label className="text-xs text-muted-foreground uppercase tracking-widest mb-1 block">Data Selecionada</Label>
            <div className="text-4xl font-black tracking-tighter text-foreground">
              Dia {day}
            </div>
          </div>

          <div className="relative group">
            <Label className="text-xs text-muted-foreground uppercase tracking-widest mb-2 block transition-colors">
              Gerente Manhã
            </Label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors" />
              <Input
                value={managerMorning}
                onChange={(e) => setManagerMorning(e.target.value)}
                placeholder="Gerente Manhã"
                className="pl-12 h-14 bg-background/50 text-lg transition-all rounded-xl"
              />
            </div>
          </div>

          <div className="relative group">
            <Label className="text-xs text-muted-foreground uppercase tracking-widest mb-2 block transition-colors">
              Gerente Noite
            </Label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors" />
              <Input
                value={managerNight}
                onChange={(e) => setManagerNight(e.target.value)}
                placeholder="Gerente Noite"
                className="pl-12 h-14 bg-background/50 text-lg transition-all rounded-xl"
              />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {renderShiftForm(morningShifts, setMorningShifts, "Manhã")}
        {renderShiftForm(nightShifts, setNightShifts, "Noite")}
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleSave}
          size="lg"
          className="h-16 px-8 rounded-full shadow-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg tracking-wide transition-all hover:scale-105"
        >
          <Save className="h-6 w-6 mr-2" />
          SALVAR
        </Button>
      </div>
    </div>
  );
};
