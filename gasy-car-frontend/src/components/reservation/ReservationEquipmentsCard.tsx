import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { Reservation } from "@/types/reservationsType";

interface ReservationEquipmentsCardProps {
    reservation: Reservation;
}

export const ReservationEquipmentsCard = ({ reservation }: ReservationEquipmentsCardProps) => {
    const equipments = reservation.equipments_data || [];

    if (equipments.length === 0) {
        return null; // Don't show card if no equipments
    }

    return (
        <Card className="border-none shadow-lg rounded-2xl overflow-hidden h-full">
            <CardHeader className="border-b border-gray-100 p-6">
                <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">Équipements supplémentaires</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-3">
                    {equipments.map((equipment) => (
                        <div
                            key={equipment.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">{equipment.label}</p>
                                {equipment.description && (
                                    <p className="text-sm text-gray-500 mt-1">{equipment.description}</p>
                                )}
                            </div>
                            {equipment.price && (
                                <span className="text-sm font-semibold text-primary ml-4">
                                    {equipment.price} Ar/jour
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
