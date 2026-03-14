import React, { useMemo, useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  Ruler,
  BadgeCheck,
  Search,
  X,
  AlertCircle,
  Palette,
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { VehicleFormData } from "@/types/addVehicleType";

type EquipmentOption = { id: string; label: string };

// --- ANIMATION VARIANTS ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 60 } },
};

const badgeVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
  exit: { scale: 0, opacity: 0, transition: { duration: 0.2 } },
};

// Composant d'erreur animé
const ErrorMessage = ({ message }: { message?: string }) => (
  <AnimatePresence>
    {message && (
      <motion.div
        initial={{ opacity: 0, y: -5, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, y: -5, height: 0 }}
        className="flex items-center gap-1 text-red-500 text-xs mt-1 overflow-hidden"
      >
        <AlertCircle className="w-3 h-3" />
        <span>{message}</span>
      </motion.div>
    )}
  </AnimatePresence>
);

export const Step2CharacteristicsEquipment = React.memo(
  ({
    stepNumber,
    equipments,
  }: {
    stepNumber: number;
    equipments: EquipmentOption[];
  }) => {
    const {
      register,
      watch,
      setValue,
      formState: { errors, submitCount },
    } = useFormContext<VehicleFormData>();

    // --- SCROLL AUTOMATIQUE VERS L'ERREUR ---
    useEffect(() => {
      if (Object.keys(errors).length > 0) {
        const firstErrorKey = Object.keys(errors)[0];
        const errorElement =
          document.querySelector(`[name="${firstErrorKey}"]`) ||
          document.getElementById(`field-${firstErrorKey}`);

        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }, [submitCount, errors]);

    const selectedColor = watch("couleur");
    const currentEquipments = (watch("equipements") as string[]) || [];

    const [searchQuery, setSearchQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    // =========================================
    // PALETTE DE COULEURS
    // =========================================
    const colors = [
      { label: "Noir", value: "noir", hex: "#000000" },
      { label: "Blanc", value: "blanc", hex: "#FFFFFF", border: "#E5E7EB" },
      { label: "Gris", value: "gris", hex: "#6B7280" },
      { label: "Argent", value: "argent", hex: "#C0C0C0" },
      { label: "Bleu", value: "bleu", hex: "#2563EB" },
      { label: "Rouge", value: "rouge", hex: "#DC2626" },
      { label: "Vert", value: "vert", hex: "#059669" },
      { label: "Beige", value: "beige", hex: "#D6C7A1" },
      { label: "Or", value: "or", hex: "#D4AF37" },
      { label: "Marron", value: "marron", hex: "#7B3F00" },
      { label: "Orange", value: "orange", hex: "#FB923C" },
      { label: "Jaune", value: "jaune", hex: "#FACC15" },
      { label: "Violet", value: "violet", hex: "#8B5CF6" },
      { label: "Bronze", value: "bronze", hex: "#CD7F32" },
      { label: "Rose", value: "rose", hex: "#F472B6" },
    ];

    // =========================================
    // AUTOCOMPLETE ÉQUIPEMENTS
    // =========================================
    const filteredEquipments = useMemo(() => {
      if (!searchQuery.trim()) return [];
      const query = searchQuery.toLowerCase();

      return equipments
        .filter(
          (eq) =>
            !currentEquipments.includes(eq.id) &&
            eq.label.toLowerCase().includes(query)
        )
        .slice(0, 5);
    }, [searchQuery, equipments, currentEquipments]);

    const selectedEquipmentDetails = useMemo(() => {
      return currentEquipments
        .map((id) => equipments.find((eq) => eq.id === id))
        .filter((e): e is EquipmentOption => !!e);
    }, [currentEquipments, equipments]);

    const addEquipment = (id: string) => {
      setValue("equipements", [...currentEquipments, id], {
        shouldValidate: true,
      });
      setSearchQuery("");
      setShowSuggestions(false);
    };

    const removeEquipment = (id: string) => {
      setValue(
        "equipements",
        currentEquipments.filter((e) => e !== id),
        { shouldValidate: true }
      );
    };

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full"
      >
        <Card className="rounded-3xl bg-white shadow-sm border border-slate-100 overflow-hidden">
          {/* ---------------------------- HEADER ---------------------------- */}
          <CardHeader className="pb-4 pt-6 px-6 border-b border-slate-50/50">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm transition-colors"
              >
                <Ruler className="w-6 h-6 text-slate-800" />
              </motion.div>

              <div className="space-y-1">
                <CardTitle className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
                  Étape {stepNumber} · Caractéristiques
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                  >
                    <BadgeCheck className="w-5 h-5 text-emerald-500" />
                  </motion.div>
                </CardTitle>

                <p className="text-sm text-slate-500 leading-relaxed">
                  Ajoutez les informations techniques et les options disponibles.
                </p>
              </div>
            </div>
          </CardHeader>

          {/* ---------------------------- CONTENT ---------------------------- */}
          <CardContent className="px-6 pb-10 pt-8 space-y-12">

            {/* ================= SECTION : COULEUR ================= */}
            <section className="space-y-4" id="field-couleur">
              <motion.div variants={itemVariants} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-slate-400" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                    Couleur extérieure
                  </p>
                </div>

                <p className="text-sm text-slate-500">
                  Sélectionnez la couleur dominante de la carrosserie.
                </p>
              </motion.div>

              {/* Input caché pour le scroll et la validation */}
              <input type="hidden" {...register("couleur", { required: "La couleur est requise" })} />

              <motion.div variants={itemVariants} className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3 mt-4">
                {colors.map((c) => (
                  <motion.button
                    key={c.value}
                    type="button"
                    whileHover={{ scale: 1.15, zIndex: 10 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      setValue("couleur", c.value, { shouldValidate: true })
                    }
                    className={`h-11 w-11 rounded-full border transition-all shadow-sm relative ${selectedColor === c.value
                        ? "ring-2 ring-emerald-500 ring-offset-2 scale-105"
                        : "border-slate-200"
                      }`}
                    style={{ backgroundColor: c.hex, borderColor: c.border || c.hex }}
                    title={c.label}
                  >
                    {selectedColor === c.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        {/* Inverse color logic for checkmark visibility */}
                        <BadgeCheck className={`w-5 h-5 ${c.value === 'blanc' || c.value === 'jaune' || c.value === 'argent' ? 'text-slate-800' : 'text-white'} drop-shadow-sm`} />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </motion.div>

              <ErrorMessage message={errors.couleur?.message as string} />
            </section>

            {/* ================= SECTION : CARACTÉRISTIQUES ================= */}
            <section className="space-y-6 pt-8 border-t border-slate-200">
              <motion.div variants={itemVariants}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 mb-6">
                  Caractéristiques techniques
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Kilométrage */}
                <motion.div variants={itemVariants} className="space-y-2" id="field-kilometrage_actuel_km">
                  <Label className={errors.kilometrage_actuel_km ? "text-red-500" : ""}>Kilométrage actuel (km) *</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 45000"
                    {...register("kilometrage_actuel_km", {
                      required: "Kilométrage requis",
                      min: { value: 0, message: "Ne peut pas être négatif" },
                      valueAsNumber: true,
                    })}
                    className={`rounded-xl h-12 transition-all ${errors.kilometrage_actuel_km
                        ? "border-red-500 bg-red-50/30 focus-visible:ring-red-200"
                        : "border-slate-200 focus:ring-slate-300"
                      }`}
                  />
                  <ErrorMessage message={errors.kilometrage_actuel_km?.message as string} />
                </motion.div>

                {/* Coffre */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label>Volume du coffre (L)</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 450"
                    {...register("volume_coffre_litres", { valueAsNumber: true })}
                    className="rounded-xl border-slate-200 h-12 focus:border-slate-400"
                  />
                  <p className="text-xs text-slate-400">Optionnel</p>
                </motion.div>
              </div>

              {/* Places + Portes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={itemVariants} className="space-y-2" id="field-nombre_places">
                  <Label className={errors.nombre_places ? "text-red-500" : ""}>Nombre de places *</Label>
                  <Input
                    type="number"
                    placeholder="5"
                    {...register("nombre_places", {
                      required: "Nombre de places requis",
                      min: { value: 1, message: "Min 1 place" },
                      max: { value: 60, message: "Max 60 places" },
                      valueAsNumber: true,
                    })}
                    className={`rounded-xl text-center h-12 ${errors.nombre_places
                        ? "border-red-500 bg-red-50/30"
                        : "border-slate-200"
                      }`}
                  />
                  <ErrorMessage message={errors.nombre_places?.message as string} />
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2" id="field-nombre_portes">
                  <Label className={errors.nombre_portes ? "text-red-500" : ""}>Nombre de portes *</Label>
                  <Input
                    type="number"
                    placeholder="4"
                    {...register("nombre_portes", {
                      required: "Nombre de portes requis",
                      min: { value: 2, message: "Min 2 portes" },
                      max: { value: 8, message: "Max 8 portes" },
                      valueAsNumber: true,
                    })}
                    className={`rounded-xl text-center h-12 ${errors.nombre_portes
                        ? "border-red-500 bg-red-50/30"
                        : "border-slate-200"
                      }`}
                  />
                  <ErrorMessage message={errors.nombre_portes?.message as string} />
                </motion.div>
              </div>
            </section>

            {/* ================= SECTION : ÉQUIPEMENTS ================= */}
            <section className="space-y-6 pt-6 border-t border-slate-200">
              <motion.div variants={itemVariants}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 mb-2">
                  Équipements & Options
                </p>
              </motion.div>

              {/* SEARCH INPUT */}
              <motion.div variants={itemVariants} className="relative z-10">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Rechercher (ex: GPS, Caméra, Toit ouvrant...)"
                  className="pl-9 rounded-xl border-slate-200 h-12 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  value={searchQuery}
                  onFocus={() => setShowSuggestions(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />

                {/* Suggestions Animated Dropdown */}
                <AnimatePresence>
                  {showSuggestions && searchQuery && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      className="absolute z-20 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-64 overflow-auto p-1"
                    >
                      {filteredEquipments.length > 0 ? (
                        filteredEquipments.map((eq) => (
                          <motion.button
                            layout
                            key={eq.id}
                            type="button"
                            onClick={() => addEquipment(eq.id)}
                            className="w-full px-4 py-3 text-left text-sm hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors flex items-center justify-between group"
                          >
                            <span>{eq.label}</span>
                            <BadgeCheck className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500" />
                          </motion.button>
                        ))
                      ) : (
                        <div className="text-sm text-slate-500 px-4 py-3 flex items-center gap-2">
                          <X className="w-4 h-4" /> Aucun équipement trouvé
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* SELECTED BADGES */}
              <motion.div
                layout
                className={`rounded-2xl p-6 transition-colors ${selectedEquipmentDetails.length > 0 ? 'bg-slate-50 border border-slate-100' : 'bg-slate-50/50 border border-dashed border-slate-200'}`}
              >
                <AnimatePresence mode="popLayout">
                  {selectedEquipmentDetails.length > 0 ? (
                    <motion.div layout className="flex flex-wrap gap-2">
                      {selectedEquipmentDetails.map((eq) => (
                        <motion.div
                          key={eq.id}
                          variants={badgeVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          layout
                        >
                          <Badge
                            variant="secondary"
                            className="px-3 py-1.5 bg-white text-slate-700 shadow-sm border border-slate-200 hover:border-slate-300 flex items-center gap-2 font-medium font-poppins text-xs sm:text-sm pl-4"
                          >
                            {eq.label}
                            <button
                              type="button"
                              onClick={() => removeEquipment(eq.id)}
                              className="ml-1 hover:bg-red-100 hover:text-red-600 rounded-full p-1 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-2"
                    >
                      <p className="text-sm text-slate-400">
                        Aucun équipement sélectionné pour le moment.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </section>

          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

Step2CharacteristicsEquipment.displayName = "Step2CharacteristicsEquipment";