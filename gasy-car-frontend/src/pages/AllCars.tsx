import { useState, useMemo, useEffect, type ComponentProps, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import VehicleCard from "@/components/VehicleCard";
import VehiculeCardSkeleton from "@/components/VehicleCardSkeleton";
import AllCarsHero from "@/components/AllCarsHero";
import {
  XCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Filter,
  Sparkles,
} from "lucide-react";
import { useVehiculesQuery } from "@/useQuery/vehiculeUseQuery";
import { useDebounce } from "@/hooks/useDebounce";
import { useVehicleFavorites } from "@/hooks/useVehicleFavorites";

type FilterState = {
  yearFrom: string;
  yearTo: string;
  serviceType: string;
  city: string;
  delivery: string;
  chauffeur: string;
  vehicleType: string;
  brand: string;
  model: string;
  transmission: string;
  fuel: string;
  minSeats: number;
  minPrice: number;
  maxPrice: number;
};

type VehicleCardData = {
  id: string;
  created_at?: string | null;
  rawYear?: number | null;
  city?: string;
  category?: string;
  serviceType?: string;
  hasDelivery?: boolean;
  hasChauffeur?: boolean;
  vehicleType?: "TOURISME" | "UTILITAIRE" | "";
} & ComponentProps<typeof VehicleCard>;

const DEFAULT_MIN_SEATS = 0;
const ITEMS_PER_PAGE = 9;
const VISIBLE_BRANDS_COUNT = 2;
const NEW_LISTING_WINDOW_MS = 1000 * 60 * 60 * 24 * 30;

const SERVICE_TYPE_OPTIONS = [
  "Transfert aéroport",
  "LCD (courte durée)",
  "LMD (un mois et +)",
] as const;

const DELIVERY_OPTIONS = ["Oui", "Non"] as const;
const CHAUFFEUR_OPTIONS = ["Oui", "Non"] as const;

const VEHICLE_TYPE_OPTIONS = ["TOURISME", "UTILITAIRE"] as const;

const isRecentListing = (date?: string | null) => {
  if (!date) return false;
  return Date.now() - new Date(date).getTime() <= NEW_LISTING_WINDOW_MS;
};

const toNormalized = (value?: string | null) =>
  (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const parseYear = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
};

const FilterSidebarSkeleton = () => (
  <aside className="h-fit w-full shrink-0 lg:w-[270px] xl:w-[280px]">
    <div className="animate-pulse lg:sticky lg:top-28">
      <div className="overflow-hidden rounded-[1.75rem] border border-border/60 bg-card shadow-lg">
        <div className="border-b border-border/50 bg-gradient-to-r from-primary/10 to-secondary/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-muted" />
            <div className="h-5 w-40 rounded-lg bg-muted" />
          </div>
        </div>

        <div className="space-y-5 p-5">
          <div className="space-y-4 border-b border-border/40 pb-6">
            <div className="h-5 w-28 rounded bg-muted" />
            <div className="flex justify-between">
              <div className="h-4 w-16 rounded bg-muted/70" />
              <div className="h-4 w-20 rounded bg-primary/20" />
              <div className="h-4 w-16 rounded bg-muted/70" />
            </div>
            <div className="h-2 w-full rounded-full bg-muted" />
          </div>

          <div className="h-11 w-full rounded-xl bg-muted/50" />

          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3 border-b border-border/40 pb-5 last:border-0">
              <div className="h-5 w-24 rounded bg-muted" />
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded bg-muted/70" />
                  <div className="h-4 w-32 rounded bg-muted/50" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded bg-muted/70" />
                  <div className="h-4 w-28 rounded bg-muted/50" />
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
  <div className="mb-6 flex items-center justify-between animate-pulse">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl bg-muted" />
      <div>
        <div className="mb-2 h-5 w-32 rounded bg-muted" />
        <div className="h-4 w-48 rounded bg-muted/60" />
      </div>
    </div>
  </div>
);

const AllCars = () => {
  const [searchParams] = useSearchParams();
  const typeFilter = searchParams.get("type") || undefined;

  const { data: allcarsdata = [], isLoading, isError, error, refetch } =
    useVehiculesQuery(typeFilter);

  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useVehicleFavorites();
  const queryErrorMessage =
    error instanceof Error ? error.message : "Impossible de récupérer les véhicules.";
  const isOffline = typeof navigator !== "undefined" && !navigator.onLine;

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc" | "newest";
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [animatedPrice, setAnimatedPrice] = useState(0);

  const [filters, setFilters] = useState<FilterState>({
    yearFrom: "",
    yearTo: "",
    serviceType: "",
    city: "",
    delivery: "",
    chauffeur: "",
    vehicleType: "",
    brand: "",
    model: "",
    transmission: "",
    fuel: "",
    minSeats: DEFAULT_MIN_SEATS,
    minPrice: 0,
    maxPrice: 1000,
  });

  const vehicleListRef = useRef<HTMLElement | null>(null);

  const vehicles = useMemo<VehicleCardData[]>(() => {
    return allcarsdata.map((vehicle) => {
      const price =
        parseFloat(String(vehicle.prix_jour || 0).replace(/[^\d.-]/g, "")) || 0;

      const image =
        (vehicle as any).photo_principale || vehicle.photos?.[0]?.image || "";
      const brand =
        (vehicle as any).marque?.nom ||
        vehicle.marque_data?.nom ||
        (vehicle as any).marque_nom ||
        "Marque inconnue";
      const model =
        (vehicle as any).modele?.label ||
        (vehicle as any).modele?.nom ||
        vehicle.modele_data?.label ||
        (vehicle as any).modele_label ||
        vehicle.titre ||
        "Modèle inconnu";
      const category =
        (vehicle as any).categorie?.nom ||
        vehicle.categorie_data?.nom ||
        (vehicle as any).categorie_nom ||
        "";
      const city = (vehicle.ville || "").trim();
      const transmission =
        (vehicle as any).transmission?.label ||
        (vehicle as any).transmission?.nom ||
        vehicle.transmission_data?.nom ||
        (vehicle as any).transmission_nom ||
        "Transmission inconnue";
      const fuel =
        (vehicle as any).type_carburant?.label ||
        (vehicle as any).type_carburant?.nom ||
        vehicle.type_carburant_data?.nom ||
        (vehicle as any).type_carburant_nom ||
        "Carburant inconnu";

      const hasHourlyPrice = Number(vehicle.prix_heure || 0) > 0;
      const hasMonthlyPrice = Number(vehicle.prix_mois || 0) > 0;
      const hasLongDurationDiscount = Number(vehicle.remise_longue_duree_pourcent || 0) > 0;

      const searchableText = toNormalized(
        `${vehicle.titre} ${model} ${category} ${vehicle.zone} ${vehicle.adresse_localisation}`
      );

      const serviceType = searchableText.includes("aeroport") || searchableText.includes("airport")
        ? "Transfert aéroport"
        : hasMonthlyPrice || hasLongDurationDiscount
          ? "LMD (un mois et +)"
          : hasHourlyPrice || Number(vehicle.prix_jour || 0) > 0
            ? "LCD (courte durée)"
            : "";

      const vehicleType = vehicle.type_vehicule || "";

      const discount = Number((vehicle as any).remise_par_jour || 0);

      return {
        id: vehicle.id,
        created_at: vehicle.created_at,
        image,
        year: vehicle.annee,
        rawYear: vehicle.annee,
        brand,
        model,
        rating: Number(vehicle.note_moyenne ?? 0),
        trips: vehicle.nombre_locations ?? 0,
        price,
        seats: vehicle.nombre_places ?? 0,
        transmission,
        fuel,
        city,
        category,
        serviceType,
        hasDelivery: Boolean(vehicle.est_disponible),
        hasChauffeur: Boolean(vehicle.driver || vehicle.driver_data || vehicle.driver_name),
        vehicleType,
        certified: vehicle.est_certifie,
        superHost: (vehicle.nombre_locations ?? 0) >= 40,
        newListing: isRecentListing(vehicle.created_at),
        deliveryAvailable: vehicle.est_disponible,
        oldPrice: discount > 0 ? price + discount : undefined,
      };
    });
  }, [allcarsdata]);

  const {
    maxPrice: availableMaxPrice,
    minPrice: availableMinPrice,
    dynamicStep,
  } = useMemo(() => {
    if (!vehicles.length) return { maxPrice: 1000, minPrice: 0, dynamicStep: 10 };

    const prices = vehicles.map((v) => v.price).filter((p) => p > 0);
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

  useEffect(() => {
    if (!isLoading && filters.maxPrice === 1000 && availableMaxPrice !== 1000) {
      setFilters((prev) => ({ ...prev, maxPrice: availableMaxPrice }));
    }
  }, [isLoading, availableMaxPrice, filters.maxPrice]);

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
  }, [filters.maxPrice, animatedPrice]);

  const filterOptions = useMemo(() => {
    const brands = Array.from(new Set(vehicles.map((v) => v.brand))).filter(Boolean);
    const transmissions = Array.from(
      new Set(vehicles.map((v) => v.transmission))
    ).filter((t) => t !== "Transmission inconnue");
    const fuels = Array.from(new Set(vehicles.map((v) => v.fuel))).filter(
      (f) => f !== "Carburant inconnu"
    );
    const seats = Array.from(new Set(vehicles.map((v) => v.seats).filter(Boolean)));
    const cities = Array.from(new Set(vehicles.map((v) => v.city).filter(Boolean)));
    const models = Array.from(new Set(vehicles.map((v) => v.model).filter(Boolean))).filter(
      (model) => model !== "Modèle inconnu"
    );

    return {
      brands: (brands as string[]).sort(),
      models: (models as string[]).sort(),
      transmissions: (transmissions as string[]).sort(),
      fuels: (fuels as string[]).sort(),
      cities: (cities as string[]).sort(),
      seats: (seats as number[]).filter((s) => s > 0).sort((a, b) => a - b),
    };
  }, [vehicles]);

  const handleReserve = (carId: string) => {
    navigate(`/reservation/${carId}`);
  };

  const scrollToVehicleList = () => {
    if (vehicleListRef.current) {
      window.scrollTo({
        top: vehicleListRef.current.offsetTop - 140,
        behavior: "smooth",
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToVehicleList();
  };

  const handleFilterChange = <K extends keyof FilterState>(
    name: K,
    value: FilterState[K]
  ) => {
    setCurrentPage(1);

    let newValue: FilterState[K];
    const sameValue = filters[name] === value;

    if (sameValue) {
      newValue = (
        name === "minSeats" ? (DEFAULT_MIN_SEATS as unknown) : ("" as unknown)
      ) as FilterState[K];
    } else {
      newValue = value;
    }

    setFilters((prev) => ({ ...prev, [name]: newValue }));
    scrollToVehicleList();
  };

  const handlePriceRangeChange = (values: number[]) => {
    setCurrentPage(1);
    setFilters((prev) => ({
      ...prev,
      minPrice: values[0],
      maxPrice: values[1],
    }));
  };

  const clearFilters = () => {
    setCurrentPage(1);
    setFilters({
      yearFrom: "",
      yearTo: "",
      serviceType: "",
      city: "",
      delivery: "",
      chauffeur: "",
      vehicleType: "",
      brand: "",
      model: "",
      transmission: "",
      fuel: "",
      minSeats: DEFAULT_MIN_SEATS,
      minPrice: 0,
      maxPrice: availableMaxPrice,
    });
    setSearchTerm("");
    setSortBy("newest");
  };

  const filteredVehicles = useMemo(() => {
    let results = vehicles;

    if (debouncedSearchTerm.trim()) {
      const q = debouncedSearchTerm.toLowerCase();
      results = results.filter((v) => {
        const searchable =
          `${v.brand} ${v.model} ${v.transmission} ${v.fuel} ${v.year}`.toLowerCase();
        return q.split(/\s+/).every((word) => searchable.includes(word));
      });
    }

    if (filters.brand) results = results.filter((v) => v.brand === filters.brand);
    if (filters.model) results = results.filter((v) => v.model === filters.model);
    if (filters.transmission)
      results = results.filter((v) => v.transmission === filters.transmission);
    if (filters.fuel) results = results.filter((v) => v.fuel === filters.fuel);
    if (filters.serviceType)
      results = results.filter((v) => v.serviceType === filters.serviceType);
    if (filters.city) results = results.filter((v) => v.city === filters.city);
    if (filters.delivery)
      results = results.filter((v) =>
        filters.delivery === "Oui" ? v.hasDelivery : !v.hasDelivery
      );
    if (filters.chauffeur)
      results = results.filter((v) =>
        filters.chauffeur === "Oui" ? v.hasChauffeur : !v.hasChauffeur
      );
    if (filters.vehicleType)
      results = results.filter((v) => v.vehicleType === filters.vehicleType);

    if (filters.yearFrom) {
      const from = parseYear(filters.yearFrom);
      if (!Number.isNaN(from)) {
        results = results.filter((v) => Number(v.rawYear || 0) >= from);
      }
    }

    if (filters.yearTo) {
      const to = parseYear(filters.yearTo);
      if (!Number.isNaN(to)) {
        results = results.filter((v) => Number(v.rawYear || 0) <= to);
      }
    }

    if (filters.minSeats > 0)
      results = results.filter((v) => (v.seats ?? 0) >= filters.minSeats);

    results = results.filter(
      (v) => v.price >= filters.minPrice && v.price <= filters.maxPrice
    );

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
          return (
            new Date(b.created_at ?? "").getTime() -
            new Date(a.created_at ?? "").getTime()
          );
        default:
          return 0;
      }
    });

    return results;
  }, [vehicles, debouncedSearchTerm, filters, sortBy]);

  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedVehicles = filteredVehicles.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.yearFrom) count++;
    if (filters.yearTo) count++;
    if (filters.serviceType) count++;
    if (filters.city) count++;
    if (filters.delivery) count++;
    if (filters.chauffeur) count++;
    if (filters.vehicleType) count++;
    if (filters.brand) count++;
    if (filters.model) count++;
    if (filters.transmission) count++;
    if (filters.fuel) count++;
    if (filters.minSeats > 0) count++;
    if (filters.maxPrice < availableMaxPrice) count++;
    if (searchTerm.trim()) count++;
    return count;
  }, [filters, availableMaxPrice, searchTerm]);

  const filterChips = useMemo(() => {
    const chips: { label: string; onClick: () => void }[] = [];

    if (searchTerm.trim()) {
      chips.push({
        label: `Recherche : ${searchTerm}`,
        onClick: () => setSearchTerm(""),
      });
    }
    if (filters.brand) {
      chips.push({
        label: filters.brand,
        onClick: () => handleFilterChange("brand", filters.brand),
      });
    }
    if (filters.model) {
      chips.push({
        label: `Modèle : ${filters.model}`,
        onClick: () => handleFilterChange("model", filters.model),
      });
    }
    if (filters.transmission) {
      chips.push({
        label: filters.transmission,
        onClick: () => handleFilterChange("transmission", filters.transmission),
      });
    }
    if (filters.fuel) {
      chips.push({
        label: filters.fuel,
        onClick: () => handleFilterChange("fuel", filters.fuel),
      });
    }
    if (filters.serviceType) {
      chips.push({
        label: `Service : ${filters.serviceType}`,
        onClick: () => handleFilterChange("serviceType", filters.serviceType),
      });
    }
    if (filters.city) {
      chips.push({
        label: `Ville : ${filters.city}`,
        onClick: () => handleFilterChange("city", filters.city),
      });
    }
    if (filters.delivery) {
      chips.push({
        label: `Livraison : ${filters.delivery}`,
        onClick: () => handleFilterChange("delivery", filters.delivery),
      });
    }
    if (filters.chauffeur) {
      chips.push({
        label: `Chauffeur : ${filters.chauffeur}`,
        onClick: () => handleFilterChange("chauffeur", filters.chauffeur),
      });
    }
    if (filters.vehicleType) {
      chips.push({
        label: `Type : ${filters.vehicleType}`,
        onClick: () => handleFilterChange("vehicleType", filters.vehicleType),
      });
    }
    if (filters.yearFrom || filters.yearTo) {
      chips.push({
        label: `Années : ${filters.yearFrom || "..."} → ${filters.yearTo || "..."}`,
        onClick: () => setFilters((prev) => ({ ...prev, yearFrom: "", yearTo: "" })),
      });
    }
    if (filters.minSeats > 0) {
      chips.push({
        label: `${filters.minSeats}+ places`,
        onClick: () => handleFilterChange("minSeats", filters.minSeats),
      });
    }
    if (filters.maxPrice < availableMaxPrice) {
      chips.push({
        label: `Max ${filters.maxPrice.toLocaleString()} Ar`,
        onClick: () =>
          setFilters((prev) => ({ ...prev, maxPrice: availableMaxPrice })),
      });
    }

    return chips;
  }, [searchTerm, filters, availableMaxPrice]);

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
      <div className="border-b border-border/40 pb-5 last:border-0 last:pb-0">
        <button
          className="flex w-full items-center justify-between py-1.5 text-left text-sm font-semibold text-foreground transition-colors hover:text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {title}
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="mt-3 space-y-1.5">
            {visibleOptions.map((option, i) => {
              const isSelected = currentValue === option;

              return (
                <button
                  key={i}
                  type="button"
                  className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition-all duration-200 ${
                    isSelected
                      ? "border-primary/20 bg-primary/10 shadow-sm"
                      : "border-transparent hover:border-border/60 hover:bg-muted/50"
                  }`}
                  onClick={() => handleFilterChange(name, option as FilterState[K])}
                >
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all duration-200 ${
                      isSelected
                        ? "border-primary bg-primary shadow-sm"
                        : "border-border bg-background"
                    }`}
                  >
                    {isSelected && (
                      <Check className="h-3 w-3 text-primary-foreground" />
                    )}
                  </div>

                  <span
                    className={`text-sm ${
                      isSelected ? "font-medium text-primary" : "text-foreground"
                    }`}
                  >
                    {name === "minSeats" ? `${option} places et +` : option}
                  </span>
                </button>
              );
            })}

            {isBrandFilter && options.length > VISIBLE_BRANDS_COUNT && (
              <button
                className="mt-2 flex items-center gap-1.5 px-3 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                onClick={() => setShowAllBrands(!showAllBrands)}
              >
                {showAllBrands
                  ? "Voir moins"
                  : `Voir ${options.length - VISIBLE_BRANDS_COUNT} autres marques`}
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    showAllBrands ? "rotate-180" : ""
                  }`}
                />
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.06),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.06),transparent_24%),linear-gradient(to_bottom,#fbfdff,#f5f9ff,#fbfdff)]">
      <AllCarsHero
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalVehicles={vehicles.length}
        isLoading={isLoading}
        typeFilter={typeFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-12 lg:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-7">
          {isLoading ? (
            <FilterSidebarSkeleton />
          ) : (
            <motion.aside
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
              className="h-fit w-full shrink-0 lg:w-[270px] xl:w-[280px]"
            >
              <div className="lg:sticky lg:top-28">
                <div className="overflow-hidden rounded-[1.9rem] border border-white/70 bg-white/85 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                  <div className="border-b border-border/40 bg-[linear-gradient(135deg,rgba(37,99,235,0.08),rgba(16,185,129,0.06))] px-5 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-primary/10 p-2.5 shadow-sm">
                          <Filter className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h2 className="text-base font-semibold text-foreground">
                            Filtres avancés
                          </h2>
                          <p className="text-xs text-muted-foreground">
                            Affinez votre sélection
                          </p>
                        </div>
                      </div>

                      {activeFiltersCount > 0 && (
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20">
                          {activeFiltersCount}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-5 p-5">
                    <div className="rounded-[1.4rem] border border-border/50 bg-slate-50/70 p-4">
                      <h3 className="mb-4 text-sm font-semibold text-foreground">Années</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          min={1950}
                          max={2100}
                          placeholder="De"
                          value={filters.yearFrom}
                          onChange={(e) => {
                            setCurrentPage(1);
                            setFilters((prev) => ({ ...prev, yearFrom: e.target.value }));
                          }}
                          className="w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/40"
                        />
                        <input
                          type="number"
                          min={1950}
                          max={2100}
                          placeholder="À"
                          value={filters.yearTo}
                          onChange={(e) => {
                            setCurrentPage(1);
                            setFilters((prev) => ({ ...prev, yearTo: e.target.value }));
                          }}
                          className="w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/40"
                        />
                      </div>
                    </div>

                    <div className="rounded-[1.4rem] border border-border/50 bg-slate-50/70 p-4">
                      <h3 className="mb-4 text-sm font-semibold text-foreground">
                        Budget maximum
                      </h3>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-muted-foreground">
                            {availableMinPrice.toLocaleString()} Ar
                          </span>
                          <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-sm font-bold text-primary">
                            {animatedPrice.toLocaleString()} Ar
                          </span>
                          <span className="font-medium text-muted-foreground">
                            {availableMaxPrice.toLocaleString()} Ar
                          </span>
                        </div>

                        <div className="relative">
                          <input
                            type="range"
                            min={availableMinPrice}
                            max={availableMaxPrice}
                            step={dynamicStep}
                            value={filters.maxPrice}
                            onChange={(e) =>
                              handlePriceRangeChange([
                                availableMinPrice,
                                Number(e.target.value),
                              ])
                            }
                            className="w-full cursor-pointer appearance-none rounded-full accent-primary"
                          />
                          <div
                            className="pointer-events-none absolute left-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-primary/25"
                            style={{
                              width: `${
                                ((filters.maxPrice - availableMinPrice) /
                                  (availableMaxPrice - availableMinPrice)) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={clearFilters}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-200 hover:border-destructive hover:bg-destructive/5 hover:text-destructive"
                    >
                      <XCircle className="h-4 w-4" />
                      Réinitialiser les filtres
                    </button>

                    <FilterBlock
                      title="Types de services"
                      name="serviceType"
                      options={[...SERVICE_TYPE_OPTIONS]}
                      currentValue={filters.serviceType}
                    />

                    <FilterBlock
                      title="Localisations (Ville)"
                      name="city"
                      options={filterOptions.cities}
                      currentValue={filters.city}
                    />

                    <FilterBlock
                      title="Livraison"
                      name="delivery"
                      options={[...DELIVERY_OPTIONS]}
                      currentValue={filters.delivery}
                    />

                    <FilterBlock
                      title="Chauffeurs"
                      name="chauffeur"
                      options={[...CHAUFFEUR_OPTIONS]}
                      currentValue={filters.chauffeur}
                    />

                    <FilterBlock
                      title="Type de véhicule"
                      name="vehicleType"
                      options={[...VEHICLE_TYPE_OPTIONS]}
                      currentValue={filters.vehicleType}
                    />

                    <FilterBlock
                      title="Marque"
                      name="brand"
                      options={filterOptions.brands}
                      currentValue={filters.brand}
                    />

                    <FilterBlock
                      title="Modèle"
                      name="model"
                      options={filterOptions.models}
                      currentValue={filters.model}
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
            </motion.aside>
          )}

          <section ref={vehicleListRef} className="min-w-0 flex-1">
            {isLoading ? (
              <ResultsHeaderSkeleton />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="mb-6 rounded-[1.75rem] border border-white/70 bg-white/80 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur-xl"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-primary/10 p-2.5 shadow-sm">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        {filteredVehicles.length} véhicule
                        {filteredVehicles.length > 1 ? "s" : ""} trouvé
                        {filteredVehicles.length > 1 ? "s" : ""}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Page {currentPage} sur {totalPages || 1}
                      </p>
                    </div>
                  </div>

                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                    >
                      <XCircle className="h-4 w-4" />
                      Tout effacer
                    </button>
                  )}
                </div>

                {filterChips.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {filterChips.map((chip, index) => (
                      <button
                        key={`${chip.label}-${index}`}
                        onClick={chip.onClick}
                        className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/10"
                      >
                        {chip.label}
                        <XCircle className="h-3.5 w-3.5" />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {isLoading && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <VehiculeCardSkeleton key={i} />
                ))}
              </div>
            )}

            {!isLoading && !isError && filteredVehicles.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[1.9rem] border border-border/60 bg-white/85 p-12 text-center shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur-xl"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <XCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  Aucun véhicule trouvé
                </h3>
                <p className="mx-auto mb-6 max-w-md text-muted-foreground">
                  Aucun véhicule ne correspond à vos critères de recherche.
                  Essayez d’ajuster vos filtres.
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 font-medium text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90"
                >
                  <XCircle className="h-4 w-4" />
                  Réinitialiser les filtres
                </button>
              </motion.div>
            )}

            {!isLoading && isError && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[1.9rem] border border-destructive/30 bg-white/85 p-12 text-center shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur-xl"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
                  <XCircle className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  {isOffline
                    ? "Vous êtes hors connexion"
                    : "Impossible de charger les véhicules"}
                </h3>
                <p className="mx-auto mb-6 max-w-md text-muted-foreground">
                  {isOffline
                    ? "Vérifiez votre connexion internet puis réessayez."
                    : queryErrorMessage}
                </p>
                <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <button
                    onClick={() => refetch()}
                    className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 font-medium text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90"
                  >
                    Réessayer
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="inline-flex items-center gap-2 rounded-2xl border border-border px-6 py-3 font-medium text-foreground transition hover:bg-muted"
                  >
                    Retour à l'accueil
                  </button>
                </div>
              </motion.div>
            )}

            {!isLoading && !isError && filteredVehicles.length > 0 && (
              <motion.div
                layout
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
              >
                {paginatedVehicles.map(({ id, ...props }, index) => (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.04 }}
                    whileHover={{ y: -4 }}
                  >
                    <Link to={`/vehicule/${id}`} className="group block">
                      <VehicleCard
                        {...props}
                        isFavorite={isFavorite(id)}
                        onToggleFavorite={() => toggleFavorite(id)}
                        onReserve={() => handleReserve(id)}
                        reserveButtonClassName="bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:bg-primary/90 transition"
                      />
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {!isLoading && totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-10 border-t border-border/40 pt-8"
              >
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded-2xl border border-border bg-white p-2.5 text-muted-foreground transition-all duration-200 hover:border-primary hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:bg-white disabled:hover:text-muted-foreground"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`h-10 w-10 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                            currentPage === page
                              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                              : "border border-border bg-white text-foreground hover:border-primary/30 hover:bg-muted"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="rounded-2xl border border-border bg-white p-2.5 text-muted-foreground transition-all duration-200 hover:border-primary hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:bg-white disabled:hover:text-muted-foreground"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default AllCars;
