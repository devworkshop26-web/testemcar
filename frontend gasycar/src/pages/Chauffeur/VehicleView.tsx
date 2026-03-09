import { Car, Tag, Calendar, FileText, CheckCircle2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const VehicleView = () => {
    
    const vehicleInfo = {
        name: "Toyota Vitz 2022",
        plate: "1234 TAA",
        color: "Bleu Nuit",
        year: 2022,
        docs: [
            { name: "Permis de conduire", status: "Valide", expiry: "12/2026", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
            { name: "Assurance", status: "Expire bientôt", expiry: "01/2026", color: "bg-yellow-100 text-yellow-700", icon: AlertTriangle },
            { name: "Carte Grise", status: "Valide", expiry: "N/A", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
        ],
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold font-poppins">Mon Véhicule 🚗</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Vehicle Card */}
                <Card className="border-none shadow-md rounded-2xl lg:col-span-1">
                    <div className="h-48 bg-gray-200 rounded-t-2xl overflow-hidden">
                        <img src="/src/assets/car-placeholder.jpg" alt={vehicleInfo.name} className="w-full h-full object-cover" />
                    </div>
                    <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{vehicleInfo.name}</h3>
                        <p className="text-sm text-gray-500 mb-4">{vehicleInfo.plate} • {vehicleInfo.color}</p>
                        
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm text-gray-700">
                                <div className="flex items-center gap-2"><Tag className="w-4 h-4"/> Année</div>
                                <span className="font-medium">{vehicleInfo.year}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-700">
                                <div className="flex items-center gap-2"><Car className="w-4 h-4"/> Type</div>
                                <span className="font-medium">Citadine</span>
                            </div>
                        </div>
                        <Button className="w-full mt-6 bg-red-600 hover:bg-red-700 rounded-xl">Modifier Infos</Button>
                    </CardContent>
                </Card>

                {/* Docs & Maintenance */}
                <div className="space-y-6 lg:col-span-2">
                    <Card className="border-none shadow-md rounded-2xl">
                        <CardHeader>
                            <CardTitle>Documents du Chauffeur/Véhicule</CardTitle>
                            <CardDescription>Assurez-vous que tous vos documents sont valides.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {vehicleInfo.docs.map((doc, index) => (
                                <div key={index} className="flex justify-between items-center p-3 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${doc.color}`}>
                                            <doc.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{doc.name}</p>
                                            <p className="text-xs text-gray-500">Expiration: {doc.expiry}</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" className="rounded-xl">Télécharger</Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md rounded-2xl">
                        <CardHeader>
                            <CardTitle>Prochain Entretien</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-4">
                                    <Calendar className="w-6 h-6 text-blue-600" />
                                    <div>
                                        <p className="font-medium text-gray-900">Vidange Moteur</p>
                                        <p className="text-sm text-gray-500">Prévue: 15 Mars 2026</p>
                                    </div>
                                </div>
                                <Button size="sm" variant="outline" className="rounded-xl">Historique</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default VehicleView;