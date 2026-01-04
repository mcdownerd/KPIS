import { useState, useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Save, Clock, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  upsertServiceTimeMetricsForStore, getServiceTimeMetrics,
  upsertQualityMetrics, getQualityMetrics, upsertQualityMetricsForStore
} from "@/lib/api/service";
import { DigitalCommDashboard } from "../dashboard/DigitalCommDashboard";
import { GoogleRatingsDashboard } from "../dashboard/GoogleRatingsDashboard";
import { FastinsightDashboard } from "../dashboard/FastinsightDashboard";
import { ComplaintsRatioTable } from "../dashboard/ComplaintsRatioTable";
import { useQualityData } from "@/hooks/useQualityData";
import { Zap } from "lucide-react";
import { SalesDashboard } from "../dashboard/SalesDashboard";
import { SalesEvolutionTable } from "../dashboard/SalesEvolutionTable";
import { GCEvolutionTable } from "../dashboard/GCEvolutionTable";

interface ServiceTimeData {
  almocoTempo: string;
  almocoVar: string;
  almocoRank: string;
  jantarTempo: string;
  jantarVar: string;
  jantarRank: string;
  diaTempo: string;
  diaVar: string;
  diaRank: string;
  deliveryTempo: string;
  deliveryVar: string;
  deliveryRank: string;
}

const initialServiceTime: ServiceTimeData = {
  almocoTempo: "",
  almocoVar: "",
  almocoRank: "",
  jantarTempo: "",
  jantarVar: "",
  jantarRank: "",
  diaTempo: "",
  diaVar: "",
  diaRank: "",
  deliveryTempo: "",
  deliveryVar: "",
  deliveryRank: ""
};

interface QualityData {
  month: string;
  store: string;
  sg: string;
  precisao: string;
  qualidade: string;
  rapidez: string;
  nps: string;
}




const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const stores = ["Amadora (20)", "Queluz (32)", "P.Borges"];


export function ServiceDataForm() {
  const { profile } = useAuth();

  // Auto-select current month
  const getCurrentMonth = () => {
    const monthNames = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    return monthNames[new Date().getMonth()];
  };

  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth());
  const [amadoraServiceData, setAmadoraServiceData] = useState<ServiceTimeData>(initialServiceTime);
  const [queluzServiceData, setQueluzServiceData] = useState<ServiceTimeData>(initialServiceTime);
  const [amadoraStatus, setAmadoraStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [queluzStatus, setQueluzStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  const [amadoraYTD, setAmadoraYTD] = useState<ServiceTimeData>(initialServiceTime);
  const [queluzYTD, setQueluzYTD] = useState<ServiceTimeData>(initialServiceTime);

  // Other states

  const { qualityData: allQualityData, refetch: refetchQuality } = useQualityData(selectedMonth);




  const storeMapping: Record<string, string> = {
    "Amadora (20)": "f86b0b1f-05d0-4310-a655-a92ca1ab68bf",
    "Queluz (32)": "fcf80b5a-b658-48f3-871c-ac62120c5a78",
    "P.Borges": "pborges" // TODO: Add correct UUID for P.Borges
  };


  // Calculate YTD Data
  useEffect(() => {
    async function calculateYTD() {
      const monthsList = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
      const currentMonthIndex = new Date().getMonth();
      // Fetch data for all months up to current
      // Optimization: In a real app, this should be a single aggregation query.
      // Here we will fetch all and average client-side as per previous plan.

      const amadoraId = storeMapping["Amadora (20)"];
      const queluzId = storeMapping["Queluz (32)"];

      const fetchStoreYTD = async (storeId: string) => {
        let lunchSum = 0, lunchCount = 0;
        let dinnerSum = 0, dinnerCount = 0;
        let daySum = 0, dayCount = 0;
        let deliverySum = 0, deliveryCount = 0;

        // Fetch all months
        const promises = monthsList.map(m => getServiceTimeMetrics(m, storeId));
        const results = await Promise.all(promises);

        results.forEach(data => {
          if (data) {
            if (data.almoco_tempo) { lunchSum += Number(data.almoco_tempo); lunchCount++; }
            if (data.jantar_tempo) { dinnerSum += Number(data.jantar_tempo); dinnerCount++; }
            if (data.dia_tempo) { daySum += Number(data.dia_tempo); dayCount++; }
            if (data.delivery_tempo) { deliverySum += Number(data.delivery_tempo); deliveryCount++; }
          }
        });

        return {
          almocoTempo: lunchCount ? Math.round(lunchSum / lunchCount).toString() : "",
          almocoVar: "0", // Placeholder
          almocoRank: "0", // Placeholder
          jantarTempo: dinnerCount ? Math.round(dinnerSum / dinnerCount).toString() : "",
          jantarVar: "0",
          jantarRank: "0",
          diaTempo: dayCount ? Math.round(daySum / dayCount).toString() : "",
          diaVar: "0",
          diaRank: "0",
          deliveryTempo: deliveryCount ? Math.round(deliverySum / deliveryCount).toString() : "",
          deliveryVar: "0",
          deliveryRank: "0"
        };
      };

      const amadoraData = await fetchStoreYTD(amadoraId);
      setAmadoraYTD(amadoraData);

      const queluzData = await fetchStoreYTD(queluzId);
      setQueluzYTD(queluzData);
    }

    calculateYTD();

    calculateYTD();
  }, [selectedMonth]); // Recalculate when month changes (or could be just on mount/save)









  const renderStatusIndicator = (status: 'saved' | 'saving' | 'error') => {
    switch (status) {
      case 'saving':
        return <span className="flex items-center text-xs text-yellow-500"><Loader2 className="mr-1 h-3 w-3 animate-spin" /> Salvando...</span>;
      case 'saved':
        return <span className="flex items-center text-xs text-green-500"><CheckCircle className="mr-1 h-3 w-3" /> Salvo</span>;
      case 'error':
        return <span className="flex items-center text-xs text-red-500"><AlertCircle className="mr-1 h-3 w-3" /> Erro</span>;
    }
  };


  const renderStoreCard = (storeName: "Amadora (20)" | "Queluz (32)", data: ServiceTimeData, setData: React.Dispatch<React.SetStateAction<ServiceTimeData>>, status: 'saved' | 'saving' | 'error') => (
    <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
      <CardHeader className="pb-2 pt-3 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-bold text-white">
            <Clock className="h-3.5 w-3.5 text-primary" />
            {storeName}
          </CardTitle>
          {renderStatusIndicator(status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4">
        {/* Almoço */}
        <div className="space-y-1">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Almoço</h3>
          <div className="grid gap-2 grid-cols-3">
            <div className="space-y-0.5">
              <Label className="text-[9px] text-zinc-500">Tempo</Label>
              <Input
                type="number"
                className="h-7 text-[10px] bg-zinc-900/50 border-zinc-700 focus:border-primary focus:ring-primary text-white px-2"
                value={data.almocoTempo}
                onChange={(e) => setData({ ...data, almocoTempo: e.target.value })}
              />
            </div>
            <div className="space-y-0.5">
              <Label className="text-[9px] text-zinc-500">Var</Label>
              <Input
                type="number"
                className="h-7 text-[10px] bg-zinc-900/50 border-zinc-700 focus:border-primary focus:ring-primary text-white px-2"
                value={data.almocoVar}
                onChange={(e) => setData({ ...data, almocoVar: e.target.value })}
              />
            </div>
            <div className="space-y-0.5">
              <Label className="text-[9px] text-zinc-500">Rank</Label>
              <Input
                type="number"
                className="h-7 text-[10px] bg-zinc-900/50 border-zinc-700 focus:border-primary focus:ring-primary text-white px-2"
                value={data.almocoRank}
                onChange={(e) => setData({ ...data, almocoRank: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Jantar */}
        <div className="space-y-1">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Jantar</h3>
          <div className="grid gap-2 grid-cols-3">
            <div className="space-y-0.5">
              <Label className="text-[9px] text-zinc-500">Tempo</Label>
              <Input
                type="number"
                className="h-7 text-[10px] bg-zinc-900/50 border-zinc-800 focus:border-primary focus:ring-primary text-white px-2"
                value={data.jantarTempo}
                onChange={(e) => setData({ ...data, jantarTempo: e.target.value })}
              />
            </div>
            <div className="space-y-0.5">
              <Label className="text-[9px] text-zinc-500">Var</Label>
              <Input
                type="number"
                className="h-7 text-[10px] bg-zinc-900/50 border-zinc-800 focus:border-primary focus:ring-primary text-white px-2"
                value={data.jantarVar}
                onChange={(e) => setData({ ...data, jantarVar: e.target.value })}
              />
            </div>
            <div className="space-y-0.5">
              <Label className="text-[9px] text-zinc-500">Rank</Label>
              <Input
                type="number"
                className="h-7 text-[10px] bg-zinc-900/50 border-zinc-800 focus:border-primary focus:ring-primary text-white px-2"
                value={data.jantarRank}
                onChange={(e) => setData({ ...data, jantarRank: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Dia */}
        <div className="space-y-1">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Dia</h3>
          <div className="grid gap-2 grid-cols-3">
            <div className="space-y-0.5">
              <Label className="text-[9px] text-zinc-500">Tempo</Label>
              <Input
                type="number"
                className="h-7 text-[10px] bg-zinc-900/50 border-zinc-800 focus:border-primary focus:ring-primary text-white px-2"
                value={data.diaTempo}
                onChange={(e) => setData({ ...data, diaTempo: e.target.value })}
              />
            </div>
            <div className="space-y-0.5">
              <Label className="text-[9px] text-zinc-500">Var</Label>
              <Input
                type="number"
                className="h-7 text-[10px] bg-zinc-900/50 border-zinc-800 focus:border-primary focus:ring-primary text-white px-2"
                value={data.diaVar}
                onChange={(e) => setData({ ...data, diaVar: e.target.value })}
              />
            </div>
            <div className="space-y-0.5">
              <Label className="text-[9px] text-zinc-500">Rank</Label>
              <Input
                type="number"
                className="h-7 text-[10px] bg-zinc-900/50 border-zinc-800 focus:border-primary focus:ring-primary text-white px-2"
                value={data.diaRank}
                onChange={(e) => setData({ ...data, diaRank: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Delivery */}
        <div className="space-y-1">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Delivery</h3>
          <div className="grid gap-2 grid-cols-3">
            <div className="space-y-0.5">
              <Label className="text-[9px] text-zinc-500">Tempo</Label>
              <Input
                type="number"
                className="h-7 text-[10px] bg-zinc-900/50 border-zinc-800 focus:border-primary focus:ring-primary text-white px-2"
                value={data.deliveryTempo}
                onChange={(e) => setData({ ...data, deliveryTempo: e.target.value })}
              />
            </div>
            <div className="space-y-0.5">
              <Label className="text-[9px] text-zinc-500">Var</Label>
              <Input
                type="number"
                className="h-7 text-[10px] bg-zinc-900/50 border-zinc-800 focus:border-primary focus:ring-primary text-white px-2"
                value={data.deliveryVar}
                onChange={(e) => setData({ ...data, deliveryVar: e.target.value })}
              />
            </div>
            <div className="space-y-0.5">
              <Label className="text-[9px] text-zinc-500">Rank</Label>
              <Input
                type="number"
                className="h-7 text-[10px] bg-zinc-900/50 border-zinc-800 focus:border-primary focus:ring-primary text-white px-2"
                value={data.deliveryRank}
                onChange={(e) => setData({ ...data, deliveryRank: e.target.value })}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );


  return (
    <div className="space-y-6">
      <Tabs defaultValue="servicetimes" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 bg-zinc-900/50 border border-zinc-800">
          <TabsTrigger value="servicetimes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Clock className="h-4 w-4 mr-2" />
            Tempos de Serviço
          </TabsTrigger>
          <TabsTrigger value="digital" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <TrendingUp className="h-4 w-4 mr-2" />
            Digital
          </TabsTrigger>


          <TabsTrigger value="sales" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <TrendingUp className="h-4 w-4 mr-2" />
            Vendas
          </TabsTrigger>
        </TabsList>


        <TabsContent value="servicetimes" className="mt-2 space-y-2">
          {/* Header and Month Selector */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 bg-zinc-950/50 p-2 rounded-lg border border-zinc-800">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="h-6 w-6 text-primary" />
                Tempos de Serviço
              </h2>
              <p className="text-sm text-zinc-500">Insira os tempos de serviço para cada período (em segundos)</p>
            </div>

            <div className="flex items-center gap-3 min-w-[200px]">
              <Label htmlFor="global-month" className="text-white font-medium">Mês:</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger id="global-month" className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectValue placeholder="Selecione o mês" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Monthly Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {renderStoreCard("Amadora (20)", amadoraServiceData, setAmadoraServiceData, amadoraStatus)}
            {renderStoreCard("Queluz (32)", queluzServiceData, setQueluzServiceData, queluzStatus)}
          </div>

          {/* YTD Section */}
          <div className="space-y-2 pt-4 border-t border-zinc-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              YTD (Year to Date)
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {renderStoreCard("Amadora (20)", amadoraYTD, setAmadoraYTD, 'saved')}
              {renderStoreCard("Queluz (32)", queluzYTD, setQueluzYTD, 'saved')}
            </div>
          </div>
        </TabsContent>




        <TabsContent value="digital" className="mt-2 space-y-2">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 bg-zinc-950/50 p-3 rounded-lg border border-zinc-800">
            <div className="space-y-0.5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Comunicação Digital
              </h2>
              <p className="text-xs text-zinc-500">Métricas de avaliação e MLovers</p>
            </div>
          </div>



          <div className="mt-6 space-y-4">




            <div className="mt-4">
              <FastinsightDashboard
                data={allQualityData}
                selectedMonth={selectedMonth}
                onDataChange={refetchQuality}
              />

              <ComplaintsRatioTable selectedMonth={selectedMonth} />
            </div>
          </div>

          <div className="mt-6">
            <DigitalCommDashboard />
          </div>
        </TabsContent>



        <TabsContent value="sales" className="mt-2 space-y-2">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 bg-zinc-950/50 p-3 rounded-lg border border-zinc-800">
            <div className="space-y-0.5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Vendas
              </h2>
              <p className="text-xs text-zinc-500">Visualização de métricas de vendas</p>
            </div>
          </div>


          <SalesDashboard />
          <SalesEvolutionTable />
          <GCEvolutionTable />
        </TabsContent>
      </Tabs>
    </div >
  );
}
