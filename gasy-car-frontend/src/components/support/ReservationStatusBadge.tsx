import { Badge } from "@/components/ui/badge";

interface ReservationStatusBadgeProps {
    status: string;
}

export const ReservationStatusBadge = ({ status }: ReservationStatusBadgeProps) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "CONFIRMED":
                return "bg-green-100 text-green-700 border-green-200";
            case "PENDING":
                return "bg-orange-100 text-orange-700 border-orange-200";
            case "CANCELLED":
                return "bg-red-100 text-red-700 border-red-200";
            case "COMPLETED":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "IN_PROGRESS":
                return "bg-purple-100 text-purple-700 border-purple-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "CONFIRMED":
                return "Confirmée";
            case "PENDING":
                return "En attente";
            case "CANCELLED":
                return "Annulée";
            case "COMPLETED":
                return "Terminée";
            case "IN_PROGRESS":
                return "En cours";
            default:
                return status;
        }
    };

    return (
        <Badge className={`${getStatusColor(status)} border px-3 py-1 rounded-full text-xs font-bold`}>
            {getStatusLabel(status)}
        </Badge>
    );
};
