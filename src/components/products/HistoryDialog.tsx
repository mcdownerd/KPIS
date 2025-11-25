import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getProductHistory, ProductHistory } from "@/lib/api/history";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { History, Loader2, User, Clock, FileEdit, Trash2, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HistoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    productId: string | null;
    productName: string;
}

export function HistoryDialog({
    open,
    onOpenChange,
    productId,
    productName,
}: HistoryDialogProps) {
    const [history, setHistory] = useState<ProductHistory[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && productId) {
            loadHistory();
        }
    }, [open, productId]);

    const loadHistory = async () => {
        if (!productId) return;
        setLoading(true);
        try {
            const data = await getProductHistory(productId);
            setHistory(data);
        } catch (error) {
            console.error("Error loading history:", error);
        } finally {
            setLoading(false);
        }
    };

    const getActionIcon = (action: string) => {
        switch (action) {
            case "CRIACAO":
                return <PlusCircle className="h-4 w-4 text-green-600" />;
            case "EDICAO":
                return <FileEdit className="h-4 w-4 text-blue-600" />;
            case "EXCLUSAO":
                return <Trash2 className="h-4 w-4 text-red-600" />;
            default:
                return <History className="h-4 w-4" />;
        }
    };

    const getActionLabel = (action: string) => {
        switch (action) {
            case "CRIACAO":
                return "Produto Criado";
            case "EDICAO":
                return "Produto Editado";
            case "EXCLUSAO":
                return "Produto Excluído";
            default:
                return action;
        }
    };

    const getFieldLabel = (key: string) => {
        const labels: Record<string, string> = {
            name: "Nome",
            category: "Categoria",
            sub_category: "Subcategoria",
            dlc_type: "Tipo DLC",
            expiry_date: "Data de Validade",
            observation: "Observação",
            expiry_dates: "Datas Adicionais",
        };
        return labels[key] || key;
    };

    const formatValue = (key: string, value: unknown) => {
        if (!value && value !== 0) return <span className="text-muted-foreground italic">Vazio</span>;

        const formatDate = (dateStr: string) => {
            try {
                const date = new Date(dateStr);
                if (key === 'expiry_date' || key === 'expiry_dates') {
                    return format(date, "dd/MM/yyyy", { locale: ptBR });
                }
                return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
            } catch (e) {
                return dateStr;
            }
        };

        if (key === 'expiry_date' || key.includes('date')) {
            if (typeof value === 'string' && (value.includes('T') || value.includes('-'))) {
                return formatDate(value);
            }
        }

        if (Array.isArray(value)) {
            if (value.length === 0) return <span className="text-muted-foreground italic">Nenhuma</span>;

            if (key === 'expiry_dates') {
                return value.map(v => formatDate(v)).join(", ");
            }

            return value.join(", ");
        }

        return String(value);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[650px] h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <History className="h-5 w-5 text-primary" />
                        Histórico de Alterações
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        {productName}
                    </p>
                </DialogHeader>

                <ScrollArea className="flex-1 pr-4">
                    <div className="pr-4 pb-4">
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : history.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
                                <History className="h-12 w-12 opacity-20" />
                                <p>Nenhum histórico encontrado.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 pl-1">
                                {history.map((item) => (
                                    <div key={item.id} className="flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm">
                                        <div className="flex items-center justify-between border-b pb-3">
                                            <div className="flex items-center gap-3">
                                                {getActionIcon(item.action)}
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-sm">
                                                        {getActionLabel(item.action)}
                                                    </span>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <Badge variant="secondary" className="text-[10px] font-normal h-5 px-2">
                                                            <User className="h-3 w-3 mr-1 opacity-70" />
                                                            {item.user?.full_name || "Sistema"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                                                <Clock className="h-3 w-3 mr-1" />
                                                {format(new Date(item.created_at), "dd/MM/yyyy HH:mm", {
                                                    locale: ptBR,
                                                })}
                                            </div>
                                        </div>

                                        {item.action === 'EDICAO' && item.changes && (
                                            <div className="space-y-2 pt-1">
                                                <div className="grid gap-2 text-sm">
                                                    {Object.entries(item.changes).map(([key, value]) => {
                                                        // Filtra campos indesejados (incluindo store_id)
                                                        if (['updated_at', 'id', 'category', 'sub_category', 'dlc_type', 'store_id'].includes(key)) return null;
                                                        // Ocultar observação se estiver vazia
                                                        if (key === 'observation' && !value) return null;

                                                        return (
                                                            <div key={key} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 p-2 rounded bg-muted/30">
                                                                <span className="font-medium min-w-[120px] text-muted-foreground">
                                                                    {getFieldLabel(key)}:
                                                                </span>
                                                                <span className="font-medium text-foreground break-all">
                                                                    {formatValue(key, value)}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {item.action === 'CRIACAO' && (
                                            <div className="text-xs text-muted-foreground italic">
                                                Produto criado inicialmente com os dados atuais.
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
