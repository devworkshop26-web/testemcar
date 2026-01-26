import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Reservation } from "@/types/reservationsType";

interface ReservationTripCardProps {
    reservation: Reservation;
}

export const ReservationTripCard = ({ reservation }: ReservationTripCardProps) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <Card className="border-none shadow-lg rounded-2xl overflow-hidden h-full">
            <CardHeader className="border-b border-gray-100 p-6">
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">Détails du trajet</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                    {/* Timeline connector line (desktop only) */}
                    <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px bg-gray-200 -translate-x-1/2"></div>

                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="mt-1 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 shadow-sm">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Départ</p>
                                <p className="font-bold text-gray-900 text-lg">{formatDate(reservation.start_datetime)}</p>
                                <div className="flex items-center gap-2 mt-2 text-gray-600 bg-gray-50 p-2 rounded-lg">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-sm">{reservation.pickup_location}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="mt-1 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0 shadow-sm">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Retour</p>
                                <p className="font-bold text-gray-900 text-lg">{formatDate(reservation.end_datetime)}</p>
                                {reservation.dropoff_location && (
                                    <div className="flex items-center gap-2 mt-2 text-gray-600 bg-gray-50 p-2 rounded-lg">
                                        <MapPin className="w-4 h-4" />
                                        <span className="text-sm">{reservation.dropoff_location}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
                    <div className="bg-gray-900 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                        Durée totale : {reservation.total_days} jours
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
