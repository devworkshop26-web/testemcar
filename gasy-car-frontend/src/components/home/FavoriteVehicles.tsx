import { Link } from "react-router-dom";
import VehicleCard from "@/components/VehicleCard";
import { AnimatedSection, AnimatedItem } from "@/components/animations";
import { useCoupDeCoeurVehicles } from "@/useQuery/vehiculeStatsUseQuery";
import { Heart } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

import { useReservationAction } from "@/hooks/useReservationAction";

/**
 * Section des véhicules coups de cœur
 * Affiche les véhicules les plus favoris avec vraies données API
 */
export const FavoriteVehicles = () => {
  const { data: vehicles = [], isLoading, isError } = useCoupDeCoeurVehicles();
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnMouseEnter: true, stopOnInteraction: false })
  );
  const { handleReserve } = useReservationAction();

  const hasVehicles = vehicles.length > 0;

  return (
    <AnimatedSection className="pb-16 pt-10" delay={0}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
          </div>
          <div>
            <h2 className="text-3xl font-poppins font-bold text-foreground">
              Coups de cœur
            </h2>
            <p className="text-sm text-muted-foreground">Les véhicules préférés de notre communauté</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          <p className="mt-4 text-muted-foreground">Chargement des coups de cœur...</p>
        </div>
      ) : (
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          opts={{
            align: "start",
            loop: true,
            slidesToScroll: 1,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {vehicles?.map((vehicle, index) => {
              const brand = vehicle.marque?.nom ?? vehicle.marque_nom ?? "Marque inconnue";
              const model =
                vehicle.modele?.label ??
                (vehicle.modele as { nom?: string } | null)?.nom ??
                vehicle.modele_label ??
                vehicle.titre ??
                "Modèle non spécifié";
              const transmission =
                vehicle.transmission?.label ??
                (vehicle.transmission as { nom?: string } | null)?.nom ??
                vehicle.transmission_nom ??
                "Transmission inconnue";
              const fuel =
                vehicle.type_carburant?.label ??
                (vehicle.type_carburant as { nom?: string } | null)?.nom ??
                vehicle.type_carburant_nom ??
                "Carburant inconnu";
              const rating = vehicle.note_moyenne ? Number(vehicle.note_moyenne) : 0;

              return (
              <CarouselItem key={vehicle.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/2 2xl:basis-1/3">
                <AnimatedItem delay={index * 100}>
                  <Link to={`/vehicule/${vehicle.id}`}>
                    <div className="relative">
                      {/* Badge coup de cœur */}
                      <div className="absolute top-4 right-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                        <Heart className="w-3 h-3 fill-white" />
                        {vehicle.nombre_favoris}
                      </div>
                      <VehicleCard
                        image={vehicle.photo_principale ?? ""}
                        year={vehicle.annee}
                        brand={brand}
                        model={model}
                        rating={rating}
                        trips={vehicle.nombre_locations ?? 0}
                        price={Number(vehicle.prix_jour) || 0}
                        distance={0}
                        seats={vehicle.nombre_places ?? 0}
                        transmission={transmission}
                        fuel={fuel}
                        certified={vehicle.est_certifie}
                        deliveryAvailable={true}
                        onReserve={() => handleReserve(vehicle.id)}
                      />
                    </div>
                  </Link>
                </AnimatedItem>
              </CarouselItem>
              );
            })}

            {!hasVehicles && (
              <CarouselItem className="pl-2 md:pl-4 basis-full">
                <div className="rounded-xl border bg-card px-6 py-10 text-center text-muted-foreground">
                  {isError
                    ? "Impossible de charger les coups de cœur pour le moment."
                    : "Aucun véhicule coup de cœur disponible actuellement."}
                </div>
              </CarouselItem>
            )}
          </CarouselContent>
          <CarouselPrevious className="absolute left-[-1vw] top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow border hover:bg-primary hover:text-white z-20" />
          <CarouselNext className="absolute right-[-1vw] top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow border hover:bg-primary hover:text-white z-20" />
        </Carousel>
      )}
    </AnimatedSection>
  );
};
