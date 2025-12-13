import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const locations = ["20", "32"];

// Schemas de Validação
const costsSchema = z.object({
  comida: z.coerce.number({ invalid_type_error: "Deve ser um número" }).min(0, "Deve ser positivo"),
  papel: z.coerce.number({ invalid_type_error: "Deve ser um número" }).min(0, "Deve ser positivo"),
  refeicoes: z.coerce.number({ invalid_type_error: "Deve ser um número" }).min(0, "Deve ser positivo"),
  perdas: z.coerce.number({ invalid_type_error: "Deve ser um número" }).min(0, "Deve ser positivo"),
  promos: z.coerce.number({ invalid_type_error: "Deve ser um número" }).min(0, "Deve ser positivo"),
});

const deviationsSchema = z.object({
  paoReg: z.coerce.number({ invalid_type_error: "Deve ser um número" }).int("Deve ser inteiro"),
  carneReg: z.coerce.number({ invalid_type_error: "Deve ser um número" }).int("Deve ser inteiro"),
  carneRoyal: z.coerce.number({ invalid_type_error: "Deve ser um número" }).int("Deve ser inteiro"),
  chkOpt: z.coerce.number({ invalid_type_error: "Deve ser um número" }).int("Deve ser inteiro"),
  chkNuggets: z.coerce.number({ invalid_type_error: "Deve ser um número" }).int("Deve ser inteiro"),
  baconFatias: z.coerce.number({ invalid_type_error: "Deve ser um número" }).int("Deve ser inteiro"),
  compal: z.coerce.number({ invalid_type_error: "Deve ser um número" }).int("Deve ser inteiro"),
  queijoCheddar: z.coerce.number({ invalid_type_error: "Deve ser um número" }).int("Deve ser inteiro"),
  queijoWhite: z.coerce.number({ invalid_type_error: "Deve ser um número" }).int("Deve ser inteiro"),
});

const yieldsSchema = z.object({
  batata: z.coerce.number({ invalid_type_error: "Deve ser um número" }),
  alfaceL6: z.coerce.number({ invalid_type_error: "Deve ser um número" }),
  sopas: z.coerce.number({ invalid_type_error: "Deve ser um número" }),
  cobChocolate: z.coerce.number({ invalid_type_error: "Deve ser um número" }),
  cobCaramelo: z.coerce.number({ invalid_type_error: "Deve ser um número" }),
  cobMorango: z.coerce.number({ invalid_type_error: "Deve ser um número" }),
  cobSnickers: z.coerce.number({ invalid_type_error: "Deve ser um número" }),
  cobMars: z.coerce.number({ invalid_type_error: "Deve ser um número" }),
  leiteSundae: z.coerce.number({ invalid_type_error: "Deve ser um número" }),
});

type CostsValues = z.infer<typeof costsSchema>;
type DeviationsValues = z.infer<typeof deviationsSchema>;
type YieldsValues = z.infer<typeof yieldsSchema>;

export function ProductDataForm() {
  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);

  // Forms
  const costsForm = useForm<CostsValues>({
    resolver: zodResolver(costsSchema),
    defaultValues: {
      comida: 0,
      papel: 0,
      refeicoes: 0,
      perdas: 0,
      promos: 0,
    },
  });

  const deviationsForm = useForm<DeviationsValues>({
    resolver: zodResolver(deviationsSchema),
    defaultValues: {
      paoReg: 0,
      carneReg: 0,
      carneRoyal: 0,
      chkOpt: 0,
      chkNuggets: 0,
      baconFatias: 0,
      compal: 0,
      queijoCheddar: 0,
      queijoWhite: 0,
    },
  });

  const yieldsForm = useForm<YieldsValues>({
    resolver: zodResolver(yieldsSchema),
    defaultValues: {
      batata: 0,
      alfaceL6: 0,
      sopas: 0,
      cobChocolate: 0,
      cobCaramelo: 0,
      cobMorango: 0,
      cobSnickers: 0,
      cobMars: 0,
      leiteSundae: 0,
    },
  });

  // Handlers
  const onCostsSubmit = (data: CostsValues) => {
    console.log("Custos:", { month: selectedMonth, location: selectedLocation, ...data });
    toast.success("Dados de custos salvos com sucesso!");
  };

  const onDeviationsSubmit = (data: DeviationsValues) => {
    console.log("Desvios:", { month: selectedMonth, location: selectedLocation, ...data });
    toast.success("Dados de desvios salvos com sucesso!");
  };

  const onYieldsSubmit = (data: YieldsValues) => {
    console.log("Rendimentos:", { month: selectedMonth, location: selectedLocation, ...data });
    toast.success("Dados de rendimentos salvos com sucesso!");
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
            <Form {...costsForm}>
              <form onSubmit={costsForm.handleSubmit(onCostsSubmit)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={costsForm.control}
                    name="comida"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comida (%)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="Ex: 26.78" {...field} />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">Objetivo: ~26-27%</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={costsForm.control}
                    name="papel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Papel (%)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="Ex: 1.52" {...field} />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">Objetivo: ~1.5-3%</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={costsForm.control}
                    name="refeicoes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Refeições (%)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="Ex: 0.85" {...field} />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">Objetivo: 0.7-0.8%</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={costsForm.control}
                    name="perdas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Perdas (%)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="Ex: 0.86" {...field} />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">Objetivo: 0.5%</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={costsForm.control}
                    name="promos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Promos (%)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="Ex: 0.49" {...field} />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">Variável por promoções</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => costsForm.reset()}>
                    Limpar
                  </Button>
                  <Button type="submit">Salvar Custos</Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="deviations">
            <Form {...deviationsForm}>
              <form onSubmit={deviationsForm.handleSubmit(onDeviationsSubmit)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Object.keys(deviationsSchema.shape).map((key) => (
                    <FormField
                      key={key}
                      control={deviationsForm.control}
                      name={key as keyof DeviationsValues}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()} (un)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Ex: -10" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => deviationsForm.reset()}>
                    Limpar
                  </Button>
                  <Button type="submit">Salvar Desvios</Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="yields">
            <Form {...yieldsForm}>
              <form onSubmit={yieldsForm.handleSubmit(onYieldsSubmit)} className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Rendimentos de produtos. Valores positivos ou negativos indicam variação do rendimento esperado.
                </p>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Object.keys(yieldsSchema.shape).map((key) => (
                    <FormField
                      key={key}
                      control={yieldsForm.control}
                      name={key as keyof YieldsValues}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="Ex: 40.3" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => yieldsForm.reset()}>
                    Limpar
                  </Button>
                  <Button type="submit">Salvar Rendimentos</Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
