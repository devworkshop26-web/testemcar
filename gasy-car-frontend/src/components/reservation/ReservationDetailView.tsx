import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { ReservationStatusBadge } from "@/components/reservation/ReservationStatusBadge";
import { ReservationVehicleCard } from "@/components/reservation/ReservationVehicleCard";
import { ReservationTripCard } from "@/components/reservation/ReservationTripCard";
import { ReservationFinancialCard } from "@/components/reservation/ReservationFinancialCard";
import { ReservationClientCard } from "@/components/reservation/ReservationClientCard";
import { ReservationEquipmentsCard } from "@/components/reservation/ReservationEquipmentsCard";
import { ReservationServicesCard } from "@/components/reservation/ReservationServicesCard";
import { ReservationDriverCard } from "@/components/reservation/ReservationDriverCard";
import { ReservationMetadataCard } from "@/components/reservation/ReservationMetadataCard";
import { Reservation } from "@/types/reservationsType";

interface ReservationDetailViewProps {
    reservation: Reservation | undefined;
    isLoading: boolean;
    backUrl: string;
    actions?: ReactNode;
    alerts?: ReactNode;
}

export const ReservationDetailView = ({
    reservation,
    isLoading,
    backUrl,
    actions,
    alerts,
}: ReservationDetailViewProps) => {
    const navigate = useNavigate();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!reservation) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <AlertCircle className="w-16 h-16 text-red-500" />
                <h2 className="text-2xl font-bold text-gray-900">Réservation introuvable</h2>
                <Button onClick={() => navigate(backUrl)}>Retour à la liste</Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12 p-6">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(backUrl)}
                        className="rounded-full h-10 w-10 bg-white shadow-sm hover:bg-gray-50 transition-all hover:scale-105"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Réservation {reservation.reference}
                            </h1>
                            <ReservationStatusBadge status={reservation.status} />
                        </div>
                        <p className="text-gray-500 text-sm mt-1">
                            Effectuée le {formatDate(reservation.created_at || "")}
                        </p>
                    </div>
                </div>

                {/* Role-specific action buttons */}
                {actions && <div className="flex gap-3">{actions}</div>}
            </div>

            {/* Role-specific alerts */}
            {alerts}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COLUMN - MAIN INFO */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Financial Summary - Most Important */}
                    <ReservationFinancialCard reservation={reservation} />

                    {/* Vehicle and Trip Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ReservationVehicleCard reservation={reservation} />
                        <ReservationTripCard reservation={reservation} />
                    </div>

                    {/* Additional Services Section */}
                    {(reservation.driver_data ||
                        (reservation.equipments_data && reservation.equipments_data.length > 0) ||
                        (reservation.services_data && reservation.services_data.length > 0)) && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                                    Services et Options
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Driver Card - show if driver is assigned */}
                                    {reservation.driver_data && (
                                        <ReservationDriverCard driver={reservation.driver_data} />
                                    )}

                                    {/* Equipments Card - show if equipments exist */}
                                    {reservation.equipments_data && reservation.equipments_data.length > 0 && (
                                        <ReservationEquipmentsCard reservation={reservation} />
                                    )}
                                </div>

                                {/* Services Card - full width if exists */}
                                {reservation.services_data && reservation.services_data.length > 0 && (
                                    <ReservationServicesCard reservation={reservation} />
                                )}
                            </div>
                        )}
                </div>

                {/* RIGHT COLUMN - METADATA & PEOPLE */}
                <div className="space-y-8">
                    {/* Metadata */}
                    <ReservationMetadataCard reservation={reservation} />

                    {/* People Involved */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <span className="w-1 h-6 bg-primary rounded-full"></span>
                            Intervenants
                        </h3>
                        <ReservationClientCard user={reservation.client_data} title="Client" />
                        {reservation.vehicle_data?.proprietaire_data && (
                            <ReservationClientCard user={reservation.vehicle_data.proprietaire_data} title="Propriétaire" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
