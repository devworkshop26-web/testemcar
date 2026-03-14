import { Link } from "react-router-dom";
import VehicleCard from "@/components/VehicleCard";
import VehicleCardSkeleton from "@/components/VehicleCardSkeleton";
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

export const FavoriteVehicles = () => {
  const { data: vehicles = [], isLoading, isError } = useCoupDeCoeurVehicles();
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
          <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center shadow-sm">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-[1.7rem] font-poppins font-bold text-foreground leading-tight">
              Coups de cœur
            </h2>
            <p className="text-sm text-muted-foreground">
              Les véhicules préférés de notre communauté
            </p>
          </div>
        </div>
      </div>

      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
          slidesToScroll: 1,
        }}
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
                <CarouselItem key={vehicle.id} className={itemClass}>
                  <AnimatedItem delay={index * 70}>
                    <Link to={`/vehicule/${vehicle.id}`} className="block h-full">
                      <div className="relative">
                        <div className="absolute top-4 right-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 shadow-lg">
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

          {!isLoading && !hasVehicles && (
            <CarouselItem className="pl-3 md:pl-4 basis-full">
              <div className="rounded-2xl border bg-card px-6 py-10 text-center text-muted-foreground">
                {isError
                  ? "Impossible de charger les coups de cœur pour le moment."
                  : "Aucun véhicule coup de cœur disponible actuellement."}
              </div>
            </CarouselItem>
          )}
        </CarouselContent>

        <CarouselPrevious className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow border hover:bg-primary hover:text-white z-20" />
        <CarouselNext className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow border hover:bg-primary hover:text-white z-20" />
      </Carousel>
    </AnimatedSection>
  );
};