import { Euro, Calendar, MessageSquare, Timer, Package, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ModeToggle } from "@/components/mode-toggle";

const StoreDashboard = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();

    const menuItems = [
        {
            title: "Dashboard KPI's",
            icon: Euro,
            path: "/dashboard",
            color: "bg-[#FFC72C]",
        },
        {
            title: "Controle de validade",
            icon: Calendar,
            path: "/products",
            color: "bg-[#FFC72C]",
        },
        {
            title: "Gestão de consumos",
            icon: MessageSquare,
            path: "/utilities",
            color: "bg-[#FFC72C]",
        },
        {
            title: "Folha de caixa",
            icon: Timer,
            path: "/cash-register",
            color: "bg-[#FFC72C]",
        },
        {
            title: "ADMIN",
            icon: Wrench,
            path: "/admin",
            color: "bg-[#FFC72C]",
            adminOnly: true, // Mark this item as admin-only
        },
    ];

    // Filter menu items based on admin status
    const visibleMenuItems = menuItems.filter(item => !item.adminOnly || isAdmin);

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="mx-auto max-w-6xl">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-foreground">Painel de Operações</h1>
                    <ModeToggle />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
                    {visibleMenuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => navigate(item.path)}
                            className={`${item.color} group relative flex h-48 w-full flex-col items-center justify-center rounded-lg shadow-md transition-all hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2`}
                        >
                            <div className="mb-4 rounded-full border-2 border-black p-3 transition-transform group-hover:scale-110">
                                <item.icon className="h-8 w-8 text-black" strokeWidth={2} />
                            </div>
                            <span className="text-xl font-bold text-black">{item.title}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StoreDashboard;
