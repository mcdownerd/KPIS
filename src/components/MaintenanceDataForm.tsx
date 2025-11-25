import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Save, Wrench } from "lucide-react";

interface UtilityData {
  aguaAmadora: string;
  eletricidadeAmadora: string;
  aguaQueluz: string;
  eletricidadeQueluz: string;
}

interface OpsData {
  easyWashAmadora: string;
  easyWashQueluz: string;
  apcAmadora: string;
  apcQueluz: string;
  noScratchAmadora: string;
  noScratchQueluz: string;
  grillCleanerAmadora: string;
  grillCleanerQueluz: string;
  sabaoLiquidoAmadora: string;
  sabaoLiquidoQueluz: string;
}

interface BreakdownData {
  equipamento: string;
  causa: string;
  data: string;
  pecas: string;
  custo: string;
}

interface PerformanceData {
  cmpAmadora: string;
  plAmadora: string;
  avaliacoesAmadora: string;
  cmpQueluz: string;
  plQueluz: string;
  avaliacoesQueluz: string;
}

const months = [
  "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
  "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
];

export const MaintenanceDataForm = () => {
  const [selectedMonth, setSelectedMonth] = useState("JANEIRO");
  const [utilityData, setUtilityData] = useState<Record<string, UtilityData>>({});
  const [opsData, setOpsData] = useState<Record<string, OpsData>>({});
  const [breakdownsAmadora, setBreakdownsAmadora] = useState<BreakdownData[]>([]);
  const [breakdownsQueluz, setBreakdownsQueluz] = useState<BreakdownData[]>([]);
  const [performanceData, setPerformanceData] = useState<Record<string, PerformanceData>>({});

  const handleUtilityChange = (field: keyof UtilityData, value: string) => {
    setUtilityData(prev => ({
      ...prev,
      [selectedMonth]: {
        ...prev[selectedMonth],
        [field]: value
      }
    }));
  };

  const handleOpsChange = (field: keyof OpsData, value: string) => {
    setOpsData(prev => ({
      ...prev,
      [selectedMonth]: {
        ...prev[selectedMonth],
        [field]: value
      }
    }));
  };

  const handlePerformanceChange = (field: keyof PerformanceData, value: string) => {
    setPerformanceData(prev => ({
      ...prev,
      [selectedMonth]: {
        ...prev[selectedMonth],
        [field]: value
      }
    }));
  };

  const addBreakdown = (location: "amadora" | "queluz") => {
    const newBreakdown: BreakdownData = {
      equipamento: "",
      causa: "",
      data: "",
      pecas: "",
      custo: ""
    };
    
    if (location === "amadora") {
      setBreakdownsAmadora([...breakdownsAmadora, newBreakdown]);
    } else {
      setBreakdownsQueluz([...breakdownsQueluz, newBreakdown]);
    }
  };

  const updateBreakdown = (
    location: "amadora" | "queluz",
    index: number,
    field: keyof BreakdownData,
    value: string
  ) => {
    if (location === "amadora") {
      const updated = [...breakdownsAmadora];
      updated[index] = { ...updated[index], [field]: value };
      setBreakdownsAmadora(updated);
    } else {
      const updated = [...breakdownsQueluz];
      updated[index] = { ...updated[index], [field]: value };
      setBreakdownsQueluz(updated);
    }
  };

  const handleSave = () => {
    toast.success(`Dados de manutenção de ${selectedMonth} salvos com sucesso!`);
  };

  const currentUtilityData: UtilityData = utilityData[selectedMonth] || {
    aguaAmadora: "",
    eletricidadeAmadora: "",
    aguaQueluz: "",
    eletricidadeQueluz: ""
  };

  const currentOpsData: OpsData = opsData[selectedMonth] || {
    easyWashAmadora: "",
    easyWashQueluz: "",
    apcAmadora: "",
    apcQueluz: "",
    noScratchAmadora: "",
    noScratchQueluz: "",
    grillCleanerAmadora: "",
    grillCleanerQueluz: "",
    sabaoLiquidoAmadora: "",
    sabaoLiquidoQueluz: ""
  };

  const currentPerformanceData: PerformanceData = performanceData[selectedMonth] || {
    cmpAmadora: "",
    plAmadora: "",
    avaliacoesAmadora: "",
    cmpQueluz: "",
    plQueluz: "",
    avaliacoesQueluz: ""
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-primary" />
          Formulário de Dados de Manutenção
        </CardTitle>
        <CardDescription>
          Preencha os dados de gastos gerais, OPS, avarias e desempenho
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

        <Tabs defaultValue="utilities" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="utilities">Gastos Gerais</TabsTrigger>
            <TabsTrigger value="ops">OPS</TabsTrigger>
            <TabsTrigger value="breakdowns">Avarias</TabsTrigger>
            <TabsTrigger value="performance">Desempenho</TabsTrigger>
          </TabsList>

          <TabsContent value="utilities" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Amadora (20)</h3>
                <div className="space-y-2">
                  <Label>Água (€)</Label>
                  <Input
                    type="text"
                    placeholder="436.14 €"
                    value={currentUtilityData.aguaAmadora}
                    onChange={(e) => handleUtilityChange("aguaAmadora", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Eletricidade (€)</Label>
                  <Input
                    type="text"
                    placeholder="4,369.51 €"
                    value={currentUtilityData.eletricidadeAmadora}
                    onChange={(e) => handleUtilityChange("eletricidadeAmadora", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Queluz (32)</h3>
                <div className="space-y-2">
                  <Label>Água (€)</Label>
                  <Input
                    type="text"
                    placeholder="386.58 €"
                    value={currentUtilityData.aguaQueluz}
                    onChange={(e) => handleUtilityChange("aguaQueluz", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Eletricidade (€)</Label>
                  <Input
                    type="text"
                    placeholder="3,233.03 €"
                    value={currentUtilityData.eletricidadeQueluz}
                    onChange={(e) => handleUtilityChange("eletricidadeQueluz", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ops" className="space-y-6">
            <p className="text-sm text-muted-foreground mb-4">
              Produtos de limpeza e operações - Insira variações absolutas
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Amadora (20)</h3>
                <div className="space-y-2">
                  <Label>Easy Wash (variação)</Label>
                  <Input
                    type="number"
                    placeholder="-28"
                    value={currentOpsData.easyWashAmadora}
                    onChange={(e) => handleOpsChange("easyWashAmadora", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>APC (variação)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={currentOpsData.apcAmadora}
                    onChange={(e) => handleOpsChange("apcAmadora", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>No-Scratch (variação)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={currentOpsData.noScratchAmadora}
                    onChange={(e) => handleOpsChange("noScratchAmadora", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Grill Cleaner (variação)</Label>
                  <Input
                    type="number"
                    placeholder="-6"
                    value={currentOpsData.grillCleanerAmadora}
                    onChange={(e) => handleOpsChange("grillCleanerAmadora", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sabão Líquido (variação)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={currentOpsData.sabaoLiquidoAmadora}
                    onChange={(e) => handleOpsChange("sabaoLiquidoAmadora", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Queluz (32)</h3>
                <div className="space-y-2">
                  <Label>Easy Wash (variação)</Label>
                  <Input
                    type="number"
                    placeholder="15"
                    value={currentOpsData.easyWashQueluz}
                    onChange={(e) => handleOpsChange("easyWashQueluz", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>APC (variação)</Label>
                  <Input
                    type="number"
                    placeholder="-2"
                    value={currentOpsData.apcQueluz}
                    onChange={(e) => handleOpsChange("apcQueluz", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>No-Scratch (variação)</Label>
                  <Input
                    type="number"
                    placeholder="1"
                    value={currentOpsData.noScratchQueluz}
                    onChange={(e) => handleOpsChange("noScratchQueluz", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Grill Cleaner (variação)</Label>
                  <Input
                    type="number"
                    placeholder="-17"
                    value={currentOpsData.grillCleanerQueluz}
                    onChange={(e) => handleOpsChange("grillCleanerQueluz", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sabão Líquido (variação)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={currentOpsData.sabaoLiquidoQueluz}
                    onChange={(e) => handleOpsChange("sabaoLiquidoQueluz", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="breakdowns" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Avarias Amadora</h3>
                  <Button onClick={() => addBreakdown("amadora")} variant="outline" size="sm">
                    + Adicionar
                  </Button>
                </div>
                {breakdownsAmadora.map((breakdown, index) => (
                  <div key={index} className="space-y-2 p-4 border rounded-lg">
                    <Input
                      placeholder="Equipamento"
                      value={breakdown.equipamento}
                      onChange={(e) => updateBreakdown("amadora", index, "equipamento", e.target.value)}
                    />
                    <Textarea
                      placeholder="Causa"
                      value={breakdown.causa}
                      onChange={(e) => updateBreakdown("amadora", index, "causa", e.target.value)}
                      rows={2}
                    />
                    <Input
                      type="date"
                      value={breakdown.data}
                      onChange={(e) => updateBreakdown("amadora", index, "data", e.target.value)}
                    />
                    <Input
                      placeholder="Peças"
                      value={breakdown.pecas}
                      onChange={(e) => updateBreakdown("amadora", index, "pecas", e.target.value)}
                    />
                    <Input
                      placeholder="Custo (€)"
                      value={breakdown.custo}
                      onChange={(e) => updateBreakdown("amadora", index, "custo", e.target.value)}
                    />
                  </div>
                ))}
                {breakdownsAmadora.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhuma avaria registada. Clique em "Adicionar" para criar uma nova.
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Avarias Queluz</h3>
                  <Button onClick={() => addBreakdown("queluz")} variant="outline" size="sm">
                    + Adicionar
                  </Button>
                </div>
                {breakdownsQueluz.map((breakdown, index) => (
                  <div key={index} className="space-y-2 p-4 border rounded-lg">
                    <Input
                      placeholder="Equipamento"
                      value={breakdown.equipamento}
                      onChange={(e) => updateBreakdown("queluz", index, "equipamento", e.target.value)}
                    />
                    <Textarea
                      placeholder="Causa"
                      value={breakdown.causa}
                      onChange={(e) => updateBreakdown("queluz", index, "causa", e.target.value)}
                      rows={2}
                    />
                    <Input
                      type="date"
                      value={breakdown.data}
                      onChange={(e) => updateBreakdown("queluz", index, "data", e.target.value)}
                    />
                    <Input
                      placeholder="Peças"
                      value={breakdown.pecas}
                      onChange={(e) => updateBreakdown("queluz", index, "pecas", e.target.value)}
                    />
                    <Input
                      placeholder="Custo (€)"
                      value={breakdown.custo}
                      onChange={(e) => updateBreakdown("queluz", index, "custo", e.target.value)}
                    />
                  </div>
                ))}
                {breakdownsQueluz.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhuma avaria registada. Clique em "Adicionar" para criar uma nova.
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <p className="text-sm text-muted-foreground mb-4">
              Objetivos: CMP 96%, PL 97%, Avaliações 70%
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Amadora (20)</h3>
                <div className="space-y-2">
                  <Label>CMP (%)</Label>
                  <Input
                    type="number"
                    placeholder="96.63"
                    min="0"
                    max="100"
                    value={currentPerformanceData.cmpAmadora}
                    onChange={(e) => handlePerformanceChange("cmpAmadora", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Objetivo: 96%</p>
                </div>
                <div className="space-y-2">
                  <Label>Plano de Limpeza (%)</Label>
                  <Input
                    type="number"
                    placeholder="100.00"
                    min="0"
                    max="100"
                    value={currentPerformanceData.plAmadora}
                    onChange={(e) => handlePerformanceChange("plAmadora", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Objetivo: 97%</p>
                </div>
                <div className="space-y-2">
                  <Label>Avaliações (%)</Label>
                  <Input
                    type="number"
                    placeholder="70"
                    min="0"
                    max="100"
                    value={currentPerformanceData.avaliacoesAmadora}
                    onChange={(e) => handlePerformanceChange("avaliacoesAmadora", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Objetivo: 70%</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Queluz (32)</h3>
                <div className="space-y-2">
                  <Label>CMP (%)</Label>
                  <Input
                    type="number"
                    placeholder="96.63"
                    min="0"
                    max="100"
                    value={currentPerformanceData.cmpQueluz}
                    onChange={(e) => handlePerformanceChange("cmpQueluz", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Objetivo: 96%</p>
                </div>
                <div className="space-y-2">
                  <Label>Plano de Limpeza (%)</Label>
                  <Input
                    type="number"
                    placeholder="100.00"
                    min="0"
                    max="100"
                    value={currentPerformanceData.plQueluz}
                    onChange={(e) => handlePerformanceChange("plQueluz", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Objetivo: 97%</p>
                </div>
                <div className="space-y-2">
                  <Label>Avaliações (%)</Label>
                  <Input
                    type="number"
                    placeholder="70"
                    min="0"
                    max="100"
                    value={currentPerformanceData.avaliacoesQueluz}
                    onChange={(e) => handlePerformanceChange("avaliacoesQueluz", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Objetivo: 70%</p>
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
