import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import VehicleCard from "@/components/VehicleCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVehicleSearchQuery } from "@/useQuery/useVehicleSearchQuery";
import { marquesVehiculeUseQuery } from "@/useQuery/marquesUseQuery";
import { useModelesVehiculeQuery } from "@/useQuery/ModeleVehiculeUseQuery";
import { categoryVehiculeUseQuery } from "@/useQuery/categoryUseQuery";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");

  // Récupérer les filtres depuis l'URL
  const filters = useMemo(() => ({
    marque: searchParams.get("marque") || "",
    modele: searchParams.get("modele") || "",
    categorie: searchParams.get("categorie") || "",
    ville: searchParams.get("ville") || "",
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
    start_date: searchParams.get("start_date") || "",
    end_date: searchParams.get("end_date") || "",
  }), [searchParams]);

  const numericFilters = useMemo(() => ({
    ...filters,
    min_price: filters.min_price === "" ? undefined : Number(filters.min_price),
    max_price: filters.max_price === "" ? undefined : Number(filters.max_price),
  }), [filters]);

  const { data: searchResults = [], isLoading, refetch } = useVehicleSearchQuery(numericFilters);
  const { data: marques = [] } = marquesVehiculeUseQuery();
  const { data: modeles = [] } = useModelesVehiculeQuery();
  const { CategoryData: categories = [] } = categoryVehiculeUseQuery();

  // Transformer les résultats pour VehicleCard
  const vehicles = useMemo(() => {
    return searchResults.map((vehicle: any) => ({
      id: vehicle.id,
      image: vehicle.photo_principale ,
      year: vehicle.annee || new Date().getFullYear(),
      brand: vehicle.marque_nom || "Marque inconnue",
      model: vehicle.modele_label || vehicle.titre || "Modèle non spécifié",
      rating: vehicle.note_moyenne ? Number(vehicle.note_moyenne) : 0,
      trips: vehicle.nombre_locations ?? 0,
      price: Number(vehicle.prix_jour) || 0,
      seats: vehicle.nombre_places ?? 5,
      transmission: vehicle.transmission_nom || "Automatique",
      fuel: vehicle.carburant_nom || "Essence",
      certified: vehicle.est_certifie || false,
      superHost: (vehicle.nombre_locations ?? 0) >= 40,
      newListing: false,
      deliveryAvailable: vehicle.est_disponible || false,
    }));
  }, [searchResults]);

  // Trier les résultats
  const sortedVehicles = useMemo(() => {
    const sorted = [...vehicles];
    switch (sortBy) {
      case "price-asc":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-desc":
        return sorted.sort((a, b) => b.price - a.price);
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "trips":
        return sorted.sort((a, b) => b.trips - a.trips);
      default:
        return sorted;
    }
  }, [vehicles, sortBy]);

  const clearFilter = (key: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== "").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-8 sm:py-12 border-b border-border/50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-poppins font-bold text-foreground mb-2">
                Résultats de recherche
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                {isLoading ? "Recherche en cours..." : `${sortedVehicles.length} véhicule${sortedVehicles.length > 1 ? 's' : ''} trouvé${sortedVehicles.length > 1 ? 's' : ''}`}
              </p>
            </div>
            
            {/* Boutons d'action */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex-1 sm:flex-initial"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filtres
                {activeFiltersCount > 0 && (
                  <span className="ml-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Pertinence</SelectItem>
                  <SelectItem value="price-asc">Prix croissant</SelectItem>
                  <SelectItem value="price-desc">Prix décroissant</SelectItem>
                  <SelectItem value="rating">Meilleure note</SelectItem>
                  <SelectItem value="trips">Plus de locations</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filtres actifs */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground font-medium">Filtres actifs :</span>
              {filters.marque && (
                <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs sm:text-sm">
                  <span>Marque: {marques.find((m: any) => m.id === filters.marque)?.nom}</span>
                  <button onClick={() => clearFilter("marque")} className="ml-1 hover:bg-primary/20 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {filters.modele && (
                <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs sm:text-sm">
                  <span>Modèle: {modeles.find((m: any) => m.id === filters.modele)?.label}</span>
                  <button onClick={() => clearFilter("modele")} className="ml-1 hover:bg-primary/20 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {filters.ville && (
                <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs sm:text-sm">
                  <span>Ville: {filters.ville}</span>
                  <button onClick={() => clearFilter("ville")} className="ml-1 hover:bg-primary/20 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {filters.min_price && (
                <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs sm:text-sm">
                  <span>Prix min: {filters.min_price} Ar</span>
                  <button onClick={() => clearFilter("min_price")} className="ml-1 hover:bg-primary/20 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {filters.max_price && (
                <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs sm:text-sm">
                  <span>Prix max: {filters.max_price} Ar</span>
                  <button onClick={() => clearFilter("max_price")} className="ml-1 hover:bg-primary/20 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {activeFiltersCount > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-xs sm:text-sm text-muted-foreground hover:text-foreground"
                >
                  Tout effacer
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Contenu principal */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Sidebar Filtres (Desktop) */}
          {showFilters && (
            <aside className="lg:w-80 flex-shrink-0">
              <Card className="lg:sticky lg:top-24 p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-poppins font-bold text-foreground flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5" />
                    Filtres
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {/* Filtres ici - vous pouvez ajouter plus de filtres si nécessaire */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Prix minimum</label>
                    <input
                      type="number"
                      value={filters.min_price}
                      onChange={(e) => {
                        const newParams = new URLSearchParams(searchParams);
                        if (e.target.value) newParams.set("min_price", e.target.value);
                        else newParams.delete("min_price");
                        setSearchParams(newParams);
                      }}
                      className="w-full p-2 border rounded-lg text-sm"
                      placeholder="0 Ar"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Prix maximum</label>
                    <input
                      type="number"
                      value={filters.max_price}
                      onChange={(e) => {
                        const newParams = new URLSearchParams(searchParams);
                        if (e.target.value) newParams.set("max_price", e.target.value);
                        else newParams.delete("max_price");
                        setSearchParams(newParams);
                      }}
                      className="w-full p-2 border rounded-lg text-sm"
                      placeholder="1000000 Ar"
                    />
                  </div>
                </div>
              </Card>
            </aside>
          )}

          {/* Résultats */}
          <section className="flex-1">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">Recherche en cours...</p>
              </div>
            ) : sortedVehicles.length === 0 ? (
              <Card className="p-12 text-center">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-poppins font-bold text-foreground mb-2">
                  Aucun véhicule trouvé
                </h3>
                <p className="text-muted-foreground mb-6">
                  Essayez de modifier vos critères de recherche
                </p>
                <Button onClick={clearAllFilters} variant="outline">
                  Réinitialiser les filtres
                </Button>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {sortedVehicles.map((vehicle) => (
                    <Link key={vehicle.id} to={`/vehicule/${vehicle.id}`}>
                      <VehicleCard {...vehicle} />
                    </Link>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default SearchResults;

