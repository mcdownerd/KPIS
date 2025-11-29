import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Save, Clock, Star, MessageSquare, TrendingUp, Package } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  upsertServiceTimeMetrics, getServiceTimeMetrics,
  upsertQualityMetrics, getQualityMetrics,
  upsertComplaintsMetrics, getComplaintsMetrics,
  upsertDigitalCommMetrics, getDigitalCommMetrics,
  upsertUberMetrics, getUberMetrics,
  upsertSalesSummaryMetrics, getSalesSummaryMetrics
} from "@/lib/api/service";

interface ServiceTimeData {
  month: string;
  store: string;
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

interface QualityData {
  month: string;
  store: string;
  sg: string;
  precisao: string;
  qualidade: string;
  rapidez: string;
  nps: string;
}

interface ComplaintsData {
  month: string;
  store: string;
  qualidadeSala: string;
  qualidadeDelivery: string;
  servicoSala: string;
  servicoDelivery: string;
  limpezaSala: string;
  limpezaDelivery: string;
}

interface DigitalCommData {
  month: string;
  store: string;
  googleRating: string;
  uberRating: string;
  deliveryRating: string;
}

interface UberMetricsData {
  month: string;
  store: string;
  estrelas: string;
  tempos: string;
  inexatidao: string;
  avaProduto: string;
  tempoTotal: string;
}

interface SalesData {
  month: string;
  store: string;
  totais: string;
  delivery: string;
  percentDelivery: string;
  sala: string;
  mop: string;
  percentMop: string;
}

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const stores = ["Amadora (20)", "Queluz (32)", "P.Borges"];

export function ServiceDataForm() {
  const { profile } = useAuth();
  const [serviceTimeData, setServiceTimeData] = useState<ServiceTimeData>({
    month: "",
    store: "",
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
  });

  const [qualityData, setQualityData] = useState<QualityData>({
    month: "",
    store: "",
    sg: "",
    precisao: "",
    qualidade: "",
    rapidez: "",
    nps: ""
  });

  const [complaintsData, setComplaintsData] = useState<ComplaintsData>({
    month: "",
    store: "",
    qualidadeSala: "",
    qualidadeDelivery: "",
    servicoSala: "",
    servicoDelivery: "",
    limpezaSala: "",
    limpezaDelivery: ""
  });

  const [digitalCommData, setDigitalCommData] = useState<DigitalCommData>({
    month: "",
    store: "",
    googleRating: "",
    uberRating: "",
    deliveryRating: ""
  });

  const [uberMetricsData, setUberMetricsData] = useState<UberMetricsData>({
    month: "",
    store: "",
    estrelas: "",
    tempos: "",
    inexatidao: "",
    avaProduto: "",
    tempoTotal: ""
  });

  const [salesData, setSalesData] = useState<SalesData>({
    month: "",
    store: "",
    totais: "",
    delivery: "",
    percentDelivery: "",
    sala: "",
    mop: "",
    percentMop: ""
  });

  // Store mapping for UUIDs
  const storeMapping: Record<string, string> = {
    "Amadora (20)": "f86b0b1f-05d0-4310-a655-a92ca1ab68bf",
    "Queluz (32)": "fcf80b5a-b658-48f3-871c-ac62120c5a78"
  };

  // Auto-fill store and current month
  useEffect(() => {
    const currentMonthIndex = new Date().getMonth();
    const currentMonthName = months[currentMonthIndex];

    let storeName = "";
    if (profile?.store_id) {
      if (profile.store_id === 'fcf80b5a-b658-48f3-871c-ac62120c5a78') storeName = "Queluz (32)";
      else if (profile.store_id === 'f86b0b1f-05d0-4310-a655-a92ca1ab68bf') storeName = "Amadora (20)";
    }

    // Update all form states with current month and store
    if (storeName) {
      setServiceTimeData(prev => ({ ...prev, month: currentMonthName, store: storeName }));
      setQualityData(prev => ({ ...prev, month: currentMonthName, store: storeName }));
      setComplaintsData(prev => ({ ...prev, month: currentMonthName, store: storeName }));
      setDigitalCommData(prev => ({ ...prev, month: currentMonthName, store: storeName }));
      setUberMetricsData(prev => ({ ...prev, month: currentMonthName, store: storeName }));
      setSalesData(prev => ({ ...prev, month: currentMonthName, store: storeName }));
    } else {
      // If no profile yet, just set the month
      setServiceTimeData(prev => ({ ...prev, month: currentMonthName }));
      setQualityData(prev => ({ ...prev, month: currentMonthName }));
      setComplaintsData(prev => ({ ...prev, month: currentMonthName }));
      setDigitalCommData(prev => ({ ...prev, month: currentMonthName }));
      setUberMetricsData(prev => ({ ...prev, month: currentMonthName }));
      setSalesData(prev => ({ ...prev, month: currentMonthName }));
    }
  }, [profile]);

  // Fetch Service Time Data
  useEffect(() => {
    async function loadData() {
      if (serviceTimeData.month && serviceTimeData.store) {
        const storeId = storeMapping[serviceTimeData.store];
        if (storeId) {
          try {
            const data = await getServiceTimeMetrics(serviceTimeData.month, storeId);
            if (data) {
              setServiceTimeData(prev => ({
                ...prev,
                almocoTempo: data.almoco_tempo?.toString() || "",
                almocoVar: data.almoco_var?.toString() || "",
                almocoRank: data.almoco_rank?.toString() || "",
                jantarTempo: data.jantar_tempo?.toString() || "",
                jantarVar: data.jantar_var?.toString() || "",
                jantarRank: data.jantar_rank?.toString() || "",
                diaTempo: data.dia_tempo?.toString() || "",
                diaVar: data.dia_var?.toString() || "",
                diaRank: data.dia_rank?.toString() || "",
                deliveryTempo: data.delivery_tempo?.toString() || "",
                deliveryVar: data.delivery_var?.toString() || "",
                deliveryRank: data.delivery_rank?.toString() || ""
              }));
            } else {
              // Clear fields if no data found
              setServiceTimeData(prev => ({
                ...prev,
                almocoTempo: "", almocoVar: "", almocoRank: "",
                jantarTempo: "", jantarVar: "", jantarRank: "",
                diaTempo: "", diaVar: "", diaRank: "",
                deliveryTempo: "", deliveryVar: "", deliveryRank: ""
              }));
            }
          } catch (error) {
            console.error("Error loading service time data:", error);
          }
        }
      }
    }
    loadData();
  }, [serviceTimeData.month, serviceTimeData.store]);

  // Fetch Quality Data
  useEffect(() => {
    async function loadData() {
      if (qualityData.month && qualityData.store) {
        const storeId = storeMapping[qualityData.store];
        if (storeId) {
          try {
            const data = await getQualityMetrics(qualityData.month, storeId);
            if (data) {
              setQualityData(prev => ({
                ...prev,
                sg: data.sg?.toString() || "",
                precisao: data.precisao?.toString() || "",
                qualidade: data.qualidade?.toString() || "",
                rapidez: data.rapidez?.toString() || "",
                nps: data.nps?.toString() || ""
              }));
            } else {
              setQualityData(prev => ({
                ...prev,
                sg: "", precisao: "", qualidade: "", rapidez: "", nps: ""
              }));
            }
          } catch (error) {
            console.error("Error loading quality data:", error);
          }
        }
      }
    }
    loadData();
  }, [qualityData.month, qualityData.store]);

  // Fetch Complaints Data
  useEffect(() => {
    async function loadData() {
      if (complaintsData.month && complaintsData.store) {
        const storeId = storeMapping[complaintsData.store];
        if (storeId) {
          try {
            const data = await getComplaintsMetrics(complaintsData.month, storeId);
            if (data) {
              setComplaintsData(prev => ({
                ...prev,
                qualidadeSala: data.qualidade_sala?.toString() || "",
                qualidadeDelivery: data.qualidade_delivery?.toString() || "",
                servicoSala: data.servico_sala?.toString() || "",
                servicoDelivery: data.servico_delivery?.toString() || "",
                limpezaSala: data.limpeza_sala?.toString() || "",
                limpezaDelivery: data.limpeza_delivery?.toString() || ""
              }));
            } else {
              setComplaintsData(prev => ({
                ...prev,
                qualidadeSala: "", qualidadeDelivery: "",
                servicoSala: "", servicoDelivery: "",
                limpezaSala: "", limpezaDelivery: ""
              }));
            }
          } catch (error) {
            console.error("Error loading complaints data:", error);
          }
        }
      }
    }
    loadData();
  }, [complaintsData.month, complaintsData.store]);

  // Fetch Digital Comm Data
  useEffect(() => {
    async function loadData() {
      if (digitalCommData.month && digitalCommData.store) {
        const storeId = storeMapping[digitalCommData.store];
        if (storeId) {
          try {
            const data = await getDigitalCommMetrics(digitalCommData.month, storeId);
            if (data) {
              setDigitalCommData(prev => ({
                ...prev,
                googleRating: data.google_rating?.toString() || "",
                uberRating: data.uber_rating?.toString() || "",
                deliveryRating: data.delivery_rating?.toString() || ""
              }));
            } else {
              setDigitalCommData(prev => ({
                ...prev,
                googleRating: "", uberRating: "", deliveryRating: ""
              }));
            }
          } catch (error) {
            console.error("Error loading digital comm data:", error);
          }
        }
      }
    }
    loadData();
  }, [digitalCommData.month, digitalCommData.store]);

  // Fetch Uber Metrics Data
  useEffect(() => {
    async function loadData() {
      if (uberMetricsData.month && uberMetricsData.store) {
        const storeId = storeMapping[uberMetricsData.store];
        if (storeId) {
          try {
            const data = await getUberMetrics(uberMetricsData.month, storeId);
            if (data) {
              setUberMetricsData(prev => ({
                ...prev,
                estrelas: data.estrelas?.toString() || "",
                tempos: data.tempos?.toString() || "",
                inexatidao: data.inexatidao?.toString() || "",
                avaProduto: data.ava_produto?.toString() || "",
                tempoTotal: data.tempo_total?.toString() || ""
              }));
            } else {
              setUberMetricsData(prev => ({
                ...prev,
                estrelas: "", tempos: "", inexatidao: "", avaProduto: "", tempoTotal: ""
              }));
            }
          } catch (error) {
            console.error("Error loading uber metrics data:", error);
          }
        }
      }
    }
    loadData();
  }, [uberMetricsData.month, uberMetricsData.store]);

  // Fetch Sales Data
  useEffect(() => {
    async function loadData() {
      if (salesData.month && salesData.store) {
        const storeId = storeMapping[salesData.store];
        if (storeId) {
          try {
            const data = await getSalesSummaryMetrics(salesData.month, storeId);
            if (data) {
              setSalesData(prev => ({
                ...prev,
                totais: data.totais?.toString() || "",
                delivery: data.delivery?.toString() || "",
                percentDelivery: data.percent_delivery?.toString() || "",
                sala: data.sala?.toString() || "",
                mop: data.mop?.toString() || "",
                percentMop: data.percent_mop?.toString() || ""
              }));
            } else {
              setSalesData(prev => ({
                ...prev,
                totais: "", delivery: "", percentDelivery: "",
                sala: "", mop: "", percentMop: ""
              }));
            }
          } catch (error) {
            console.error("Error loading sales data:", error);
          }
        }
      }
    }
    loadData();
  }, [salesData.month, salesData.store]);


  const handleServiceTimeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const monthIndex = months.indexOf(serviceTimeData.month);
      const year = new Date().getFullYear();
      const recordDate = new Date(year, monthIndex, 1).toISOString().split('T')[0];

      await upsertServiceTimeMetrics({
        month_name: serviceTimeData.month,
        record_date: recordDate,
        almoco_tempo: parseInt(serviceTimeData.almocoTempo) || 0,
        almoco_var: parseInt(serviceTimeData.almocoVar) || 0,
        almoco_rank: parseInt(serviceTimeData.almocoRank) || 0,
        jantar_tempo: parseInt(serviceTimeData.jantarTempo) || 0,
        jantar_var: parseInt(serviceTimeData.jantarVar) || 0,
        jantar_rank: parseInt(serviceTimeData.jantarRank) || 0,
        dia_tempo: parseInt(serviceTimeData.diaTempo) || 0,
        dia_var: parseInt(serviceTimeData.diaVar) || 0,
        dia_rank: parseInt(serviceTimeData.diaRank) || 0,
        delivery_tempo: parseInt(serviceTimeData.deliveryTempo) || 0,
        delivery_var: parseInt(serviceTimeData.deliveryVar) || 0,
        delivery_rank: parseInt(serviceTimeData.deliveryRank) || 0
      });

      toast.success("Dados de tempos de serviço salvos com sucesso!");
      // No reset needed as we want to keep the data visible
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar dados de tempos de serviço.");
    }
  };

  const handleQualitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const monthIndex = months.indexOf(qualityData.month);
      const year = new Date().getFullYear();
      const recordDate = new Date(year, monthIndex, 1).toISOString().split('T')[0];

      await upsertQualityMetrics({
        month_name: qualityData.month,
        record_date: recordDate,
        sg: parseFloat(qualityData.sg) || 0,
        precisao: parseFloat(qualityData.precisao) || 0,
        qualidade: parseFloat(qualityData.qualidade) || 0,
        rapidez: parseFloat(qualityData.rapidez) || 0,
        nps: parseFloat(qualityData.nps) || 0
      });

      toast.success("Dados de qualidade salvos com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar dados de qualidade.");
    }
  };

  const handleComplaintsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const monthIndex = months.indexOf(complaintsData.month);
      const year = new Date().getFullYear();
      const recordDate = new Date(year, monthIndex, 1).toISOString().split('T')[0];

      await upsertComplaintsMetrics({
        month_name: complaintsData.month,
        record_date: recordDate,
        qualidade_sala: parseInt(complaintsData.qualidadeSala) || 0,
        qualidade_delivery: parseInt(complaintsData.qualidadeDelivery) || 0,
        servico_sala: parseInt(complaintsData.servicoSala) || 0,
        servico_delivery: parseInt(complaintsData.servicoDelivery) || 0,
        limpeza_sala: parseInt(complaintsData.limpezaSala) || 0,
        limpeza_delivery: parseInt(complaintsData.limpezaDelivery) || 0
      });

      toast.success("Dados de reclamações salvos com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar dados de reclamações.");
    }
  };

  const handleDigitalCommSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const monthIndex = months.indexOf(digitalCommData.month);
      const year = new Date().getFullYear();
      const recordDate = new Date(year, monthIndex, 1).toISOString().split('T')[0];

      await upsertDigitalCommMetrics({
        month_name: digitalCommData.month,
        record_date: recordDate,
        google_rating: parseFloat(digitalCommData.googleRating) || 0,
        uber_rating: parseFloat(digitalCommData.uberRating) || 0,
        delivery_rating: parseFloat(digitalCommData.deliveryRating) || 0
      });

      toast.success("Dados de comunicação digital salvos com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar dados de comunicação digital.");
    }
  };

  const handleUberMetricsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const monthIndex = months.indexOf(uberMetricsData.month);
      const year = new Date().getFullYear();
      const recordDate = new Date(year, monthIndex, 1).toISOString().split('T')[0];

      await upsertUberMetrics({
        month_name: uberMetricsData.month,
        record_date: recordDate,
        estrelas: parseFloat(uberMetricsData.estrelas) || 0,
        tempos: parseInt(uberMetricsData.tempos) || 0,
        inexatidao: parseFloat(uberMetricsData.inexatidao) || 0,
        ava_produto: parseFloat(uberMetricsData.avaProduto) || 0,
        tempo_total: parseInt(uberMetricsData.tempoTotal) || 0
      });

      toast.success("Dados de métricas Uber salvos com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar dados de métricas Uber.");
    }
  };

  const handleSalesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const monthIndex = months.indexOf(salesData.month);
      const year = new Date().getFullYear();
      const recordDate = new Date(year, monthIndex, 1).toISOString().split('T')[0];

      await upsertSalesSummaryMetrics({
        month_name: salesData.month,
        record_date: recordDate,
        totais: parseFloat(salesData.totais) || 0,
        delivery: parseFloat(salesData.delivery) || 0,
        percent_delivery: parseFloat(salesData.percentDelivery) || 0,
        sala: parseFloat(salesData.sala) || 0,
        mop: parseFloat(salesData.mop) || 0,
        percent_mop: parseFloat(salesData.percentMop) || 0
      });

      toast.success("Dados de vendas por plataforma salvos com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar dados de vendas.");
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="servicetimes" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-secondary">
          <TabsTrigger value="servicetimes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Clock className="h-4 w-4 mr-2" />
            Tempos de Serviço
          </TabsTrigger>
          <TabsTrigger value="quality" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Star className="h-4 w-4 mr-2" />
            Qualidade
          </TabsTrigger>
          <TabsTrigger value="complaints" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <MessageSquare className="h-4 w-4 mr-2" />
            Reclamações
          </TabsTrigger>
          <TabsTrigger value="digital" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <TrendingUp className="h-4 w-4 mr-2" />
            Digital
          </TabsTrigger>
          <TabsTrigger value="uber" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Package className="h-4 w-4 mr-2" />
            Uber Métricas
          </TabsTrigger>
          <TabsTrigger value="sales" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <TrendingUp className="h-4 w-4 mr-2" />
            Vendas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="servicetimes" className="mt-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Tempos de Serviço
              </CardTitle>
              <CardDescription>
                Insira os tempos de serviço para cada período (em segundos)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleServiceTimeSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="servicetime-month">Mês</Label>
                    <Select
                      value={serviceTimeData.month}
                      onValueChange={(value) => setServiceTimeData({ ...serviceTimeData, month: value })}
                      required
                    >
                      <SelectTrigger id="servicetime-month">
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
                    <Label htmlFor="servicetime-store">Loja</Label>
                    <Select
                      value={serviceTimeData.store}
                      onValueChange={(value) => setServiceTimeData({ ...serviceTimeData, store: value })}
                      disabled={!!profile?.store_id}
                      required
                    >
                      <SelectTrigger id="servicetime-store">
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

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Almoço</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="almocoTempo">Tempo (seg)</Label>
                      <Input
                        id="almocoTempo"
                        type="number"
                        step="1"
                        placeholder="108"
                        value={serviceTimeData.almocoTempo}
                        onChange={(e) => setServiceTimeData({ ...serviceTimeData, almocoTempo: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="almocoVar">Variação</Label>
                      <Input
                        id="almocoVar"
                        type="number"
                        step="1"
                        placeholder="-5"
                        value={serviceTimeData.almocoVar}
                        onChange={(e) => setServiceTimeData({ ...serviceTimeData, almocoVar: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="almocoRank">Rank</Label>
                      <Input
                        id="almocoRank"
                        type="number"
                        step="1"
                        placeholder="6"
                        value={serviceTimeData.almocoRank}
                        onChange={(e) => setServiceTimeData({ ...serviceTimeData, almocoRank: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Jantar</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="jantarTempo">Tempo (seg)</Label>
                      <Input
                        id="jantarTempo"
                        type="number"
                        step="1"
                        placeholder="122"
                        value={serviceTimeData.jantarTempo}
                        onChange={(e) => setServiceTimeData({ ...serviceTimeData, jantarTempo: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jantarVar">Variação</Label>
                      <Input
                        id="jantarVar"
                        type="number"
                        step="1"
                        placeholder="-3"
                        value={serviceTimeData.jantarVar}
                        onChange={(e) => setServiceTimeData({ ...serviceTimeData, jantarVar: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jantarRank">Rank</Label>
                      <Input
                        id="jantarRank"
                        type="number"
                        step="1"
                        placeholder="21"
                        value={serviceTimeData.jantarRank}
                        onChange={(e) => setServiceTimeData({ ...serviceTimeData, jantarRank: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Dia</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="diaTempo">Tempo (seg)</Label>
                      <Input
                        id="diaTempo"
                        type="number"
                        step="1"
                        placeholder="132"
                        value={serviceTimeData.diaTempo}
                        onChange={(e) => setServiceTimeData({ ...serviceTimeData, diaTempo: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="diaVar">Variação</Label>
                      <Input
                        id="diaVar"
                        type="number"
                        step="1"
                        placeholder="-4"
                        value={serviceTimeData.diaVar}
                        onChange={(e) => setServiceTimeData({ ...serviceTimeData, diaVar: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="diaRank">Rank</Label>
                      <Input
                        id="diaRank"
                        type="number"
                        step="1"
                        placeholder="14"
                        value={serviceTimeData.diaRank}
                        onChange={(e) => setServiceTimeData({ ...serviceTimeData, diaRank: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Delivery</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="deliveryTempo">Tempo (seg)</Label>
                      <Input
                        id="deliveryTempo"
                        type="number"
                        step="1"
                        placeholder="81"
                        value={serviceTimeData.deliveryTempo}
                        onChange={(e) => setServiceTimeData({ ...serviceTimeData, deliveryTempo: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deliveryVar">Variação</Label>
                      <Input
                        id="deliveryVar"
                        type="number"
                        step="1"
                        placeholder="-2"
                        value={serviceTimeData.deliveryVar}
                        onChange={(e) => setServiceTimeData({ ...serviceTimeData, deliveryVar: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deliveryRank">Rank</Label>
                      <Input
                        id="deliveryRank"
                        type="number"
                        step="1"
                        placeholder="7"
                        value={serviceTimeData.deliveryRank}
                        onChange={(e) => setServiceTimeData({ ...serviceTimeData, deliveryRank: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full md:w-auto">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Tempos de Serviço
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="mt-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Qualidade do Serviço (FastInsight)
              </CardTitle>
              <CardDescription>
                Insira as métricas de qualidade do serviço
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleQualitySubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="quality-month">Mês</Label>
                    <Select
                      value={qualityData.month}
                      onValueChange={(value) => setQualityData({ ...qualityData, month: value })}
                      required
                    >
                      <SelectTrigger id="quality-month">
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
                    <Label htmlFor="quality-store">Loja</Label>
                    <Select
                      value={qualityData.store}
                      onValueChange={(value) => setQualityData({ ...qualityData, store: value })}
                      disabled={!!profile?.store_id}
                      required
                    >
                      <SelectTrigger id="quality-store">
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
                    <Label htmlFor="sg">SG</Label>
                    <Input
                      id="sg"
                      type="number"
                      step="0.01"
                      placeholder="96.13"
                      value={qualityData.sg}
                      onChange={(e) => setQualityData({ ...qualityData, sg: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="precisao">Precisão</Label>
                    <Input
                      id="precisao"
                      type="number"
                      step="0.01"
                      placeholder="100"
                      value={qualityData.precisao}
                      onChange={(e) => setQualityData({ ...qualityData, precisao: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qualidade">Qualidade</Label>
                    <Input
                      id="qualidade"
                      type="number"
                      step="0.01"
                      placeholder="97.2"
                      value={qualityData.qualidade}
                      onChange={(e) => setQualityData({ ...qualityData, qualidade: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rapidez">Rapidez</Label>
                    <Input
                      id="rapidez"
                      type="number"
                      step="0.01"
                      placeholder="97.2"
                      value={qualityData.rapidez}
                      onChange={(e) => setQualityData({ ...qualityData, rapidez: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nps">NPS</Label>
                    <Input
                      id="nps"
                      type="number"
                      step="0.1"
                      placeholder="91.3"
                      value={qualityData.nps}
                      onChange={(e) => setQualityData({ ...qualityData, nps: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full md:w-auto">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Dados de Qualidade
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complaints" className="mt-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Rácio de Reclamações
              </CardTitle>
              <CardDescription>
                Insira o número de reclamações por categoria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleComplaintsSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="complaints-month">Mês</Label>
                    <Select
                      value={complaintsData.month}
                      onValueChange={(value) => setComplaintsData({ ...complaintsData, month: value })}
                      required
                    >
                      <SelectTrigger id="complaints-month">
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
                    <Label htmlFor="complaints-store">Loja</Label>
                    <Select
                      value={complaintsData.store}
                      onValueChange={(value) => setComplaintsData({ ...complaintsData, store: value })}
                      disabled={!!profile?.store_id}
                      required
                    >
                      <SelectTrigger id="complaints-store">
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

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Qualidade</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="qualidadeSala">Sala</Label>
                      <Input
                        id="qualidadeSala"
                        type="number"
                        step="1"
                        placeholder="0"
                        value={complaintsData.qualidadeSala}
                        onChange={(e) => setComplaintsData({ ...complaintsData, qualidadeSala: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="qualidadeDelivery">Delivery</Label>
                      <Input
                        id="qualidadeDelivery"
                        type="number"
                        step="1"
                        placeholder="1"
                        value={complaintsData.qualidadeDelivery}
                        onChange={(e) => setComplaintsData({ ...complaintsData, qualidadeDelivery: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Serviço</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="servicoSala">Sala</Label>
                      <Input
                        id="servicoSala"
                        type="number"
                        step="1"
                        placeholder="0"
                        value={complaintsData.servicoSala}
                        onChange={(e) => setComplaintsData({ ...complaintsData, servicoSala: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="servicoDelivery">Delivery</Label>
                      <Input
                        id="servicoDelivery"
                        type="number"
                        step="1"
                        placeholder="0"
                        value={complaintsData.servicoDelivery}
                        onChange={(e) => setComplaintsData({ ...complaintsData, servicoDelivery: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Limpeza</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="limpezaSala">Sala</Label>
                      <Input
                        id="limpezaSala"
                        type="number"
                        step="1"
                        placeholder="0"
                        value={complaintsData.limpezaSala}
                        onChange={(e) => setComplaintsData({ ...complaintsData, limpezaSala: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="limpezaDelivery">Delivery</Label>
                      <Input
                        id="limpezaDelivery"
                        type="number"
                        step="1"
                        placeholder="0"
                        value={complaintsData.limpezaDelivery}
                        onChange={(e) => setComplaintsData({ ...complaintsData, limpezaDelivery: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full md:w-auto">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Dados de Reclamações
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="digital" className="mt-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Comunicação Digital
              </CardTitle>
              <CardDescription>
                Insira as avaliações das plataformas digitais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDigitalCommSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="digital-month">Mês</Label>
                    <Select
                      value={digitalCommData.month}
                      onValueChange={(value) => setDigitalCommData({ ...digitalCommData, month: value })}
                      required
                    >
                      <SelectTrigger id="digital-month">
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
                    <Label htmlFor="digital-store">Loja</Label>
                    <Select
                      value={digitalCommData.store}
                      onValueChange={(value) => setDigitalCommData({ ...digitalCommData, store: value })}
                      disabled={!!profile?.store_id}
                      required
                    >
                      <SelectTrigger id="digital-store">
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

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="googleRating">Google (1-5)</Label>
                    <Input
                      id="googleRating"
                      type="number"
                      step="0.1"
                      placeholder="4.2"
                      value={digitalCommData.googleRating}
                      onChange={(e) => setDigitalCommData({ ...digitalCommData, googleRating: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="uberRating">Uber (1-5)</Label>
                    <Input
                      id="uberRating"
                      type="number"
                      step="0.1"
                      placeholder="4.5"
                      value={digitalCommData.uberRating}
                      onChange={(e) => setDigitalCommData({ ...digitalCommData, uberRating: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliveryRating">Delivery (1-5)</Label>
                    <Input
                      id="deliveryRating"
                      type="number"
                      step="0.1"
                      placeholder="4.4"
                      value={digitalCommData.deliveryRating}
                      onChange={(e) => setDigitalCommData({ ...digitalCommData, deliveryRating: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full md:w-auto">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Dados Digitais
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="uber" className="mt-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Métricas Uber Eats
              </CardTitle>
              <CardDescription>
                Insira as métricas detalhadas do Uber Eats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUberMetricsSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="uber-month">Mês</Label>
                    <Select
                      value={uberMetricsData.month}
                      onValueChange={(value) => setUberMetricsData({ ...uberMetricsData, month: value })}
                      required
                    >
                      <SelectTrigger id="uber-month">
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
                    <Label htmlFor="uber-store">Loja</Label>
                    <Select
                      value={uberMetricsData.store}
                      onValueChange={(value) => setUberMetricsData({ ...uberMetricsData, store: value })}
                      disabled={!!profile?.store_id}
                      required
                    >
                      <SelectTrigger id="uber-store">
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
                    <Label htmlFor="estrelas">Estrelas (1-5)</Label>
                    <Input
                      id="estrelas"
                      type="number"
                      step="0.1"
                      placeholder="4.4"
                      value={uberMetricsData.estrelas}
                      onChange={(e) => setUberMetricsData({ ...uberMetricsData, estrelas: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tempos">Tempos</Label>
                    <Input
                      id="tempos"
                      type="number"
                      step="0.1"
                      placeholder="5.2"
                      value={uberMetricsData.tempos}
                      onChange={(e) => setUberMetricsData({ ...uberMetricsData, tempos: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inexatidao">Inexatidão (%)</Label>
                    <Input
                      id="inexatidao"
                      type="number"
                      step="0.01"
                      placeholder="2.50"
                      value={uberMetricsData.inexatidao}
                      onChange={(e) => setUberMetricsData({ ...uberMetricsData, inexatidao: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="avaProduto">Avaliação Produto (%)</Label>
                    <Input
                      id="avaProduto"
                      type="number"
                      step="1"
                      placeholder="86"
                      value={uberMetricsData.avaProduto}
                      onChange={(e) => setUberMetricsData({ ...uberMetricsData, avaProduto: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tempoTotal">Tempo Total (min)</Label>
                    <Input
                      id="tempoTotal"
                      type="number"
                      step="0.1"
                      placeholder="19.3"
                      value={uberMetricsData.tempoTotal}
                      onChange={(e) => setUberMetricsData({ ...uberMetricsData, tempoTotal: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full md:w-auto">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Métricas Uber
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="mt-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Vendas por Plataforma
              </CardTitle>
              <CardDescription>
                Insira os valores de vendas por canal (em €)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSalesSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sales-month">Mês</Label>
                    <Select
                      value={salesData.month}
                      onValueChange={(value) => setSalesData({ ...salesData, month: value })}
                      required
                    >
                      <SelectTrigger id="sales-month">
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
                    <Label htmlFor="sales-store">Loja</Label>
                    <Select
                      value={salesData.store}
                      onValueChange={(value) => setSalesData({ ...salesData, store: value })}
                      disabled={!!profile?.store_id}
                      required
                    >
                      <SelectTrigger id="sales-store">
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

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="totais">Totais (€)</Label>
                    <Input
                      id="totais"
                      type="number"
                      step="0.01"
                      placeholder="239000.00"
                      value={salesData.totais}
                      onChange={(e) => setSalesData({ ...salesData, totais: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="delivery">Delivery (€)</Label>
                    <Input
                      id="delivery"
                      type="number"
                      step="0.01"
                      placeholder="144574.93"
                      value={salesData.delivery}
                      onChange={(e) => setSalesData({ ...salesData, delivery: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="percentDelivery">% Delivery</Label>
                    <Input
                      id="percentDelivery"
                      type="number"
                      step="0.01"
                      placeholder="60.5"
                      value={salesData.percentDelivery}
                      onChange={(e) => setSalesData({ ...salesData, percentDelivery: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sala">Sala (€)</Label>
                    <Input
                      id="sala"
                      type="number"
                      step="0.01"
                      placeholder="94425.07"
                      value={salesData.sala}
                      onChange={(e) => setSalesData({ ...salesData, sala: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mop">MOP (€)</Label>
                    <Input
                      id="mop"
                      type="number"
                      step="0.01"
                      placeholder="711.34"
                      value={salesData.mop}
                      onChange={(e) => setSalesData({ ...salesData, mop: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="percentMop">% MOP</Label>
                    <Input
                      id="percentMop"
                      type="number"
                      step="0.01"
                      placeholder="0.3"
                      value={salesData.percentMop}
                      onChange={(e) => setSalesData({ ...salesData, percentMop: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full md:w-auto">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Dados de Vendas
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
