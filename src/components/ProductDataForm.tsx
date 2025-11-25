import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const locations = ["20", "32"];

export function ProductDataForm() {
  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);

  // Custos de Vendas
  const [costsData, setCostsData] = useState({
    comida: "",
    papel: "",
    refeicoes: "",
    perdas: "",
    promos: "",
  });

  // Desvios de Inventário
  const [deviationsData, setDeviationsData] = useState({
    paoReg: "",
    carneReg: "",
    carneRoyal: "",
    chkOpt: "",
    chkNuggets: "",
    baconFatias: "",
    compal: "",
    queijoCheddar: "",
    queijoWhite: "",
  });

  // Rendimentos
  const [yieldsData, setYieldsData] = useState({
    batata: "",
    alfaceL6: "",
    sopas: "",
    cobChocolate: "",
    cobCaramelo: "",
    cobMorango: "",
    cobSnickers: "",
    cobMars: "",
    leiteSundae: "",
  });

  const handleCostsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Dados de custos salvos com sucesso!");
    console.log("Custos:", { month: selectedMonth, location: selectedLocation, ...costsData });
  };

  const handleDeviationsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Dados de desvios salvos com sucesso!");
    console.log("Desvios:", { month: selectedMonth, location: selectedLocation, ...deviationsData });
  };

  const handleYieldsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Dados de rendimentos salvos com sucesso!");
    console.log("Rendimentos:", { month: selectedMonth, location: selectedLocation, ...yieldsData });
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Preenchimento de Dados de Produto</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex gap-4">
          <div className="flex-1">
            <Label>Mês</Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue />
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
          <div className="flex-1">
            <Label>Localização</Label>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    Loja {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="costs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="costs">Custos de Vendas</TabsTrigger>
            <TabsTrigger value="deviations">Desvios</TabsTrigger>
            <TabsTrigger value="yields">Rendimentos</TabsTrigger>
          </TabsList>

          <TabsContent value="costs">
            <form onSubmit={handleCostsSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="comida">Comida (%)</Label>
                  <Input
                    id="comida"
                    type="number"
                    step="0.01"
                    placeholder="Ex: 26.78"
                    value={costsData.comida}
                    onChange={(e) => setCostsData({ ...costsData, comida: e.target.value })}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Objetivo: ~26-27%</p>
                </div>

                <div>
                  <Label htmlFor="papel">Papel (%)</Label>
                  <Input
                    id="papel"
                    type="number"
                    step="0.01"
                    placeholder="Ex: 1.52"
                    value={costsData.papel}
                    onChange={(e) => setCostsData({ ...costsData, papel: e.target.value })}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Objetivo: ~1.5-3%</p>
                </div>

                <div>
                  <Label htmlFor="refeicoes">Refeições (%)</Label>
                  <Input
                    id="refeicoes"
                    type="number"
                    step="0.01"
                    placeholder="Ex: 0.85"
                    value={costsData.refeicoes}
                    onChange={(e) => setCostsData({ ...costsData, refeicoes: e.target.value })}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Objetivo: 0.7-0.8%</p>
                </div>

                <div>
                  <Label htmlFor="perdas">Perdas (%)</Label>
                  <Input
                    id="perdas"
                    type="number"
                    step="0.01"
                    placeholder="Ex: 0.86"
                    value={costsData.perdas}
                    onChange={(e) => setCostsData({ ...costsData, perdas: e.target.value })}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Objetivo: 0.5%</p>
                </div>

                <div>
                  <Label htmlFor="promos">Promos (%)</Label>
                  <Input
                    id="promos"
                    type="number"
                    step="0.01"
                    placeholder="Ex: 0.49"
                    value={costsData.promos}
                    onChange={(e) => setCostsData({ ...costsData, promos: e.target.value })}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Variável por promoções</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setCostsData({
                  comida: "",
                  papel: "",
                  refeicoes: "",
                  perdas: "",
                  promos: "",
                })}>
                  Limpar
                </Button>
                <Button type="submit">Salvar Custos</Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="deviations">
            <form onSubmit={handleDeviationsSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <Label htmlFor="paoReg">Pão Regular (unidades)</Label>
                  <Input
                    id="paoReg"
                    type="number"
                    placeholder="Ex: -114"
                    value={deviationsData.paoReg}
                    onChange={(e) => setDeviationsData({ ...deviationsData, paoReg: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="carneReg">Carne Regular (unidades)</Label>
                  <Input
                    id="carneReg"
                    type="number"
                    placeholder="Ex: -29"
                    value={deviationsData.carneReg}
                    onChange={(e) => setDeviationsData({ ...deviationsData, carneReg: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="carneRoyal">Carne Royal (unidades)</Label>
                  <Input
                    id="carneRoyal"
                    type="number"
                    placeholder="Ex: -105"
                    value={deviationsData.carneRoyal}
                    onChange={(e) => setDeviationsData({ ...deviationsData, carneRoyal: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="chkOpt">CHK OPT (unidades)</Label>
                  <Input
                    id="chkOpt"
                    type="number"
                    placeholder="Ex: -43"
                    value={deviationsData.chkOpt}
                    onChange={(e) => setDeviationsData({ ...deviationsData, chkOpt: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="chkNuggets">CHK Nuggets (unidades)</Label>
                  <Input
                    id="chkNuggets"
                    type="number"
                    placeholder="Ex: -299"
                    value={deviationsData.chkNuggets}
                    onChange={(e) => setDeviationsData({ ...deviationsData, chkNuggets: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="baconFatias">Bacon Fatias (unidades)</Label>
                  <Input
                    id="baconFatias"
                    type="number"
                    placeholder="Ex: 617"
                    value={deviationsData.baconFatias}
                    onChange={(e) => setDeviationsData({ ...deviationsData, baconFatias: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="compal">Compal (unidades)</Label>
                  <Input
                    id="compal"
                    type="number"
                    placeholder="Ex: -20"
                    value={deviationsData.compal}
                    onChange={(e) => setDeviationsData({ ...deviationsData, compal: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="queijoCheddar">Queijo Cheddar (unidades)</Label>
                  <Input
                    id="queijoCheddar"
                    type="number"
                    placeholder="Ex: 82"
                    value={deviationsData.queijoCheddar}
                    onChange={(e) => setDeviationsData({ ...deviationsData, queijoCheddar: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="queijoWhite">Queijo White (unidades)</Label>
                  <Input
                    id="queijoWhite"
                    type="number"
                    placeholder="Ex: -21"
                    value={deviationsData.queijoWhite}
                    onChange={(e) => setDeviationsData({ ...deviationsData, queijoWhite: e.target.value })}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDeviationsData({
                  paoReg: "",
                  carneReg: "",
                  carneRoyal: "",
                  chkOpt: "",
                  chkNuggets: "",
                  baconFatias: "",
                  compal: "",
                  queijoCheddar: "",
                  queijoWhite: "",
                })}>
                  Limpar
                </Button>
                <Button type="submit">Salvar Desvios</Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="yields">
            <form onSubmit={handleYieldsSubmit} className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Rendimentos de produtos. Valores positivos ou negativos indicam variação do rendimento esperado.
              </p>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <Label htmlFor="batata">Batata</Label>
                  <Input
                    id="batata"
                    type="number"
                    step="0.01"
                    placeholder="Ex: 40.3"
                    value={yieldsData.batata}
                    onChange={(e) => setYieldsData({ ...yieldsData, batata: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="alfaceL6">Alface L6</Label>
                  <Input
                    id="alfaceL6"
                    type="number"
                    step="0.01"
                    placeholder="Ex: 92.41"
                    value={yieldsData.alfaceL6}
                    onChange={(e) => setYieldsData({ ...yieldsData, alfaceL6: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="sopas">Sopas</Label>
                  <Input
                    id="sopas"
                    type="number"
                    step="0.01"
                    placeholder="Ex: -42.523"
                    value={yieldsData.sopas}
                    onChange={(e) => setYieldsData({ ...yieldsData, sopas: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="cobChocolate">Cob Chocolate</Label>
                  <Input
                    id="cobChocolate"
                    type="number"
                    step="0.01"
                    placeholder="Ex: 7.9"
                    value={yieldsData.cobChocolate}
                    onChange={(e) => setYieldsData({ ...yieldsData, cobChocolate: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="cobCaramelo">Cob Caramelo</Label>
                  <Input
                    id="cobCaramelo"
                    type="number"
                    step="0.01"
                    placeholder="Ex: 7.9"
                    value={yieldsData.cobCaramelo}
                    onChange={(e) => setYieldsData({ ...yieldsData, cobCaramelo: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="cobMorango">Cob Morango</Label>
                  <Input
                    id="cobMorango"
                    type="number"
                    step="0.01"
                    placeholder="Ex: -8.2"
                    value={yieldsData.cobMorango}
                    onChange={(e) => setYieldsData({ ...yieldsData, cobMorango: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="cobSnickers">Cob Snickers</Label>
                  <Input
                    id="cobSnickers"
                    type="number"
                    step="0.01"
                    placeholder="Ex: 4.7"
                    value={yieldsData.cobSnickers}
                    onChange={(e) => setYieldsData({ ...yieldsData, cobSnickers: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="cobMars">Cob Mars</Label>
                  <Input
                    id="cobMars"
                    type="number"
                    step="0.01"
                    placeholder="Ex: -11.7"
                    value={yieldsData.cobMars}
                    onChange={(e) => setYieldsData({ ...yieldsData, cobMars: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="leiteSundae">Leite Sundae</Label>
                  <Input
                    id="leiteSundae"
                    type="number"
                    step="0.01"
                    placeholder="Ex: -31.01"
                    value={yieldsData.leiteSundae}
                    onChange={(e) => setYieldsData({ ...yieldsData, leiteSundae: e.target.value })}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setYieldsData({
                  batata: "",
                  alfaceL6: "",
                  sopas: "",
                  cobChocolate: "",
                  cobCaramelo: "",
                  cobMorango: "",
                  cobSnickers: "",
                  cobMars: "",
                  leiteSundae: "",
                })}>
                  Limpar
                </Button>
                <Button type="submit">Salvar Rendimentos</Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
