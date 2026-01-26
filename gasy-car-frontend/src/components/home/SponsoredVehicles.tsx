// src/components/home/SponsoredVehicles.tsx

import { Link } from "react-router-dom";
import VehicleCard from "@/components/VehicleCard";
import VehicleCardSkeleton from "@/components/VehicleCardSkeleton";
import { AnimatedSection, AnimatedItem } from "@/components/animations";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

import { BadgeDollarSign } from "lucide-react"; // Icône sponsorisée

// 👉 IMPORTANT : remplace par ta vraie query sponsorisée
import { usePopularVehicles } from "@/useQuery/vehiculeStatsUseQuery";


export const SponsoredVehicles = () => {
  const { data: vehicles = [], isLoading } = usePopularVehicles();

  const plugin = useRef(
    Autoplay({
      delay: 3500,
      stopOnInteraction: true,
    })
  );

  const skeletonCount = 6;

  // Si aucun résultat → ne rien afficher
  if (!isLoading && vehicles.length === 0) return null;

  return (
    <AnimatedSection className="pb-16 pt-10" delay={0}>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
            <BadgeDollarSign className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-3xl font-poppins font-bold text-foreground">
              Voitures Sponsorisées
            </h2>
            <p className="text-sm text-muted-foreground">
              Les véhicules sélectionnés et mis en avant par nos partenaires
            </p>
          </div>
        </div>
      </div>

      {/* CAROUSEL */}
      <div className="relative w-full">
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{ align: "start", loop: true }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">

            {/* SKELETON LOADING */}
            {isLoading &&
              Array.from({ length: skeletonCount }).map((_, index) => (
                <CarouselItem
                  key={index}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <VehicleCardSkeleton />
                </CarouselItem>
              ))}

            {/* VEHICLES SPONSORISÉS */}
            {!isLoading &&
              vehicles?.map((vehicle: any, index: number) => {
                const brand =
                  vehicle.marque?.nom ??
                  vehicle.marque_nom ??
                  "Marque inconnue";

                const model =
                  vehicle.modele?.label ??
                  vehicle.modele?.nom ??
                  vehicle.modele_label ??
                  vehicle.titre ??
                  "Modèle non spécifié";

                const transmission =
                  vehicle.transmission?.label ??
                  vehicle.transmission?.nom ??
                  "Transmission inconnue";

                const fuel =
                  vehicle.type_carburant?.label ??
                  vehicle.type_carburant?.nom ??
                  "Carburant inconnu";

                const price = Number(vehicle.prix_jour) || 0;
                const rating = vehicle.note_moyenne
                  ? Number(vehicle.note_moyenne)
                  : 0;
                const seats = vehicle.nombre_places ?? 5;

                return (
                  <CarouselItem
                    key={vehicle.id}
                    className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                  >
                    <AnimatedItem delay={index * 80}>
                      <Link to={`/vehicule/${vehicle.id}`}>
                        <VehicleCard
                          image={vehicle.photo_principale}
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
                        />
                      </Link>
                    </AnimatedItem>
                  </CarouselItem>
                );
              })}
          </CarouselContent>

          {/* CONTROLS */}
          <CarouselPrevious className="absolute left-[-1vw] top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow border hover:bg-primary hover:text-white z-20" />
          <CarouselNext className="absolute right-[-1vw] top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow border hover:bg-primary hover:text-white z-20" />
        </Carousel>
      </div>
    </AnimatedSection>
  );
};

export default SponsoredVehicles;
