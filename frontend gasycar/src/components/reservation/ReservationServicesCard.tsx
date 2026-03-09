import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks } from "lucide-react";
import { Reservation } from "@/types/reservationsType";

interface ReservationServicesCardProps {
    reservation: Reservation;
}

export const ReservationServicesCard = ({ reservation }: ReservationServicesCardProps) => {
    const services = reservation.services_data || [];

    if (services.length === 0) {
        return null; // Don't show card if no services
    }

    const getServiceTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            ASSURANCE: "Assurance",
            CHAUFFEUR: "Chauffeur",
            EQUIPEMENT: "Équipement",
            AUTRE: "Autre",
        };
        return labels[type] || type;
    };

    const getServiceTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            ASSURANCE: "bg-blue-100 text-blue-700",
            CHAUFFEUR: "bg-green-100 text-green-700",
            EQUIPEMENT: "bg-purple-100 text-purple-700",
            AUTRE: "bg-gray-100 text-gray-700",
        };
        return colors[type] || "bg-gray-100 text-gray-700";
    };

    const formatCurrency = (amount: string | number) => {
        return new Intl.NumberFormat("fr-FR").format(Number(amount));
    };

    return (
        <Card className="border-none shadow-lg rounded-2xl overflow-hidden h-full">
            <CardHeader className="border-b border-gray-100 p-6">
                <div className="flex items-center gap-2">
                    <ListChecks className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">Services additionnels</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-3">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="flex items-start justify-between p-4 bg-gray-50 rounded-lg"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getServiceTypeColor(
                                            service.service_type
                                        )}`}
                                    >
                                        {getServiceTypeLabel(service.service_type)}
                                    </span>
                                </div>
                                <p className="font-medium text-gray-900">{service.service_name}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Quantité: {service.quantity}
                                </p>
                            </div>
                            <div className="text-right ml-4">
                                <p className="text-sm font-semibold text-primary">
                                    {formatCurrency(service.price)} Ar
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Total: {formatCurrency(Number(service.price) * service.quantity)} Ar
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
