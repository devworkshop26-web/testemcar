import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDriverQuery } from "@/useQuery/driverUseQuery";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Phone, MapPin, Calendar, CreditCard, FileText } from "lucide-react";

const DriverDetailsView = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: driver, isLoading, isError } = useDriverQuery(id || "");

    if (isLoading) return <div className="p-6"><Skeleton className="h-64 w-full" /></div>;
    if (isError || !driver) return <div className="p-6 text-red-500">Chauffeur non trouvé</div>;

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return "Non renseigné";
        return new Date(dateString).toLocaleDateString("fr-FR");
    };

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => navigate("/prestataire/drivers")}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold font-poppins text-gray-900">Détails du Chauffeur</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Profile & Stats */}
                <div className="space-y-6">
                    <Card>
                        <CardContent className="pt-6 flex flex-col items-center text-center">
                            <Avatar className="w-32 h-32 mb-4">
                                <AvatarImage src={driver.profile_photo || undefined} className="object-cover" />
                                <AvatarFallback className="text-2xl">{driver.first_name[0]}{driver.last_name[0]}</AvatarFallback>
                            </Avatar>
                            <h2 className="text-xl font-bold">{driver.first_name} {driver.last_name}</h2>
                            <p className="text-gray-500 mb-2">{driver.nationality || "Nationalité inconnue"}</p>

                            <Badge variant={driver.is_available ? "default" : "secondary"} className={`mb-4 ${driver.is_available ? "bg-green-100 text-green-800" : ""}`}>
                                {driver.is_available ? "Disponible" : "Indisponible"}
                            </Badge>

                            <div className="w-full space-y-3 text-left mt-4 pt-4 border-t">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span>{driver.phone_number}</span>
                                </div>
                                {driver.secondary_phone && (
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span>{driver.secondary_phone}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-gray-700">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span>{driver.address || "Adresse non renseignée"}, {driver.city}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span>Né(e) le {formatDate(driver.date_of_birth)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <FileText className="w-4 h-4 text-gray-400" />
                                    <span>{driver.experience_years} ans d'expérience</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Documents */}
                <div className="md:col-span-2 space-y-6">

                    {/* Permis de Conduire */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5" /> Let's Information Permis
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Numéro de Permis</p>
                                    <p className="font-medium">{driver.license_number || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Catégorie</p>
                                    <p className="font-medium">{driver.license_category || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Délivré le</p>
                                    <p className="font-medium">{formatDate(driver.license_issued_date)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Expire le</p>
                                    <p className="font-medium">{formatDate(driver.license_expiry_date)}</p>
                                </div>
                            </div>
                            {driver.license_photo && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-500 mb-2">Scan du permis</p>
                                    <div className="rounded-lg overflow-hidden border bg-gray-50 max-w-md">
                                        <img src={driver.license_photo} alt="Permis" className="w-full h-auto object-contain" />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* CIN */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" /> Information CIN
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Numéro CIN</p>
                                <p className="font-medium">{driver.cin_number || "N/A"}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {driver.cin_recto && (
                                    <div>
                                        <p className="text-sm text-gray-500 mb-2">Recto</p>
                                        <div className="rounded-lg overflow-hidden border bg-gray-50">
                                            <img src={driver.cin_recto} alt="CIN Recto" className="w-full h-auto object-contain" />
                                        </div>
                                    </div>
                                )}
                                {driver.cin_verso && (
                                    <div>
                                        <p className="text-sm text-gray-500 mb-2">Verso</p>
                                        <div className="rounded-lg overflow-hidden border bg-gray-50">
                                            <img src={driver.cin_verso} alt="CIN Verso" className="w-full h-auto object-contain" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Certificat de Résidence */}
                    {driver.residence_certificate && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" /> Certificat de Résidence
                                </CardTitle>
                                <CardDescription>Document justificatif de domicile</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-lg overflow-hidden border bg-gray-50 max-w-2xl">
                                    <img
                                        src={driver.residence_certificate}
                                        alt="Certificat de Résidence"
                                        className="w-full h-auto object-contain"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DriverDetailsView;
