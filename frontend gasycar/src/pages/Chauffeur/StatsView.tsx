import { BarChart3, Clock, DollarSign, Users, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const StatsView = () => {
    
    // Données de démo
    const mainStats = [
        { title: "Courses Totales", value: "350", icon: BarChart3, color: "text-red-600", trend: "+12%" },
        { title: "Heures Actives", value: "520", icon: Clock, color: "text-blue-600", trend: "+5%" },
        { title: "Note Client", value: "4.8", icon: Users, color: "text-green-600", trend: "0" },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold font-poppins">Statistiques de Performance</h2>
            
            {/* SÉLECTEUR DE PÉRIODE */}
            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl">Mois</Button>
                    <Button variant="default" className="rounded-xl bg-red-600 hover:bg-red-700">Semaine</Button>
                    <Button variant="outline" className="rounded-xl">Jour</Button>
                </div>
                <Button variant="outline" className="rounded-xl">Toutes les Périodes <ChevronDown className="w-4 h-4 ml-2" /></Button>
            </div>

            {/* MAIN STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mainStats.map((stat, index) => (
                    <Card key={index} className="border-none shadow-md rounded-2xl">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{stat.trend}</span>
                            </div>
                            <p className="text-4xl font-bold text-gray-900 mt-4 mb-1">{stat.value}</p>
                            <p className="text-sm text-gray-500">{stat.title}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* HEATMAP/RIDE DISTRIBUTION */}
            <Card className="border-none shadow-md rounded-2xl">
                <CardHeader>
                    <CardTitle>Distribution des Courses par Heure</CardTitle>
                    <CardDescription>Visualisez les heures de pointe pour optimiser votre temps.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Placeholder for chart */}
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed text-gray-400">
                        
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default StatsView;