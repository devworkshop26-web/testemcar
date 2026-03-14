import { Car, Clock, MapPin, CheckCircle2, XCircle, ChevronRight, Route } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const RidesView = () => {
    
    const ridesData = [
        { id: 1, client: "Ravalitera J.", status: "Actif", fare: "35,000 Ar", date: "Aujourd'hui, 14:00", type: "Réservation", pickup: "Anosy", dropoff: "Aéroport Ivato", badgeClass: "bg-red-600 hover:bg-red-700" },
        { id: 2, client: "Andrianina R.", status: "Terminé", fare: "12,500 Ar", date: "23 Nov, 18:30", type: "Immédiat", pickup: "Antanimena", dropoff: "67Ha Nord", badgeClass: "bg-green-600 hover:bg-green-700" },
        { id: 3, client: "Rakoto N.", status: "Annulé", fare: "0 Ar", date: "23 Nov, 10:00", type: "Immédiat", pickup: "Tana Water Front", dropoff: "Ambohijatovo", badgeClass: "bg-gray-400 hover:bg-gray-500" },
        { id: 4, client: "Fenosoa L.", status: "Terminé", fare: "8,000 Ar", date: "22 Nov, 08:00", type: "Immédiat", pickup: "Alarobia", dropoff: "Itaosy", badgeClass: "bg-green-600 hover:bg-green-700" },
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Actif": return <Clock className="w-4 h-4 text-red-600" />;
            case "Terminé": return <CheckCircle2 className="w-4 h-4 text-green-600" />;
            case "Annulé": return <XCircle className="w-4 h-4 text-gray-500" />;
            default: return <Route className="w-4 h-4 text-gray-600" />;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold font-poppins">Courses & Demandes</h2>
            
            <div className="space-y-4">
                {ridesData.map((ride) => (
                    <Card key={ride.id} className="border-none shadow-md hover:shadow-lg transition-all rounded-2xl">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                {/* Status & Icon */}
                                <div className={`w-12 h-12 min-w-[3rem] rounded-xl flex items-center justify-center text-white shadow-lg ${ride.badgeClass}`}>
                                    {getStatusIcon(ride.status)}
                                </div>
                                
                                <div className="flex-1 w-full">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-lg text-gray-900">{ride.client} ({ride.type})</h4>
                                        <Badge className={`text-xs ${ride.badgeClass}`}>{ride.status}</Badge>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-3">{ride.date}</p>

                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <MapPin className="w-4 h-4 text-green-500" />
                                        <span>{ride.pickup}</span>
                                        <ChevronRight className="w-3 h-3 text-gray-400" />
                                        <span>{ride.dropoff}</span>
                                    </div>
                                </div>
                                
                                <div className="w-full md:w-auto flex flex-col items-end">
                                    <span className="text-xl font-bold text-red-600 mb-2">{ride.fare}</span>
                                    {ride.status === 'Actif' && (
                                        <Button size="sm" className="rounded-xl bg-red-600 hover:bg-red-700">Voir la carte</Button>
                                    )}
                                    {ride.status === 'Terminé' && (
                                        <Button size="sm" variant="outline" className="rounded-xl text-gray-600">Détails</Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default RidesView;