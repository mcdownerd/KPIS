import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DeliveryDayForm } from "@/components/delivery/DeliveryDayForm";
import { OperatorAnalysis } from "@/components/delivery/OperatorAnalysis";
import { RestaurantAverage } from "@/components/delivery/RestaurantAverage";
import { MonthComparison } from "@/components/delivery/MonthComparison";
import { DeliveryDay, DeliveryShift } from "@/types/delivery";
import { useAuth } from "@/hooks/useAuth";
import { getCashRegisterShiftsByMonth, upsertCashRegisterShift, getCashRegisterShiftsForComparison, CashRegisterShift } from "@/lib/api/cash_register";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const DeliveryCashSheet = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(currentDate.getDate());

  // Estado local formatado para a UI
  const [monthData, setMonthData] = useState<DeliveryDay[]>([]);
  const [comparisonData, setComparisonData] = useState<Record<string, DeliveryDay[]>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadMonthData();
    }
  }, [selectedMonth, selectedYear, user]);

  useEffect(() => {
    if (user) {
      loadComparisonData();
    }
  }, [user]);

  const loadMonthData = async () => {
    setLoading(true);
    try {
      const shifts = await getCashRegisterShiftsByMonth(selectedMonth, selectedYear);

      // Agrupar shifts por dia
      const daysMap = new Map<number, DeliveryDay>();

      shifts.forEach(shift => {
        const date = new Date(shift.shift_date);
        const day = date.getDate();

        if (!daysMap.has(day)) {
          daysMap.set(day, {
            day,
            morning_shifts: [],
            night_shifts: [],
            manager_morning: "",
            manager_night: ""
          });
        }

        const dayData = daysMap.get(day)!;
        const uiShift: DeliveryShift = {
          id: shift.id,
          operator: shift.operator_name,
          gcs: shift.gcs,
          sales: shift.sales,
          cash: shift.cash,
          mb: shift.mb,
          mbp: shift.mbp,
          tr_euro: shift.tr_euro,
          difference: shift.difference,
          reimbursement_qty: shift.reimbursement_qty,
          reimbursement_value: shift.reimbursement_value,
          reimbursement_note: shift.reimbursement_note
        };

        if (shift.shift_type === 'morning') {
          dayData.morning_shifts.push(uiShift);
          if (shift.manager_name) dayData.manager_morning = shift.manager_name;
        } else {
          dayData.night_shifts.push(uiShift);
          if (shift.manager_name) dayData.manager_night = shift.manager_name;
        }
      });

      setMonthData(Array.from(daysMap.values()));
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar folha de caixa.");
    } finally {
      setLoading(false);
    }
  };

  const loadComparisonData = async () => {
    try {
      const data = await getCashRegisterShiftsForComparison(12);
      setComparisonData(data);
    } catch (error) {
      console.error("Erro ao carregar dados de comparação:", error);
      // Não mostra toast para não incomodar o usuário, apenas loga o erro
    }
  };

  const handleSaveDay = async (dayData: DeliveryDay) => {
    try {
      const dateStr = `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}-${dayData.day.toString().padStart(2, '0')}`;

      // Salvar turnos da manhã
      for (const shift of dayData.morning_shifts) {
        await upsertCashRegisterShift({
          id: shift.id.startsWith('temp-') ? undefined : shift.id, // IDs temporários são ignorados
          shift_date: dateStr,
          shift_type: 'morning',
          operator_name: shift.operator,
          gcs: shift.gcs,
          sales: shift.sales,
          cash: shift.cash,
          mb: shift.mb,
          mbp: shift.mbp,
          tr_euro: shift.tr_euro,
          difference: shift.difference,
          reimbursement_qty: shift.reimbursement_qty,
          reimbursement_value: shift.reimbursement_value,
          reimbursement_note: shift.reimbursement_note,
          manager_name: dayData.manager_morning
        });
      }

      // Salvar turnos da noite
      for (const shift of dayData.night_shifts) {
        await upsertCashRegisterShift({
          id: shift.id.startsWith('temp-') ? undefined : shift.id,
          shift_date: dateStr,
          shift_type: 'night',
          operator_name: shift.operator,
          gcs: shift.gcs,
          sales: shift.sales,
          cash: shift.cash,
          mb: shift.mb,
          mbp: shift.mbp,
          tr_euro: shift.tr_euro,
          difference: shift.difference,
          reimbursement_qty: shift.reimbursement_qty,
          reimbursement_value: shift.reimbursement_value,
          reimbursement_note: shift.reimbursement_note,
          manager_name: dayData.manager_night
        });
      }

      toast.success("Dados salvos com sucesso!");
      loadMonthData(); // Recarregar para obter IDs reais
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar dados.");
    }
  };

  const getCurrentDayData = () => {
    return monthData.find(d => d.day === selectedDay);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Gradients for Glassmorphism Context */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[100px]" />
        <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] rounded-full bg-purple-600/10 blur-[100px]" />
      </div>

      <div className="p-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-6">
          <header className="space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link to="/">
                  <Button variant="ghost" size="sm" className="pl-0 hover:pl-2 transition-all">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar ao Dashboard
                  </Button>
                </Link>
              </div>
              <h1 className="text-4xl font-bold text-foreground">Folha de Caixa Delivery</h1>
              <p className="text-muted-foreground mt-2">Controle diário de operações de caixa</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="w-full md:flex-1 md:max-w-xs">
                <label className="text-sm font-medium mb-2 block">Mês</label>
                <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((month, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full md:flex-1 md:max-w-xs">
                <label className="text-sm font-medium mb-2 block">Ano</label>
                <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - 2 + i).map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </header>

          <Card className="p-4 md:p-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Tabs defaultValue="daily" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
                  <TabsTrigger value="daily">Entrada Diária</TabsTrigger>
                  <TabsTrigger value="operator">Análise Operador</TabsTrigger>
                  <TabsTrigger value="restaurant">Média Restaurante</TabsTrigger>
                  <TabsTrigger value="comparison">Comparação Meses</TabsTrigger>
                </TabsList>

                <TabsContent value="daily" className="space-y-4">
                  <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${selectedDay === day
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                          }`}
                      >
                        Dia {day}
                      </button>
                    ))}
                  </div>

                  <DeliveryDayForm
                    day={selectedDay}
                    initialData={getCurrentDayData()}
                    onSave={handleSaveDay}
                  />
                </TabsContent>

                <TabsContent value="operator" className="space-y-4">
                  <OperatorAnalysis deliveryData={monthData} />
                </TabsContent>

                <TabsContent value="restaurant" className="space-y-4">
                  <RestaurantAverage deliveryData={monthData} />
                </TabsContent>

                <TabsContent value="comparison" className="space-y-4">
                  <MonthComparison allMonthsData={comparisonData} months={MONTHS} />
                </TabsContent>
              </Tabs>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DeliveryCashSheet;
