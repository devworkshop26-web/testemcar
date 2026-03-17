import { useState, useRef, useEffect } from "react";
import {
  Search,
  ArrowUpDown,
  Sparkles,
  ChevronDown,
  X,
  Check,
  Filter,
  ShieldCheck,
  CarFront,
  Clock3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc" | "newest";

interface AllCarsHeroProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  totalVehicles: number;
  isLoading: boolean;
  typeFilter?: string;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "name-asc", label: "Nom A → Z" },
  { value: "name-desc", label: "Nom Z → A" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "newest", label: "Plus récents" },
];

const AllCarsHero = ({
  searchTerm,
  onSearchChange,
  totalVehicles,
  isLoading,
  typeFilter,
  sortBy,
  onSortChange,
}: AllCarsHeroProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === sortBy)?.label || "Trier";

  const getCategoryLabel = () => {
    if (typeFilter === "UTILITAIRE") return "Gamme Utilitaire";
    if (typeFilter === "TOURISME") return "Gamme Tourisme";
    return " Catalogue Diversifié ";
  };

  return (
    <section className="relative isolate overflow-hidden bg-[linear-gradient(to_bottom,#ffffff,#f8fbff)] pb-12 pt-24 lg:pb-14 lg:pt-28">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-[-8%] top-[-10%] h-[280px] w-[280px] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-[-8%] right-[-8%] h-[260px] w-[260px] rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,#94a3b8_1px,transparent_1px),linear-gradient(to_bottom,#94a3b8_1px,transparent_1px)] [background-size:44px_44px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            {getCategoryLabel()}
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
             Des véhicules disponibles
            <br />
            <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
               partout à Madagascar. 
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {isLoading ? (
              <span className="animate-pulse">Mise à jour du catalogue...</span>
            ) : (
              <>
                 Choisissez, réservez et prenez la route en toute simplicité
              </>
            )}
          </p>

          <div className="mt-10 rounded-[2rem] border border-white/70 bg-white/80 p-3 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <div
              className={`flex flex-col gap-2 rounded-[1.5rem] border border-border/40 bg-background/70 p-2 transition-all duration-300 sm:flex-row ${
                isFocused || sortDropdownOpen
                  ? "ring-2 ring-primary/15"
                  : "hover:border-primary/20"
              }`}
            >
              <div className="relative flex h-12 flex-1 items-center px-3 sm:h-14">
                <Search
                  className={`mr-3 h-5 w-5 transition-colors ${
                    isFocused ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <input
                  type="text"
                  value={searchTerm}
                  placeholder="Marque, modèle, transmission..."
                  onChange={(e) => onSearchChange(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="w-full border-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70 sm:text-base"
                />

                <AnimatePresence>
                  {searchTerm && (
                    <motion.button
                      type="button"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      onClick={() => onSearchChange("")}
                      className="rounded-full bg-muted p-1 text-muted-foreground transition hover:bg-muted/80"
                    >
                      <X className="h-3.5 w-3.5" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <div className="hidden h-9 w-px self-center bg-border/70 sm:block" />

              <div ref={sortRef} className="relative w-full sm:w-auto sm:min-w-[210px]">
                <button
                  type="button"
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                  className={`flex h-11 w-full items-center justify-between rounded-[1.1rem] px-4 text-sm font-medium transition-all sm:h-12 ${
                    sortDropdownOpen
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted/60"
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    {sortDropdownOpen ? (
                      <Filter className="h-4 w-4" />
                    ) : (
                      <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                    )}
                    {currentSortLabel}
                  </span>
                  <ChevronDown
                    className={`ml-2 h-3.5 w-3.5 transition-transform duration-200 ${
                      sortDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {sortDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.16 }}
                      className="absolute right-0 top-[calc(100%+8px)] z-[100] w-full rounded-2xl border border-border/50 bg-white/95 p-1.5 shadow-2xl backdrop-blur-md sm:w-60"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            onSortChange(option.value);
                            setSortDropdownOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors ${
                            sortBy === option.value
                              ? "bg-primary text-primary-foreground font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          {option.label}
                          {sortBy === option.value && <Check className="h-3.5 w-3.5" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white/80 px-4 py-2 text-sm text-muted-foreground shadow-sm">
              <CarFront className="h-4 w-4 text-primary" />
              Large sélection
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white/80 px-4 py-2 text-sm text-muted-foreground shadow-sm">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Annonces plus rassurantes
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white/80 px-4 py-2 text-sm text-muted-foreground shadow-sm">
              <Clock3 className="h-4 w-4 text-primary" />
              Mise à jour régulière
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AllCarsHero;