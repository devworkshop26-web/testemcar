import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, Briefcase, Fuel, Users, Cog, Shield, Star, MapPin, Calendar, Maximize2 } from "lucide-react";
import { Reservation } from "@/types/reservationsType";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ReservationVehicleCardProps {
    reservation: Reservation;
    className?: string;
    onViewDetails?: () => void;
    onChangeVehicle?: () => void;
}

export const ReservationVehicleCard = ({ 
    reservation, 
    className,
    onViewDetails,
    onChangeVehicle 
}: ReservationVehicleCardProps) => {
    const [isImageHovered, setIsImageHovered] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const vehicle = reservation.vehicle_data;
    const photos = vehicle?.photos || [];
    const mainImage = photos[selectedImageIndex]?.image || "/placeholder-car.jpg";

    const vehicleSpecs = [
        {
            icon: Fuel,
            label: "Carburant",
            value: vehicle?.type_carburant_data?.nom,
            color: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            icon: Cog,
            label: "Transmission",
            value: vehicle?.transmission_data?.nom,
            color: "text-purple-600",
            bgColor: "bg-purple-50"
        },
        {
            icon: Users,
            label: "Places",
            value: `${vehicle?.nombre_places} places`,
            color: "text-green-600",
            bgColor: "bg-green-50"
        },
        {
            icon: Shield,
            label: "Catégorie",
            value: vehicle?.categorie_data?.nom,
            color: "text-amber-600",
            bgColor: "bg-amber-50"
        }
    ];

    const ownerInfo = vehicle?.proprietaire_data;

    return (
        <Card className={cn(
            "border-none shadow-2xl rounded-2xl overflow-hidden bg-gradient-to-br from-white to-gray-50/50",
            "transform transition-all duration-300 hover:shadow-3xl hover:-translate-y-0.5",
            className
        )}>
            {/* Header avec gradient moderne */}
            <CardHeader className="relative p-0">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"></div>
                <div className="relative p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                <Car className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-xl text-white font-bold">Véhicule réservé</CardTitle>
                                <p className="text-white/80 text-sm mt-1">Caractéristiques et informations</p>
                            </div>
                        </div>
                        
                        {vehicle?.annee && (
                            <Badge className="px-4 py-2 bg-white/20 text-white border-0 backdrop-blur-sm">
                                {vehicle.annee}
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
                {/* Section principale : Image + Infos */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Galerie d'images avec overlay interactif */}
                    <div className="lg:w-2/5">
                        <div 
                            className="relative w-full h-64 lg:h-72 rounded-2xl overflow-hidden group cursor-pointer"
                            onMouseEnter={() => setIsImageHovered(true)}
                            onMouseLeave={() => setIsImageHovered(false)}
                            onClick={onViewDetails}
                        >
                            <img
                                src={mainImage}
                                alt={`${vehicle?.marque_data?.nom} ${vehicle?.modele_data?.label}`}
                                className={cn(
                                    "w-full h-full object-cover transition-all duration-700",
                                    isImageHovered ? "scale-110" : "scale-100"
                                )}
                            />
                            
                            {/* Overlay avec effet de verre */}
                            <div className={cn(
                                "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent",
                                "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                                "flex items-center justify-center"
                            )}>
                                <div className="mt-auto mb-6 mx-4 p-3 bg-black/50 backdrop-blur-sm rounded-full">
                                    <Maximize2 className="w-6 h-6 text-white" />
                                </div>
                            </div>

                            {/* Badge premium si disponible */}
                            {vehicle?.premium && (
                                <div className="absolute top-4 left-4">
                                    <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 px-3 py-1 shadow-lg">
                                        <Star className="w-3 h-3 mr-1 fill-current" />
                                        Premium
                                    </Badge>
                                </div>
                            )}

                            {/* Navigation entre images */}
                            {photos.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                    {photos.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedImageIndex(index);
                                            }}
                                            className={cn(
                                                "w-2 h-2 rounded-full transition-all duration-300",
                                                selectedImageIndex === index 
                                                    ? "bg-white w-4" 
                                                    : "bg-white/50 hover:bg-white/80"
                                            )}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Miniatures des images */}
                        {photos.length > 1 && (
                            <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                                {photos.slice(0, 4).map((photo, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={cn(
                                            "relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300",
                                            selectedImageIndex === index 
                                                ? "border-primary scale-105 shadow-md" 
                                                : "border-transparent hover:border-gray-300"
                                        )}
                                    >
                                        <img
                                            src={photo.image}
                                            alt={`Vue ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        {index === 3 && photos.length > 4 && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <span className="text-white text-xs font-bold">
                                                    +{photos.length - 4}
                                                </span>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Informations du véhicule */}
                    <div className="lg:w-3/5 space-y-6">
                        {/* Titre et marque */}
                        <div>
                            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                                {vehicle?.marque_data?.nom} {vehicle?.modele_data?.label}
                            </h3>
                            <p className="text-gray-500 font-medium text-lg">
                                {vehicle?.categorie_data?.nom}
                            </p>
                        </div>

                        {/* Spécifications sous forme de cartes */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {vehicleSpecs.map((spec, index) => (
                                spec.value && (
                                    <div 
                                        key={spec.label}
                                        className="p-3 rounded-xl border transition-all duration-300 hover:shadow-md"
                                        style={{
                                            animationDelay: `${index * 100}ms`
                                        }}
                                    >
                                        <div className={cn(
                                            "p-2 rounded-lg w-fit mb-2",
                                            spec.bgColor
                                        )}>
                                            <spec.icon className={cn("w-4 h-4", spec.color)} />
                                        </div>
                                        <p className="text-xs text-gray-500 mb-1">{spec.label}</p>
                                        <p className="font-semibold text-gray-900">{spec.value}</p>
                                    </div>
                                )
                            ))}
                        </div>

                        {/* Options spéciales */}
                        <div className="space-y-3">
                            {reservation.with_chauffeur && (
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                                    <div className="p-2 bg-primary/20 rounded-lg">
                                        <Briefcase className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-primary">Avec chauffeur inclus</p>
                                        <p className="text-sm text-primary/80">
                                            Conduite professionnelle incluse dans la réservation
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Propriétaire du véhicule */}
                            {ownerInfo && (
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                                            <span className="text-white font-bold text-lg">
                                                {ownerInfo.first_name?.[0]}{ownerInfo.last_name?.[0]}
                                            </span>
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900">
                                            {ownerInfo.first_name} {ownerInfo.last_name}
                                        </p>
                                        <p className="text-sm text-gray-500">Propriétaire du véhicule</p>
                                    </div>
                                    
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions et informations supplémentaires */}
                <div className="pt-6 border-t border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                            <p className="text-sm text-gray-500">Période de location</p>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    <span className="font-semibold text-gray-900">
                                        {reservation.date_debut ? new Date(reservation.date_debut).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        }) : 'N/A'}
                                    </span>
                                </div>
                                <span className="text-gray-300">→</span>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    <span className="font-semibold text-gray-900">
                                        {reservation.date_fin ? new Date(reservation.date_fin).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        }) : 'N/A'}
                                    </span>
                                </div>
                                <Badge variant="outline" className="ml-2">
                                    {reservation.total_days || 0} jours
                                </Badge>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            {onViewDetails && (
                                <Button 
                                    variant="outline" 
                                    className="gap-2"
                                    onClick={onViewDetails}
                                >
                                    <Maximize2 className="w-4 h-4" />
                                    Voir détails
                                </Button>
                            )}
                            {onChangeVehicle && (
                                <Button 
                                    variant="default"
                                    className="gap-2 bg-gradient-to-r from-primary to-primary/80"
                                    onClick={onChangeVehicle}
                                >
                                    <Car className="w-4 h-4" />
                                    Changer
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Informations complémentaires */}
                    {(vehicle?.description || vehicle?.caracteristiques) && (
                        <div className="mt-6 p-4 rounded-xl bg-gray-50/50 border border-gray-100">
                            <p className="text-sm font-semibold text-gray-900 mb-2">À propos de ce véhicule</p>
                            <p className="text-sm text-gray-600 line-clamp-2">
                                {vehicle.description || vehicle.caracteristiques}
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};