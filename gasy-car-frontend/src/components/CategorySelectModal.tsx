"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { Car, Truck, X, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CategorySelectModal() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // 🟢 LOGIQUE D'OUVERTURE
  useEffect(() => {
    // On vérifie si un choix a déjà été fait
    const savedChoice = localStorage.getItem("user_category_preference");

    // Si pas de choix sauvegardé, on ouvre la modale
    if (!savedChoice) {
      setOpen(true);
    }
  }, []);

  // 🔵 LOGIQUE DE SÉLECTION (Sauvegarde et Navigation)
  const handleSelect = (type: "tourisme" | "utilitaire") => {
    // 1. On sauvegarde le choix dans le LocalStorage
    localStorage.setItem("user_category_preference", type);

    // 2. On ferme la modale
    setOpen(false);

    // 3. Navigation
    const typeParam = type === "tourisme" ? "TOURISME" : "UTILITAIRE";
    navigate(`/allcars?type=${typeParam}`);
  };

  // 🔴 LOGIQUE DE FERMETURE (Sans sauvegarder)
  const handleClose = () => {
    setOpen(false);
    // On ne sauvegarde RIEN dans le localStorage. 
    // Donc au prochain F5, la modale réapparaîtra.
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="p-0 max-w-5xl overflow-hidden border-none bg-transparent shadow-2xl rounded-2xl [&>button]:hidden"
      // [&>button]:hidden cache la croix par défaut de shadcn pour utiliser la nôtre
      >

        {/* BOUTON FERMER CUSTOM */}
        <div className="absolute top-4 right-4 z-50">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border border-white/10"
            onClick={handleClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex flex-col md:flex-row h-[85vh] md:h-[550px] w-full bg-black">

          {/* ================= GAUCHE : TOURISME ================= */}
          <div
            onClick={() => handleSelect("tourisme")}
            className="relative w-full md:w-1/2 h-1/2 md:h-full group overflow-hidden cursor-pointer"
          >
            {/* Image de fond (Nouvelle URL fiable) */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1974&auto=format&fit=crop')" }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-blue-950/90 via-blue-900/60 to-transparent transition-opacity group-hover:opacity-90" />

            {/* Contenu */}
            <div className="relative h-full flex flex-col items-center justify-center p-8 z-10 text-center">
              <div className="transform transition-all duration-500 group-hover:-translate-y-2">
                <Badge className="bg-blue-500/20 text-blue-100 border-blue-400/30 backdrop-blur-md mb-6 px-4 py-1.5 text-sm mx-auto w-fit">
                  <Car className="w-4 h-4 mr-2" /> Véhicules Légers
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 shadow-black drop-shadow-lg">
                  Tourisme
                </h2>
                <p className="text-blue-100/90 text-sm md:text-base max-w-xs mx-auto leading-relaxed">
                  Explorez notre gamme de berlines, SUV et véhicules de luxe pour vos trajets quotidiens.
                </p>
              </div>

              {/* Bouton visuel (faux bouton) */}
              <div className="mt-8 opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                <span className="flex items-center gap-2 text-white font-semibold border-b border-white pb-1">
                  Choisir Tourisme <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>

          {/* ================= DROITE : UTILITAIRE ================= */}
          <div
            onClick={() => handleSelect("utilitaire")}
            className="relative w-full md:w-1/2 h-1/2 md:h-full group overflow-hidden cursor-pointer border-t md:border-t-0 md:border-l border-white/10"
          >
            {/* Image de fond */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=2075&auto=format&fit=crop')" }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-stone-950/90 via-stone-900/60 to-transparent transition-opacity group-hover:opacity-90" />

            {/* Contenu */}
            <div className="relative h-full flex flex-col items-center justify-center p-8 z-10 text-center">
              <div className="transform transition-all duration-500 group-hover:-translate-y-2">
                <Badge className="bg-amber-500/20 text-amber-100 border-amber-400/30 backdrop-blur-md mb-6 px-4 py-1.5 text-sm mx-auto w-fit">
                  <Truck className="w-4 h-4 mr-2" /> Professionnels
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 shadow-black drop-shadow-lg">
                  Utilitaire
                </h2>
                <p className="text-amber-100/90 text-sm md:text-base max-w-xs mx-auto leading-relaxed">
                  Des camions, fourgons et engins robustes conçus pour répondre à vos besoins professionnels.
                </p>
              </div>

              {/* Bouton visuel (faux bouton) */}
              <div className="mt-8 opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                <span className="flex items-center gap-2 text-white font-semibold border-b border-white pb-1">
                  Choisir Utilitaire <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}