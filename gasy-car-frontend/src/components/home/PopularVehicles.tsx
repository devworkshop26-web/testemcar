// src/components/home/PopularVehicles.tsx
import { Link } from "react-router-dom";
import VehicleCard from "@/components/VehicleCard";
import VehicleCardSkeleton from "@/components/VehicleCardSkeleton";
import { AnimatedSection, AnimatedItem } from "@/components/animations";
import { usePopularVehicles } from "@/useQuery/vehiculeStatsUseQuery";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import { Star } from "lucide-react";

import { useReservationAction } from "@/hooks/useReservationAction";

export const PopularVehicles = () => {
  const { data: vehicles = [], isLoading } = usePopularVehicles();
  const plugin = useRef(Autoplay({ delay: 3500, stopOnInteraction: true }));
  const { handleReserve } = useReservationAction();



  const skeletonCount = 6;
  if (!isLoading && vehicles.length === 0) return null;


  return (
    <AnimatedSection className="pb-16 pt-10" delay={0}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
          </div>
          <div>
            <h2 className="text-3xl font-poppins font-bold text-foreground">
              Véhicules sponsorisés
            </h2>
            <p className="text-sm text-muted-foreground">
              Découvrez notre sélection mise en avant.
            </p>
          </div>
        </div>
      </div>

      <div className="relative w-full">
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{ align: "start", loop: true }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">

            {/* =========================== */}
            {/* SQUELETTES LORS DU CHARGEMENT */}
            {/* =========================== */}
            {isLoading &&
              Array.from({ length: skeletonCount }).map((_, index) => (
                <CarouselItem
                  key={index}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <VehicleCardSkeleton />
                </CarouselItem>
              ))}

            {/* =========================== */}
            {/* LISTE RÉELLE DES VÉHICULES */}
            {/* =========================== */}
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
                  "Transmission inconnue";
                const fuel =
                  vehicle.type_carburant?.label ??
                  "Carburant inconnu";
                const price = Number(vehicle.prix_jour) || 0;
                const rating = vehicle.note_moyenne ? Number(vehicle.note_moyenne) : 0;
                const seats = vehicle.nombre_places ?? 0;

                return (
                  <CarouselItem
                    key={vehicle.id}
                    className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                  >
                    <AnimatedItem delay={index * 80}>
                      <Link to={`/vehicule/${vehicle.id}`}>
                        <VehicleCard
                          image={vehicle.photo_principale ?? ""}
                          year={vehicle.annee}
                          brand={brand}
                          model={model}
                          rating={rating}
                          trips={vehicle.nombre_locations ?? 0}
                          price={price}
                          seats={seats}
                          transmission={transmission}
                          fuel={fuel}
                          certified={vehicle.est_certifie}
                          deliveryAvailable={true}
                          onReserve={() => handleReserve(vehicle.id)}
                        />
                      </Link>
                    </AnimatedItem>
                  </CarouselItem>
                );
              })}
          </CarouselContent>

          {/* Flèches */}
          <CarouselPrevious className="absolute left-[-1vw] top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow border hover:bg-primary hover:text-white z-20" />
          <CarouselNext className="absolute right-[-1vw] top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow border hover:bg-primary hover:text-white z-20" />
        </Carousel>
      </div>
    </AnimatedSection>
  );
};
