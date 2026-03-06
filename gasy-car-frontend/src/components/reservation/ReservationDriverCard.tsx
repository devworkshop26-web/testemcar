import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, Phone, Award } from "lucide-react";
import { Driver } from "@/types/reservationsType";

interface ReservationDriverCardProps {
    driver: Driver;
}

export const ReservationDriverCard = ({ driver }: ReservationDriverCardProps) => {
    return (
        <Card className="border-none shadow-lg rounded-2xl overflow-hidden h-full">
            <CardHeader className="border-b border-gray-100 p-6">
                <div className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">Chauffeur assigné</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="flex items-start gap-4">
                    {driver.profile_photo ? (
                        <img
                            src={driver.profile_photo}
                            alt={`${driver.first_name} ${driver.last_name}`}
                            className="w-16 h-16 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <UserCheck className="w-8 h-8 text-primary" />
                        </div>
                    )}

                    <div className="flex-1 space-y-3">
                        <div>
                            <h3 className="font-semibold text-lg text-gray-900">
                                {driver.first_name} {driver.last_name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <Award className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    {driver.experience_years} ans d'expérience
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-700">{driver.phone_number}</span>
                            </div>
                            {driver.secondary_phone && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-700">{driver.secondary_phone}</span>
                                </div>
                            )}
                        </div>

                        {driver.license_number && (
                            <div className="pt-2 border-t border-gray-100">
                                <p className="text-xs text-gray-500">Permis de conduire</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {driver.license_number}
                                    {driver.license_category && ` - Catégorie ${driver.license_category}`}
                                </p>
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${driver.is_available
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                            >
                                {driver.is_available ? "Disponible" : "Non disponible"}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
