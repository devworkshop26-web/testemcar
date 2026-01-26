import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, AlertCircle, Calendar, User, Car, MapPin, Phone, Mail, CreditCard, Wrench } from "lucide-react";
import { Reservation } from "@/types/reservationsType";
import { ReservationStatusBadge } from "./ReservationStatusBadge";
import { ReservationFinancialCard } from "./ReservationFinancialCard";
import { ReservationVehicleCard } from "./ReservationVehicleCard";
import { ReservationTripCard } from "./ReservationTripCard";
import { ReservationDriverCard } from "./ReservationDriverCard";
import { ReservationEquipmentsCard } from "./ReservationEquipmentsCard";
import { ReservationServicesCard } from "./ReservationServicesCard";
import { ReservationMetadataCard } from "./ReservationMetadataCard";
import { ReservationClientCard } from "./ReservationClientCard";

interface ReservationDetailViewProps {
    reservation: Reservation | undefined;
    isLoading: boolean;
    isError?: boolean;
    error?: string;
    backUrl: string;
    actions?: ReactNode;
    alerts?: ReactNode;
    onRetry?: () => void;
}

const LoadingSkeleton = () => (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 px-4 sm:px-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
                <Skeleton className="rounded-full h-10 w-10" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-48" />
                </div>
            </div>
            <div className="flex gap-3">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="lg:w-2/3 space-y-8 min-w-0">
                {/* Financial Card Skeleton */}
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-32" />
                            <Separator />
                            <div className="grid grid-cols-2 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-6 w-32" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Vehicle and Trip Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[...Array(2)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-5 w-5" />
                                        <Skeleton className="h-6 w-32" />
                                    </div>
                                    <Separator />
                                    {[...Array(3)].map((_, j) => (
                                        <div key={j} className="flex justify-between items-center">
                                            <Skeleton className="h-4 w-20" />
                                            <Skeleton className="h-5 w-28" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3 space-y-8 flex-shrink-0">
                {/* Metadata Skeleton */}
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <Skeleton className="h-6 w-40" />
                        <Separator />
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex justify-between">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Clients Skeleton */}
                <Card>
                    <CardContent className="p-6 space-y-6">
                        <Skeleton className="h-6 w-32" />
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="space-y-3">
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
);

const ErrorState = ({ error, backUrl, onRetry }: { error?: string; backUrl: string; onRetry?: () => void }) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center p-6">
            <div className="relative">
                <AlertCircle className="w-20 h-20 text-red-500 animate-pulse" />
                <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-20"></div>
            </div>
            
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Erreur de chargement</h2>
                <p className="text-gray-600 max-w-md">
                    {error || "Impossible de charger les détails de la réservation. Veuillez réessayer."}
                </p>
            </div>

            <div className="flex gap-4 mt-4">
                {onRetry && (
                    <Button 
                        onClick={onRetry}
                        variant="outline"
                        className="gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Réessayer
                    </Button>
                )}
                <Button 
                    onClick={() => navigate(backUrl)}
                    className="gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour à la liste
                </Button>
            </div>
        </div>
    );
};

const EmptyState = ({ backUrl }: { backUrl: string }) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center p-6">
            <div className="relative">
                <AlertCircle className="w-20 h-20 text-amber-500" />
                <div className="absolute -inset-2 bg-amber-100 rounded-full opacity-50"></div>
            </div>
            
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Réservation introuvable</h2>
                <p className="text-gray-600 max-w-md">
                    La réservation que vous recherchez n'existe pas ou a été supprimée.
                </p>
            </div>

            <Button 
                onClick={() => navigate(backUrl)}
                className="gap-2 mt-4"
            >
                <ArrowLeft className="w-4 h-4" />
                Retour à la liste
            </Button>
        </div>
    );
};

export const ReservationDetailView = ({
    reservation,
    isLoading,
    isError = false,
    error,
    backUrl,
    actions,
    alerts,
    onRetry,
}: ReservationDetailViewProps) => {
    const navigate = useNavigate();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            weekday: 'long',
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getDateInfo = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const diffTime = Math.abs(date.getTime() - today.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return {
            formatted: formatDate(dateString),
            isToday: diffDays === 0,
            isPast: date < today,
            diffDays
        };
    };

    const getQuickActions = () => {
        const actions = [
            {
                icon: MapPin,
                label: "Modifier le trajet",
                onClick: () => console.log("Modifier trajet"),
                variant: "outline" as const
            },
            {
                icon: Car,
                label: "Changer de véhicule",
                onClick: () => console.log("Changer véhicule"),
                variant: "outline" as const
            },
            {
                icon: CreditCard,
                label: "Gérer le paiement",
                onClick: () => console.log("Gérer paiement"),
                variant: "outline" as const
            },
            {
                icon: Wrench,
                label: "Ajouter un service",
                onClick: () => console.log("Ajouter service"),
                variant: "outline" as const
            }
        ];

        return actions;
    };

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (isError) {
        return <ErrorState error={error} backUrl={backUrl} onRetry={onRetry} />;
    }

    if (!reservation) {
        return <EmptyState backUrl={backUrl} />;
    }

    const createdDateInfo = getDateInfo(reservation.created_at || "");
    const quickActions = getQuickActions();

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-12 px-4 sm:px-6">
            {/* HEADER */}
            <div className="bg-white py-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                    <div className="flex items-start md:items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate(backUrl)}
                            className="rounded-full h-10 w-10 bg-white shadow-sm hover:bg-gray-50 transition-all hover:scale-105 hover:shadow-md flex-shrink-0"
                            aria-label="Retour"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                <h1 className="text-2xl font-bold text-gray-900 truncate">
                                    Réservation {reservation.reference}
                                </h1>
                                <ReservationStatusBadge status={reservation.status} />
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span className={`${createdDateInfo.isToday ? 'text-primary font-medium' : ''}`}>
                                        {createdDateInfo.formatted}
                                        {createdDateInfo.isToday && " (Aujourd'hui)"}
                                    </span>
                                </div>
                                
                                {reservation.client_data && (
                                    <>
                                        <span className="text-gray-300">•</span>
                                        <div className="flex items-center gap-1">
                                            <User className="w-4 h-4" />
                                            <span>{reservation.client_data.first_name} {reservation.client_data.last_name}</span>
                                        </div>
                                    </>
                                )}
                                
                                {reservation.vehicle_data && (
                                    <>
                                        <span className="text-gray-300">•</span>
                                        <div className="flex items-center gap-1">
                                            <Car className="w-4 h-4" />
                                            <span className="truncate">{reservation.vehicle_data.brand} {reservation.vehicle_data.model}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    {actions && (
                        <div className="flex flex-wrap gap-3 justify-end">
                            {actions}
                        </div>
                    )}
                </div>
            </div>

            {/* Alerts */}
            {alerts && (
                <div className="animate-in fade-in duration-300">
                    {alerts}
                </div>
            )}

            {/* MAIN CONTENT GRID - 2/3 pour le contenu principal, 1/3 pour la sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* LEFT/MAIN CONTENT - 2 colonnes sur 3 */}
                <div className="lg:col-span-2 space-y-6 md:space-y-8">
                    {/* Financial Summary - Full width */}
                    <div className="animate-in slide-in-from-left-4 duration-500">
                        <ReservationFinancialCard 
                            reservation={reservation}
                        />
                    </div>

                        <div className="animate-in slide-in-from-left-4 duration-500 delay-100">
                            <ReservationVehicleCard 
                                reservation={reservation}
                            />
                        </div>
                        <div className="animate-in slide-in-from-left-4 duration-500 delay-150">
                            <ReservationTripCard 
                                reservation={reservation}
                            />
                        </div>

                    {/* Services Section - Conditional rendering */}
                    {(reservation.driver_data ||
                        (reservation.equipments_data?.length ?? 0) > 0 ||
                        (reservation.services_data?.length ?? 0) > 0) && (
                            <div className="space-y-6 animate-in fade-in duration-500 delay-200">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                                    <div className="h-8 w-1.5 bg-gradient-to-b from-primary to-primary/60 rounded-full flex-shrink-0"></div>
                                    <span>Services et Options</span>
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Driver */}
                                    {reservation.driver_data && (
                                        <div className="animate-in fade-in duration-300">
                                            <ReservationDriverCard 
                                                driver={reservation.driver_data}
                                            />
                                        </div>
                                    )}

                                    {/* Equipments */}
                                    {reservation.equipments_data && reservation.equipments_data.length > 0 && (
                                        <div className="animate-in fade-in duration-300">
                                            <ReservationEquipmentsCard 
                                                reservation={reservation}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Services - Full width */}
                                {reservation.services_data && reservation.services_data.length > 0 && (
                                    <div className="animate-in fade-in duration-300">
                                        <ReservationServicesCard 
                                            reservation={reservation}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                </div>

                {/* RIGHT SIDEBAR - 1 colonne sur 3 */}
                <div className="space-y-6 md:space-y-8">
                    {/* Metadata */}
                    <div className="animate-in slide-in-from-right-4 duration-500">
                        <ReservationMetadataCard 
                            reservation={reservation}
                        />
                    </div>

                    {/* People Involved */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                            <div className="h-8 w-1.5 bg-gradient-to-b from-primary to-primary/60 rounded-full flex-shrink-0"></div>
                            <span>Intervenants</span>
                        </h3>
                        
                        <div className="space-y-4">
                            <div className="animate-in fade-in duration-300">
                                <ReservationClientCard 
                                    user={reservation.client_data} 
                                    title="Client"
                                />
                            </div>
                            
                            {reservation.vehicle_data?.proprietaire_data && (
                                <div className="animate-in fade-in duration-300 delay-100">
                                    <ReservationClientCard 
                                        user={reservation.vehicle_data.proprietaire_data} 
                                        title="Propriétaire"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions Card */}
                 

                    {/* Contact Info Card */}
                    <Card className="border-blue-100 bg-blue-50/50">
                        <CardContent className="p-6">
                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Phone className="w-4 h-4 text-blue-600" />
                                Contacts utiles
                            </h4>
                            <div className="space-y-3">
                                <div className="p-3 bg-white rounded-lg border border-blue-100">
                                    <p className="text-sm font-semibold text-gray-900 mb-1">Support technique</p>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone className="w-3 h-3" />
                                        <span>+261 34 XX XX XX</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                        <Mail className="w-3 h-3" />
                                        <span>support@example.com</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-white rounded-lg border border-blue-100">
                                    <p className="text-sm font-semibold text-gray-900 mb-1">Service client</p>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone className="w-3 h-3" />
                                        <span>+261 32 XX XX XX</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                        <Mail className="w-3 h-3" />
                                        <span>client@example.com</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};