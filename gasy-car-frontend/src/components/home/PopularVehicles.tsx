import { Link } from "react-router-dom";
import VehicleCard from "@/components/VehicleCard";
import VehicleCardSkeleton from "@/components/VehicleCardSkeleton";
import { AnimatedSection, AnimatedItem } from "@/components/animations";
import { usePopularVehicles, useSponsoredVehicles } from "@/useQuery/vehiculeStatsUseQuery";
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
  const { data: sponsoredVehicles = [], isLoading, isError } = useSponsoredVehicles();
  const shouldLoadPopularFallback = !isLoading && (isError || sponsoredVehicles.length === 0);
  const { data: popularVehicles = [] } = usePopularVehicles({ enabled: shouldLoadPopularFallback });

  const vehicles =
    shouldLoadPopularFallback && popularVehicles.length > 0
      ? popularVehicles
      : sponsoredVehicles;

  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnMouseEnter: true, stopOnInteraction: false })
  );

  const { handleReserve } = useReservationAction();
  const skeletonCount = 8;
  const hasVehicles = vehicles.length > 0;

  const itemClass =
    "pl-3 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/4 pb-3 pt-2";

  return (
    <AnimatedSection className="pb-10 pt-6" delay={0}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-yellow-100 flex items-center justify-center shadow-sm">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-[1.7rem] font-poppins font-bold text-foreground leading-tight">
               Annonces sponsorisés
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
          opts={{ align: "start", loop: true, slidesToScroll: 1 }}
        >
          <CarouselContent className="-ml-3 md:-ml-4">
            {isLoading &&
              Array.from({ length: skeletonCount }).map((_, index) => (
                <CarouselItem key={index} className={itemClass}>
                  <VehicleCardSkeleton />
                </CarouselItem>
              ))}

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
                  vehicle.transmission?.nom ??
                  vehicle.transmission_nom ??
                  "Transmission inconnue";
                const fuel =
                  vehicle.type_carburant?.label ??
                  vehicle.type_carburant?.nom ??
                  vehicle.type_carburant_nom ??
                  "Carburant inconnu";
                const price = Number(vehicle.prix_jour) || 0;
                const rating = vehicle.note_moyenne ? Number(vehicle.note_moyenne) : 0;
                const seats = vehicle.nombre_places ?? 0;

                return (
                  <CarouselItem key={vehicle.id} className={itemClass}>
                    <AnimatedItem delay={index * 60}>
                      <Link to={`/vehicule/${vehicle.id}`} className="block h-full">
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

            {!isLoading && !hasVehicles && (
              <CarouselItem className="pl-3 md:pl-4 basis-full">
                <div className="rounded-2xl border bg-card px-6 py-10 text-center text-muted-foreground">
                  Aucun véhicule disponible actuellement.
                </div>
              </CarouselItem>
            )}
          </CarouselContent>

          <CarouselPrevious className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow border hover:bg-primary hover:text-white z-20" />
          <CarouselNext className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow border hover:bg-primary hover:text-white z-20" />
        </Carousel>
      </div>
    </AnimatedSection>
  );
};