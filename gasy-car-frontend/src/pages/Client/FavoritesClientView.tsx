import { Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import VehicleCard from "@/components/VehicleCard";
import { favoritesAPI } from "@/Actions/favoritesApi";
import { useVehicleFavorites } from "@/hooks/useVehicleFavorites";
import { useCurentuser } from "@/useQuery/authUseQuery";

const FavoritesClientView = () => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useVehicleFavorites();
  const { user, isAuthenticated } = useCurentuser();

  const { data: favoriteCars = [], isLoading } = useQuery({
    queryKey: ["vehicle-favorites-vehicles", user?.id],
    enabled: Boolean(isAuthenticated && user?.id),
    queryFn: async () => {
      const { data } = await favoritesAPI.getFavoriteVehicles();
      return Array.isArray(data) ? data : [];
    },
  });

  if (isLoading) {
    return <p className="p-10 text-center">Chargement des favoris...</p>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold font-poppins">Mes Favoris</h2>
        <p className="text-sm text-slate-500">
          {favoriteCars.length} véhicule{favoriteCars.length > 1 ? "s" : ""} en favoris
        </p>
      </div>

      {favoriteCars.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500">
            <Heart className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Aucun favori pour le moment</h3>
          <p className="mt-1 text-sm text-slate-500">
            Cliquez sur le cœur dans la liste des véhicules pour enregistrer vos coups de cœur.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {favoriteCars.map((car: any) => {
            const price = parseFloat(String(car.prix_jour || 0).replace(/[^\d.-]/g, "")) || 0;
            const image = car.photo_principale || car.photos?.[0]?.image || "";
            const brand = car.marque_nom || car.marque_data?.nom || "Marque inconnue";
            const model = car.modele_label || car.modele_data?.label || car.titre || "Modèle inconnu";
            const transmission =
              car.transmission_nom ||
              car.transmission_data?.nom ||
              car.transmission?.nom ||
              "Transmission inconnue";
            const fuel =
              car.type_carburant_nom ||
              car.type_carburant_data?.nom ||
              car.type_carburant?.nom ||
              "Carburant inconnu";

            return (
              <Link key={car.id} to={`/vehicule/${car.id}`} className="group block">
                <VehicleCard
                  image={image}
                  year={car.annee}
                  brand={brand}
                  model={model}
                  rating={Number(car.note_moyenne ?? 0)}
                  trips={car.nombre_locations ?? 0}
                  price={price}
                  seats={car.nombre_places ?? 0}
                  transmission={transmission}
                  fuel={fuel}
                  certified={Boolean(car.est_certifie)}
                  deliveryAvailable={Boolean(car.est_disponible)}
                  isFavorite={isFavorite(car.id)}
                  onToggleFavorite={() => toggleFavorite(car.id)}
                  onReserve={() => navigate(`/client/reservation/${car.id}`)}
                  reserveButtonClassName="bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:bg-primary/90 transition"
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FavoritesClientView;
