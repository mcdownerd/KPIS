import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Save, Calculator } from "lucide-react";

interface MonthlyData {
  vendas20: string;
  vendas32: string;
  horas20: string;
  horas32: string;
  turnoverAmadora: string;
  turnoverQueluz: string;
  horasExtraAmadora: string;
  horasExtraQueluz: string;
  justificacaoExtra: string;
  cedenciaAmadora: string;
  cedenciaQueluz: string;
  justificacaoCedencia: string;
}

interface StaffingData {
  totalAmadora: string;
  almocoAmadora: string;
  jantarAmadora: string;
  totalQueluz: string;
  almocoQueluz: string;
  jantarQueluz: string;
}

const months = [
  "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
  "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
];

export const PeopleDataForm = () => {
  const [selectedMonth, setSelectedMonth] = useState("JANEIRO");
  const [monthlyData, setMonthlyData] = useState<Record<string, MonthlyData>>({});
  const [staffingData, setStaffingData] = useState<Record<string, StaffingData>>({});

  const handleMonthlyDataChange = (field: keyof MonthlyData, value: string) => {
    setMonthlyData(prev => ({
      ...prev,
      [selectedMonth]: {
        ...prev[selectedMonth],
        [field]: value
      }
    }));
  };

  const handleStaffingDataChange = (field: keyof StaffingData, value: string) => {
    setStaffingData(prev => ({
      ...prev,
      [selectedMonth]: {
        ...prev[selectedMonth],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    toast.success(`Dados de ${selectedMonth} salvos com sucesso!`);
  };

  const calculateProductivity = (vendas: string, horas: string) => {
    const v = parseFloat(vendas.replace(/[^0-9.-]+/g, ""));
    const h = parseFloat(horas);
    if (!isNaN(v) && !isNaN(h) && h > 0) {
      return (v / h).toFixed(2) + " €";
    }
    return "-";
  };

  const currentMonthData: MonthlyData = monthlyData[selectedMonth] || {
    vendas20: "",
    vendas32: "",
    horas20: "",
    horas32: "",
    turnoverAmadora: "",
    turnoverQueluz: "",
    horasExtraAmadora: "",
    horasExtraQueluz: "",
    justificacaoExtra: "",
    cedenciaAmadora: "",
    cedenciaQueluz: "",
    justificacaoCedencia: ""
  };
  
  const currentStaffingData: StaffingData = staffingData[selectedMonth] || {
    totalAmadora: "",
    almocoAmadora: "",
    jantarAmadora: "",
    totalQueluz: "",
    almocoQueluz: "",
    jantarQueluz: ""
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Formulário de Dados de Pessoas - M.O. Mensal
        </CardTitle>
        <CardDescription>
          Preencha os dados mensais de vendas, horas, turnover e staffing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Label>Selecione o Mês</Label>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map(month => (
                <SelectItem key={month} value={month}>{month}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="vendas" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="vendas">Vendas & Horas</TabsTrigger>
            <TabsTrigger value="turnover">Turnover</TabsTrigger>
            <TabsTrigger value="staffing">Staffing</TabsTrigger>
            <TabsTrigger value="horas">Horas Extra</TabsTrigger>
          </TabsList>

          <TabsContent value="vendas" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Amadora (20)</h3>
                <div className="space-y-2">
                  <Label>Vendas (€)</Label>
                  <Input
                    type="text"
                    placeholder="286,344.11 €"
                    value={currentMonthData.vendas20 || ""}
                    onChange={(e) => handleMonthlyDataChange("vendas20", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Horas Trabalhadas</Label>
                  <Input
                    type="number"
                    placeholder="4121"
                    value={currentMonthData.horas20 || ""}
                    onChange={(e) => handleMonthlyDataChange("horas20", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Produtividade (calculada)</Label>
                  <Input
                    type="text"
                    disabled
                    value={calculateProductivity(currentMonthData.vendas20 || "", currentMonthData.horas20 || "")}
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Queluz (32)</h3>
                <div className="space-y-2">
                  <Label>Vendas (€)</Label>
                  <Input
                    type="text"
                    placeholder="155,938.56 €"
                    value={currentMonthData.vendas32 || ""}
                    onChange={(e) => handleMonthlyDataChange("vendas32", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Horas Trabalhadas</Label>
                  <Input
                    type="number"
                    placeholder="2425.12"
                    value={currentMonthData.horas32 || ""}
                    onChange={(e) => handleMonthlyDataChange("horas32", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Produtividade (calculada)</Label>
                  <Input
                    type="text"
                    disabled
                    value={calculateProductivity(currentMonthData.vendas32 || "", currentMonthData.horas32 || "")}
                    className="bg-muted"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="turnover" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Turnover Amadora</h3>
                <div className="space-y-2">
                  <Label>Taxa de Turnover (%)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
                    value={currentMonthData.turnoverAmadora || ""}
                    onChange={(e) => handleMonthlyDataChange("turnoverAmadora", e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">Objetivo: 85%</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Turnover Queluz</h3>
                <div className="space-y-2">
                  <Label>Taxa de Turnover (%)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
                    value={currentMonthData.turnoverQueluz || ""}
                    onChange={(e) => handleMonthlyDataChange("turnoverQueluz", e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">Objetivo: 85%</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="staffing" className="space-y-6">
            <p className="text-sm text-muted-foreground mb-4">
              Staffing abaixo do ideal - Objetivo: 35%
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Amadora (20)</h3>
                <div className="space-y-2">
                  <Label>Total Staffing (%)</Label>
                  <Input
                    type="number"
                    placeholder="40"
                    value={currentStaffingData.totalAmadora || ""}
                    onChange={(e) => handleStaffingDataChange("totalAmadora", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Almoço (%)</Label>
                  <Input
                    type="number"
                    placeholder="23"
                    value={currentStaffingData.almocoAmadora || ""}
                    onChange={(e) => handleStaffingDataChange("almocoAmadora", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Jantar (%)</Label>
                  <Input
                    type="number"
                    placeholder="58"
                    value={currentStaffingData.jantarAmadora || ""}
                    onChange={(e) => handleStaffingDataChange("jantarAmadora", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Queluz (32)</h3>
                <div className="space-y-2">
                  <Label>Total Staffing (%)</Label>
                  <Input
                    type="number"
                    placeholder="52"
                    value={currentStaffingData.totalQueluz || ""}
                    onChange={(e) => handleStaffingDataChange("totalQueluz", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Almoço (%)</Label>
                  <Input
                    type="number"
                    placeholder="45"
                    value={currentStaffingData.almocoQueluz || ""}
                    onChange={(e) => handleStaffingDataChange("almocoQueluz", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Jantar (%)</Label>
                  <Input
                    type="number"
                    placeholder="58"
                    value={currentStaffingData.jantarQueluz || ""}
                    onChange={(e) => handleStaffingDataChange("jantarQueluz", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="horas" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Horas Extra</h3>
                <div className="space-y-2">
                  <Label>Horas Extra Amadora</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={currentMonthData.horasExtraAmadora || ""}
                    onChange={(e) => handleMonthlyDataChange("horasExtraAmadora", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Horas Extra Queluz</Label>
                  <Input
                    type="number"
                    placeholder="14.21"
                    value={currentMonthData.horasExtraQueluz || ""}
                    onChange={(e) => handleMonthlyDataChange("horasExtraQueluz", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Justificação</Label>
                  <Textarea
                    placeholder="Ex: Descarga sábado, baixa Arman..."
                    value={currentMonthData.justificacaoExtra || ""}
                    onChange={(e) => handleMonthlyDataChange("justificacaoExtra", e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Cedência de Horas</h3>
                <div className="space-y-2">
                  <Label>Cedência Amadora</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={currentMonthData.cedenciaAmadora || ""}
                    onChange={(e) => handleMonthlyDataChange("cedenciaAmadora", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cedência Queluz</Label>
                  <Input
                    type="number"
                    placeholder="7.3"
                    value={currentMonthData.cedenciaQueluz || ""}
                    onChange={(e) => handleMonthlyDataChange("cedenciaQueluz", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Justificação</Label>
                  <Textarea
                    placeholder="Ex: Dia 1 amadora precisou, Kadimira á tarde..."
                    value={currentMonthData.justificacaoCedencia || ""}
                    onChange={(e) => handleMonthlyDataChange("justificacaoCedencia", e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Salvar Dados de {selectedMonth}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
