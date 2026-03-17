import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Calendar, MapPin, Settings, Clock } from "lucide-react";
import { Reservation } from "@/types/reservationsType";

interface ReservationMetadataCardProps {
    reservation: Reservation;
}

export const ReservationMetadataCard = ({ reservation }: ReservationMetadataCardProps) => {
    const getDrivingModeLabel = (mode: string) => {
        return mode === "SELF_DRIVE" ? "Je conduis (Self-drive)" : "Avec chauffeur pro";
    };

    const getPricingZoneLabel = (zone: string) => {
        return zone === "URBAIN" ? "Zone Urbaine" : "Province";
    };

    const getDriverSourceLabel = (source: string) => {
        const labels: Record<string, string> = {
            NONE: "Aucun (Self-drive)",
            PROVIDER: "Chauffeur Prestataire",
            ADMIN_POOL: "Pool Admin",
        };
        return labels[source] || source;
    };

    const formatDateTime = (dateString: string) => {
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
                    <Info className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">Informations complémentaires</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                {/* Driving Mode */}
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Settings className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Mode de conduite</p>
                        <p className="font-medium text-gray-900">
                            {getDrivingModeLabel(reservation.driving_mode)}
                        </p>
                    </div>
                </div>

                {/* Pricing Zone */}
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Zone de tarification</p>
                        <p className="font-medium text-gray-900">
                            {getPricingZoneLabel(reservation.pricing_zone)}
                        </p>
                    </div>
                </div>

                {/* Driver Source */}
                {reservation.with_chauffeur && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Info className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">Source du chauffeur</p>
                            <p className="font-medium text-gray-900">
                                {getDriverSourceLabel(reservation.driver_source)}
                            </p>
                        </div>
                    </div>
                )}

                {/* Total Days */}
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Durée totale</p>
                        <p className="font-medium text-gray-900">
                            {reservation.total_days} jour{reservation.total_days > 1 ? "s" : ""}
                        </p>
                    </div>
                </div>

                {/* Created At */}
                {reservation.created_at && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">Créée le</p>
                            <p className="font-medium text-gray-900 text-sm">
                                {formatDateTime(reservation.created_at)}
                            </p>
                        </div>
                    </div>
                )}

                {/* Updated At */}
                {reservation.updated_at && reservation.updated_at !== reservation.created_at && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">Dernière modification</p>
                            <p className="font-medium text-gray-900 text-sm">
                                {formatDateTime(reservation.updated_at)}
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
