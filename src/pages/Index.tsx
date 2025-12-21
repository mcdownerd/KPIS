import { MetricCard } from "@/components/dashboard/MetricCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { LocationTabs } from "@/components/LocationTabs";
import { ServiceTimesTable } from "@/components/ServiceTimesTable";
import { CostsAnalysis } from "@/components/dashboard/CostsAnalysis";
import { InventoryDeviations } from "@/components/dashboard/InventoryDeviations";
import { SalesByPlatform } from "@/components/dashboard/SalesByPlatform";
import { DataEntryForm } from "@/components/forms/DataEntryForm";
import { ServiceDataForm } from "@/components/forms/ServiceDataForm";
import { PeopleDataForm } from "@/components/forms/PeopleDataForm";
import { PeopleDashboard } from "@/components/dashboard/PeopleDashboard";
import { MaintenanceDataForm } from "@/components/forms/MaintenanceDataForm";
import { MaintenanceDashboard } from "@/components/dashboard/MaintenanceDashboard";
import { ProductDataForm } from "@/components/forms/ProductDataForm";
import { ProductDashboard } from "@/components/dashboard/ProductDashboard";
import { YieldsAnalysis } from "@/components/dashboard/YieldsAnalysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { BarChart3, TrendingUp, Users, Clock, DollarSign, Package, ShoppingCart, Headphones, UserCheck, Wrench, Box, Calendar, Zap, LogOut, Shield, LayoutGrid, Home } from "lucide-react";
import { signOut } from "@/lib/api/auth";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ModeToggle } from "@/components/mode-toggle";

import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { InstallPWA } from "@/components/InstallPWA";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const { metrics, loading } = useDashboardMetrics();

  const handleLogout = async () => {
    try {
      // Set a timeout to force redirect if signOut takes too long
      const timeoutId = setTimeout(() => {
        localStorage.clear();
        navigate("/login");
      }, 2000);

      await signOut();
      clearTimeout(timeoutId);

      toast({
        title: "Logout realizado",
        description: "Você saiu da sua conta com sucesso.",
      });
      navigate("/login");
    } catch (error) {
      console.error("Erro ao sair:", error);
      // Force logout even on error
      localStorage.clear();
      navigate("/login");
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard KPI's 2025</h1>
              <p className="text-xs md:text-sm text-muted-foreground">P.Borges - Performance Overview</p>
            </div>

            {/* Navigation buttons - horizontal scroll on mobile */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground flex-shrink-0" asChild>
                <Link to="/">
                  <Home className="h-5 w-5" />
                </Link>
              </Button>

              <Button variant="outline" size="sm" className="flex-shrink-0" asChild>
                <Link to="/products">
                  <Calendar className="mr-1 md:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Gestão de Validade</span>
                  <span className="sm:hidden">Validade</span>
                </Link>
              </Button>

              <Button variant="outline" size="sm" className="flex-shrink-0" asChild>
                <Link to="/utilities">
                  <Zap className="mr-1 md:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Consumos</span>
                  <span className="sm:hidden">Consumos</span>
                </Link>
              </Button>

              <div className="flex-shrink-0 flex items-center gap-2 rounded-lg bg-primary px-3 md:px-4 py-2">
                <BarChart3 className="h-4 md:h-5 w-4 md:w-5 text-primary-foreground" />
                <span className="text-xs md:text-sm font-medium text-primary-foreground whitespace-nowrap">YTD 2025</span>
              </div>
              <ModeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="Sair"
                className="flex-shrink-0 text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-4 md:h-5 w-4 md:w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 bg-secondary h-auto p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart3 className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Visão Geral</span>
              <span className="sm:hidden">Geral</span>
            </TabsTrigger>
            <TabsTrigger value="sales" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Vendas
            </TabsTrigger>
            <TabsTrigger value="operations" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Clock className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Operações</span>
              <span className="sm:hidden">Ops</span>
            </TabsTrigger>


            <TabsTrigger value="product" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Box className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Produto</span>
              <span className="sm:hidden">Prod</span>
            </TabsTrigger>
            <TabsTrigger value="service" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Headphones className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Serviço</span>
              <span className="sm:hidden">Serv</span>
            </TabsTrigger>
            <TabsTrigger value="people" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <UserCheck className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Pessoas</span>
              <span className="sm:hidden">RH</span>
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Wrench className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Manutenção</span>
              <span className="sm:hidden">Manut</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8 mt-4 md:mt-6">
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
                <TrendingUp className="h-5 w-5 text-primary" />
                Métricas Principais
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  title="Crescimento de Vendas"
                  value={loading ? "..." : `${metrics?.sales_growth.toFixed(1)}%`}
                  change={12.5}
                  trend="up"
                  subtitle="P.Borges vs Nacional: +2.5%"
                />
                <MetricCard
                  title="Crescimento GC's"
                  value={loading ? "..." : `${metrics?.gcs_growth.toFixed(1)}%`}
                  change={5.2}
                  trend="up"
                  subtitle="P.Borges vs Nacional: +1.2%"
                />
                <MetricCard
                  title="Crescimento Delivery"
                  value={loading ? "..." : "15.8%"}
                  change={15.8}
                  trend="up"
                  subtitle="P.Borges YTD"
                />
                <MetricCard
                  title="Peso Delivery"
                  value={loading ? "..." : `${metrics?.delivery_growth.toFixed(1)}%`}
                  change={2.4}
                  trend="up"
                  subtitle="vs Nacional: +5.0%"
                />
              </div>
            </section>

            <section>
              <SalesChart />
            </section>

            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
                <Clock className="h-5 w-5 text-primary" />
                Operações
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                <MetricCard
                  title="Tempos de Serviço"
                  value={loading ? "..." : `${metrics?.service_time_avg.toFixed(0)}s`}
                  target="180s"
                  trend={metrics?.service_time_avg && metrics.service_time_avg <= 180 ? "up" : "down"}
                  change={0}
                />
                <MetricCard
                  title="Tempos Delivery"
                  value={loading ? "..." : `${metrics?.service_time_delivery.toFixed(0)}s`}
                  target="180s"
                  trend="neutral"
                  change={0}
                />
                <MetricCard
                  title="Fastinsight"
                  value={loading ? "..." : `${metrics?.fastinsight_score.toFixed(1)}%`}
                  target="80.0%"
                  trend={metrics?.fastinsight_score && metrics.fastinsight_score >= 80 ? "up" : "down"}
                  change={0}
                />
              </div>
            </section>

            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
                <Users className="h-5 w-5 text-primary" />
                PACE (0/0)
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  title="Estrelas (Rating)"
                  value={loading ? "..." : `${metrics?.rating.toFixed(1)}`}
                  target="4.5"
                  subtitle="Meta: 4.5 estrelas"
                />
                <MetricCard
                  title="Turnover"
                  value={loading ? "..." : `${metrics?.turnover_rate.toFixed(1)}%`}
                  trend={metrics?.turnover_rate && metrics.turnover_rate <= 10 ? "up" : "down"}
                  subtitle="Objetivo de redução"
                />
                <MetricCard
                  title="Staffing"
                  value="0%"
                  subtitle="Níveis de pessoal"
                />
                <MetricCard
                  title="BSV"
                  value="0%"
                  trend="neutral"
                  subtitle="Brand Standards Visit"
                />
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Performance por Localização
              </h2>
              <LocationTabs />
            </section>
          </TabsContent>

          {/* Sales Tab */}
          <TabsContent value="sales" className="space-y-6">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
              <ShoppingCart className="h-6 w-6 text-primary" />
              Análise de Vendas
            </h2>
            <SalesByPlatform />
          </TabsContent>

          {/* Operations Tab */}
          <TabsContent value="operations" className="space-y-6">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
              <Clock className="h-6 w-6 text-primary" />
              Tempos de Serviço
            </h2>
            <ServiceTimesTable />
          </TabsContent>





          {/* Product Tab */}
          <TabsContent value="product" className="space-y-6">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
              <Box className="h-6 w-6 text-primary" />
              Gestão de Produto - Custos e Desvios
            </h2>
            <Tabs defaultValue="dashboard" className="space-y-6">
              <TabsList>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="inventory">Inventário</TabsTrigger>
                <TabsTrigger value="yields">Rendimentos</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard">
                <CostsAnalysis />
              </TabsContent>

              <TabsContent value="inventory">
                <InventoryDeviations />
                <div className="mt-8">
                  <DataEntryForm />
                </div>
              </TabsContent>

              <TabsContent value="yields">
                <YieldsAnalysis />
                <div className="mt-8">
                  <DataEntryForm />
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Service Tab */}
          <TabsContent value="service" className="space-y-6">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
              <Headphones className="h-6 w-6 text-primary" />
              Preenchimento de Dados de Serviço
            </h2>
            <ServiceDataForm />
          </TabsContent>


          {/* Maintenance Tab */}
          <TabsContent value="maintenance" className="space-y-6">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
              <Wrench className="h-6 w-6 text-primary" />
              Manutenção e Gastos Operacionais
            </h2>
            <Tabs defaultValue="dashboard" className="space-y-6">
              <TabsList>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="form">Preencher Dados</TabsTrigger>
              </TabsList>
              <TabsContent value="dashboard">
                <MaintenanceDashboard />
              </TabsContent>
              <TabsContent value="form">
                <MaintenanceDataForm />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-border/50 bg-card/30 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Dashboard KPI's 2025 - P.Borges | Atualizado em tempo real</p>
        </div>
      </footer>
      <InstallPWA />
    </div>
  );
};

export default Index;
