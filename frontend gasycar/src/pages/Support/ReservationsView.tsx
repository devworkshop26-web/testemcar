import { Car, MapPin, Calendar, Clock, CheckCircle2, XCircle, Ban, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SupportReservationPage from "./reservation/SupportReservation";

const ReservationsView = () => {
    
    const reservationsData = [
        { id: "RES-4590", client: "Jean Dupont", status: "Confirmée", car: "Toyota Vitz", dates: "26 Nov - 28 Nov", amount: "150,000 Ar", color: "bg-green-600" },
        { id: "RES-4589", client: "Sarah Ravelo", status: "Annulée", car: "Renault Duster", dates: "24 Nov - 27 Nov", amount: "200,000 Ar", color: "bg-gray-400" },
        { id: "RES-4588", client: "Paul Rakoto", status: "En attente", car: "Mitsubishi L200", dates: "29 Nov - 05 Dec", amount: "350,000 Ar", color: "bg-yellow-600" },
        { id: "RES-4587", client: "Marie Fara", status: "Terminée", car: "Peugeot 208", dates: "20 Nov - 23 Nov", amount: "100,000 Ar", color: "bg-blue-600" },
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Confirmée": return <CheckCircle2 className="w-4 h-4 text-white" />;
            case "Annulée": return <XCircle className="w-4 h-4 text-white" />;
            case "En attente": return <Clock className="w-4 h-4 text-white" />;
            case "Terminée": return <Car className="w-4 h-4 text-white" />;
            default: return <Ban className="w-4 h-4 text-white" />;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <SupportReservationPage />
            <h2 className="text-2xl font-bold font-poppins">Gérer les Réservations</h2>
            
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {["Toutes", "Confirmées", "En Attente", "À Venir", "Terminées", "Annulées"].map((cat, i) => (
                    <button key={i} className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${i === 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                        {cat}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {reservationsData.map((res) => (
                    <Card key={res.id} className="border-none shadow-md hover:shadow-lg transition-all rounded-2xl">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                {/* Car & Dates */}
                                <div className="flex-1 w-full">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-lg text-gray-900">{res.car} - {res.client}</h4>
                                        <Badge className={`text-xs ${res.color} hover:opacity-90`}>
                                            {getStatusIcon(res.status)} <span className="ml-1">{res.status}</span>
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-3 font-mono">{res.id}</p>

                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <Calendar className="w-4 h-4 text-blue-500" />
                                        <span>{res.dates}</span>
                                        <MapPin className="w-4 h-4 text-blue-500" />
                                        <span>Agence Antananarivo</span>
                                    </div>
                                </div>
                                
                                <div className="w-full md:w-auto flex flex-col items-end">
                                    <span className="text-xl font-bold text-blue-600 mb-2">{res.amount}</span>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" className="rounded-xl text-blue-600">Modifier</Button>
                                        <Button size="sm" className="rounded-xl bg-blue-600 hover:bg-blue-700">Détails</Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        
        </div>
    );
};

export default ReservationsView;