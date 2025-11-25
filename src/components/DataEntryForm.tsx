import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Save, Calendar, Clock } from "lucide-react";

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

const stores = ["20", "32"];

const serviceStores = ["Amadora", "Queluz", "P.Borges"];

export function DataEntryForm() {
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

  const handleDeviationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Deviation data submitted:", deviationData);
    toast.success("Dados de desvios salvos com sucesso!");
    
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
  };

  const handleYieldSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Yield data submitted:", yieldData);
    toast.success("Dados de rendimentos salvos com sucesso!");
    
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
      <Tabs defaultValue="costs" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-secondary">
          <TabsTrigger value="costs" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Custo de Vendas
          </TabsTrigger>
          <TabsTrigger value="deviations" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Desvios de Inventário
          </TabsTrigger>
          <TabsTrigger value="yields" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Rendimentos
          </TabsTrigger>
          <TabsTrigger value="servicetimes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Tempos de Serviço
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
                    >
                      <SelectTrigger id="dev-store">
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
                    <Label htmlFor="paoReg">Pão Regular</Label>
                    <Input
                      id="paoReg"
                      type="number"
                      step="1"
                      placeholder="-114"
                      value={deviationData.paoReg}
                      onChange={(e) => setDeviationData({ ...deviationData, paoReg: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="carneReg">Carne Regular</Label>
                    <Input
                      id="carneReg"
                      type="number"
                      step="1"
                      placeholder="-29"
                      value={deviationData.carneReg}
                      onChange={(e) => setDeviationData({ ...deviationData, carneReg: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="carneRoyal">Carne Royal</Label>
                    <Input
                      id="carneRoyal"
                      type="number"
                      step="1"
                      placeholder="-105"
                      value={deviationData.carneRoyal}
                      onChange={(e) => setDeviationData({ ...deviationData, carneRoyal: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chkOpt">Chicken Optimum</Label>
                    <Input
                      id="chkOpt"
                      type="number"
                      step="1"
                      placeholder="-43"
                      value={deviationData.chkOpt}
                      onChange={(e) => setDeviationData({ ...deviationData, chkOpt: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chkNuggets">Chicken Nuggets</Label>
                    <Input
                      id="chkNuggets"
                      type="number"
                      step="1"
                      placeholder="-299"
                      value={deviationData.chkNuggets}
                      onChange={(e) => setDeviationData({ ...deviationData, chkNuggets: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="baconFatias">Bacon Fatias</Label>
                    <Input
                      id="baconFatias"
                      type="number"
                      step="1"
                      placeholder="617"
                      value={deviationData.baconFatias}
                      onChange={(e) => setDeviationData({ ...deviationData, baconFatias: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="compal">Compal</Label>
                    <Input
                      id="compal"
                      type="number"
                      step="1"
                      placeholder="-20"
                      value={deviationData.compal}
                      onChange={(e) => setDeviationData({ ...deviationData, compal: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="queijoCheddar">Queijo Cheddar</Label>
                    <Input
                      id="queijoCheddar"
                      type="number"
                      step="1"
                      placeholder="82"
                      value={deviationData.queijoCheddar}
                      onChange={(e) => setDeviationData({ ...deviationData, queijoCheddar: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="queijoWhite">Queijo White</Label>
                    <Input
                      id="queijoWhite"
                      type="number"
                      step="1"
                      placeholder="-21"
                      value={deviationData.queijoWhite}
                      onChange={(e) => setDeviationData({ ...deviationData, queijoWhite: e.target.value })}
                      required
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
                    >
                      <SelectTrigger id="yield-store">
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

        <TabsContent value="servicetimes" className="mt-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Preenchimento de Tempos de Serviço
              </CardTitle>
              <CardDescription>
                Insira os tempos de serviço mensais por tipo (em segundos)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleServiceTimeSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="service-month">Mês</Label>
                    <Select
                      value={serviceTimeData.month}
                      onValueChange={(value) => setServiceTimeData({ ...serviceTimeData, month: value })}
                      required
                    >
                      <SelectTrigger id="service-month">
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
                    <Label htmlFor="service-store">Loja</Label>
                    <Select
                      value={serviceTimeData.store}
                      onValueChange={(value) => setServiceTimeData({ ...serviceTimeData, store: value })}
                      required
                    >
                      <SelectTrigger id="service-store">
                        <SelectValue placeholder="Selecione a loja" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceStores.map((store) => (
                          <SelectItem key={store} value={store}>
                            {store}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="almoco">Almoço (seg)</Label>
                    <Input
                      id="almoco"
                      type="number"
                      step="1"
                      placeholder="108"
                      value={serviceTimeData.almoco}
                      onChange={(e) => setServiceTimeData({ ...serviceTimeData, almoco: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jantar">Jantar (seg)</Label>
                    <Input
                      id="jantar"
                      type="number"
                      step="1"
                      placeholder="122"
                      value={serviceTimeData.jantar}
                      onChange={(e) => setServiceTimeData({ ...serviceTimeData, jantar: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dia">Dia (seg)</Label>
                    <Input
                      id="dia"
                      type="number"
                      step="1"
                      placeholder="132"
                      value={serviceTimeData.dia}
                      onChange={(e) => setServiceTimeData({ ...serviceTimeData, dia: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="delivery">Delivery (seg)</Label>
                    <Input
                      id="delivery"
                      type="number"
                      step="1"
                      placeholder="81"
                      value={serviceTimeData.delivery}
                      onChange={(e) => setServiceTimeData({ ...serviceTimeData, delivery: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full md:w-auto">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Dados de Tempos de Serviço
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}