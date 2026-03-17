import { Filter, Heart, Star } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useVehiculesQuery } from "@/useQuery/vehiculeUseQuery";
import { useNavigate } from "react-router-dom";
import { useVehicleFavorites } from "@/hooks/useVehicleFavorites";

const BrowseCarsClientView = () => {
  const { data: cars = [], isLoading } = useVehiculesQuery();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useVehicleFavorites();

  if (isLoading)
    return <p className="p-10 text-center">Chargement des véhicules...</p>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold font-poppins">Véhicules Disponibles</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl">
            <Filter className="w-4 h-4 mr-2" /> Filtres
          </Button>
          <Button variant="outline" className="rounded-xl">Trier par</Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => {
          const primaryPhoto =
            car.photos?.find((p) => p.is_primary)?.image ||
            car.photos?.[0]?.image ||
            "/placeholder-car.jpg";

          return (
            <Card
              key={car.id}
              className="border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group cursor-pointer"
            >
              <div className="relative h-52 bg-gray-200 overflow-hidden">
                <img
                  src={primaryPhoto}
                  alt={car.titre}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(car.id);
                  }}
                  onDoubleClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(car.id);
                  }}
                  className={`absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors ${isFavorite(car.id) ? "text-red-500" : "text-gray-500 hover:text-red-500"}`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite(car.id) ? "fill-current" : ""}`} />
                </button>

                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-2 py-1 rounded-lg">
                  {car.categorie_data?.nom ?? "—"}
                </div>
              </div>

              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                    {car.marque_data?.nom} {car.modele_data?.label}
                  </h3>

                  <div className="flex items-center gap-1 text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg">
                    <Star className="w-3 h-3 fill-yellow-700" />
                    {car.note_moyenne ?? "N/A"}
                  </div>
                </div>

                <p className="text-sm text-gray-500 mb-4">
                  {car.nombre_locations} voyages effectués
                </p>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div>
                    <span className="text-lg font-bold text-blue-600">
                      {car.prix_jour} {car.devise}
                    </span>
                    <span className="text-xs text-gray-400"> / jour</span>
                  </div>

                  {/* 🎯 NAVIGATION DIRECTE après clic */}
                  <Button
                    size="sm"
                    className="rounded-xl bg-gray-900 hover:bg-gray-800"
                    onClick={() => navigate(`/client/reservation/${car.id}`)}
                  >
                    Réserver
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default BrowseCarsClientView;
