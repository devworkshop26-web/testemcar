import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, ShieldCheck, FileText } from "lucide-react";
import { Reservation } from "@/types/reservationsType";

interface ReservationFinancialCardProps {
    reservation: Reservation;
    onProofClick?: (url: string) => void;
}

export const ReservationFinancialCard = ({ reservation, onProofClick }: ReservationFinancialCardProps) => {
    const formatCurrency = (amount: string | number) => {
        return Number(amount).toLocaleString("fr-FR") + " Ar";
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

    return (
        <Card className="border-none shadow-lg rounded-2xl overflow-hidden bg-white h-full">
            <CardHeader className="bg-primary/5 border-b border-primary/10 p-6">
                <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg text-primary">Résumé financier</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Montant de base ({reservation.total_days} jours)</span>
                        <span className="font-medium">{formatCurrency(reservation.base_amount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Options & Services</span>
                        <span className="font-medium">{formatCurrency(reservation.options_amount)}</span>
                    </div>
                    <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="font-bold text-gray-900 text-lg">Total</span>
                        <span className="text-2xl font-bold text-primary">{formatCurrency(reservation.total_amount)}</span>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-100">
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="w-4 h-4 text-orange-600" />
                        <p className="text-xs font-bold text-orange-700 uppercase">Caution remboursable</p>
                    </div>
                    <p className="font-bold text-gray-900 text-lg">{formatCurrency(reservation.caution_amount)}</p>
                </div>

                {/* PAYMENT DETAILS */}
                {reservation.payment && (
                    <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
                        <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            <p className="font-semibold text-gray-900">Détails du paiement</p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm text-gray-600">Statut</span>
                                <Badge className={`${getPaymentStatusColor(reservation.payment.status)} border`}>
                                    {getPaymentStatusLabel(reservation.payment.status)}
                                </Badge>
                            </div>

                            {reservation.payment.reason && (
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Référence</p>
                                    <p className="font-mono font-semibold text-gray-900">{reservation.payment.reason}</p>
                                </div>
                            )}

                            {reservation.payment.mode_data && (
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Mode de paiement</p>
                                    <div className="flex items-center gap-2">
                                        {reservation.payment.mode_data.image && (
                                            <img src={reservation.payment.mode_data.image} alt="" className="h-6 object-contain" />
                                        )}
                                        <p className="font-semibold text-gray-900">{reservation.payment.mode_data.name}</p>
                                    </div>
                                </div>
                            )}

                            {reservation.payment.created_at && (
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Date de création</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {new Date(reservation.payment.created_at).toLocaleDateString("fr-FR", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            )}

                            {reservation.payment.updated_at && reservation.payment.updated_at !== reservation.payment.created_at && (
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Dernière modification</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {new Date(reservation.payment.updated_at).toLocaleDateString("fr-FR", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            )}

                            {reservation.payment.proof_image && (
                                <div>
                                    <p className="text-xs text-gray-500 mb-2">Preuve de paiement</p>
                                    <img
                                        src={reservation.payment.proof_image}
                                        alt="Preuve de paiement"
                                        className="w-full h-40 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={() => {
                                            if (onProofClick) {
                                                onProofClick(reservation.payment?.proof_image || "");
                                            } else if (reservation.payment?.proof_image) {
                                                window.open(reservation.payment.proof_image, '_blank');
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
