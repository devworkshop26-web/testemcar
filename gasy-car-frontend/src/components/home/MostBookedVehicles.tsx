import { Link } from "react-router-dom";
import VehicleCard from "@/components/VehicleCard";
import VehicleCardSkeleton from "@/components/VehicleCardSkeleton";
import { AnimatedSection, AnimatedItem } from "@/components/animations";
import { useMostBookedVehicles } from "@/useQuery/vehiculeStatsUseQuery";
import { TrendingUp, Calendar } from "lucide-react";

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

export const MostBookedVehicles = () => {
  const { data: vehicles = [], isLoading, isError } = useMostBookedVehicles();
  const plugin = useRef(
    Autoplay({ delay: 3200, stopOnMouseEnter: true, stopOnInteraction: false })
  );
  const { handleReserve } = useReservationAction();

  const skeletonCount = 6;

  

  const hasVehicles = vehicles.length > 0;

  return (
    <AnimatedSection className="pb-16 pt-10" delay={0}>
      
      {/* ==== HEADER ==== */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-3xl font-poppins font-bold text-foreground">
              Les plus réservés
            </h2>
            <p className="text-sm text-muted-foreground">
              Les véhicules les plus demandés
            </p>
          </div>
        </div>
      </div>

      {/* ==== CAROUSEL ==== */}
      <div className="relative w-full">
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
            
            {/* -------------------------------------- */}
            {/* SKELETONS LORS DU CHARGEMENT */}
            {/* -------------------------------------- */}
            {isLoading &&
              Array.from({ length: skeletonCount }).map((_, index) => (
                <CarouselItem
                  key={index}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 2xl:basis-1/3 pb-4 pt-2"
                >
                  <VehicleCardSkeleton />
                </CarouselItem>
              ))}

            {/* -------------------------------------- */}
            {/* VÉHICULES RÉELS */}
            {/* -------------------------------------- */}
            {!isLoading &&
              vehicles?.map((vehicle, index) => {
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
                  "";
                const fuel =
                  vehicle.type_carburant?.label ??
                  (vehicle.type_carburant as { nom?: string } | null)?.nom ??
                  vehicle.type_carburant_nom ??
                  "";

                return (
                  <CarouselItem
                    key={vehicle.id}
                    className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 2xl:basis-1/3 pb-4 pt-2"
                  >
                    <AnimatedItem delay={index * 80}>
                      <Link to={`/vehicule/${vehicle.id}`}>
                        <div className="relative">

                          {/* Badge nombre de réservations */}
                          <div className="
                            absolute top-4 right-4 z-10 
                            bg-blue-600 text-white 
                            px-3 py-1 rounded-full 
                            text-xs font-bold shadow-lg
                            flex items-center gap-1
                          ">
                            <Calendar className="w-3 h-3" />
                            {vehicle.nombre_locations} réservations
                          </div>

                          <VehicleCard
                            image={vehicle.photo_principale ?? ""}
                            year={vehicle.annee}
                            brand={brand}
                            model={model}
                            rating={vehicle.note_moyenne ? Number(vehicle.note_moyenne) : 0}
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
                    ? "Impossible de charger les véhicules les plus réservés pour le moment."
                    : "Aucun véhicule réservé disponible actuellement."}
                </div>
              </CarouselItem>
            )}
          </CarouselContent>

          {/* ==== FLÈCHES COLLÉES ==== */}
          <CarouselPrevious
            className="
              absolute left-[-1vw] top-1/2 -translate-y-1/2 
              w-9 h-9 rounded-full bg-white 
              shadow border border-border 
              hover:bg-primary hover:text-white 
              transition-all duration-200 z-20
            "
          />
          <CarouselNext
            className="
              absolute right-[-1vw] top-1/2 -translate-y-1/2 
              w-9 h-9 rounded-full bg-white 
              shadow border border-border 
              hover:bg-primary hover:text-white 
              transition-all duration-200 z-20
            "
          />
        </Carousel>
      </div>

    </AnimatedSection>
  );
};
