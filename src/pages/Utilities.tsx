import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, TrendingUp, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ElectricityTable } from "@/components/utilities/ElectricityTable";
import { WaterTable } from "@/components/utilities/WaterTable";
import { CostsTable } from "@/components/utilities/CostsTable";
import { MonthComparison } from "@/components/utilities/MonthComparison";
import { MonthlyData, ElectricityReading, WaterReading } from "@/types/utilities";
import { calculateDailyCosts, formatCurrency, electricityRates } from "@/utils/utilitiesCalculations";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { getUtilitiesByMonth, upsertUtilityReading, Utility } from "@/lib/api/utilities";

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export default function Utilities() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [waterPricePerM3, setWaterPricePerM3] = useState(0.70);
  const [loading, setLoading] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  // Estado local para a UI
  const [currentMonthData, setCurrentMonthData] = useState<MonthlyData>({
    month: selectedMonth,
    year: 2025,
    managerMorning: "",
    managerNight: "",
    electricityReadings: Array.from({ length: 31 }, (_, i) => ({
      day: i + 1,
      vazia: null,
      ponta: null,
      cheia: null,
      sVazia: null,
    })),
    waterReadings: Array.from({ length: 31 }, (_, i) => ({
      day: i + 1,
      reading: null,
      m3Used: 0,
      euroSpent: 0,
    })),
    waterPricePerM3: 0.70,
  });

  // Redirecionar se não estiver logado
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Carregar dados quando o mês muda
  useEffect(() => {
    if (user) {
      loadMonthData(selectedMonth);
    }
  }, [selectedMonth, user]);

  const loadMonthData = async (month: number) => {
    setLoading(true);
    try {
      const utilities = await getUtilitiesByMonth(month, 2025);

      // Transformar dados do Supabase para o formato da UI
      const newMonthData: MonthlyData = {
        month: month,
        year: 2025,
        managerMorning: "", // TODO: Persistir gerentes se necessário
        managerNight: "",
        electricityReadings: Array.from({ length: 31 }, (_, i) => {
          const day = i + 1;
          const dateStr = `2025-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

          const vazia = utilities.find(u => u.reading_date === dateStr && u.utility_type === 'electricity_vazia')?.reading_value || null;
          const ponta = utilities.find(u => u.reading_date === dateStr && u.utility_type === 'electricity_ponta')?.reading_value || null;
          const cheia = utilities.find(u => u.reading_date === dateStr && u.utility_type === 'electricity_cheia')?.reading_value || null;
          const sVazia = utilities.find(u => u.reading_date === dateStr && u.utility_type === 'electricity_svazia')?.reading_value || null;

          return { day, vazia, ponta, cheia, sVazia };
        }),
        waterReadings: Array.from({ length: 31 }, (_, i) => {
          const day = i + 1;
          const dateStr = `2025-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          const reading = utilities.find(u => u.reading_date === dateStr && u.utility_type === 'water')?.reading_value || null;

          return {
            day,
            reading,
            m3Used: 0, // Será recalculado pelo calculateDailyCosts
            euroSpent: 0
          };
        }),
        waterPricePerM3: waterPricePerM3,
      };

      setCurrentMonthData(newMonthData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar dados de consumo.");
    } finally {
      setLoading(false);
    }
  };

  const dailyCosts = calculateDailyCosts(
    currentMonthData.electricityReadings,
    currentMonthData.waterReadings,
    waterPricePerM3
  );

  const handleElectricityChange = async (
    day: number,
    field: keyof Omit<ElectricityReading, 'day'>,
    value: number | null
  ) => {
    // Atualizar estado local imediatamente para UX fluida
    setCurrentMonthData((prev) => ({
      ...prev,
      electricityReadings: prev.electricityReadings.map((reading) =>
        reading.day === day ? { ...reading, [field]: value } : reading
      ),
    }));

    // Persistir no Supabase
    if (value !== null) {
      try {
        const dateStr = `2025-${(selectedMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const typeMap: Record<string, string> = {
          vazia: 'electricity_vazia',
          ponta: 'electricity_ponta',
          cheia: 'electricity_cheia',
          sVazia: 'electricity_svazia'
        };

        await upsertUtilityReading(dateStr, typeMap[field as string], value);
      } catch (error) {
        console.error("Erro ao salvar leitura:", error);
        toast.error("Erro ao salvar leitura.");
      }
    }
  };

  const handleWaterChange = async (day: number, value: number | null) => {
    // Atualizar estado local
    setCurrentMonthData((prev) => ({
      ...prev,
      waterReadings: prev.waterReadings.map((reading) =>
        reading.day === day ? { ...reading, reading: value } : reading
      ),
    }));

    // Persistir no Supabase
    if (value !== null) {
      try {
        const dateStr = `2025-${(selectedMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        await upsertUtilityReading(dateStr, 'water', value);
      } catch (error) {
        console.error("Erro ao salvar leitura de água:", error);
        toast.error("Erro ao salvar leitura de água.");
      }
    }
  };

  const totalMonthly = dailyCosts[dailyCosts.length - 1]?.accumulatedTotal || 0;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar ao Dashboard
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Consumo de Luz e Água</h1>
            <p className="text-muted-foreground mt-2">Gestão de consumos e custos - 2025</p>
          </div>

          {/* TODO: Reimplementar comparação de meses com dados reais */}
          {/* <Dialog open={showComparison} onOpenChange={setShowComparison}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Comparar Meses
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Comparação entre Meses</DialogTitle>
              </DialogHeader>
              <MonthComparison allMonthsData={{}} months={months} />
            </DialogContent>
          </Dialog> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => setSelectedMonth(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gerente Manhã</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={currentMonthData.managerMorning}
                onChange={(e) =>
                  setCurrentMonthData((prev) => ({ ...prev, managerMorning: e.target.value }))
                }
                placeholder="1º nome"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gerente Noite</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={currentMonthData.managerNight}
                onChange={(e) =>
                  setCurrentMonthData((prev) => ({ ...prev, managerNight: e.target.value }))
                }
                placeholder="1º nome"
              />
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Resumo do Mês - {months[selectedMonth]}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground mb-1">Total Eletricidade</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(dailyCosts[dailyCosts.length - 1]?.accumulatedElectricity || 0)}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground mb-1">Total Água</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(dailyCosts[dailyCosts.length - 1]?.accumulatedWater || 0)}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground mb-1">Total Geral</p>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(totalMonthly)}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground mb-1">Gasto Médio Diário</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(totalMonthly / 31)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <CardTitle>Tarifas de Eletricidade</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">S.VAZIA</p>
                    <p className="font-medium">{formatCurrency(electricityRates.sVazia)}/kWh</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">VAZIA</p>
                    <p className="font-medium">{formatCurrency(electricityRates.vazia)}/kWh</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">PONTA</p>
                    <p className="font-medium">{formatCurrency(electricityRates.ponta)}/kWh</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">CHEIA</p>
                    <p className="font-medium">{formatCurrency(electricityRates.cheia)}/kWh</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Leituras de Eletricidade</CardTitle>
                <p className="text-sm text-muted-foreground">Contagens feitas às 10h</p>
              </CardHeader>
              <CardContent>
                <ElectricityTable
                  readings={currentMonthData.electricityReadings}
                  onReadingChange={handleElectricityChange}
                />
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle>Leituras de Água</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="waterPrice">Preço M³:</Label>
                    <Input
                      id="waterPrice"
                      type="number"
                      step="0.01"
                      value={waterPricePerM3}
                      onChange={(e) => setWaterPricePerM3(parseFloat(e.target.value) || 0)}
                      className="w-24"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <WaterTable
                  readings={currentMonthData.waterReadings}
                  onReadingChange={handleWaterChange}
                  waterPricePerM3={waterPricePerM3}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumo de Custos</CardTitle>
              </CardHeader>
              <CardContent>
                <CostsTable costs={dailyCosts} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
