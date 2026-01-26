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
  const { data: vehicles = [], isLoading } = useCoupDeCoeurVehicles();
  const plugin = useRef(
    Autoplay({ delay: 3500, stopOnInteraction: true })
  );
  const { handleReserve } = useReservationAction();

  // Ne rien afficher s'il n'y a pas de données et pas de chargement
  if (!isLoading && vehicles.length === 0) {
    return null;
  }

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
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {vehicles?.map((vehicle, index) => (
              <CarouselItem key={vehicle.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <AnimatedItem delay={index * 100}>
                  <Link to={`/vehicule/${vehicle.id}`}>
                    <div className="relative">
                      {/* Badge coup de cœur */}
                      <div className="absolute top-4 right-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                        <Heart className="w-3 h-3 fill-white" />
                        {vehicle.nombre_favoris}
                      </div>
                      <VehicleCard
                        image={vehicle.photo_principale}
                        year={vehicle.annee}
                        brand={vehicle.marque?.nom || ""}
                        model={vehicle.modele?.label || ""}
                        rating={vehicle.note_moyenne ? parseFloat(vehicle.note_moyenne.toString()) : 0}
                        trips={vehicle.nombre_locations}
                        price={Number(vehicle.prix_jour)}
                        distance={0}
                        seats={vehicle.nombre_places}
                        transmission={vehicle.transmission?.label || ""}
                        fuel={vehicle.type_carburant?.label || ""}
                        certified={vehicle.est_certifie}
                        deliveryAvailable={true}
                        onReserve={() => handleReserve(vehicle.id)}
                      />
                    </div>
                  </Link>
                </AnimatedItem>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      )}
    </AnimatedSection>
  );
};
