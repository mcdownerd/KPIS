import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Product, DLCType } from "@/types/product";
import { Plus, X, Package, FolderTree, Tag, Calendar, Clock, FileText, Loader2, Check, ChevronsUpDown } from "lucide-react";
import { DatePicker } from "./DatePicker";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (product: Omit<Product, "id" | "daysToExpiry" | "status" | "created_at" | "updated_at" | "created_by">, id?: string) => void;
  product?: Product;
  isManager?: boolean; // Gerentes só podem editar datas
  isLoading?: boolean;
  isAdmin?: boolean;
  userStoreId?: string;
}

export const ProductDialog = ({ open, onOpenChange, onSave, product, isManager = false, isLoading = false, isAdmin = false, userStoreId }: ProductDialogProps) => {
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    category: "",
    sub_category: "",
    name: "",
    expiry_date: "",
    dlc_type: "Primária" as DLCType,
    observation: "",
    store_id: "",
  });
  const [additionalDates, setAdditionalDates] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [subCategoryOpen, setSubCategoryOpen] = useState(false);
  const [stores, setStores] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    if (product) {
      setFormData({
        category: product.category,
        sub_category: product.sub_category || "",
        name: product.name,
        expiry_date: product.expiry_date,
        dlc_type: product.dlc_type,
        observation: product.observation || "",
        store_id: product.store_id || "",
      });
      setAdditionalDates(
        product.expiry_dates?.filter(d => d !== product.expiry_date) || []
      );
    } else {
      const now = new Date();
      setFormData({
        category: "",
        sub_category: "",
        name: "",
        expiry_date: now.toISOString(),
        dlc_type: "Primária",
        observation: "",
        store_id: userStoreId || "",
      });
      setAdditionalDates([]);
    }
  }, [product, open, userStoreId]);

  // Carregar categorias e subcategorias existentes
  useEffect(() => {
    const loadCategoriesAndSubCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('category, sub_category');

        if (error) throw error;

        const uniqueCategories = [...new Set(data?.map(p => p.category).filter(Boolean))] as string[];
        const uniqueSubCategories = [...new Set(data?.map(p => p.sub_category).filter(Boolean))] as string[];

        setCategories(uniqueCategories.sort());
        setSubCategories(uniqueSubCategories.sort());
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    };

    if (open) {
      loadCategoriesAndSubCategories();
    }
  }, [open]);

  // Carregar lojas para admins
  useEffect(() => {
    const loadStores = async () => {
      if (!isAdmin) return;

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
    };

    if (open && isAdmin) {
      loadStores();
    }
  }, [open, isAdmin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const allDates = [formData.expiry_date, ...additionalDates.filter(d => d)];

    // Garantir que dlc_type seja sempre preservado, especialmente para gerentes
    // Converter strings vazias em null para campos opcionais
    const dataToSave = {
      ...formData,
      sub_category: formData.sub_category?.trim() || null,
      observation: formData.observation?.trim() || null,
      dlc_type: product?.dlc_type || formData.dlc_type, // Priorizar o dlc_type original do produto
      expiry_date: formData.expiry_date,
      expiry_dates: allDates,
    };

    onSave(dataToSave, product?.id);
    // Não fechar o diálogo aqui, esperar o onSave completar (controlado pelo pai)
    // Mas o pai fecha o diálogo no sucesso.
    // Se isLoading for true, o botão desabilita.
  };

  const addDateField = () => {
    setAdditionalDates([...additionalDates, new Date().toISOString()]);
  };

  const removeDateField = (index: number) => {
    setAdditionalDates(additionalDates.filter((_, i) => i !== index));
  };

  const updateAdditionalDate = (index: number, value: string | undefined) => {
    const updated = [...additionalDates];
    if (value) {
      updated[index] = value;
    } else {
      updated.splice(index, 1);
    }
    setAdditionalDates(updated);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto w-[95vw] p-4 sm:p-6">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              {product ? "Editar Produto" : "Adicionar Produto"}
            </DialogTitle>
            {isManager && isEditing ? (
              <div className="mt-2 p-3 bg-muted/50 rounded-lg border">
                <p className="text-sm font-medium text-muted-foreground">Produto</p>
                <p className="text-lg font-bold text-foreground">{formData.name}</p>
                <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                  <span>{formData.category}</span>
                  {formData.sub_category && <span>• {formData.sub_category}</span>}
                  <span>• {formData.dlc_type}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">
                Preencha os dados do produto abaixo
              </p>
            )}
          </DialogHeader>

          <div className="grid gap-6 py-6">
            {/* Categoria - Ocultar para Gerente */}
            {!isManager && (
              <div className="grid gap-3">
                <Label htmlFor="category" className="flex items-center gap-2 text-base font-semibold">
                  <FolderTree className="h-4 w-4 text-primary" />
                  Categoria
                  <span className="text-destructive">*</span>
                </Label>
                <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={categoryOpen}
                      className="h-11 justify-between"
                    >
                      {formData.category || "Ex: Laticínios, Padaria, Carnes"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Buscar ou criar categoria..."
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      />
                      <CommandEmpty>
                        <div className="p-2 text-sm">
                          Pressione Enter para criar "{formData.category}"
                        </div>
                      </CommandEmpty>
                      <CommandGroup>
                        {categories.map((cat) => (
                          <CommandItem
                            key={cat}
                            value={cat}
                            onSelect={(value) => {
                              setFormData({ ...formData, category: value });
                              setCategoryOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.category === cat ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {cat}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Subcategoria - Ocultar para Gerente */}
            {!isManager && (
              <div className="grid gap-3">
                <Label htmlFor="sub_category" className="flex items-center gap-2 text-base font-semibold">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  Subcategoria
                  <span className="text-xs text-muted-foreground font-normal">(opcional)</span>
                </Label>
                <Popover open={subCategoryOpen} onOpenChange={setSubCategoryOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={subCategoryOpen}
                      className="h-11 justify-between"
                    >
                      {formData.sub_category || "Ex: Refrigerados, Frescos, Congelados"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Buscar ou criar subcategoria..."
                        value={formData.sub_category}
                        onValueChange={(value) => setFormData({ ...formData, sub_category: value })}
                      />
                      <CommandEmpty>
                        <div className="p-2 text-sm">
                          Pressione Enter para criar "{formData.sub_category}"
                        </div>
                      </CommandEmpty>
                      <CommandGroup>
                        {subCategories.map((subCat) => (
                          <CommandItem
                            key={subCat}
                            value={subCat}
                            onSelect={(value) => {
                              setFormData({ ...formData, sub_category: value });
                              setSubCategoryOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.sub_category === subCat ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {subCat}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Nome do Produto - Ocultar para Gerente */}
            {!isManager && (
              <div className="grid gap-3">
                <Label htmlFor="name" className="flex items-center gap-2 text-base font-semibold">
                  <Package className="h-4 w-4 text-primary" />
                  Produto
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome do produto"
                  className="h-11"
                  required
                />
              </div>
            )}

            {/* Data de Validade */}
            <div className="grid gap-3 p-4 bg-muted/50 rounded-lg border">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <Label htmlFor="expiry_date" className="flex items-center gap-2 text-base font-semibold">
                  <Calendar className="h-4 w-4 text-primary" />
                  Data {formData.dlc_type === "Secundária" && "e Hora"} de Validade
                  <span className="text-destructive">*</span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addDateField}
                  className="h-8 text-xs w-full sm:w-auto"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Adicionar Data
                </Button>
              </div>
              <DatePicker
                id="expiry_date"
                value={formData.expiry_date}
                onChange={(value) => setFormData({ ...formData, expiry_date: value || "" })}
                timePicker={formData.dlc_type === "Secundária"}
                disabled={false}
              />
              {additionalDates.map((date, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <DatePicker
                    value={date}
                    onChange={(value) => updateAdditionalDate(index, value)}
                    timePicker={formData.dlc_type === "Secundária"}
                    disabled={false}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDateField(index)}
                    className="h-10 w-10 flex-shrink-0 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Tipo DLC - Ocultar para Gerente */}
            {!isManager && (
              <div className="grid gap-3">
                <Label htmlFor="dlc_type" className="flex items-center gap-2 text-base font-semibold">
                  <Clock className="h-4 w-4 text-primary" />
                  Tipo DLC
                  <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.dlc_type}
                  onValueChange={(value: DLCType) => setFormData({ ...formData, dlc_type: value })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Primária">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Primária (apenas data)
                      </div>
                    </SelectItem>
                    <SelectItem value="Secundária">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Secundária (data e hora)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {formData.dlc_type === "Primária"
                    ? "Para produtos com validade por data (ex: leite, queijo)"
                    : "Para produtos com validade por data e hora (ex: produtos frescos)"}
                </p>
              </div>
            )}

            {/* Observação */}
            <div className="grid gap-3">
              <Label htmlFor="observation" className="flex items-center gap-2 text-base font-semibold">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Observação
                <span className="text-xs text-muted-foreground font-normal">(opcional)</span>
              </Label>
              <Input
                id="observation"
                value={formData.observation}
                onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
                placeholder="Observações adicionais (ex: lote, fornecedor)"
                className="h-11"
              />
            </div>

            {/* Loja - Apenas para Admins */}
            {isAdmin && !isManager && (
              <div className="grid gap-3">
                <Label htmlFor="store_id" className="flex items-center gap-2 text-base font-semibold">
                  <Package className="h-4 w-4 text-primary" />
                  Loja
                  <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.store_id}
                  onValueChange={(value) => setFormData({ ...formData, store_id: value })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecione uma loja" />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map(store => (
                      <SelectItem key={store.id} value={store.id}>
                        {store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 pt-4 border-t flex-col sm:flex-row">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading} className="h-11 w-full sm:w-auto">
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="h-11 min-w-[120px] w-full sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Package className="mr-2 h-4 w-4" />
                  {product ? "Salvar" : "Adicionar"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
