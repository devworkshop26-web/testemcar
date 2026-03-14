import {
    LayoutDashboard,
    Car,
    Clock,
    DollarSign,
    Settings,
    LogOut,
    Route, // Nouvelle icône pour les courses
    BarChart3, // Nouvelle icône pour les statistiques
} from "lucide-react";

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    isOpen: boolean;
}

const DriverSidebar = ({ activeTab, setActiveTab, isOpen }: SidebarProps) => {
    const menuItems = [
        { id: "dashboard", icon: LayoutDashboard, label: "Aperçu Général" },
        { id: "rides", icon: Route, label: "Courses & Demandes" },
        { id: "earnings", icon: DollarSign, label: "Mes Revenus" },
        { id: "vehicle", icon: Car, label: "Mon Véhicule" },
        { id: "stats", icon: BarChart3, label: "Statistiques" },
        { id: "settings", icon: Settings, label: "Mon Profil" },
    ];

    return (
        <aside
            className={`fixed h-full z-20 bg-white transition-all duration-300 ease-in-out overflow-hidden border-r border-gray-200 ${
                isOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full lg:translate-x-0 lg:w-0 lg:border-none"
            }`}
        >
            <div className="flex flex-col h-full w-64">
                {/* Header / Logo */}
                <div className="p-6 flex items-center gap-3">
                    <div className="w-10 h-10 min-w-[2.5rem] bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-lg text-white">
                        <Car className="w-6 h-6" />
                    </div>
                    <div className="whitespace-nowrap overflow-hidden">
                        <h1 className="text-xl font-bold font-poppins text-gray-900">Gasy'Driver</h1>
                        <p className="text-xs text-gray-500">Espace Partenaire</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto scrollbar-none">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                                activeTab === item.id
                                    ? "bg-red-50 text-red-600 shadow-sm ring-1 ring-red-100"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                        >
                            <item.icon className={`w-5 h-5 min-w-[1.25rem] ${activeTab === item.id ? "text-red-600" : "text-gray-500"}`} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl text-sm font-medium transition-colors whitespace-nowrap">
                        <LogOut className="w-5 h-5 min-w-[1.25rem]" />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default DriverSidebar;