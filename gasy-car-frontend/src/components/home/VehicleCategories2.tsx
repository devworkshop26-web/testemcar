import { Link } from "react-router-dom";
import { AnimatedSection, AnimatedItem } from "@/components/animations";
import { categoryVehiculeUseQuery } from "@/useQuery/categoryUseQuery";

import {
  Car,
  Crown,
  Bus,
  Truck,
  Bike,
  Sparkles,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { useMemo } from "react";

/* ---------------------------------------------------
   STRUCTURE EN 2 COLONNES
---------------------------------------------------- */

const CATEGORY_STRUCTURE = {
  "Mobilité personnelle": {
    groups: {
      "Véhicules personnels": ["Citadine", "Compacte", "Berline", "SUV / 4x4"],
      "Luxe & Prestige": ["Mariage", "Prestige", "Chauffeur VIP"],
      "Moto / Scooter": ["Moto", "Scooter"],
    },
    icon: Car,
  },

  "Transport & Utilitaire": {
    groups: {
      "Transport de groupe": ["Minibus", "Midibus", "Autobus"],
      Utilitaire: ["Utilitaire léger", "Utilitaire lourd"],
    },
    icon: Truck,
  },
};

const ICONS = {
  "Véhicules personnels": Car,
  "Luxe & Prestige": Crown,
  "Moto / Scooter": Bike,
  "Transport de groupe": Bus,
  Utilitaire: Truck,
};

/* ---------------------------------------------------
   MAPPER BACKEND
---------------------------------------------------- */
const prepareData = (backend) => {
  const result = {};

  for (const [mainCat, cfg] of Object.entries(CATEGORY_STRUCTURE)) {
    result[mainCat] = {
      icon: cfg.icon,
      items: [],
    };

    for (const [subCat, names] of Object.entries(cfg.groups)) {
      result[mainCat].items.push({
        name: subCat,
        icon: ICONS[subCat],
        children: backend.filter((c) => names.includes(c.nom)),
      });
    }
  }

  return result;
};

/* ---------------------------------------------------
   UI COMPLET + INTRO PREMIUM + TITRES NOIRS
---------------------------------------------------- */

export const VehicleCategories2 = () => {
  const { CategoryData, isLoading } = categoryVehiculeUseQuery();

  const categories = useMemo(() => {
    if (!CategoryData) return {};
    return prepareData(CategoryData);
  }, [CategoryData]);

  if (isLoading)
    return (
      <div className="py-20 flex flex-col items-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground mt-2">Chargement…</p>
      </div>
    );

  return (
    <AnimatedSection className="py-16 bg-gradient-to-br from-white via-slate-50 to-slate-100">

      {/* ===== INTRO ===== */}
      <div className="text-center mb-16">

        <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase 
          tracking-widest mb-3 px-4 py-1.5 rounded-full 
          bg-black/5 text-black border border-black/10 
          animate-fade-in"
        >
          <Sparkles className="w-4 h-4 animate-spin-slow" />
          Sélectionnez Votre Style
        </span>

        <h2 className="text-4xl md:text-5xl font-poppins font-extrabold text-black mt-2 mb-4 leading-tight
          animate-slide-up"
        >
          Trouvez le véhicule parfait
        </h2>

        <p className="text-lg text-muted-foreground max-w-3xl mx-auto px-4 animate-fade-in">
          Découvrez nos <span className="font-semibold text-black">{categories.length} catégories</span> 
          de véhicules adaptées à tous vos besoins.
        </p>
      </div>

      {/* ===== LAYOUT 2 COLONNES ===== */}
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">

        {Object.entries(categories).map(([mainName, group], gIndex) => (
          <AnimatedItem key={mainName} delay={gIndex * 120}>

            {/* TITRE NOIR */}
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-black">
              <span className="p-2 rounded-lg bg-black/10 shadow-sm animate-pulse-slow">
                <group.icon className="w-6 h-6 text-black" />
              </span>
              {mainName}
            </h2>

            {/* CARTES */}
            <div className="space-y-5">
              {group.items.map((cat, index) => (
                <AnimatedItem key={cat.name} delay={index * 80}>
                  
                  <div
                    className="p-5 rounded-xl border bg-white shadow-sm hover:shadow-xl 
                    hover:border-primary/40 transition-all duration-300
                    hover:-translate-y-1 hover:bg-white/90 backdrop-blur-sm group"
                  >

                    {/* ICON + TITRE */}
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center
                        shadow-inner transform transition-all duration-300
                        group-hover:scale-110 group-hover:rotate-6 group-hover:bg-primary/20
                        animate-breathing"
                      >
                        <cat.icon
                          className="w-6 h-6 text-primary transition-all duration-300"
                        />
                      </div>

                      <h3 className="font-semibold text-[16px] tracking-tight">
                        {cat.name}
                      </h3>
                    </div>

                    {/* SOUS-CATEGORIES */}
                    <div className="space-y-1">
                      {cat.children.map((child) => (
                        <Link
                          key={child.id}
                          to={`/category/${child.id}`}
                          className="
                          flex justify-between items-center text-sm px-3 py-2 
                          rounded-md bg-slate-50 
                          hover:bg-primary hover:text-white transition-all
                          hover:shadow-md hover:-translate-y-[1px]"
                        >
                          <span>{child.nom}</span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      ))}
                    </div>

                  </div>

                </AnimatedItem>
              ))}
            </div>

          </AnimatedItem>
        ))}

      </div>

    </AnimatedSection>
  );
};
