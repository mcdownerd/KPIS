import { Product } from "@/types/product";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Calendar, Package, Tag, History, Check, X } from "lucide-react";
import { getStatusLabel, getStatusColor } from "@/utils/productUtils";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onViewHistory?: (product: Product) => void;
  isAdmin?: boolean;
  onCategoryUpdate?: () => void;
}

// Função para agrupar produtos por categoria e subcategoria
const groupProducts = (products: Product[]) => {
  const grouped: Record<string, Record<string, Product[]>> = {};

  products.forEach(product => {
    const category = product.category || "Sem Categoria";
    const subCategory = product.sub_category || "";

    if (!grouped[category]) {
      grouped[category] = {};
    }

    if (!grouped[category][subCategory]) {
      grouped[category][subCategory] = [];
    }

    grouped[category][subCategory].push(product);
  });

  return grouped;
};

export const ProductTable = ({ products, onEdit, onDelete, onViewHistory, isAdmin = false, onCategoryUpdate }: ProductTableProps) => {
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");

  if (products.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-12 text-center">
        <p className="text-muted-foreground">Nenhum produto cadastrado</p>
      </div>
    );
  }

  const groupedProducts = groupProducts(products);

  const handleEditCategory = (category: string) => {
    setEditingCategory(category);
    setNewCategoryName(category);
  };

  const handleSaveCategory = async (oldCategory: string) => {
    if (!newCategoryName.trim() || newCategoryName === oldCategory) {
      setEditingCategory(null);
      return;
    }

    try {
      // Atualizar todos os produtos desta categoria
      const { error } = await supabase
        .from('products')
        .update({ category: newCategoryName.trim() })
        .eq('category', oldCategory);

      if (error) throw error;

      toast.success(`Categoria "${oldCategory}" renomeada para "${newCategoryName}"`);
      setEditingCategory(null);

      // Recarregar produtos
      if (onCategoryUpdate) {
        onCategoryUpdate();
      }
    } catch (error) {
      console.error("Erro ao renomear categoria:", error);
      toast.error("Erro ao renomear categoria");
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setNewCategoryName("");
  };

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block space-y-8">
        {Object.entries(groupedProducts).map(([category, subCategories]) => (
          <div key={category} className="space-y-6">
            {/* Cabeçalho da Categoria Principal */}
            <div className="bg-muted px-4 py-3 rounded-lg flex items-center justify-between gap-3">
              {editingCategory === category ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="h-9 font-bold text-lg uppercase"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveCategory(category);
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 text-green-600 hover:text-green-700 hover:bg-green-100"
                    onClick={() => handleSaveCategory(category)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleCancelEdit}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <h3 className="font-bold text-lg uppercase">{category}</h3>
                  {isAdmin && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => handleEditCategory(category)}
                      title="Editar categoria"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </>
              )}
            </div>

            {/* Cada subcategoria tem sua própria tabela */}
            {Object.entries(subCategories).map(([subCategory, categoryProducts]) => (
              <div key={`${category}-${subCategory}`} className="space-y-3">
                {subCategory && (
                  <div className="px-2">
                    <h4 className="font-semibold text-sm uppercase text-muted-foreground">{subCategory}</h4>
                  </div>
                )}

                <div className="rounded-lg border bg-card overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead>Data de Validade</TableHead>
                        <TableHead>Tipo DLC</TableHead>
                        <TableHead className="text-center">Dias p/ Vencer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Observação</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categoryProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <span>
                                {product.expiry_date.includes('T') || product.expiry_date.length > 10
                                  ? format(parseISO(product.expiry_date), "dd/MM/yyyy HH:mm", { locale: ptBR })
                                  : format(parseISO(product.expiry_date), "dd/MM/yyyy", { locale: ptBR })}
                              </span>
                              {product.expiry_dates && product.expiry_dates.length > 1 && (
                                <span className="text-xs text-muted-foreground">
                                  +{product.expiry_dates.length - 1} {product.expiry_dates.length - 1 === 1 ? 'data' : 'datas'}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{product.dlc_type}</TableCell>
                          <TableCell className="text-center font-semibold">
                            {product.daysToExpiry}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(product.status)}>
                              {getStatusLabel(product.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {product.observation || '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {onViewHistory && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => onViewHistory(product)}
                                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                                  title="Ver Histórico"
                                >
                                  <History className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onEdit(product)}
                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onDelete(product.id)}
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-8">
        {Object.entries(groupedProducts).map(([category, subCategories]) => (
          <div key={category} className="space-y-6">
            <div className="bg-muted px-4 py-3 rounded-lg">
              <h3 className="font-bold text-base uppercase">{category}</h3>
            </div>

            {Object.entries(subCategories).map(([subCategory, categoryProducts]) => (
              <div key={`${category}-${subCategory}`} className="space-y-3">
                {subCategory && (
                  <div className="px-2">
                    <h4 className="font-semibold text-sm uppercase text-muted-foreground">{subCategory}</h4>
                  </div>
                )}

                {categoryProducts.map((product) => (
                  <Card key={product.id} className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base leading-tight">{product.name}</h3>
                        {product.observation && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Observação: {product.observation}
                          </p>
                        )}
                      </div>
                      <Badge className={getStatusColor(product.status)}>
                        {getStatusLabel(product.status)}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {product.expiry_date.includes('T') || product.expiry_date.length > 10
                              ? format(parseISO(product.expiry_date), "dd/MM/yyyy HH:mm", { locale: ptBR })
                              : format(parseISO(product.expiry_date), "dd/MM/yyyy", { locale: ptBR })}
                          </span>
                          {product.expiry_dates && product.expiry_dates.length > 1 && (
                            <span className="text-xs text-muted-foreground">
                              +{product.expiry_dates.length - 1} {product.expiry_dates.length - 1 === 1 ? 'data' : 'datas'}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-muted-foreground">{product.dlc_type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">Dias:</span>
                          <span className="font-bold text-base">{product.daysToExpiry}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t mt-2">
                      {onViewHistory && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewHistory(product)}
                          className="text-muted-foreground hover:text-primary"
                        >
                          <History className="h-4 w-4 mr-2" />
                          Histórico
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(product)}
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(product.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};
