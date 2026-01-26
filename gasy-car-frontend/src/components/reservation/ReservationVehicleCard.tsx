import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Briefcase } from "lucide-react";
import { Reservation } from "@/types/reservationsType";

interface ReservationVehicleCardProps {
    reservation: Reservation;
}

export const ReservationVehicleCard = ({ reservation }: ReservationVehicleCardProps) => {
    return (
        <Card className="border-none shadow-lg rounded-2xl overflow-hidden h-full">
            <CardHeader className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6">
                <div className="flex items-center gap-2">
                    <Car className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">Véhicule réservé</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-8">
                    <div className="w-full sm:w-64 h-40 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 relative group">
                        <img
                            src={reservation.vehicle_data?.photos?.[0]?.image || "/placeholder-car.jpg"}
                            alt="Vehicle"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    </div>
                    <div className="space-y-4 flex-1">
                        <div>
                            <h4 className="text-2xl font-bold text-gray-900">
                                {reservation.vehicle_data?.marque_data?.nom} {reservation.vehicle_data?.modele_data?.label}
                            </h4>
                            <p className="text-gray-500 font-medium">{reservation.vehicle_data?.categorie_data?.nom}</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                                {reservation.vehicle_data?.transmission_data?.nom}
                            </Badge>
                            <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                                {reservation.vehicle_data?.type_carburant_data?.nom}
                            </Badge>
                            <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                                {reservation.vehicle_data?.nombre_places} places
                            </Badge>
                        </div>

                        {reservation.with_chauffeur && (
                            <div className="flex items-center gap-2 text-primary font-semibold bg-primary/10 px-3 py-2 rounded-lg w-fit">
                                <Briefcase className="w-4 h-4" />
                                <span>Avec chauffeur inclus</span>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
