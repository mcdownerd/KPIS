import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Save, Calendar, Clock } from "lucide-react";
import { createMaintenance } from "@/lib/api/maintenance";
import { upsertInventoryDeviation, calculateDeviationStatus } from "@/lib/api/inventory";
import { upsertYield } from "@/lib/api/yields";

interface CostData {
  month: string;
  store: string;
  comida: string;
  papel: string;
  refeicoes: string;
  perdas: string;
  promos: string;
}

interface DeviationData {
  month: string;
  store: string;
  paoReg: string;
  carneReg: string;
  carneRoyal: string;
  chkOpt: string;
  chkNuggets: string;
  baconFatias: string;
  compal: string;
  queijoCheddar: string;
  queijoWhite: string;
}

interface YieldData {
  month: string;
  store: string;
  batata: string;
  alfaceL6: string;
  sopas: string;
  cobChocolate: string;
  cobCaramelo: string;
  cobMorango: string;
  cobSnickers: string;
  cobMars: string;
  leiteSundae: string;
}

interface ServiceTimeData {
  month: string;
  store: string;
  almoco: string;
  jantar: string;
  dia: string;
  delivery: string;
}

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const stores = ["Amadora", "Queluz"];

const serviceStores = ["Amadora", "Queluz", "P.Borges"];

import { useAuth } from "@/hooks/useAuth";

interface DataEntryFormProps {
  onTabChange?: (tab: 'costs' | 'deviations' | 'yields') => void;
}

export function DataEntryForm({ onTabChange }: DataEntryFormProps = {}) {
  const { profile } = useAuth();

  const [costData, setCostData] = useState<CostData>({
    month: "",
    store: "",
    comida: "",
    papel: "",
    refeicoes: "",
    perdas: "",
    promos: ""
  });

  const [deviationData, setDeviationData] = useState<DeviationData>({
    month: "",
    store: "",
    paoReg: "",
    carneReg: "",
    carneRoyal: "",
    chkOpt: "",
    chkNuggets: "",
    baconFatias: "",
    compal: "",
    queijoCheddar: "",
    queijoWhite: ""
  });

  const [yieldData, setYieldData] = useState<YieldData>({
    month: "",
    store: "",
    batata: "",
    alfaceL6: "",
    sopas: "",
    cobChocolate: "",
    cobCaramelo: "",
    cobMorango: "",
    cobSnickers: "",
    cobMars: "",
    leiteSundae: ""
  });

  const [serviceTimeData, setServiceTimeData] = useState<ServiceTimeData>({
    month: "",
    store: "",
    almoco: "",
    jantar: "",
    dia: "",
    delivery: ""
  });





  useEffect(() => {
    // Get current month name
    const currentMonthIndex = new Date().getMonth();
    const currentMonthName = months[currentMonthIndex];

    if (profile?.store_id) {
      let storeName = "";
      // Map IDs to names used in the form
      if (profile.store_id === 'fcf80b5a-b658-48f3-871c-ac62120c5a78') storeName = "Queluz";
      else if (profile.store_id === 'f86b0b1f-05d0-4310-a655-a92ca1ab68bf') storeName = "Amadora";

      // Update all form states with current month and store
      if (storeName) {
        setCostData(prev => ({ ...prev, month: currentMonthName, store: storeName }));
        setDeviationData(prev => ({ ...prev, month: currentMonthName, store: storeName }));
        setYieldData(prev => ({ ...prev, month: currentMonthName, store: storeName }));
        setServiceTimeData(prev => ({ ...prev, month: currentMonthName, store: storeName }));
      }
    } else {
      // If no profile yet, just set the month
      setCostData(prev => ({ ...prev, month: currentMonthName }));
      setDeviationData(prev => ({ ...prev, month: currentMonthName }));
      setYieldData(prev => ({ ...prev, month: currentMonthName }));
      setServiceTimeData(prev => ({ ...prev, month: currentMonthName }));
    }
  }, [profile]);

  const handleCostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Cost data submitted:", costData);
    toast.success("Dados de custos salvos com sucesso!");

    // Reset form
    setCostData({
      month: costData.month,
      store: costData.store,
      comida: "",
      papel: "",
      refeicoes: "",
      perdas: "",
      promos: ""
    });
  };

  const handleDeviationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const year = new Date().getFullYear(); // Assuming current year
      const monthIndex = months.indexOf(deviationData.month);
      // Create a date for the 1st of the selected month
      // Note: monthIndex is 0-based (0 = January)
      const recordDate = new Date(year, monthIndex, 1).toISOString().split('T')[0];

      const products = [
        { key: 'paoReg', name: 'PÃO REG' },
        { key: 'carneReg', name: 'CARNE REG' },
        { key: 'carneRoyal', name: 'CARNE ROYAL' },
        { key: 'chkOpt', name: 'CHK OPT' },
        { key: 'chkNuggets', name: 'CHK NUGGETS' },
        { key: 'baconFatias', name: 'BACON FATIAS' },
        { key: 'compal', name: 'COMPAL' },
        { key: 'queijoCheddar', name: 'QUEIJO CHEDDAR' },
        { key: 'queijoWhite', name: 'QUEIJO WHITE' }
      ];

      for (const product of products) {
        const valueStr = deviationData[product.key as keyof DeviationData];
        if (valueStr && valueStr !== "") {
          const value = parseFloat(valueStr as string);
          await upsertInventoryDeviation({
            record_date: recordDate,
            item_name: product.name,
            deviation_value: value,
            status: calculateDeviationStatus(value)
          });
        }
      }

      toast.success("Dados de desvios salvos com sucesso!");

      // Dispatch custom event to refresh the inventory deviations dashboard
      window.dispatchEvent(new CustomEvent('inventory-deviations-updated'));

      // Reset form
      setDeviationData({
        month: deviationData.month,
        store: deviationData.store,
        paoReg: "",
        carneReg: "",
        carneRoyal: "",
        chkOpt: "",
        chkNuggets: "",
        baconFatias: "",
        compal: "",
        queijoCheddar: "",
        queijoWhite: ""
      });
    } catch (error) {
      console.error("Error saving deviation data:", error);
      toast.error("Erro ao salvar dados de desvios.");
    }
  };

  const handleYieldSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const monthIndex = months.indexOf(yieldData.month);
      const year = new Date().getFullYear();
      const recordDate = new Date(year, monthIndex + 1, 0).toISOString().split('T')[0];

      const items = [
        { key: 'batata', name: 'Batata' },
        { key: 'alfaceL6', name: 'Alface L6' },
        { key: 'sopas', name: 'Sopas' },
        { key: 'cobChocolate', name: 'Cob Chocolate' },
        { key: 'cobCaramelo', name: 'Cob Caramelo' },
        { key: 'cobMorango', name: 'Cob Morango' },
        { key: 'cobSnickers', name: 'Cob Snickers' },
        { key: 'cobMars', name: 'Cob Mars' },
        { key: 'leiteSundae', name: 'Leite Sundae' },
      ];

      for (const item of items) {
        const value = yieldData[item.key as keyof typeof yieldData];
        if (value) {
          await upsertYield({
            record_date: recordDate,
            product_name: item.name,
            yield_value: parseFloat(value.toString())
          });
        }
      }

      toast.success("Dados de rendimentos salvos com sucesso!");
      window.dispatchEvent(new CustomEvent('yields-updated'));

      // Reset form
      setYieldData({
        month: yieldData.month,
        store: yieldData.store,
        batata: "",
        alfaceL6: "",
        sopas: "",
        cobChocolate: "",
        cobCaramelo: "",
        cobMorango: "",
        cobSnickers: "",
        cobMars: "",
        leiteSundae: ""
      });
    } catch (error) {
      console.error("Error saving yield data:", error);
      toast.error("Erro ao salvar dados de rendimentos.");
    }
  };

  const handleServiceTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Service time data submitted:", serviceTimeData);
    toast.success("Dados de tempos de serviço salvos com sucesso!");

    // Reset form
    setServiceTimeData({
      month: serviceTimeData.month,
      store: serviceTimeData.store,
      almoco: "",
      jantar: "",
      dia: "",
      delivery: ""
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="costs" className="w-full" onValueChange={(value) => {
        if (onTabChange) {
          onTabChange(value as 'costs' | 'deviations' | 'yields');
        }
      }}>
        <TabsList className="h-auto flex flex-col sm:grid w-full sm:grid-cols-3 bg-secondary p-1">
          <TabsTrigger value="costs" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Custo de Vendas
          </TabsTrigger>
          <TabsTrigger value="deviations" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Desvios de Inventário
          </TabsTrigger>
          <TabsTrigger value="yields" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Rendimentos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="costs" className="mt-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Preenchimento de Custo de Vendas
              </CardTitle>
              <CardDescription>
                Insira os dados mensais de custos por categoria (em %)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCostSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="cost-month">Mês</Label>
                    <Select
                      value={costData.month}
                      onValueChange={(value) => setCostData({ ...costData, month: value })}
                      required
                    >
                      <SelectTrigger id="cost-month">
                        <SelectValue placeholder="Selecione o mês" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month} value={month}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cost-store">Loja</Label>
                    <Select
                      value={costData.store}
                      onValueChange={(value) => setCostData({ ...costData, store: value })}
                      required
                      disabled={!!profile?.store_id}
                    >
                      <SelectTrigger id="cost-store">
                        <SelectValue placeholder="Selecione a loja" />
                      </SelectTrigger>
                      <SelectContent>
                        {stores.map((store) => (
                          <SelectItem key={store} value={store}>
                            Loja {store}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="comida">Comida (%)</Label>
                    <Input
                      id="comida"
                      type="number"
                      step="0.01"
                      placeholder="26.78"
                      value={costData.comida}
                      onChange={(e) => setCostData({ ...costData, comida: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="papel">Papel (%)</Label>
                    <Input
                      id="papel"
                      type="number"
                      step="0.01"
                      placeholder="1.52"
                      value={costData.papel}
                      onChange={(e) => setCostData({ ...costData, papel: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="refeicoes">Refeições (%)</Label>
                    <Input
                      id="refeicoes"
                      type="number"
                      step="0.01"
                      placeholder="0.85"
                      value={costData.refeicoes}
                      onChange={(e) => setCostData({ ...costData, refeicoes: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="perdas">Perdas (%)</Label>
                    <Input
                      id="perdas"
                      type="number"
                      step="0.01"
                      placeholder="0.86"
                      value={costData.perdas}
                      onChange={(e) => setCostData({ ...costData, perdas: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="promos">Promos (%)</Label>
                    <Input
                      id="promos"
                      type="number"
                      step="0.01"
                      placeholder="0.49"
                      value={costData.promos}
                      onChange={(e) => setCostData({ ...costData, promos: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full md:w-auto">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Dados de Custos
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deviations" className="mt-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Preenchimento de Desvios de Inventário
              </CardTitle>
              <CardDescription>
                Insira os desvios mensais por produto (valores absolutos)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDeviationSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="dev-month">Mês</Label>
                    <Select
                      value={deviationData.month}
                      onValueChange={(value) => setDeviationData({ ...deviationData, month: value })}
                      required
                    >
                      <SelectTrigger id="dev-month">
                        <SelectValue placeholder="Selecione o mês" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month} value={month}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dev-store">Loja</Label>
                    <Select
                      value={deviationData.store}
                      onValueChange={(value) => setDeviationData({ ...deviationData, store: value })}
                      required
                      disabled={!!profile?.store_id}
                    >
                      <SelectTrigger id="dev-store">
                        <SelectValue placeholder="Selecione a loja" />
                      </SelectTrigger>
                      <SelectContent>
                        {stores.map((store) => (
                          <SelectItem key={store} value={store}>
                            {store}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="paoReg">PÃO REG</Label>
                    <Input
                      id="paoReg"
                      type="number"
                      step="1"
                      placeholder="-114"
                      value={deviationData.paoReg}
                      onChange={(e) => setDeviationData({ ...deviationData, paoReg: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="carneReg">CARNE REG</Label>
                    <Input
                      id="carneReg"
                      type="number"
                      step="1"
                      placeholder="-29"
                      value={deviationData.carneReg}
                      onChange={(e) => setDeviationData({ ...deviationData, carneReg: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="carneRoyal">CARNE ROYAL</Label>
                    <Input
                      id="carneRoyal"
                      type="number"
                      step="1"
                      placeholder="-105"
                      value={deviationData.carneRoyal}
                      onChange={(e) => setDeviationData({ ...deviationData, carneRoyal: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chkOpt">CHK OPT</Label>
                    <Input
                      id="chkOpt"
                      type="number"
                      step="1"
                      placeholder="-43"
                      value={deviationData.chkOpt}
                      onChange={(e) => setDeviationData({ ...deviationData, chkOpt: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chkNuggets">CHK NUGGETS</Label>
                    <Input
                      id="chkNuggets"
                      type="number"
                      step="1"
                      placeholder="-299"
                      value={deviationData.chkNuggets}
                      onChange={(e) => setDeviationData({ ...deviationData, chkNuggets: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="baconFatias">BACON FATIAS</Label>
                    <Input
                      id="baconFatias"
                      type="number"
                      step="1"
                      placeholder="617"
                      value={deviationData.baconFatias}
                      onChange={(e) => setDeviationData({ ...deviationData, baconFatias: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="compal">COMPAL</Label>
                    <Input
                      id="compal"
                      type="number"
                      step="1"
                      placeholder="-20"
                      value={deviationData.compal}
                      onChange={(e) => setDeviationData({ ...deviationData, compal: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="queijoCheddar">QUEIJO CHEDDAR</Label>
                    <Input
                      id="queijoCheddar"
                      type="number"
                      step="1"
                      placeholder="82"
                      value={deviationData.queijoCheddar}
                      onChange={(e) => setDeviationData({ ...deviationData, queijoCheddar: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="queijoWhite">QUEIJO WHITE</Label>
                    <Input
                      id="queijoWhite"
                      type="number"
                      step="1"
                      placeholder="-21"
                      value={deviationData.queijoWhite}
                      onChange={(e) => setDeviationData({ ...deviationData, queijoWhite: e.target.value })}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full md:w-auto">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Dados de Desvios
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="yields" className="mt-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Preenchimento de Rendimentos
              </CardTitle>
              <CardDescription>
                Insira os rendimentos mensais por produto (valores decimais)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleYieldSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="yield-month">Mês</Label>
                    <Select
                      value={yieldData.month}
                      onValueChange={(value) => setYieldData({ ...yieldData, month: value })}
                      required
                    >
                      <SelectTrigger id="yield-month">
                        <SelectValue placeholder="Selecione o mês" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month} value={month}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yield-store">Loja</Label>
                    <Select
                      value={yieldData.store}
                      onValueChange={(value) => setYieldData({ ...yieldData, store: value })}
                      required
                      disabled={!!profile?.store_id}
                    >
                      <SelectTrigger id="yield-store">
                        <SelectValue placeholder="Selecione a loja" />
                      </SelectTrigger>
                      <SelectContent>
                        {stores.map((store) => (
                          <SelectItem key={store} value={store}>
                            {store}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="batata">Batata</Label>
                    <Input
                      id="batata"
                      type="number"
                      step="0.001"
                      placeholder="40.3"
                      value={yieldData.batata}
                      onChange={(e) => setYieldData({ ...yieldData, batata: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alfaceL6">Alface L6</Label>
                    <Input
                      id="alfaceL6"
                      type="number"
                      step="0.001"
                      placeholder="92.41"
                      value={yieldData.alfaceL6}
                      onChange={(e) => setYieldData({ ...yieldData, alfaceL6: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sopas">Sopas</Label>
                    <Input
                      id="sopas"
                      type="number"
                      step="0.001"
                      placeholder="-42.523"
                      value={yieldData.sopas}
                      onChange={(e) => setYieldData({ ...yieldData, sopas: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cobChocolate">Cobertura Chocolate</Label>
                    <Input
                      id="cobChocolate"
                      type="number"
                      step="0.001"
                      placeholder="7.9"
                      value={yieldData.cobChocolate}
                      onChange={(e) => setYieldData({ ...yieldData, cobChocolate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cobCaramelo">Cobertura Caramelo</Label>
                    <Input
                      id="cobCaramelo"
                      type="number"
                      step="0.001"
                      placeholder="7.9"
                      value={yieldData.cobCaramelo}
                      onChange={(e) => setYieldData({ ...yieldData, cobCaramelo: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cobMorango">Cobertura Morango</Label>
                    <Input
                      id="cobMorango"
                      type="number"
                      step="0.001"
                      placeholder="-8.2"
                      value={yieldData.cobMorango}
                      onChange={(e) => setYieldData({ ...yieldData, cobMorango: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cobSnickers">Cobertura Snickers</Label>
                    <Input
                      id="cobSnickers"
                      type="number"
                      step="0.001"
                      placeholder="4.7"
                      value={yieldData.cobSnickers}
                      onChange={(e) => setYieldData({ ...yieldData, cobSnickers: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cobMars">Cobertura Mars</Label>
                    <Input
                      id="cobMars"
                      type="number"
                      step="0.001"
                      placeholder="-11.7"
                      value={yieldData.cobMars}
                      onChange={(e) => setYieldData({ ...yieldData, cobMars: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="leiteSundae">Leite Sundae</Label>
                    <Input
                      id="leiteSundae"
                      type="number"
                      step="0.001"
                      placeholder="-31.01"
                      value={yieldData.leiteSundae}
                      onChange={(e) => setYieldData({ ...yieldData, leiteSundae: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full md:w-auto">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Dados de Rendimentos
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}