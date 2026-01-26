import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
    CreditCard, 
    ShieldCheck, 
    FileText, 
    CheckCircle, 
    Clock, 
    AlertCircle, 
    DollarSign,
    TrendingUp,
    Receipt,
    ExternalLink,
    Eye
} from "lucide-react";
import { Reservation } from "@/types/reservationsType";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ReservationFinancialCardProps {
    reservation: Reservation;
    onProofClick?: (url: string) => void;
    onPaymentAction?: (action: 'validate' | 'reject' | 'view') => void;
    className?: string;
}

export const ReservationFinancialCard = ({ 
    reservation, 
    onProofClick, 
    onPaymentAction,
    className 
}: ReservationFinancialCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const formatCurrency = (amount: string | number) => {
        const numAmount = Number(amount);
        return numAmount.toLocaleString("fr-FR", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }) + " Ar";
    };

    const getPaymentStatusConfig = (status: string) => {
        const configs = {
            "VALIDATED": {
                label: "Validé",
                color: "bg-green-50 text-green-700 border-green-200",
                icon: CheckCircle,
                iconColor: "text-green-600",
                bgColor: "bg-green-500/10",
                progress: 100,
                progressColor: "bg-green-500"
            },
            "PENDING": {
                label: "En attente",
                color: "bg-orange-50 text-orange-700 border-orange-200",
                icon: Clock,
                iconColor: "text-orange-600",
                bgColor: "bg-orange-500/10",
                progress: 50,
                progressColor: "bg-orange-500"
            },
            "REJECTED": {
                label: "Rejeté",
                color: "bg-red-50 text-red-700 border-red-200",
                icon: AlertCircle,
                iconColor: "text-red-600",
                bgColor: "bg-red-500/10",
                progress: 100,
                progressColor: "bg-red-500"
            },
            "PARTIAL": {
                label: "Partiel",
                color: "bg-blue-50 text-blue-700 border-blue-200",
                icon: TrendingUp,
                iconColor: "text-blue-600",
                bgColor: "bg-blue-500/10",
                progress: 75,
                progressColor: "bg-blue-500"
            }
        };

        return configs[status as keyof typeof configs] || {
            label: status,
            color: "bg-gray-50 text-gray-700 border-gray-200",
            icon: CreditCard,
            iconColor: "text-gray-600",
            bgColor: "bg-gray-500/10",
            progress: 0,
            progressColor: "bg-gray-500"
        };
    };

    const calculateAmounts = () => {
        const baseAmount = Number(reservation.base_amount) || 0;
        const optionsAmount = Number(reservation.options_amount) || 0;
        const totalAmount = Number(reservation.total_amount) || 0;
        const cautionAmount = Number(reservation.caution_amount) || 0;

        const basePercentage = totalAmount > 0 ? (baseAmount / totalAmount) * 100 : 0;
        const optionsPercentage = totalAmount > 0 ? (optionsAmount / totalAmount) * 100 : 0;

        return {
            baseAmount,
            optionsAmount,
            totalAmount,
            cautionAmount,
            basePercentage: Math.round(basePercentage),
            optionsPercentage: Math.round(optionsPercentage)
        };
    };

    const amounts = calculateAmounts();
    const statusConfig = getPaymentStatusConfig(reservation.payment?.status || "PENDING");
    const StatusIcon = statusConfig.icon;

    const paymentAmount = reservation.payment?.amount ? Number(reservation.payment.amount) : 0;
    const paidPercentage = amounts.totalAmount > 0 ? (paymentAmount / amounts.totalAmount) * 100 : 0;

    return (
        <Card className={cn(
            "border-none shadow-2xl rounded-2xl overflow-hidden bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm",
            "transform transition-all duration-300 hover:shadow-3xl hover:-translate-y-0.5",
            className
        )}>
            {/* Header avec gradient */}
            <CardHeader className="relative p-0">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70"></div>
                <div className="relative p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                            <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-xl text-white font-bold">Résumé financier</CardTitle>
                            <p className="text-white/80 text-sm mt-1">Détails complets des transactions</p>
                        </div>
                    </div>
                    
                    <Badge className={cn(
                        "px-4 py-2 rounded-full border-0 font-semibold shadow-lg",
                        statusConfig.color
                    )}>
                        <StatusIcon className={`w-4 h-4 mr-2 ${statusConfig.iconColor}`} />
                        {statusConfig.label}
                    </Badge>
                </div>

                {/* Barre de progression du statut */}
                <div className="relative px-6 pb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white/90">Progression du paiement</span>
                        <span className="text-sm font-bold text-white">{Math.round(paidPercentage)}%</span>
                    </div>
                    <Progress 
                        value={paidPercentage} 
                        className="h-2 bg-white/20"
                        indicatorClassName={cn("h-2", statusConfig.progressColor)}
                    />
                </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
                {/* Montants principaux avec visualisation */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-primary" />
                            Détail des montants
                        </h3>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-primary hover:text-primary/80"
                        >
                            {isExpanded ? "Réduire" : "Voir détails"}
                        </Button>
                    </div>

                    {/* Barres de répartition */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Location ({reservation.total_days} jours)</span>
                            <span className="font-semibold">{formatCurrency(amounts.baseAmount)}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                                style={{ width: `${amounts.basePercentage}%` }}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Services & Options</span>
                            <span className="font-semibold">{formatCurrency(amounts.optionsAmount)}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-500 delay-100"
                                style={{ width: `${amounts.optionsPercentage}%` }}
                            />
                        </div>
                    </div>

                    {/* Total avec effet visuel */}
                    <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-500">Montant total</p>
                                <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                    {formatCurrency(amounts.totalAmount)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Caution</p>
                                <p className="text-xl font-bold text-orange-600">{formatCurrency(amounts.cautionAmount)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section caution avec effet visuel */}
                <div className={cn(
                    "p-5 rounded-xl border transition-all duration-300",
                    "bg-gradient-to-br from-orange-50 to-amber-50/50 border-orange-100",
                    "hover:shadow-lg hover:border-orange-200"
                )}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <ShieldCheck className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-orange-700 uppercase tracking-wide">Caution remboursable</p>
                                <p className="text-xs text-orange-600/80">Garantie de sécurité</p>
                            </div>
                        </div>
                        <Badge variant="outline" className="bg-white text-orange-700 border-orange-200">
                            Remboursable
                        </Badge>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(amounts.cautionAmount)}</p>
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Sera restituée après</p>
                            <p className="text-sm font-semibold text-gray-900">Vérification du véhicule</p>
                        </div>
                    </div>
                </div>

                {/* Détails du paiement (expandable) */}
                {reservation.payment && (
                    <div className={cn(
                        "space-y-4 transition-all duration-300 overflow-hidden",
                        isExpanded ? "max-h-[1000px]" : "max-h-0"
                    )}>
                        <div className="pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Receipt className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Détails du paiement</h4>
                                    <p className="text-sm text-gray-500">Informations sur la transaction</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Statut détaillé */}
                                <div className="p-4 rounded-lg bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                                    <p className="text-xs text-gray-500 mb-1">Statut du paiement</p>
                                    <div className="flex items-center gap-2">
                                        <StatusIcon className={`w-5 h-5 ${statusConfig.iconColor}`} />
                                        <p className="font-semibold text-gray-900">{statusConfig.label}</p>
                                    </div>
                                    {paidPercentage > 0 && (
                                        <div className="mt-2">
                                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                <span>Montant payé</span>
                                                <span>{formatCurrency(paymentAmount)}</span>
                                            </div>
                                            <Progress 
                                                value={paidPercentage} 
                                                className="h-1.5"
                                                indicatorClassName={statusConfig.progressColor}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Mode de paiement */}
                                {reservation.payment.mode_data && (
                                    <div className="p-4 rounded-lg bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                                        <p className="text-xs text-gray-500 mb-1">Mode de paiement</p>
                                        <div className="flex items-center gap-3">
                                            {reservation.payment.mode_data.image && (
                                                <div className="p-2 bg-white border border-gray-200 rounded-lg">
                                                    <img 
                                                        src={reservation.payment.mode_data.image} 
                                                        alt={reservation.payment.mode_data.name} 
                                                        className="h-6 object-contain" 
                                                    />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-gray-900">{reservation.payment.mode_data.name}</p>
                                                <p className="text-xs text-gray-500">Méthode sécurisée</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Dates */}
                                <div className="p-4 rounded-lg bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                                    <p className="text-xs text-gray-500 mb-1">Date de création</p>
                                    <p className="font-semibold text-gray-900">
                                        {new Date(reservation.payment.created_at || "").toLocaleDateString("fr-FR", {
                                            weekday: 'long',
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        à {new Date(reservation.payment.created_at || "").toLocaleTimeString("fr-FR", {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>

                                {/* Référence */}
                                {reservation.payment.reason && (
                                    <div className="p-4 rounded-lg bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                                        <p className="text-xs text-gray-500 mb-1">Référence transaction</p>
                                        <p className="font-mono font-semibold text-gray-900 text-sm">
                                            {reservation.payment.reason}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Preuve de paiement avec aperçu amélioré */}
                            {reservation.payment.proof_image && (
                                <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="font-semibold text-gray-900 flex items-center gap-2">
                                                <FileText className="w-5 h-5 text-primary" />
                                                Preuve de paiement
                                            </p>
                                            <p className="text-sm text-gray-500">Document justificatif</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-2"
                                                onClick={() => {
                                                    if (onProofClick) {
                                                        onProofClick(reservation.payment?.proof_image || "");
                                                    } else if (reservation.payment?.proof_image) {
                                                        window.open(reservation.payment.proof_image, '_blank');
                                                    }
                                                }}
                                            >
                                                <Eye className="w-4 h-4" />
                                                Voir
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-2"
                                                onClick={() => {
                                                    if (reservation.payment?.proof_image) {
                                                        window.open(reservation.payment.proof_image, '_blank');
                                                    }
                                                }}
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                Ouvrir
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="relative group cursor-pointer" onClick={() => {
                                        if (onProofClick) {
                                            onProofClick(reservation.payment?.proof_image || "");
                                        } else if (reservation.payment?.proof_image) {
                                            window.open(reservation.payment.proof_image, '_blank');
                                        }
                                    }}>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                            <div className="text-white p-3 bg-black/50 rounded-full backdrop-blur-sm">
                                                <Eye className="w-6 h-6" />
                                            </div>
                                        </div>
                                        <img
                                            src={reservation.payment.proof_image}
                                            alt="Preuve de paiement"
                                            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 transition-all duration-300 group-hover:scale-[1.02] group-hover:border-primary"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Actions de paiement (si besoin) */}
                            {onPaymentAction && reservation.payment.status === "PENDING" && (
                                <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                                    <p className="font-semibold text-primary mb-3">Actions de gestion</p>
                                    <div className="flex gap-3">
                                        <Button
                                            onClick={() => onPaymentAction('validate')}
                                            className="flex-1 bg-green-600 hover:bg-green-700"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Valider le paiement
                                        </Button>
                                        <Button
                                            onClick={() => onPaymentAction('reject')}
                                            variant="outline"
                                            className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                                        >
                                            <AlertCircle className="w-4 h-4 mr-2" />
                                            Rejeter
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Bouton pour développer/réduire si payment existe */}
                {reservation.payment && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-full border-t border-gray-100 pt-4 mt-2 text-primary hover:text-primary/80"
                    >
                        {isExpanded ? (
                            <>
                                <span className="mr-2">↑</span>
                                Réduire les détails
                            </>
                        ) : (
                            <>
                                <span className="mr-2">↓</span>
                                Voir tous les détails du paiement
                            </>
                        )}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};