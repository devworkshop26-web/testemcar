import { useState, useMemo, useEffect, type ComponentProps, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import VehicleCard from "@/components/VehicleCard";
import VehiculeCardSkeleton from "@/components/VehicleCardSkeleton";
import AllCarsHero from "@/components/AllCarsHero";

import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Check,
  Car,
  Filter,
} from "lucide-react";

import { useVehiculesQuery } from "@/useQuery/vehiculeUseQuery";
import { useCurentuser } from "@/useQuery/authUseQuery";
import { useDebounce } from "@/hooks/useDebounce";

// --- TYPES ET CONSTANTES ---
type FilterState = {
  brand: string;
  transmission: string;
  fuel: string;
  minSeats: number;
  minPrice: number;
  maxPrice: number;
};

type VehicleCardData = {
  id: string;
  created_at?: string | null;
} & ComponentProps<typeof VehicleCard>;

const DEFAULT_MIN_SEATS = 0;
const ITEMS_PER_PAGE = 9;
const VISIBLE_BRANDS_COUNT = 2;

const NEW_LISTING_WINDOW_MS = 1000 * 60 * 60 * 24 * 30;

const isRecentListing = (date?: string | null) => {
  if (!date) return false;
  return Date.now() - new Date(date).getTime() <= NEW_LISTING_WINDOW_MS;
};

// ===============================
// SKELETONS AMÉLIORÉS
// ===============================
const SearchBarSkeleton = () => (
  <div className="relative max-w-2xl mt-6 h-14 animate-pulse">
    <div className="w-full h-full bg-muted/60 rounded-2xl border border-border/50"></div>
    <div className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 bg-muted rounded-full"></div>
  </div>
);

const FilterSidebarSkeleton = () => (
  <aside className="w-full lg:w-80 shrink-0 h-fit">
    <div className="lg:sticky lg:top-28 animate-pulse">
      <div className="bg-card rounded-2xl border border-border/60 shadow-lg overflow-hidden">
        {/* Header Skeleton */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-5 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-xl"></div>
            <div className="h-5 w-40 bg-muted rounded-lg"></div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Budget Skeleton */}
          <div className="space-y-4 pb-6 border-b border-border/40">
            <div className="h-5 w-28 bg-muted rounded"></div>
            <div className="flex justify-between">
              <div className="h-4 w-16 bg-muted/70 rounded"></div>
              <div className="h-4 w-20 bg-primary/20 rounded"></div>
              <div className="h-4 w-16 bg-muted/70 rounded"></div>
            </div>
            <div className="h-2 w-full bg-muted rounded-full"></div>
          </div>

          {/* Reset Button Skeleton */}
          <div className="h-11 w-full bg-muted/50 rounded-xl"></div>

          {/* Filter Blocks Skeleton */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3 pb-5 border-b border-border/40 last:border-0">
              <div className="h-5 w-24 bg-muted rounded"></div>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-muted/70 rounded"></div>
                  <div className="h-4 w-32 bg-muted/50 rounded"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-muted/70 rounded"></div>
                  <div className="h-4 w-28 bg-muted/50 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </aside>
);

const ResultsHeaderSkeleton = () => (
  <div className="flex items-center justify-between mb-6 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-muted rounded-xl"></div>
      <div>
        <div className="h-5 w-32 bg-muted rounded mb-2"></div>
        <div className="h-4 w-48 bg-muted/60 rounded"></div>
      </div>
    </div>
  </div>
);

// ===================================================
// PAGE PRINCIPALE : ALL CARS
// ===================================================
const AllCars = () => {
  const [searchParams] = useSearchParams();
  const typeFilter = searchParams.get("type") || undefined;

  const { data: allcarsdata = [], isLoading, isError, error, refetch } =
    useVehiculesQuery(typeFilter);

  const { user } = useCurentuser();
  const navigate = useNavigate();

  const queryErrorMessage =
    error instanceof Error ? error.message : "Impossible de récupérer les véhicules.";

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc" | "newest";
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const [animatedPrice, setAnimatedPrice] = useState(0);

  // FILTRES
  const [filters, setFilters] = useState<FilterState>({
    brand: "",
    transmission: "",
    fuel: "",
    minSeats: DEFAULT_MIN_SEATS,
    minPrice: 0,
    maxPrice: 1000,
  });

  const vehicleListRef = useRef<HTMLElement | null>(null);

  // TRANSFORMATION DES DONNÉES API
  const vehicles = useMemo<VehicleCardData[]>(() => {
    return allcarsdata.map((vehicle) => {
      const price = parseFloat(String(vehicle.prix_jour || 0).replace(/[^\d.-]/g, "")) || 0;

      const image = (vehicle as any).photo_principale || vehicle.photos?.[0]?.image || "";
      const brand = vehicle.marque_data?.nom || (vehicle as any).marque_nom || "Marque inconnue";
      const model = vehicle.modele_data?.label || (vehicle as any).modele_label || vehicle.titre || "Modèle inconnu";

      return {
        id: vehicle.id,
        created_at: vehicle.created_at,
        image,
        year: vehicle.annee,
        brand,
        model,
        rating: Number(vehicle.note_moyenne ?? 0),
        trips: vehicle.nombre_locations ?? 0,
        price,
        seats: vehicle.nombre_places ?? 0,
        transmission: vehicle.transmission_data?.nom || (vehicle.transmission as any)?.nom || (vehicle.transmission as any)?.label || "Auto",
        fuel: vehicle.type_carburant_data?.nom || (vehicle.type_carburant as any)?.nom || (vehicle.type_carburant as any)?.label || "Essence",
        certified: vehicle.est_certifie,
        superHost: (vehicle.nombre_locations ?? 0) >= 40,
        newListing: isRecentListing(vehicle.created_at),
        deliveryAvailable: vehicle.est_disponible,
        oldPrice: (parseFloat(vehicle.remise_par_jour || "0") > 0) ? price + parseFloat(vehicle.remise_par_jour || "0") : undefined,
      };
    });
  }, [allcarsdata]);

  // CALCUL DU PRIX MAX DISPONIBLE + STEP DYNAMIQUE
  const { maxPrice: availableMaxPrice, minPrice: availableMinPrice, dynamicStep } = useMemo(() => {
    if (!vehicles.length) return { maxPrice: 1000, minPrice: 0, dynamicStep: 10 };

    const prices = vehicles.map(v => v.price).filter(p => p > 0);
    if (!prices.length) return { maxPrice: 1000, minPrice: 0, dynamicStep: 10 };

    const maxP = Math.max(...prices);

    let step = 1000;
    if (maxP < 50000) step = 1000;
    else if (maxP < 200000) step = 5000;
    else if (maxP < 500000) step = 10000;
    else if (maxP < 1000000) step = 20000;
    else step = 50000;

    return {
      maxPrice: Math.ceil(maxP / step) * step,
      minPrice: 0,
      dynamicStep: step,
    };
  }, [vehicles]);

  // Initialisation de maxPrice réel
  useEffect(() => {
    if (!isLoading && filters.maxPrice === 1000 && availableMaxPrice !== 1000) {
      setFilters(prev => ({ ...prev, maxPrice: availableMaxPrice }));
    }
  }, [isLoading, availableMaxPrice, filters.maxPrice]);

  // Animation du prix affiché
  useEffect(() => {
    const start = animatedPrice;
    const end = filters.maxPrice;
    const duration = 300;
    const stepTime = 15;

    const diff = end - start;
    let currentTime = 0;

    const timer = setInterval(() => {
      currentTime += stepTime;
      const progress = Math.min(currentTime / duration, 1);
      setAnimatedPrice(Math.floor(start + diff * progress));

      if (progress === 1) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [filters.maxPrice]);

  // OPTIONS DE FILTRES
  const filterOptions = useMemo(() => {
    const brands = Array.from(new Set(vehicles.map(v => v.brand))).filter(Boolean);
    const transmissions = Array.from(new Set(vehicles.map(v => v.transmission))).filter(t => t !== "Transmission inconnue");
    const fuels = Array.from(new Set(vehicles.map(v => v.fuel))).filter(f => f !== "Carburant inconnu");
    const seats = Array.from(new Set(vehicles.map(v => v.seats).filter(Boolean)));

    return {
      brands: (brands as string[]).sort(),
      transmissions: (transmissions as string[]).sort(),
      fuels: (fuels as string[]).sort(),
      seats: (seats as number[]).filter(s => s > 0).sort((a, b) => a - b),
    };
  }, [vehicles]);

  // CLICK RESERVER
  const handleReserve = (carId: string) => {
    if (!user) return navigate("/login");
    navigate(`/reservation/${carId}`);
  };

  // SCROLL AUTO
  const scrollToVehicleList = () => {
    if (vehicleListRef.current) {
      window.scrollTo({ top: vehicleListRef.current.offsetTop - 150, behavior: "smooth" });
    }
  };

  // GESTION PAGINATION
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToVehicleList();
  };

  // Changement des filtres
  const handleFilterChange = <K extends keyof FilterState>(name: K, value: FilterState[K]) => {
    setCurrentPage(1);

    let newValue: FilterState[K];
    const sameValue = filters[name] === value;

    if (sameValue) {
      newValue = (name === "minSeats" ? (DEFAULT_MIN_SEATS as unknown) : ("" as unknown)) as FilterState[K];
    } else {
      newValue = value;
    }

    setFilters(prev => ({ ...prev, [name]: newValue }));

    scrollToVehicleList();
  };

  // Changement slider prix
  const handlePriceRangeChange = (values: number[]) => {
    setCurrentPage(1);
    setFilters(prev => ({ ...prev, minPrice: values[0], maxPrice: values[1] }));
  };

  // Reset filtres
  const clearFilters = () => {
    setCurrentPage(1);
    setFilters({
      brand: "",
      transmission: "",
      fuel: "",
      minSeats: DEFAULT_MIN_SEATS,
      minPrice: 0,
      maxPrice: availableMaxPrice,
    });
    setSearchTerm("");
    setSortBy("newest");
  };

  // APPLICATION DES FILTRES
  const filteredVehicles = useMemo(() => {
    let results = vehicles;

    // SEARCH
    if (debouncedSearchTerm.trim()) {
      const q = debouncedSearchTerm.toLowerCase();
      results = results.filter(v => {
        const searchable = `${v.brand} ${v.model} ${v.transmission} ${v.fuel} ${v.year}`.toLowerCase();
        return q.split(/\s+/).every(word => searchable.includes(word));
      });
    }

    // FILTERS
    if (filters.brand) results = results.filter(v => v.brand === filters.brand);
    if (filters.transmission) results = results.filter(v => v.transmission === filters.transmission);
    if (filters.fuel) results = results.filter(v => v.fuel === filters.fuel);
    if (filters.minSeats > 0) results = results.filter(v => (v.seats ?? 0) >= filters.minSeats);

    results = results.filter(v => v.price >= filters.minPrice && v.price <= filters.maxPrice);

    // ✅ SORT
    results = [...results].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`);
        case "name-desc":
          return `${b.brand} ${b.model}`.localeCompare(`${a.brand} ${a.model}`);
        case "price-asc":
          return (a.price ?? 0) - (b.price ?? 0);
        case "price-desc":
          return (b.price ?? 0) - (a.price ?? 0);
        case "newest":
          return new Date(b.created_at ?? "").getTime() - new Date(a.created_at ?? "").getTime();
        default:
          return 0;
      }
    });

    return results;
  }, [vehicles, debouncedSearchTerm, filters, sortBy]);


  // Pagination
  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedVehicles = filteredVehicles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Compteur de filtres actifs
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.brand) count++;
    if (filters.transmission) count++;
    if (filters.fuel) count++;
    if (filters.minSeats > 0) count++;
    if (filters.maxPrice < availableMaxPrice) count++;
    return count;
  }, [filters, availableMaxPrice]);

  // =============================================
  // COMPOSANT FILTRE DÉPLIANT
  // =============================================
  const FilterBlock = <K extends keyof FilterState>({
    title,
    name,
    options,
    currentValue,
  }: {
    title: string;
    name: K;
    options: (string | number)[];
    currentValue: FilterState[K];
  }) => {
    const [isOpen, setIsOpen] = useState(true);

    const isBrandFilter = name === "brand";
    const [showAllBrands, setShowAllBrands] = useState(false);

    const visibleOptions =
      isBrandFilter && !showAllBrands
        ? options.slice(0, VISIBLE_BRANDS_COUNT)
        : options;

    return (
      <div className="pb-5 border-b border-border/40 last:border-0 last:pb-0">
        {/* HEADER */}
        <button
          className="flex justify-between items-center w-full py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {title}
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="mt-3 space-y-1">
            {visibleOptions.map((option, i) => {
              const isSelected = currentValue === option;

              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${isSelected
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-muted/50 border border-transparent"
                    }`}
                  onClick={() =>
                    handleFilterChange(name, option as FilterState[K])
                  }
                >
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${isSelected
                      ? "bg-primary border-primary shadow-sm"
                      : "bg-background border-border hover:border-primary/50"
                      }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                  </div>

                  <span
                    className={`text-sm transition-colors ${isSelected ? "text-primary font-medium" : "text-foreground"
                      }`}
                  >
                    {name === "minSeats" ? `${option} places et +` : option}
                  </span>
                </div>
              );
            })}

            {isBrandFilter && options.length > VISIBLE_BRANDS_COUNT && (
              <button
                className="text-primary text-sm font-medium mt-3 flex items-center gap-1.5 hover:text-primary/80 transition-colors px-3"
                onClick={() => setShowAllBrands(!showAllBrands)}
              >
                {showAllBrands
                  ? "Voir moins"
                  : `Voir ${options.length - VISIBLE_BRANDS_COUNT} autres marques`}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${showAllBrands ? "rotate-180" : ""}`}
                />
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  // =============================================
  // RENDER
  // =============================================
  return (
    <div className="min-h-screen bg-background">
      {/* HERO SECTION */}
      <AllCarsHero
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalVehicles={vehicles.length}
        isLoading={isLoading}
        typeFilter={typeFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />


      {/* CONTENU PRINCIPAL */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

          {/* SIDEBAR FIXE */}
          {isLoading ? (
            <FilterSidebarSkeleton />
          ) : (
            <aside className="w-full lg:w-80 shrink-0 h-fit">
              <div className="lg:sticky lg:top-28">
                <div className="bg-card rounded-2xl border border-border/60 shadow-lg overflow-hidden">
                  {/* Header du sidebar */}
                  <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-5 border-b border-border/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/15 rounded-xl">
                          <Filter className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h2 className="text-base font-semibold text-foreground">Filtres</h2>
                          {activeFiltersCount > 0 && (
                            <p className="text-xs text-muted-foreground">{activeFiltersCount} filtre{activeFiltersCount > 1 ? "s" : ""} actif{activeFiltersCount > 1 ? "s" : ""}</p>
                          )}
                        </div>
                      </div>
                      {activeFiltersCount > 0 && (
                        <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                          {activeFiltersCount}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Slider Budget */}
                    <div className="pb-6 border-b border-border/40">
                      <h3 className="text-sm font-semibold text-foreground mb-4">Budget maximum</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground font-medium">{availableMinPrice.toLocaleString()} Ar</span>
                          <span className="text-primary font-bold text-sm bg-primary/10 px-2.5 py-1 rounded-lg">
                            {animatedPrice.toLocaleString()} Ar
                          </span>
                          <span className="text-muted-foreground font-medium">{availableMaxPrice.toLocaleString()} Ar</span>
                        </div>

                        <div className="relative">
                          <input
                            type="range"
                            min={availableMinPrice}
                            max={availableMaxPrice}
                            step={dynamicStep}
                            value={filters.maxPrice}
                            onChange={(e) =>
                              handlePriceRangeChange([availableMinPrice, Number(e.target.value)])
                            }
                            className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
                          />
                          <div
                            className="absolute top-0 left-0 h-2 bg-primary/30 rounded-full pointer-events-none"
                            style={{ width: `${((filters.maxPrice - availableMinPrice) / (availableMaxPrice - availableMinPrice)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Reset Button */}
                    <button
                      onClick={clearFilters}
                      className="w-full py-3 text-sm font-medium rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-destructive hover:text-destructive hover:bg-destructive/5 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Réinitialiser les filtres
                    </button>

                    {/* Filter Blocks */}
                    <FilterBlock
                      title="Marque"
                      name="brand"
                      options={filterOptions.brands}
                      currentValue={filters.brand}
                    />

                    <FilterBlock
                      title="Transmission"
                      name="transmission"
                      options={filterOptions.transmissions}
                      currentValue={filters.transmission}
                    />

                    <FilterBlock
                      title="Carburant"
                      name="fuel"
                      options={filterOptions.fuels}
                      currentValue={filters.fuel}
                    />

                    <FilterBlock
                      title="Nombre de places"
                      name="minSeats"
                      options={filterOptions.seats}
                      currentValue={filters.minSeats}
                    />
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* ZONE DES RÉSULTATS */}
          <section ref={vehicleListRef} className="flex-1 min-w-0">
            {/* Header des résultats */}
            {isLoading ? (
              <ResultsHeaderSkeleton />
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-border/40">
                <div className="flex items-center gap-3">
                  {/* <div className="p-2.5 bg-secondary/20 rounded-xl">
                    <Car className="w-5 h-5 text-secondary-foreground" />
                  </div> */}
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {filteredVehicles.length} véhicule{filteredVehicles.length > 1 ? "s" : ""} trouvé{filteredVehicles.length > 1 ? "s" : ""}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Page {currentPage} sur {totalPages || 1}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SKELETON GRID */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <VehiculeCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* AUCUN VÉHICULE */}
            {!isLoading && !isError && filteredVehicles.length === 0 && (
              <div className="bg-card border border-border/60 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <XCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Aucun véhicule trouvé
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Aucun véhicule ne correspond à vos critères de recherche. Essayez d'ajuster vos filtres.
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                  <XCircle className="w-4 h-4" />
                  Réinitialiser les filtres
                </button>
              </div>
            )}

            {/* LISTE DES VÉHICULES */}
            {!isLoading && !isError && filteredVehicles.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedVehicles.map(({ id, ...props }) => (
                  <Link key={id} to={`/vehicule/${id}`} className="group">
                    <VehicleCard
                      {...props}
                      onReserve={() => handleReserve(id)}
                      reserveButtonClassName="bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:bg-primary/90 transition"
                    />
                  </Link>
                ))}
              </div>
            )}

            {/* PAGINATION */}
            {!isLoading && totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10 pt-8 border-t border-border/40">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2.5 border border-border rounded-xl text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-muted-foreground disabled:hover:border-border transition-all duration-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-xl font-semibold text-sm transition-all duration-200 ${currentPage === page
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "bg-card text-foreground border border-border hover:bg-muted hover:border-primary/30"
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2.5 border border-border rounded-xl text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-muted-foreground disabled:hover:border-border transition-all duration-200"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default AllCars;
