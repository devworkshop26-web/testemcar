import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    ArrowLeft,
    AlertCircle,
    CreditCard,
    Calendar,
    Car,
    Package,
    FileText,
    Clock,
    Info,
    MapPin,
    ShieldCheck,
    Briefcase,
    User,
    Phone,
    Mail,
    Settings,
    UserCheck,
} from "lucide-react";
import { Reservation } from "@/types/reservationsType";
import { ReservationStatusBadge } from "@/components/reservation/ReservationStatusBadge";
import { useUpdateReservationPaymentMutation } from "@/useQuery/reservationsUseQuery";

interface ReservationDetailProProps {
    reservation: Reservation | undefined;
    isLoading: boolean;
    backUrl: string;
    actions?: ReactNode;
    alerts?: ReactNode;
}

export const ReservationDetailPro = ({
    reservation,
    isLoading,
    backUrl,
    actions,
    alerts,
}: ReservationDetailProProps) => {
    const navigate = useNavigate();
    const updatePaymentMutation = useUpdateReservationPaymentMutation();

    const handleProviderPayment = async () => {
        if (!reservation?.payment?.id) {
            toast.error("Aucun paiement n'est encore associé à cette réservation.");
            return;
        }

        try {
            await updatePaymentMutation.mutateAsync({
                id: reservation.payment.id,
                payload: { status: "VALIDATED" },
            });
            toast.success("Paiement validé par le prestataire.");
        } catch (error) {
            toast.error("Impossible de valider le paiement pour le moment.");
        }
    };

    // ============ UTILITY FUNCTIONS ============
    const formatCurrency = (amount: string | number) => {
        return Number(amount).toLocaleString("fr-FR") + " Ar";
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDateShort = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case "VALIDATED":
                return "bg-green-100 text-green-700 border-green-200";
            case "PENDING":
                return "bg-orange-100 text-orange-700 border-orange-200";
            case "REJECTED":
                return "bg-red-100 text-red-700 border-red-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getPaymentStatusLabel = (status: string) => {
        switch (status) {
            case "VALIDATED":
                return "Validé";
            case "PENDING":
                return "En attente";
            case "REJECTED":
                return "Rejeté";
            default:
                return status;
        }
    };

    const getDrivingModeLabel = (mode: string) => {
        return mode === "SELF_DRIVE" ? "Self-Drive" : "Avec Chauffeur";
    };

    const getPricingZoneLabel = (zone: string) => {
        return zone === "URBAIN" ? "Urbain" : "Province";
    };

    const getDriverSourceLabel = (source: string) => {
        switch (source) {
            case "PROVIDER":
                return "Prestataire";
            case "ADMIN_POOL":
                return "Pool Admin";
            default:
                return "Aucun";
        }
    };

    // ============ LOADING STATE ============
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
                    <p className="text-gray-500 font-medium">Chargement des détails...</p>
                </div>
            </div>
        );
    }

    // ============ NOT FOUND STATE ============
    if (!reservation) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                <div className="bg-red-50 p-6 rounded-full">
                    <AlertCircle className="w-16 h-16 text-red-500" />
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold text-gray-900">Réservation introuvable</h2>
                    <p className="text-gray-500">Cette réservation n'existe pas ou a été supprimée.</p>
                </div>
                <Button onClick={() => navigate(backUrl)} size="lg" className="mt-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour à la liste
                </Button>
            </div>
        );
    }

    // ============ MAIN RENDER ============
    return (
        <div className="min-h-screen bg-gray-50">
            {/* ============ STICKY HEADER ============ */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Left: Title + Status */}
                        <div className="flex items-start gap-4">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => navigate(backUrl)}
                                className="rounded-full h-11 w-11 flex-shrink-0 hover:bg-gray-100 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                                        Réservation {reservation.reference}
                                    </h1>
                                    <ReservationStatusBadge status={reservation.status} />
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    Créée le {formatDateShort(reservation.created_at || "")} • {reservation.total_days} jours • {reservation.pickup_location}
                                </p>
                            </div>
                        </div>

                        {/* Right: Actions */}
                        {actions && (
                            <div className="flex gap-3 flex-wrap">
                                {actions}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ============ ALERTS ============ */}
            {alerts && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                    {alerts}
                </div>
            )}

            {/* ============ MAIN CONTENT ============ */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ============ LEFT COLUMN (2/3) ============ */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* SECTION 1: RÉSUMÉ FINANCIER */}
                        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="border-b border-gray-100 bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-primary" />
                                    <h2 className="text-xl font-semibold text-gray-900">Résumé financier</h2>
                                </div>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* Montants */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-600">Montant de base ({reservation.total_days} jours)</span>
                                        <span className="font-semibold text-gray-900">{formatCurrency(reservation.base_amount)}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-600">Options & Services</span>
                                        <span className="font-semibold text-gray-900">{formatCurrency(reservation.options_amount)}</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-900">Total</span>
                                        <span className="text-3xl font-bold text-primary">{formatCurrency(reservation.total_amount)}</span>
                                    </div>
                                </div>

                                {/* Caution */}
                                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <ShieldCheck className="w-5 h-5 text-orange-600" />
                                        <p className="text-xs font-bold text-orange-700 uppercase tracking-wide">Caution remboursable</p>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(reservation.caution_amount)}</p>
                                </div>

                                {/* État paiement */}
                                {reservation.payment && (
                                    <div className="border-t border-gray-100 pt-6 space-y-4">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-primary" />
                                            <h3 className="font-semibold text-gray-900">Détails du paiement</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <p className="text-xs text-gray-500 mb-1">Statut</p>
                                                <Badge className={`${getPaymentStatusColor(reservation.payment.status)} border`}>
                                                    {getPaymentStatusLabel(reservation.payment.status)}
                                                </Badge>
                                            </div>

                                            {reservation.payment.mode_data && (
                                                <div className="bg-gray-50 rounded-lg p-4">
                                                    <p className="text-xs text-gray-500 mb-2">Mode de paiement</p>
                                                    <div className="flex items-center gap-2">
                                                        {reservation.payment.mode_data.image && (
                                                            <img src={reservation.payment.mode_data.image} alt="" className="h-6 object-contain" />
                                                        )}
                                                        <p className="font-semibold text-gray-900">{reservation.payment.mode_data.name}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {reservation.payment.reason && (
                                                <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                                                    <p className="text-xs text-gray-500 mb-1">Référence</p>
                                                    <p className="font-mono font-semibold text-gray-900 text-sm">{reservation.payment.reason}</p>
                                                </div>
                                            )}
                                        </div>

                                        {reservation.payment.proof_image && (
                                            <div>
                                                <p className="text-xs text-gray-500 mb-2">Preuve de paiement</p>
                                                <img
                                                    src={reservation.payment.proof_image}
                                                    alt="Preuve de paiement"
                                                    className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                                                    onClick={() => reservation.payment?.proof_image && window.open(reservation.payment.proof_image, '_blank')}
                                                />
                                            </div>
                                        )}

                                        <div className="flex flex-wrap gap-3">
                                            <Button
                                                variant="default"
                                                onClick={handleProviderPayment}
                                                disabled={
                                                    updatePaymentMutation.isPending ||
                                                    reservation.payment.status === "VALIDATED"
                                                }
                                            >
                                                {updatePaymentMutation.isPending
                                                    ? "Validation..."
                                                    : "Paiement par le prestataire"}
                                            </Button>
                                            {reservation.payment.status === "VALIDATED" && (
                                                <span className="text-xs text-gray-500 self-center">
                                                    Paiement déjà validé.
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* SECTION 2: TRAJET & PLANNING */}
                        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="border-b border-gray-100 px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    <h2 className="text-xl font-semibold text-gray-900">Trajet & Planning</h2>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="relative">
                                    {/* Timeline */}
                                    <div className="absolute left-6 top-12 bottom-12 w-0.5 bg-gray-200"></div>

                                    <div className="space-y-8">
                                        {/* Départ */}
                                        <div className="flex gap-4">
                                            <div className="relative z-10 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 shadow-md border-4 border-white">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 pt-1">
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Départ</p>
                                                <p className="text-lg font-bold text-gray-900 mb-2">{formatDate(reservation.start_datetime)}</p>
                                                <div className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg">
                                                    <MapPin className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                                                    <span className="text-sm text-gray-700">{reservation.pickup_location}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Retour */}
                                        <div className="flex gap-4">
                                            <div className="relative z-10 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0 shadow-md border-4 border-white">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 pt-1">
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Retour</p>
                                                <p className="text-lg font-bold text-gray-900 mb-2">{formatDate(reservation.end_datetime)}</p>
                                                {reservation.dropoff_location && (
                                                    <div className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg">
                                                        <MapPin className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                                                        <span className="text-sm text-gray-700">{reservation.dropoff_location}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Durée totale */}
                                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
                                        <div className="bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg">
                                            Durée totale : {reservation.total_days} jours
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* SECTION 3: VÉHICULE */}
                        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="border-b border-gray-100 bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <Car className="w-5 h-5 text-primary" />
                                    <h2 className="text-xl font-semibold text-white">Véhicule réservé</h2>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Photo */}
                                    <div className="w-full md:w-80 h-56 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 group">
                                        <img
                                            src={reservation.vehicle_data?.photos?.[0]?.image || "/placeholder-car.jpg"}
                                            alt="Vehicle"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>

                                    {/* Infos */}
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <h3 className="text-3xl font-bold text-gray-900">
                                                {reservation.vehicle_data?.marque_data?.nom} {reservation.vehicle_data?.modele_data?.label}
                                            </h3>
                                            <p className="text-lg text-gray-600 font-medium mt-1">{reservation.vehicle_data?.categorie_data?.nom}</p>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1">
                                                {reservation.vehicle_data?.transmission_data?.nom}
                                            </Badge>
                                            <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1">
                                                {reservation.vehicle_data?.type_carburant_data?.nom}
                                            </Badge>
                                            <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1">
                                                {reservation.vehicle_data?.nombre_places} places
                                            </Badge>
                                        </div>

                                        {reservation.with_chauffeur && (
                                            <div className="flex items-center gap-2 text-primary font-semibold bg-primary/10 px-4 py-3 rounded-lg w-fit">
                                                <Briefcase className="w-5 h-5" />
                                                <span>Avec chauffeur inclus</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* SECTION 4: OPTIONS & SERVICES */}
                        {((reservation.equipments_data && reservation.equipments_data.length > 0) ||
                            (reservation.services_data && reservation.services_data.length > 0)) && (
                                <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="border-b border-gray-100 px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Package className="w-5 h-5 text-primary" />
                                            <h2 className="text-xl font-semibold text-gray-900">Options & Services</h2>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b border-gray-200">
                                                        <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nom</th>
                                                        <th className="text-center py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Quantité</th>
                                                        <th className="text-right py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Prix unitaire</th>
                                                        <th className="text-right py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {/* Équipements */}
                                                    {reservation.equipments_data?.map((equipment) => (
                                                        <tr key={equipment.id} className="hover:bg-gray-50 transition-colors">
                                                            <td className="py-3 px-4 text-sm font-medium text-gray-900">{equipment.label}</td>
                                                            <td className="py-3 px-4 text-sm text-center text-gray-600">1</td>
                                                            <td className="py-3 px-4 text-sm text-right text-gray-600">{formatCurrency(equipment.price || 0)}</td>
                                                            <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900">{formatCurrency(equipment.price || 0)}</td>
                                                        </tr>
                                                    ))}

                                                    {/* Services */}
                                                    {reservation.services_data?.map((service) => (
                                                        <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                                                            <td className="py-3 px-4 text-sm font-medium text-gray-900">{service.service_name}</td>
                                                            <td className="py-3 px-4 text-sm text-center text-gray-600">{service.quantity}</td>
                                                            <td className="py-3 px-4 text-sm text-right text-gray-600">{formatCurrency(service.price)}</td>
                                                            <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900">
                                                                {formatCurrency(Number(service.price) * service.quantity)}
                                                            </td>
                                                        </tr>
                                                    ))}

                                                    {/* Total */}
                                                    <tr className="bg-gray-50 font-bold">
                                                        <td colSpan={3} className="py-4 px-4 text-right text-gray-900">Total Options & Services</td>
                                                        <td className="py-4 px-4 text-right text-primary text-lg">{formatCurrency(reservation.options_amount)}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </section>
                            )}
                    </div>

                    {/* ============ RIGHT COLUMN (1/3) ============ */}
                    <div className="space-y-8">
                        {/* SECTION 7: MÉTADONNÉES */}
                        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="border-b border-gray-100 px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-primary" />
                                    <h2 className="text-lg font-semibold text-gray-900">Informations système</h2>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Référence</p>
                                    <p className="font-mono text-lg font-bold text-gray-900">{reservation.reference}</p>
                                </div>

                                <div className="border-t border-gray-100 pt-4">
                                    <p className="text-xs text-gray-500 mb-1">ID Système</p>
                                    <p className="font-mono text-xs text-gray-500">{reservation.id}</p>
                                </div>

                                <div className="border-t border-gray-100 pt-4">
                                    <p className="text-xs text-gray-500 mb-1">Créée le</p>
                                    <p className="text-sm font-medium text-gray-900">{formatDate(reservation.created_at || "")}</p>
                                </div>

                                {reservation.updated_at && reservation.updated_at !== reservation.created_at && (
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Modifiée le</p>
                                        <p className="text-sm font-medium text-gray-900">{formatDate(reservation.updated_at)}</p>
                                    </div>
                                )}

                                <div className="border-t border-gray-100 pt-4 space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-2">Mode de conduite</p>
                                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                                            {getDrivingModeLabel(reservation.driving_mode)}
                                        </Badge>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500 mb-2">Zone tarifaire</p>
                                        <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                                            {getPricingZoneLabel(reservation.pricing_zone)}
                                        </Badge>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500 mb-2">Source chauffeur</p>
                                        <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                                            {getDriverSourceLabel(reservation.driver_source)}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* SECTION 8: CLIENT & PRESTATAIRE */}
                        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="border-b border-gray-100 px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <User className="w-5 h-5 text-primary" />
                                    <h2 className="text-lg font-semibold text-gray-900">Intervenants</h2>
                                </div>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* Client */}
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Client</p>
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
                                            {reservation.client_data?.first_name?.[0]}{reservation.client_data?.last_name?.[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 truncate">
                                                {reservation.client_data?.first_name} {reservation.client_data?.last_name}
                                            </p>
                                            {reservation.client_data?.phone && (
                                                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                                                    <Phone className="w-3.5 h-3.5" />
                                                    <span>{reservation.client_data.phone}</span>
                                                </div>
                                            )}
                                            {reservation.client_data?.email && (
                                                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                                                    <Mail className="w-3.5 h-3.5" />
                                                    <span className="truncate">{reservation.client_data.email}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Propriétaire */}
                                {reservation.vehicle_data?.proprietaire_data && (
                                    <div className="border-t border-gray-100 pt-6">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Propriétaire</p>
                                        <div className="flex items-start gap-3">
                                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-lg flex-shrink-0">
                                                {reservation.vehicle_data.proprietaire_data.first_name?.[0]}{reservation.vehicle_data.proprietaire_data.last_name?.[0]}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900 truncate">
                                                    {reservation.vehicle_data.proprietaire_data.first_name} {reservation.vehicle_data.proprietaire_data.last_name}
                                                </p>
                                                {reservation.vehicle_data.proprietaire_data.phone && (
                                                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                                                        <Phone className="w-3.5 h-3.5" />
                                                        <span>{reservation.vehicle_data.proprietaire_data.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* SECTION 9: CHAUFFEUR */}
                        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="border-b border-gray-100 px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <UserCheck className="w-5 h-5 text-primary" />
                                    <h2 className="text-lg font-semibold text-gray-900">Chauffeur</h2>
                                </div>
                            </div>
                            <div className="p-6">
                                {/* Cas 1: Chauffeur assigné */}
                                {reservation.driver_data ? (
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg flex-shrink-0">
                                            {reservation.driver_data.first_name?.[0]}{reservation.driver_data.last_name?.[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900">
                                                {reservation.driver_data.first_name} {reservation.driver_data.last_name}
                                            </p>
                                            {reservation.driver_data.phone_number && (
                                                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                                                    <Phone className="w-3.5 h-3.5" />
                                                    <span>{reservation.driver_data.phone_number}</span>
                                                </div>
                                            )}
                                            <div className="mt-2 flex items-center gap-2">
                                                <Badge className={reservation.driver_data.is_available ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}>
                                                    {reservation.driver_data.is_available ? "Disponible" : "Indisponible"}
                                                </Badge>
                                                {reservation.driver_data.experience_years && (
                                                    <span className="text-xs text-gray-500">{reservation.driver_data.experience_years} ans d'expérience</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : reservation.driver_source === "ADMIN_POOL" ? (
                                    /* Cas 2: En attente d'assignation admin */
                                    <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-lg p-4">
                                        <Info className="w-5 h-5 text-orange-600 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold text-orange-900">En attente d'assignation</p>
                                            <p className="text-sm text-orange-700 mt-1">Un chauffeur sera assigné par l'administrateur</p>
                                        </div>
                                    </div>
                                ) : (
                                    /* Cas 3: Self-drive */
                                    <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <Car className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold text-blue-900">Client conduit</p>
                                            <p className="text-sm text-blue-700 mt-1">Mode self-drive (sans chauffeur)</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};
