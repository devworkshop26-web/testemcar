"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { Search, ChevronDown, MapPin, Bike, CarFront, Truck, Badge } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useNavigate } from "react-router-dom";
import { categoryVehiculeUseQuery } from "@/useQuery/categoryUseQuery";

// ✅ Remplace le JSON district par liste_ville.json (array of {id,name})
import listeVilles from "@/api/liste_ville.json";

type CityItem = { id: string; name: string };

const DEFAULT_CITY = "Antananarivo";

const BASE_CITIES = [
  "Antananarivo",
  "Toamasina",
  "Mahajanga",
  "Fianarantsoa",
  "Toliara",
  "Antsiranana",
  "Antsirabe",
  "Morondava",
  "Sambava",
  "Nosy Be",
  "Ambositra",
  "Fort-Dauphin",
];

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const getCategoryPriority = (name: string) => {
  const value = normalizeText(name);

  if (value.includes("2 roues") || value.includes("moto") || value.includes("scooter")) return 0;
  if (value.includes("vintage") || value.includes("retro") || value.includes("classique")) return 1;
  if (value.includes("tourisme")) return 2;
  if (value.includes("utilitaire")) return 3;

  return 99;
};

const getCategoryIcon = (name: string) => {
  const value = normalizeText(name);

  if (value.includes("2 roues") || value.includes("moto") || value.includes("scooter")) return Bike;
  if (value.includes("vintage") || value.includes("retro") || value.includes("classique")) return Badge;
  if (value.includes("utilitaire")) return Truck;

  return CarFront;
};

// ✅ Nettoyage + déduplication (par nom), tout en gardant id+name
function cleanCityList(data: unknown): CityItem[] {
  if (!Array.isArray(data)) return [];

  const out: CityItem[] = [];
  const seen = new Set<string>();

  for (const item of data) {
    if (!item || typeof item !== "object") continue;
    const obj = item as Record<string, unknown>;
    const id = typeof obj.id === "string" ? obj.id.trim() : "";
    const name = typeof obj.name === "string" ? obj.name.trim() : "";

    if (!id || !name) continue;

    const key = normalizeText(name);
    if (seen.has(key)) continue;

    seen.add(key);
    out.push({ id, name });
  }

  return out;
}

const ALL_CITIES_FROM_JSON: CityItem[] = cleanCityList(listeVilles);

export default function SearchBar() {
  const navigate = useNavigate();
  const { CategoryData: categories = [] } = categoryVehiculeUseQuery();

  // ✅ value peut rester vide pour afficher le placeholder
  const [location, setLocation] = useState<string>("");
  // ✅ id sélectionné (utile pour backend)
  const [selectedCityId, setSelectedCityId] = useState<string>("");

  const [detectedCity, setDetectedCity] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [carType, setCarType] = useState<string>("");

  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);

  const userEditedLocation = useRef(false);

  // Auto-fill ville via IP (inchangé dans l'esprit)
  useEffect(() => {
    const controller = new AbortController();

    const detectCityByIP = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/", { signal: controller.signal });
        if (!response.ok) throw new Error("IP lookup failed");

        const data = await response.json();
        const city =
          typeof data?.city === "string" && data.city.trim() ? data.city.trim() : DEFAULT_CITY;

        setDetectedCity(city);

        if (!userEditedLocation.current) {
          // On pré-remplit si possible (sinon placeholder reste visible au départ)
          setLocation(city);

          const match = ALL_CITIES_FROM_JSON.find(
            (c) => normalizeText(c.name) === normalizeText(city)
          );
          setSelectedCityId(match?.id ?? "");
        }
      } catch {
        // si IP échoue, on laisse le placeholder (Antananarivo)
      }
    };

    detectCityByIP();
    return () => controller.abort();
  }, []);

  // Fallback local si jamais le JSON est vide
  const fallbackCityObjects = useMemo<CityItem[]>(() => {
    // on fabrique des ids stables juste pour fallback (sans casser)
    const names = Array.from(new Set([detectedCity, DEFAULT_CITY, ...BASE_CITIES].filter(Boolean)));
    return names.map((name, idx) => ({ id: `MDG-FALLBACK-${String(idx + 1).padStart(4, "0")}`, name }));
  }, [detectedCity]);

  // ✅ Liste finale: JSON sinon fallback
  const allCityList = useMemo<CityItem[]>(() => {
    return ALL_CITIES_FROM_JSON.length > 0 ? ALL_CITIES_FROM_JSON : fallbackCityObjects;
  }, [fallbackCityObjects]);

  // ✅ Logique dropdown: 10 items max, recherche sur toute la liste quand l’utilisateur tape
  const filteredCities = useMemo<CityItem[]>(() => {
    const LIMIT = 10;
    const query = normalizeText(location);

    if (!userEditedLocation.current) {
      return allCityList.slice(0, LIMIT);
    }

    if (!query) {
      return allCityList.slice(0, LIMIT);
    }

    return allCityList
      .filter((c) => normalizeText(c.name).includes(query))
      .slice(0, LIMIT);
  }, [location, allCityList]);

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      const pa = getCategoryPriority(a.nom);
      const pb = getCategoryPriority(b.nom);
      if (pa !== pb) return pa - pb;
      return a.nom.localeCompare(b.nom, "fr");
    });
  }, [categories]);

  const selectedCategory = useMemo(
    () => sortedCategories.find((type) => type.nom === carType),
    [sortedCategories, carType]
  );

  const SelectedCategoryIcon = selectedCategory ? getCategoryIcon(selectedCategory.nom) : null;

  // ============================
  // 🔍 FUNCTION : HANDLE SEARCH
  // ============================
  const handleSearch = () => {
    const params = new URLSearchParams();

    // ✅ On garde "ville" (logique existante)
    if (location) params.append("ville", location);

    // ✅ On ajoute l’id si on a sélectionné une ville du JSON (sans casser backend)
    if (selectedCityId) params.append("ville_id", selectedCityId);

    if (startDate) params.append("start_date", format(startDate, "yyyy-MM-dd"));
    if (endDate) params.append("end_date", format(endDate, "yyyy-MM-dd"));
    if (carType) params.append("categorie", carType);

    navigate(`/search-results?${params.toString()}`);
  };

  return (
    <div className="w-full">
      {/* CARD */}
      <div className="w-full bg-white rounded-3xl shadow-[0_6px_20px_rgba(15,23,42,0.08)] border border-slate-100">
        {/* LIGNE CHAMPS */}
        <div className="p-2 flex flex-col lg:flex-row lg:items-center">
          {/* VILLE */}
          <div className="flex-[1.5] min-w-0 px-6 py-2 lg:py-1 lg:border-r border-slate-200 relative">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-0.5 block">
              Ville
            </label>

            <div className="relative">
              <Input
                placeholder="Antananarivo"
                value={location}
                onFocus={() => setShowCityDropdown(true)}
                onBlur={() => setTimeout(() => setShowCityDropdown(false), 150)}
                onChange={(e) => {
                  userEditedLocation.current = true;
                  setLocation(e.target.value);
                  setSelectedCityId(""); // ✅ tapé manuel => id inconnu
                  setShowCityDropdown(true);
                }}
                className="border-none p-0 h-auto shadow-none bg-transparent focus-visible:ring-0 focus-visible:border-transparent text-[15px] font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:ring-0 focus:ring-offset-0"
              />

              {showCityDropdown && filteredCities.length > 0 && (
                <div className="absolute left-0 top-full z-50 mt-3 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                  {filteredCities.map((city) => (
                    <button
                      key={city.id}
                      type="button"
                      data-city-id={city.id}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        userEditedLocation.current = true;
                        setLocation(city.name);     // ✅ affichage name
                        setSelectedCityId(city.id); // ✅ stockage id
                        setShowCityDropdown(false);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-[14px] text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{city.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* DEBUT */}
          <div className="flex-1 min-w-0 px-6 py-2 lg:py-1 lg:border-r border-slate-200">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-0.5 block">
              Départ
            </label>

            <Popover open={openStartDate} onOpenChange={setOpenStartDate}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  onClick={() => setOpenStartDate(true)}
                  className="w-full flex items-center justify-between gap-2 text-[14px] font-medium text-slate-900 hover:bg-slate-50 rounded px-1 -ml-1 transition-colors text-left whitespace-nowrap"
                >
                  <span>{startDate ? format(startDate, "dd/MM/yyyy", { locale: fr }) : "Date"}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white rounded-3xl shadow-xl border border-slate-200">
                <Calendar
                  mode="single"
                  selected={startDate || undefined}
                  onSelect={(d) => {
                    setStartDate(d || null);
                    setOpenStartDate(false);
                  }}
                  numberOfMonths={1}
                  locale={fr}
                />
                <div className="flex justify-end px-4 py-3 border-t">
                  <Button variant="ghost" onClick={() => setStartDate(null)}>
                    Effacer
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* FIN */}
          <div className="flex-1 min-w-0 px-6 py-2 lg:py-1 lg:border-r border-slate-200 relative">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-0.5 block">
              Jusqu&apos;au
            </label>

            <Popover open={openEndDate} onOpenChange={setOpenEndDate}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  onClick={() => setOpenEndDate(true)}
                  className="w-full flex items-center justify-between gap-2 text-[14px] font-medium text-slate-900 hover:bg-slate-50 rounded px-1 -ml-1 transition-colors text-left whitespace-nowrap"
                >
                  <span>{endDate ? format(endDate, "dd/MM/yyyy", { locale: fr }) : "Date"}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white rounded-3xl shadow-xl border border-slate-200">
                <Calendar
                  mode="single"
                  selected={endDate || undefined}
                  onSelect={(d) => {
                    setEndDate(d || null);
                    setOpenEndDate(false);
                  }}
                  numberOfMonths={1}
                  locale={fr}
                />
                <div className="flex justify-end px-4 py-3 border-t">
                  <Button variant="ghost" onClick={() => setEndDate(null)}>
                    Effacer
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* TYPE DE VOITURE (Dropdown like header, modal=false) */}
          <div className="flex-1 min-w-0 px-6 py-2 lg:py-1 relative">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-0.5 block">
              Type de Voiture
            </label>

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="w-full min-w-0 border-none p-0 h-auto shadow-none bg-transparent focus:outline-none focus:ring-0 focus:ring-offset-0"
                >
                  <div className="w-full flex items-center justify-between gap-2 text-[14px] font-medium text-slate-900 hover:bg-slate-50 rounded px-1 -ml-1 transition-colors text-left">
                    <div className="flex min-w-0 items-center gap-2">
                      {SelectedCategoryIcon ? (
                        <SelectedCategoryIcon className="w-4 h-4 text-slate-500 shrink-0" />
                      ) : null}
                      <span className="block min-w-0 whitespace-nowrap overflow-visible text-left">
                        {carType || "Choisir une catégorie"}
                      </span>
                    </div>
                    <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                  </div>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                sideOffset={12}
                className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[220px] bg-white rounded-xl shadow-xl border border-slate-200 p-1"
              >
                {sortedCategories.map((type) => {
                  const Icon = getCategoryIcon(type.nom);

                  return (
                    <DropdownMenuItem
                      key={type.id}
                      onClick={() => setCarType(type.nom)}
                      className="rounded-lg cursor-pointer px-3 py-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-slate-500 shrink-0" />
                        <span>{type.nom}</span>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* BOUTON SEARCH (harmonisé avec le thème) */}
          <div className="px-2">
            <Button
              onClick={handleSearch}
              className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all"
            >
              <Search className="w-5 h-5 text-primary-foreground" />
            </Button>
          </div>
        </div>

        {/* NOTE LEGALE (intégrée & harmonisée) */}
        <div className="px-6 pb-3 pt-2 border-t border-slate-100">
          <p className="text-[11px] leading-relaxed text-slate-500">
            Madagasycar agit exclusivement en qualité d’intermédiaire technique.
          </p>
        </div>
      </div>
    </div>
  );
}