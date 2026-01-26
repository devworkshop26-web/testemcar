import { useState, useMemo, type ComponentProps } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import VehicleCard from "@/components/VehicleCard";
import { Search, Loader2, ArrowLeft, XCircle } from "lucide-react";
import { useCategoryVehiculesQuery } from "@/useQuery/vehiculeUseQuery";
import { useCurentuser } from "@/useQuery/authUseQuery";

type VehicleCardData = {
    id: string;
} & ComponentProps<typeof VehicleCard>;

const NEW_LISTING_WINDOW_MS = 1000 * 60 * 60 * 24 * 30;

const isRecentListing = (date?: string | null) => {
    if (!date) return false;
    const created = new Date(date).getTime();
    if (Number.isNaN(created)) return false;
    return Date.now() - created <= NEW_LISTING_WINDOW_MS;
};

export default function VehiculeCategory() {
    const { id } = useParams<{ id: string }>();
    const { data: categoryVehicles = [], isLoading, isError, error } = useCategoryVehiculesQuery(id);
    const { user } = useCurentuser();
    const navigate = useNavigate();
    const queryErrorMessage = error instanceof Error ? error.message : "Une erreur est survenue.";


    

    const [searchTerm, setSearchTerm] = useState("");

    const vehicles = useMemo<VehicleCardData[]>(() => {
        return categoryVehicles.map((vehicle) => {
            const brand = vehicle.marque_data?.nom ?? "Marque inconnue";
            const model = vehicle.modele_data?.label ?? vehicle.titre ?? "Modèle non spécifié";
            const transmission = vehicle.transmission_data?.nom ?? "Transmission inconnue";
            const fuel = vehicle.type_carburant_data?.nom ?? "Carburant inconnu";
            const price = Number(vehicle.prix_jour) || 0;
            const discountPercent = vehicle.remise_longue_duree_pourcent ? Number(vehicle.remise_longue_duree_pourcent) : 0;
            const oldPrice = discountPercent > 0 && discountPercent < 100
                ? Math.round(price / (1 - discountPercent / 100))
                : undefined;

            return {
                id: vehicle.id,
                image: vehicle.photos?.[0]?.image,
                year: vehicle.annee,
                brand,
                model,
                rating: vehicle.note_moyenne ? Number(vehicle.note_moyenne) : 0,
                trips: vehicle.nombre_locations ?? 0,
                price,
                oldPrice,
                seats: vehicle.nombre_places ?? 0,
                transmission,
                fuel,
                certified: vehicle.est_certifie,
                superHost: (vehicle.nombre_locations ?? 0) >= 40,
                newListing: isRecentListing(vehicle.created_at),
                deliveryAvailable: vehicle.est_disponible,
            };
        });
    }, [categoryVehicles]);

    const categoryName = vehicles[0]?.brand ? categoryVehicles[0]?.categorie_data?.nom : "Catégorie";

    const handleReserve = (carId: string) => {
        if (!user) {
            navigate("/auth/login");
        } else {
            navigate(`/reservation/${carId}`);
        }
    };

    const filteredVehicles = useMemo(() => {
        if (!searchTerm.trim()) return vehicles;

        const lowerCaseSearch = searchTerm.toLowerCase();
        return vehicles.filter(vehicle =>
            vehicle.brand.toLowerCase().includes(lowerCaseSearch) ||
            vehicle.model.toLowerCase().includes(lowerCaseSearch) ||
            vehicle.transmission.toLowerCase().includes(lowerCaseSearch) ||
            vehicle.fuel.toLowerCase().includes(lowerCaseSearch) ||
            vehicle.year.toString().includes(lowerCaseSearch)
        );
    }, [vehicles, searchTerm]);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Section Héro et Recherche */}
            <section className="relative bg-muted/30 py-12 sm:py-16 md:py-20 mb-8 overflow-hidden">
                {/* Background Pattern/Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 text-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute left-4 top-0 sm:left-6 lg:left-12 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/50 hover:bg-white hover:shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Retour</span>
                    </button>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-poppins font-extrabold text-foreground mb-4 tracking-tight">
                        {categoryName}
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        {isLoading ? "Chargement des véhicules..." : `Explorez notre sélection de ${vehicles.length} véhicules dans cette catégorie.`}
                    </p>

                    {/* Champ de Recherche Centré */}
                    <div className="relative max-w-2xl mx-auto">
                        <input
                            type="text"
                            placeholder="Rechercher par Marque, Modèle, ou Année..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-4 pl-12 text-base sm:text-lg border border-border/50 rounded-full shadow-xl shadow-primary/5 focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white/80 backdrop-blur-xl placeholder:text-muted-foreground/70"
                        />
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/70" />
                    </div>
                </div>
            </section>

            {/* Contenu Principal */}
            <main className="flex-grow max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 md:pb-20 w-full">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                        <p className="text-lg text-muted-foreground">Chargement des véhicules...</p>
                    </div>
                ) : isError ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                            <XCircle className="w-10 h-10 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">Une erreur est survenue</h2>
                        <p className="text-muted-foreground max-w-md mb-6">{queryErrorMessage}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2.5 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                        >
                            Réessayer
                        </button>
                    </div>
                ) : filteredVehicles.length > 0 ? (
                    <>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-semibold text-foreground">
                                {filteredVehicles.length} {filteredVehicles.length > 1 ? "Véhicules disponibles" : "Véhicule disponible"}
                            </h2>
                            {/* Optionnel: Ajouter un tri ici si demandé plus tard */}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                            {filteredVehicles.map(({ id, ...vehicleProps }) => (
                                <Link key={id} to={`/vehicule/${id}`} className="group">
                                    <VehicleCard
                                        {...vehicleProps}
                                        onReserve={() => handleReserve(id)}
                                        reserveButtonClassName="btn-primary text-xs font-semibold px-4 py-2.5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105"
                                    />
                                </Link>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/10 rounded-3xl border border-border/50">
                        <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mb-6">
                            <Search className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">Aucun résultat trouvé</h2>
                        <p className="text-muted-foreground max-w-md mb-6">
                            Nous n'avons trouvé aucun véhicule correspondant à votre recherche "{searchTerm}".
                        </p>
                        <button
                            onClick={() => setSearchTerm("")}
                            className="px-6 py-2.5 bg-secondary text-secondary-foreground rounded-full font-medium hover:bg-secondary/90 transition-colors"
                        >
                            Effacer la recherche
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
