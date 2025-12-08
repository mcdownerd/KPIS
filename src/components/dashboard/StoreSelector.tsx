import { useState, useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Store } from "lucide-react";

interface StoreData {
    id: string;
    name: string;
}

interface StoreSelectorProps {
    selectedStoreId: string | null;
    onStoreChange: (storeId: string) => void;
}

export function StoreSelector({ selectedStoreId, onStoreChange }: StoreSelectorProps) {
    const { profile, isAdminOrSupervisor } = useAuth();
    const [stores, setStores] = useState<StoreData[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAdminOrSupervisor) {
            fetchStores();
        }
    }, [isAdminOrSupervisor]);

    const fetchStores = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('stores')
                .select('id, name')
                .order('name');

            if (error) throw error;
            setStores(data || []);
        } catch (error) {
            console.error("Erro ao carregar lojas:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isAdminOrSupervisor) {
        // Se não for admin/supervisor, mostra apenas o nome da loja atual (se tiver)
        return profile?.stores?.name ? (
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-2 rounded-md border border-border/50">
                <Store className="h-4 w-4" />
                {profile.stores.name}
            </div>
        ) : null;
    }

    return (
        <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Store className="h-4 w-4" />
                Loja:
            </div>
            <Select
                value={selectedStoreId || ""}
                onValueChange={onStoreChange}
                disabled={loading}
            >
                <SelectTrigger className="w-[180px] h-9 bg-background/50 backdrop-blur-sm border-border/50">
                    <SelectValue placeholder="Selecione a loja" />
                </SelectTrigger>
                <SelectContent>
                    {stores.map((store) => (
                        <SelectItem key={store.id} value={store.id}>
                            {store.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
