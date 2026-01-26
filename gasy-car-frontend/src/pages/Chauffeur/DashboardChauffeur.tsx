import { useState } from "react";
import {
    Search,
    Bell,
    Menu,
    Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import DriverSidebar from "./LayoutChauffer/DriverSidebar";
import DashboardOverview from "./DashboardOverview";
import RidesView from "./RidesView";
import EarningsView from "./EarningsView";
import VehicleView from "./VehicleView";
import StatsView from "./StatsView";
import SettingsView from "./SettingsView";

const DriverDashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Fonction pour rendre le contenu dynamique
    const renderContent = () => {
        switch (activeTab) {
            case "dashboard": return <DashboardOverview setActiveTab={setActiveTab} />;
            case "rides": return <RidesView />;
            case "earnings": return <EarningsView />;
            case "vehicle": return <VehicleView />;
            case "stats": return <StatsView />;
            case "settings": return <SettingsView />;
            default: return <DashboardOverview setActiveTab={setActiveTab} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-roboto overflow-x-hidden">
            
            {/* SIDEBAR CHAUFFEUR */}
            <DriverSidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                isOpen={isSidebarOpen}
            />

            {/* MAIN CONTENT */}
            <main 
                className={`flex-1 p-8 transition-all duration-300 ease-in-out ${
                    isSidebarOpen ? "lg:ml-64" : "lg:ml-0"
                }`}
            >

                {/* TOP BAR */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            <Menu className="w-6 h-6" />
                        </Button>

                        {/* Titre dynamique */}
                        <h2 className="text-2xl font-bold text-gray-900 font-poppins">
                            {activeTab === 'dashboard' ? "Tableau de Bord Chauffeur" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Rechercher une course..."
                                className="pl-10 bg-white border-gray-200 rounded-xl focus:ring-red-500/20"
                            />
                        </div>

                        {/* BOUTON ACCUEIL */}
                        <Link to="/">
                            <button 
                                className="relative p-2.5 bg-white rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-red-500 transition-colors shadow-sm"
                                title="Retour à l'accueil"
                            >
                                <Home className="w-5 h-5" />
                            </button>
                        </Link>

                        <button className="relative p-2.5 bg-white rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors shadow-sm">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        
                        {/* Profil Link vers Settings */}
                        <div 
                            onClick={() => setActiveTab('settings')}
                            className="h-10 w-10 rounded-xl bg-gray-200 overflow-hidden border border-gray-200 cursor-pointer shadow-sm hover:ring-2 hover:ring-red-500/50 transition-all"
                        >
                            <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </header>

                {/* DYNAMIC CONTENT */}
                {renderContent()}

            </main>
        </div>
    );
};

export default DriverDashboard;