import { useState, useRef, useEffect } from "react";
import { Search, ArrowUpDown, Sparkles, ChevronDown, X, Check, Filter } from "lucide-react";
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

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label || "Trier";

  const getCategoryLabel = () => {
    if (typeFilter === "UTILITAIRE") return "Gamme Utilitaire";
    if (typeFilter === "TOURISME") return "Gamme Tourisme";
    return "Catalogue complet";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 100, damping: 15 } 
    },
  };

  return (
    <section className="relative w-full bg-background pt-16 pb-12 lg:pt-5 lg:pb-5 isolate">
    
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          {/* Badge (Design #1) */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-xs font-medium text-primary tracking-wide uppercase">
              <Sparkles className="w-3 h-3" />
              {getCategoryLabel()}
            </span>
          </motion.div>

          {/* Titre (Design #1) */}
          <motion.div variants={itemVariants} className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
              Trouvez votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">prochaine route</span>
            </h1>
          </motion.div>

          {/* Sous-titre (Design #1) */}
          <motion.p variants={itemVariants} className="text-muted-foreground text-base sm:text-lg max-w-lg mb-10 leading-relaxed">
            {isLoading ? (
              <span className="animate-pulse">Mise à jour du catalogue...</span>
            ) : (
              <>
                Une sélection de <span className="text-foreground font-semibold">{totalVehicles} véhicules</span> prêts à partir.
                Qualité certifiée et transparence totale.
              </>
            )}
          </motion.p>

          {/* --- BARRE DE COMMANDE (Design #1 + Fix Z-Index) --- */}
          <motion.div 
            variants={itemVariants} 
            className="w-full max-w-2xl relative"
            style={{ zIndex: 50 }} // Très important : s'assure que le dropdown passe au-dessus de tout
          >
            <div 
              className={`
                group relative flex flex-col sm:flex-row items-center p-1.5 gap-2
                bg-card/90 backdrop-blur-xl border border-border/50 shadow-lg shadow-primary/5
                rounded-2xl transition-all duration-300 ease-out
                ${isFocused || sortDropdownOpen ? "ring-2 ring-primary/20 scale-[1.01]" : "hover:border-primary/30"}
              `}
            >
              {/* Zone Recherche */}
              <div className="relative flex-1 w-full flex items-center px-3 h-12">
                <Search className={`w-5 h-5 mr-3 transition-colors ${isFocused ? "text-primary" : "text-muted-foreground"}`} />
                <input
                  type="text"
                  value={searchTerm}
                  placeholder="Marque, modèle..."
                  onChange={(e) => onSearchChange(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="w-full bg-transparent border-none outline-none text-sm sm:text-base placeholder:text-muted-foreground/70 text-foreground"
                />
                <AnimatePresence>
                  {searchTerm && (
                    <motion.button
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      onClick={() => onSearchChange("")}
                      className="p-1 rounded-full bg-muted hover:bg-muted-foreground/20 text-muted-foreground"
                    >
                      <X className="w-3.5 h-3.5" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Séparateur Vertical (Design #1) */}
              <div className="hidden sm:block w-[1px] h-8 bg-border/60 mx-1" />

              {/* Zone Tri */}
              <div ref={sortRef} className="relative w-full sm:w-auto min-w-[160px]">
                <button
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                  className={`
                    w-full flex items-center justify-between px-4 h-11 rounded-xl text-sm font-medium transition-colors
                    ${sortDropdownOpen ? "bg-primary/10 text-primary" : "hover:bg-muted/50 text-foreground"}
                  `}
                >
                  <span className="flex items-center gap-2 truncate">
                    {sortDropdownOpen ? <Filter className="w-4 h-4"/> : <ArrowUpDown className="w-4 h-4 text-muted-foreground" />}
                    {currentSortLabel}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 ml-2 transition-transform duration-200 ${sortDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu (Design #1) */}
                <AnimatePresence>
                  {sortDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      // Positionnement ajusté mais style visuel conservé
                      className="absolute top-[calc(100%+8px)] right-0 w-full sm:w-56 p-1.5 bg-card/95 backdrop-blur-md border border-border/50 rounded-xl shadow-xl z-[100] origin-top-right"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            onSortChange(option.value);
                            setSortDropdownOpen(false);
                          }}
                          className={`
                            w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors
                            ${sortBy === option.value 
                              ? "bg-primary text-primary-foreground font-medium" 
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }
                          `}
                        >
                          {option.label}
                          {sortBy === option.value && <Check className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Tags / Stats (Design #1 avec les points) */}
          <motion.div 
            variants={itemVariants}
            className="mt-8 flex items-center justify-center gap-6 text-xs sm:text-sm text-muted-foreground/80 font-medium"
          >
             <span className="flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
               Disponible immédiatement
             </span>
             <span className="w-1 h-1 rounded-full bg-border" />
             <span>Garantie incluse</span>
             <span className="w-1 h-1 rounded-full bg-border" />
             <span>Service 24/7</span>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default AllCarsHero;