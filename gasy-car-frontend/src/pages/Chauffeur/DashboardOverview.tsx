import { Car, Clock, DollarSign, BarChart2, CheckCircle2, ChevronRight, User, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DashboardOverview = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
    
    // Données de démo
    const stats = [
        { icon: DollarSign, title: "Gains du jour", value: "85,000 Ar", color: "text-green-600", bg: "bg-green-50" },
        { icon: Route, title: "Courses complétées", value: "5", color: "text-blue-600", bg: "bg-blue-50" },
        { icon: Clock, title: "Heures en ligne", value: "6h 45m", color: "text-yellow-600", bg: "bg-yellow-50" },
        { icon: BarChart2, title: "Note moyenne", value: "4.9 / 5", color: "text-red-600", bg: "bg-red-50" },
    ];

    const currentRide = {
        client: "Ravelo M.",
        pickup: "Analakely",
        dropoff: "Ivandry (Zone ZES)",
        fare: "18,000 Ar",
        time: "10:30 AM",
        status: "En route vers client",
        minutes: "5 min",
    };

    const recentRides = [
        { id: 1, client: "Sophie L.", fare: "22,000 Ar", date: "Hier", status: "Terminé" },
        { id: 2, client: "Paul V.", fare: "15,000 Ar", date: "Hier", status: "Terminé" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* STATS GRID */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="border-none shadow-md rounded-2xl">
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* MAIN CONTENT: Active Ride & Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ACTIVE RIDE */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 font-poppins">Course Actuelle</h3>
                    
                    <Card className="border-none shadow-xl rounded-2xl bg-red-500/10 border-red-200">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center text-red-700">
                                <span>{currentRide.status}</span>
                                <Badge variant="default" className="bg-red-600 hover:bg-red-700">{currentRide.minutes}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-inner">
                                <div className="flex items-center gap-3">
                                    <User className="w-5 h-5 text-gray-500" />
                                    <p className="font-semibold text-gray-900">{currentRide.client}</p>
                                </div>
                                <span className="text-lg font-bold text-red-600">{currentRide.fare}</span>
                            </div>
                            
                            <div className="space-y-3 pl-2 border-l-2 border-gray-200">
                                <div className="flex items-center gap-3">
                                    <span className="w-3 h-3 block rounded-full bg-green-500"></span>
                                    <p className="text-gray-700 font-medium">Départ: <span className="font-normal text-gray-500">{currentRide.pickup}</span></p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="w-3 h-3 block rounded-full bg-red-500"></span>
                                    <p className="text-gray-700 font-medium">Arrivée: <span className="font-normal text-gray-500">{currentRide.dropoff}</span></p>
                                </div>
                            </div>
                            
                            <div className="flex gap-3 pt-2">
                                <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl">Accepter</Button>
                                <Button variant="outline" className="flex-1 rounded-xl text-red-600 border-red-200">Refuser</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <h3 className="text-xl font-bold text-gray-900 font-poppins mt-8">Courses Récentes</h3>
                    <div className="space-y-3">
                        {recentRides.map((ride) => (
                            <Card key={ride.id} className="border-none shadow-sm hover:shadow-md transition-shadow rounded-xl cursor-pointer" onClick={() => setActiveTab('rides')}>
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-gray-900">Course avec {ride.client}</h5>
                                            <p className="text-xs text-gray-500">{ride.date} • {ride.status}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-sm text-green-600">{ride.fare}</span>
                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* SIDE INFO (Notes & Tips) */}
                <div className="space-y-6">
                    {/* Note & Disponibilité */}
                    <Card className="border-none shadow-md rounded-2xl bg-gray-900 text-white">
                        <CardContent className="p-6 text-center">
                            <h3 className="text-2xl font-bold">4.9 / 5.0</h3>
                            <p className="text-gray-400 text-sm mb-4">Note Chauffeur</p>
                            <Button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl">Changer de Statut (En Ligne)</Button>
                        </CardContent>
                    </Card>

                    {/* Prochains entretiens/document */}
                    <Card className="border-none shadow-md rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-lg">Alertes Véhicule</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl cursor-pointer hover:bg-yellow-100 transition-colors" onClick={() => setActiveTab('vehicle')}>
                                <div className="w-10 h-10 bg-yellow-200 rounded-lg flex items-center justify-center text-yellow-700">
                                    <Car className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">Contrôle technique</p>
                                    <p className="text-xs text-gray-500">Échéance dans 15 jours</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => setActiveTab('settings')}>
                                <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center text-blue-700">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">Permis de conduire</p>
                                    <p className="text-xs text-gray-500">À mettre à jour (scan)</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;