import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useVehiculeQuery } from "@/useQuery/vehiculeUseQuery";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, MapPin, Wrench, CheckCircle, Tag, Info, ChevronLeft, ChevronRight, Calendar } from "lucide-react";

// 💡 Import correct des types
import { Vehicule } from "@/types/vehiculeType";
import { PhotoVehicule } from "@/types/VehiculePhoto";
import { VehicleEquipment } from "@/types/VehicleEquipmentsType";
import VehicleAvailabilityCalendar from "@/components/vehicule/VehicleAvailabilityCalendar";

// Composant pour le Carrousel d'Images
const ImageCarousel: React.FC<{ photos: PhotoVehicule[]; title: string }> = ({ photos, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!photos || photos.length === 0) {
    return (
      <Card className="overflow-hidden rounded-2xl shadow-lg border-2 border-gray-100">
        <img
          // J'ASSURE QUE L'IMAGE PLACEHOLDER RESPECTE ÉGALEMENT LA HAUTEUR FIXE
          className="w-full h-96 object-cover" 
          src="/api/placeholder/800/600" // Placeholder plus grand
          alt={title || "Véhicule"}
        />
      </Card>
    );
  }

  const currentPhoto = photos[currentIndex];
  const totalPhotos = photos.length;

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPhotos);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalPhotos) % totalPhotos);
  };

  return (
    <Card className="overflow-hidden rounded-2xl shadow-2xl border-2 border-primary/20 relative">
      <img
        // C'EST LA CLASSE QUI FIXE LA HAUTEUR À 384px (24rem)
        className="w-full h-96 object-cover transition-opacity duration-300"
        src={currentPhoto?.image || "/api/placeholder/800/600"}
        alt={`${title} - Photo ${currentIndex + 1}`}
      />

      {totalPhotos > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition"
            aria-label="Photo précédente"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition"
            aria-label="Photo suivante"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {photos.map((_, index) => (
              <span
                key={index}
                className={`block w-2.5 h-2.5 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </Card>
  );
};

const VehicleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: car, isLoading, isError } = useVehiculeQuery(id);

  

  if (isLoading)
    return (
      <div className="space-y-6 p-6 max-w-6xl mx-auto">
        <Skeleton className="h-10 w-full rounded-xl" />
        {/* J'ASSURE QUE LE SQUELETTE D'IMAGE A LA MÊME HAUTEUR FIXE */}
        <Skeleton className="h-96 w-full rounded-2xl" /> 
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    );

  if (isError || !car)
    return (
      <p className="text-center text-red-500 text-lg mt-10 p-6">
        Impossible de charger le véhicule. Veuillez réessayer.
      </p>
    );
    
  // Affichage du statut en fonction de la disponibilité
  const statusElement = car.est_disponible ? (
    <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
        <CheckCircle className="w-4 h-4 mr-1.5" /> Disponible
    </span>
  ) : (
    <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
        Indisponible
    </span>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-6 max-w-7xl mx-auto **overflow-x-hidden**">
      
      {/* HEADER AMÉLIORÉ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-4xl font-extrabold text-gray-900 font-poppins">
            {car.titre}
          </h1>
          <p className="text-gray-500 text-lg mt-1">{car.numero_immatriculation}</p>
        </div>

        <Button
          onClick={() => navigate(-1)}
          className="rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 px-6 py-2 shadow-md transition-all duration-200"
          variant="outline"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour
        </Button>
      </div>

      {/* COMPOSANT DU CARROUSEL AVEC HAUTEUR FIXE */}
      <ImageCarousel photos={car.photos || []} title={car.titre || "Véhicule"} />

      {/* CONTENU PRINCIPAL EN DEUX COLONNES (LG+) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLONNE GAUCHE (Infos/Description/Équipements) - 2/3 */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* INFORMATIONS CLÉS ET STATUT */}
          <Card className="rounded-2xl shadow-lg border-2 border-blue-100">
            <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                    <h3 className="text-xl font-bold text-blue-700 flex items-center">
                        <Info className="w-5 h-5 mr-2" /> Aperçu Rapide
                    </h3>
                    {statusElement}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <p><span className="text-gray-800 font-medium">Année :</span> <span className="text-gray-600 font-medium">{car.annee}</span></p>
                    <p><span className="text-gray-800 font-medium">Marque :</span> <span className="text-gray-600 font-medium">{car.marque_data?.nom || "Non spécifié"}</span></p>
                    <p><span className="text-gray-800 font-medium">Modèle :</span> <span className="text-gray-600 font-medium">{car.modele_data?.label || "Non spécifié"}</span></p>
                    <p><span className="text-gray-800 font-medium">Couleur :</span> <span className="text-gray-600 font-medium">{car.couleur}</span></p>
                </div>
            </CardContent>
          </Card>
          {/* DESCRIPTION DÉTAILLÉE */}
          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-3 border-b pb-2">Description du Véhicule</h3>
              <p className="text-gray-700 break-words">{car.description}</p>
            </CardContent>
          </Card>

          {/* ÉQUIPEMENTS AMÉLIORÉS */}
          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center border-b pb-2">
                <Wrench className="w-6 h-6 mr-2 text-primary" /> Équipements & Options
              </h3>

              {car.equipements_details && Array.isArray(car.equipements_details) && car.equipements_details.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {car.equipements_details.map((eq: VehicleEquipment) => (
                    <div
                      key={eq.id}
                      className="flex items-center px-4 py-2 rounded-xl bg-green-50 border border-green-200 text-sm font-medium text-gray-800 transition hover:bg-green-100"
                    >
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600 flex-shrink-0" />
                        {eq.label}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">Aucun équipement spécifique listé.</p>
              )}
            </CardContent>
          </Card>

        </div>

        {/* COLONNE DROITE (Tarification/Localisation) - 1/3 */}
        <div className="lg:col-span-1 space-y-8">
            
          {/* TARIFICATION MISE EN VALEUR */}
          <Card className="rounded-2xl shadow-2xl bg-primary text-primary-foreground">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-2xl font-semibold flex items-center border-b border-primary-foreground/50 pb-2 mb-3">
                <Tag className="w-6 h-6 mr-2" /> Tarification
              </h3>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-lg font-medium bg-primary-foreground/10 p-2 rounded-lg">
                    <span>Prix/Jour :</span>
                    <span className="font-medium">{car.prix_jour} {car.devise}</span>
                </div>
                <div className="flex justify-between">
                    <span>Prix/Heure :</span>
                    <span className="font-medium">{car.prix_heure || "N/A"} {car.prix_heure ? car.devise : ''}</span>
                </div>
                <div className="flex justify-between">
                    <span>Prix/Mois :</span>
                    <span className="font-medium">{car.prix_mois || "N/A"} {car.prix_mois ? car.devise : ''}</span>
                </div>
              </div>
              
              <div className="pt-3 border-t border-primary-foreground/50">
                <p className="flex justify-between font-medium text-lg">
                    <span>Caution :</span>
                    <span>{car.montant_caution} {car.devise}</span>
                </p>
              </div>
            </CardContent>
          </Card>
            
          {/* LOCALISATION */}
          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-6 space-y-3">
              <h3 className="text-xl font-bold border-b pb-2 mb-2">Localisation</h3>
              <p className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 mt-1 text-red-500 flex-shrink-0" /> 
                <span className="font-medium text-gray-800">{car.adresse_localisation || "Non renseignée"}</span>
              </p>
              <p><strong>Ville :</strong> <span className="text-gray-700">{car.ville || "-"}</span></p>
              <p><strong>Zone :</strong> <span className="text-gray-700">{car.zone || "-"}</span></p>
            </CardContent>
          </Card>

          {/* CALENDRIER DISPONIBILITÉ */}
          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold border-b pb-2 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-primary" /> Disponibilités
              </h3>
              {id && <VehicleAvailabilityCalendar vehicleId={id} />}
            </CardContent>
          </Card>

        </div>
      </div>
      
    </div>
  );
};

export default VehicleDetails;