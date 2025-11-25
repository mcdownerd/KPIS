import { MetricCard } from "@/components/MetricCard";
import { SalesChart } from "@/components/SalesChart";
import { LocationTabs } from "@/components/LocationTabs";
import { ServiceTimesTable } from "@/components/ServiceTimesTable";
import { CostsAnalysis } from "@/components/CostsAnalysis";
import { InventoryDeviations } from "@/components/InventoryDeviations";
import { SalesByPlatform } from "@/components/SalesByPlatform";
import { DataEntryForm } from "@/components/DataEntryForm";
import { ServiceDataForm } from "@/components/ServiceDataForm";
import { PeopleDataForm } from "@/components/PeopleDataForm";
import { PeopleDashboard } from "@/components/PeopleDashboard";
import { MaintenanceDataForm } from "@/components/MaintenanceDataForm";
import { MaintenanceDashboard } from "@/components/MaintenanceDashboard";
import { ProductDataForm } from "@/components/ProductDataForm";
import { ProductDashboard } from "@/components/ProductDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { BarChart3, TrendingUp, Users, Clock, DollarSign, Package, ShoppingCart, Headphones, UserCheck, Wrench, Box, Calendar, Zap, LogOut, Shield, LayoutGrid, Home } from "lucide-react";
import { signOut } from "@/lib/api/auth";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ModeToggle } from "@/components/mode-toggle";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useAuth();


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
              <Link to="/" className="flex-shrink-0">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <Home className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/products" className="flex-shrink-0">
                <Button variant="outline" size="sm">
                  <Calendar className="mr-1 md:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Gestão de Validade</span>
                  <span className="sm:hidden">Validade</span>
                </Button>
              </Link>
              <Link to="/utilities" className="flex-shrink-0">
                <Button variant="outline" size="sm">
                  <Zap className="mr-1 md:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Consumos</span>
                  <span className="sm:hidden">Consumos</span>
                </Button>
              </Link>
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
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9 bg-secondary h-auto p-1">
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
            <TabsTrigger value="costs" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <DollarSign className="mr-2 h-4 w-4" />
              Custos
            </TabsTrigger>
            <TabsTrigger value="inventory" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Package className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Inventário</span>
              <span className="sm:hidden">Inv</span>
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
                  value="11.84%"
                  change={11.84}
                  trend="up"
                  subtitle="P.Borges vs Nacional: +2.42%"
                />
                <MetricCard
                  title="Crescimento GC's"
                  value="4.11%"
                  change={4.11}
                  trend="up"
                  subtitle="P.Borges vs Nacional: +2.61%"
                />
                <MetricCard
                  title="Crescimento Delivery"
                  value="19.26%"
                  change={19.26}
                  trend="up"
                  subtitle="P.Borges YTD"
                />
                <MetricCard
                  title="Peso Delivery"
                  value="52.50%"
                  change={34.40}
                  trend="up"
                  subtitle="vs Nacional: +34.40%"
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
                  value="105s"
                  target="95s"
                  trend="down"
                  change={5}
                />
                <MetricCard
                  title="Tempos Delivery"
                  value="366s"
                  target="306s"
                  trend="down"
                  change={42}
                />
                <MetricCard
                  title="Fastinsight"
                  value="97.4%"
                  target="94.1%"
                  trend="up"
                  change={2.30}
                />
              </div>
            </section>

            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
                <Users className="h-5 w-5 text-primary" />
                PACE (20/32)
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  title="Estrelas (Rating)"
                  value="4.2"
                  target="4.5"
                  subtitle="Meta: 4.5 estrelas"
                />
                <MetricCard
                  title="Turnover"
                  value="60%"
                  trend="down"
                  subtitle="Objetivo de redução"
                />
                <MetricCard
                  title="Staffing"
                  value="35%"
                  subtitle="Níveis de pessoal"
                />
                <MetricCard
                  title="BSV"
                  value="100%"
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

          {/* Costs Tab */}
          <TabsContent value="costs" className="space-y-6">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
              <DollarSign className="h-6 w-6 text-primary" />
              Análise de Custos
            </h2>
            <CostsAnalysis />
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
              <Package className="h-6 w-6 text-primary" />
              Inventário e Preenchimento
            </h2>
            <InventoryDeviations />
            <div className="mt-8">
              <DataEntryForm />
            </div>
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
                <TabsTrigger value="form">Preencher Dados</TabsTrigger>
              </TabsList>
              <TabsContent value="dashboard">
                <ProductDashboard />
              </TabsContent>
              <TabsContent value="form">
                <ProductDataForm />
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

          {/* People Tab */}
          <TabsContent value="people" className="space-y-6">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
              <UserCheck className="h-6 w-6 text-primary" />
              Gestão de Pessoas - M.O. Mensal
            </h2>
            <Tabs defaultValue="dashboard" className="space-y-6">
              <TabsList>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="form">Preencher Dados</TabsTrigger>
              </TabsList>
              <TabsContent value="dashboard">
                <PeopleDashboard />
              </TabsContent>
              <TabsContent value="form">
                <PeopleDataForm />
              </TabsContent>
            </Tabs>
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
    </div>
  );
};

export default Index;
