import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus, Trash2, Users, Store, Shield, Edit } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface UserData {
    id: string;
    email: string;
    full_name: string | null;
    role: 'admin' | 'user' | 'gerente' | 'consultor';
    store_id: string | null;
    created_at: string;
    stores?: { name: string } | null;
}

interface StoreData {
    id: string;
    name: string;
    location: string | null;
    created_at: string;
}

export function AdminDashboard() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { loading: authLoading } = useAuth();
    const [users, setUsers] = useState<UserData[]>([]);
    const [stores, setStores] = useState<StoreData[]>([]);
    const [loading, setLoading] = useState(true);

    // Store management states
    const [isCreateStoreOpen, setIsCreateStoreOpen] = useState(false);
    const [newStoreName, setNewStoreName] = useState("");
    const [newStoreLocation, setNewStoreLocation] = useState("");
    const [editingStore, setEditingStore] = useState<StoreData | null>(null);
    const [isEditStoreOpen, setIsEditStoreOpen] = useState(false);
    const [editStoreName, setEditStoreName] = useState("");
    const [editStoreLocation, setEditStoreLocation] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: usersData, error: usersError } = await supabase
                .from('user_profiles')
                .select('*, stores(name)')
                .order('created_at', { ascending: false });

            if (usersError) throw usersError;
            setUsers(usersData || []);

            const { data: storesData, error: storesError } = await supabase
                .from('stores')
                .select('*')
                .order('created_at', { ascending: false });

            if (storesError) throw storesError;

            // Filter valid UUIDs if necessary, or just use all
            const validStores = (storesData || []).filter(store =>
                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(store.id)
            );
            setStores(validStores);

        } catch (error: unknown) {
            console.error('Erro ao carregar dados:', error);
            toast({
                title: "Erro",
                description: "Não foi possível carregar os dados do painel.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateStore = async () => {
        try {
            const { error } = await supabase
                .from('stores')
                .insert([{ name: newStoreName, location: newStoreLocation }]);

            if (error) throw error;

            toast({ title: "Sucesso", description: "Loja criada com sucesso!" });
            setNewStoreName('');
            setNewStoreLocation('');
            setIsCreateStoreOpen(false);
            fetchData();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Erro ao criar loja."
            toast({
                title: "Erro",
                description: errorMessage,
                variant: "destructive"
            });
        }
    };

    const openEditStoreModal = (store: StoreData) => {
        setEditingStore(store);
        setEditStoreName(store.name);
        setEditStoreLocation(store.location || '');
        setIsEditStoreOpen(true);
    };

    const handleUpdateStore = async () => {
        if (!editingStore) return;

        try {
            const { error } = await supabase
                .from('stores')
                .update({ name: editStoreName, location: editStoreLocation })
                .eq('id', editingStore.id);

            if (error) throw error;

            toast({ title: "Sucesso", description: "Loja atualizada com sucesso!" });
            setIsEditStoreOpen(false);
            setEditingStore(null);
            fetchData();
        } catch (error) {
            toast({
                title: "Erro",
                description: "Erro ao atualizar loja.",
                variant: "destructive"
            });
        }
    };

    const handleDeleteStore = async (storeId: string) => {
        if (!confirm("Tem certeza que deseja excluir esta loja?")) return;

        try {
            const { error } = await supabase
                .from('stores')
                .delete()
                .eq('id', storeId);

            if (error) throw error;

            toast({ title: "Sucesso", description: "Loja removida com sucesso!" });
            fetchData();
        } catch (error) {
            toast({
                title: "Erro",
                description: "Erro ao remover loja.",
                variant: "destructive"
            });
        }
    };

    const updateUserRole = async (userId: string, newRole: 'admin' | 'user' | 'gerente' | 'consultor') => {
        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({ role: newRole })
                .eq('id', userId);

            if (error) throw error;

            toast({ title: "Atualizado", description: "Permissão do usuário atualizada." });
            fetchData();
        } catch (error) {
            toast({ title: "Erro", description: "Falha ao atualizar permissão.", variant: "destructive" });
        }
    };

    const updateUserStore = async (userId: string, storeId: string) => {
        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({ store_id: storeId === 'none' ? null : storeId })
                .eq('id', userId);

            if (error) throw error;

            toast({ title: "Atualizado", description: "Loja do usuário atualizada." });
            fetchData();
        } catch (error) {
            toast({ title: "Erro", description: "Falha ao atualizar loja do usuário.", variant: "destructive" });
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="container mx-auto space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Painel Administrativo</h1>
                        <p className="text-muted-foreground">Gerencie usuários, permissões e lojas do sistema.</p>
                    </div>
                    <Button variant="outline" onClick={() => navigate('/')} className="w-full sm:w-auto">
                        Voltar ao Dashboard
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{users.length}</div>
                            <p className="text-xs text-muted-foreground">Usuários registrados na plataforma</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Lojas Ativas</CardTitle>
                            <Store className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stores.length}</div>
                            <p className="text-xs text-muted-foreground">Unidades operacionais cadastradas</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Administradores</CardTitle>
                            <Shield className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</div>
                            <p className="text-xs text-muted-foreground">Usuários com acesso total</p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="users" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="users">Gerenciar Usuários</TabsTrigger>
                        <TabsTrigger value="stores">Gerenciar Lojas</TabsTrigger>
                    </TabsList>

                    <TabsContent value="users" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Usuários do Sistema</CardTitle>
                                <CardDescription>Visualize e gerencie permissões de acesso.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Desktop Table */}
                                <div className="hidden md:block rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nome</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Função</TableHead>
                                                <TableHead>Loja Associada</TableHead>
                                                <TableHead>Data Registro</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {users.map((user) => (
                                                <TableRow key={user.id}>
                                                    <TableCell className="font-medium">{user.full_name || 'Sem nome'}</TableCell>
                                                    <TableCell>{user.email}</TableCell>
                                                    <TableCell>
                                                        <Select
                                                            defaultValue={user.role}
                                                            onValueChange={(val: 'admin' | 'user' | 'gerente' | 'consultor') => updateUserRole(user.id, val)}
                                                        >
                                                            <SelectTrigger className="w-[130px]">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="user">Usuário</SelectItem>
                                                                <SelectItem value="gerente">Gerente</SelectItem>
                                                                <SelectItem value="consultor">Consultor</SelectItem>
                                                                <SelectItem value="admin">Admin</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Select
                                                            defaultValue={user.store_id || 'none'}
                                                            onValueChange={(val) => updateUserStore(user.id, val)}
                                                        >
                                                            <SelectTrigger className="w-[200px]">
                                                                <SelectValue placeholder="Selecione uma loja" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="none">Nenhuma</SelectItem>
                                                                {stores.map(store => (
                                                                    <SelectItem key={store.id} value={store.id}>{store.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell>{user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Mobile Cards */}
                                <div className="md:hidden space-y-4">
                                    {users.map((user) => (
                                        <Card key={user.id}>
                                            <CardContent className="pt-6 space-y-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-muted-foreground">Nome</span>
                                                        <span className="font-medium">{user.full_name || 'Sem nome'}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-muted-foreground">Email</span>
                                                        <span className="text-sm break-all">{user.email}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-muted-foreground">Função</span>
                                                        <Select
                                                            defaultValue={user.role}
                                                            onValueChange={(val: 'admin' | 'user' | 'gerente' | 'consultor') => updateUserRole(user.id, val)}
                                                        >
                                                            <SelectTrigger className="w-[130px]">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="user">Usuário</SelectItem>
                                                                <SelectItem value="gerente">Gerente</SelectItem>
                                                                <SelectItem value="consultor">Consultor</SelectItem>
                                                                <SelectItem value="admin">Admin</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <span className="text-sm font-medium text-muted-foreground">Loja Associada</span>
                                                        <Select
                                                            defaultValue={user.store_id || 'none'}
                                                            onValueChange={(val) => updateUserStore(user.id, val)}
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Selecione uma loja" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="none">Nenhuma</SelectItem>
                                                                {stores.map(store => (
                                                                    <SelectItem key={store.id} value={store.id}>{store.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-muted-foreground">Data Registro</span>
                                                        <span className="text-sm">{user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="stores" className="space-y-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Lojas Cadastradas</CardTitle>
                                    <CardDescription>Adicione ou edite as unidades da rede.</CardDescription>
                                </div>
                                <Dialog open={isCreateStoreOpen} onOpenChange={setIsCreateStoreOpen}>
                                    <DialogTrigger asChild>
                                        <Button><Plus className="mr-2 h-4 w-4" /> Nova Loja</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Adicionar Nova Loja</DialogTitle>
                                            <DialogDescription>Preencha os dados da nova unidade.</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label>Nome da Loja</Label>
                                                <Input
                                                    placeholder="Ex: P.Borges - Lisboa"
                                                    value={newStoreName}
                                                    onChange={(e) => setNewStoreName(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Localização</Label>
                                                <Input
                                                    placeholder="Ex: Lisboa, Portugal"
                                                    value={newStoreLocation}
                                                    onChange={(e) => setNewStoreLocation(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsCreateStoreOpen(false)}>Cancelar</Button>
                                            <Button onClick={handleCreateStore}>Criar Loja</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                                <Dialog open={isEditStoreOpen} onOpenChange={setIsEditStoreOpen}>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Editar Loja</DialogTitle>
                                            <DialogDescription>Atualize os dados da unidade.</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label>Nome da Loja</Label>
                                                <Input
                                                    value={editStoreName}
                                                    onChange={(e) => setEditStoreName(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Localização</Label>
                                                <Input
                                                    value={editStoreLocation}
                                                    onChange={(e) => setEditStoreLocation(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsEditStoreOpen(false)}>Cancelar</Button>
                                            <Button onClick={handleUpdateStore}>Salvar Alterações</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nome da Loja</TableHead>
                                                <TableHead>Localização</TableHead>
                                                <TableHead>ID do Sistema</TableHead>
                                                <TableHead>Data Criação</TableHead>
                                                <TableHead className="text-right">Ações</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {stores.map((store) => (
                                                <TableRow key={store.id}>
                                                    <TableCell className="font-medium">{store.name}</TableCell>
                                                    <TableCell>{store.location || '-'}</TableCell>
                                                    <TableCell className="font-mono text-xs text-muted-foreground">{store.id}</TableCell>
                                                    <TableCell>{store.created_at ? new Date(store.created_at).toLocaleDateString() : '-'}</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => openEditStoreModal(store)}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-destructive hover:text-destructive/90"
                                                                onClick={() => handleDeleteStore(store.id)}
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
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
