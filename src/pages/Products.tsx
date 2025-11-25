import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Package, AlertTriangle, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Product } from "@/types/product";
import { ProductDialog } from "@/components/products/ProductDialog";
import { ProductTable } from "@/components/products/ProductTable";
import { SummaryCard } from "@/components/products/SummaryCard";
import { calculateDaysToExpiry, calculateProductStatus } from "@/utils/productUtils";
import { toast } from "sonner";
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/lib/api/products";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { logProductAction } from "@/lib/api/history";
import { HistoryDialog } from "@/components/products/HistoryDialog";
import { supabase } from "@/lib/supabase";

export default function Products() {
  const { user, profile, isManager, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyProductId, setHistoryProductId] = useState<string | null>(null);
  const [historyProductName, setHistoryProductName] = useState("");
  const [activeTab, setActiveTab] = useState<"primaria" | "secundaria">("primaria");
  const [stores, setStores] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedStore, setSelectedStore] = useState<string>("all");

  const isAdminOrConsultant = profile?.role === 'admin' || profile?.role === 'consultor';
  const isAdmin = profile?.role === 'admin';

  const loadStores = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('id, name')
        .order('name', { ascending: true });

      if (error) throw error;
      setStores(data || []);
    } catch (error) {
      console.error("Erro ao carregar lojas:", error);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProducts();

      const processedProducts = data.map(p => ({
        ...p,
        daysToExpiry: calculateDaysToExpiry(p.expiry_date),
        status: calculateProductStatus(calculateDaysToExpiry(p.expiry_date))
      }));

      let filteredProducts = processedProducts;

      if (isManager) {
        if (profile?.store_id) {
          filteredProducts = processedProducts.filter(p => p.store_id === profile.store_id);
        }
      } else if (isAdminOrConsultant && selectedStore !== "all") {
        filteredProducts = processedProducts.filter(p => p.store_id === selectedStore);
      }

      setProducts(filteredProducts);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      toast.error("Erro ao carregar produtos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [isManager, profile?.store_id, isAdminOrConsultant, selectedStore]);

  // Carregar dados inicial e quando filtros mudarem
  useEffect(() => {
    if (authLoading || !user || !profile) return;

    // Inline loadStores
    if (isAdminOrConsultant) {
      supabase
        .from('stores')
        .select('id, name')
        .order('name', { ascending: true })
        .then(({ data, error }) => {
          if (!error && data) {
            setStores(data);
          }
        });
    }

    // Inline loadProducts
    getProducts().then(data => {
      const processedProducts = data.map(p => ({
        ...p,
        daysToExpiry: calculateDaysToExpiry(p.expiry_date),
        status: calculateProductStatus(calculateDaysToExpiry(p.expiry_date))
      }));

      let filteredProducts = processedProducts;

      if (isManager && profile?.store_id) {
        filteredProducts = processedProducts.filter(p => p.store_id === profile.store_id);
      } else if (isAdminOrConsultant && selectedStore !== "all") {
        filteredProducts = processedProducts.filter(p => p.store_id === selectedStore);
      }

      setProducts(filteredProducts);
      setLoading(false);
    }).catch(error => {
      console.error("Erro ao carregar produtos:", error);
      toast.error("Erro ao carregar produtos.");
      setLoading(false);
    });
  }, [authLoading, user, profile, selectedStore, isAdminOrConsultant, isManager]);

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProduct = async (productData: Omit<Product, "id" | "daysToExpiry" | "status" | "created_at" | "updated_at" | "created_by">, id?: string) => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      const daysToExpiry = calculateDaysToExpiry(productData.expiry_date);
      const status = calculateProductStatus(daysToExpiry);

      // Garantir que apenas campos válidos do banco sejam enviados
      const dataToSave = {
        category: productData.category,
        sub_category: productData.sub_category,
        name: productData.name,
        expiry_date: productData.expiry_date,
        expiry_dates: productData.expiry_dates,
        dlc_type: productData.dlc_type,
        observation: productData.observation,
        store_id: productData.store_id || profile?.store_id || '' // Usar store_id do produto ou do perfil do usuário
      };

      // Usar o ID passado ou o do estado (fallback)
      const targetId = id || editingProduct?.id;

      if (targetId) {
        await updateProduct(targetId, dataToSave);
        await logProductAction(targetId, 'EDICAO', dataToSave);
        toast.success("Produto atualizado com sucesso!");
      } else {
        const newProduct = await createProduct(dataToSave as Omit<Product, 'id' | 'created_at' | 'updated_at'>);
        if (newProduct && newProduct.id) {
          await logProductAction(newProduct.id, 'CRIACAO', dataToSave);
        }
        toast.success("Produto adicionado com sucesso!");
      }

      // Recarregar lista para garantir dados atualizados
      await loadProducts();
      setDialogOpen(false);
      setEditingProduct(undefined);
    } catch (error: unknown) {
      console.error("Erro ao salvar produto:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro ao salvar produto."
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      await logProductAction(id, 'EXCLUSAO', { deleted_at: new Date().toISOString() });
      setProducts(products.filter(p => p.id !== id));
      toast.success("Produto removido com sucesso!");
    } catch (error: unknown) {
      console.error("Erro ao deletar produto:", error);
      toast.error("Erro ao remover produto.");
    }
  };

  const handleAddNew = () => {
    setEditingProduct(undefined);
    setDialogOpen(true);
  };

  const handleViewHistory = (product: Product) => {
    setHistoryProductId(product.id);
    setHistoryProductName(product.name);
    setHistoryOpen(true);
  };

  // Filtrar produtos por tipo
  const primaryProducts = products.filter(p => p.dlc_type === "Primária");
  const secondaryProducts = products.filter(p => p.dlc_type === "Secundária");

  // Calcular estatísticas baseadas na aba ativa
  const activeProducts = activeTab === "primaria" ? primaryProducts : secondaryProducts;
  const totalProducts = activeProducts.length;
  const expiredProducts = activeProducts.filter(p => p.status === "EXPIRED").length;
  const warningProducts = activeProducts.filter(p => p.status === "WARNING").length;
  const okProducts = activeProducts.filter(p => p.status === "OK").length;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar ao Dashboard
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Gestão de Produtos</h1>
            <p className="text-muted-foreground mt-2">Controle de validade e estoque</p>
          </div>
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            {isAdminOrConsultant && (
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger className="w-full md:w-[250px]">
                  <SelectValue placeholder="Selecione uma loja" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Lojas</SelectItem>
                  {stores.map(store => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {!isManager && (
              <Button onClick={handleAddNew} size="lg" className="w-full md:w-auto">
                <Plus className="mr-2 h-5 w-5" />
                Adicionar Produto
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <SummaryCard
            title="Total de Produtos"
            value={totalProducts}
            icon={Package}
            colorClass="text-primary"
          />
          <SummaryCard
            title="Produtos OK"
            value={okProducts}
            icon={CheckCircle}
            colorClass="text-success"
          />
          <SummaryCard
            title="Produtos em Atenção"
            value={warningProducts}
            icon={AlertTriangle}
            colorClass="text-warning"
          />
          <SummaryCard
            title="Produtos Vencidos"
            value={expiredProducts}
            icon={AlertTriangle}
            colorClass="text-destructive"
          />
        </div>

        <Tabs value={activeTab} className="w-full" onValueChange={(value) => setActiveTab(value as "primaria" | "secundaria")}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="primaria">DLC Primária ({primaryProducts.length})</TabsTrigger>
            <TabsTrigger value="secundaria">DLC Secundária ({secondaryProducts.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="primaria">
            <ProductTable
              products={primaryProducts}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onViewHistory={handleViewHistory}
              isAdmin={isAdmin}
              onCategoryUpdate={loadProducts}
            />
          </TabsContent>

          <TabsContent value="secundaria">
            <ProductTable
              products={secondaryProducts}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onViewHistory={handleViewHistory}
              isAdmin={isAdmin}
              onCategoryUpdate={loadProducts}
            />
          </TabsContent>
        </Tabs>

        <ProductDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={handleSaveProduct}
          product={editingProduct}
          isManager={isManager}
          isLoading={isSaving}
          isAdmin={isAdmin}
          userStoreId={profile?.store_id}
        />

        <HistoryDialog
          open={historyOpen}
          onOpenChange={setHistoryOpen}
          productId={historyProductId}
          productName={historyProductName}
        />
      </div>
    </div>
  );
}
