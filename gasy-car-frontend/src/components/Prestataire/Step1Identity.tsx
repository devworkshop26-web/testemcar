import React, { useMemo, useState, useEffect } from "react";
import { Car, Check, Hash, BadgeCheck, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { VehicleFormData } from "@/types/addVehicleType";
import { SearchableSelect } from "./FormHelper";
import { useFormContext, useWatch, Controller } from "react-hook-form";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence, Variants } from "framer-motion";

type Option = { value: string; label: string; marque?: string | null };

interface Step1IdentityProps {
  brandOptions: Option[];
  modelOptions: Option[];
  categories: { value: string; label: string }[];
  transmissions: { value: string; label: string }[];
  fuels: { value: string; label: string }[];
  statuses: { value: string; label: string }[];
  loading?: boolean;
  stepNumber: number;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 50 } },
};

const ErrorMessage = ({ message }: { message?: string }) => {
  return (
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
};

export const Step1Identity = React.memo(
  ({
    brandOptions,
    modelOptions,
    categories,
    transmissions,
    fuels,
    statuses,
    loading,
    stepNumber,
  }: Step1IdentityProps) => {
    const {
      register,
      formState: { errors, submitCount },
      watch,
      setValue,
      control,
    } = useFormContext<VehicleFormData>();

    useEffect(() => {
      if (Object.keys(errors).length > 0) {
        const firstErrorKey = Object.keys(errors)[0];
        const errorElement = document.querySelector(`[name="${firstErrorKey}"]`);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
          (errorElement as HTMLElement).focus();
        } else {
          const customElement = document.getElementById(`field-${firstErrorKey}`);
          if (customElement) customElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }, [submitCount, errors]);

    const selectedMarque = watch("marque");
    const [marqueQuery, setMarqueQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [categorySearch, setCategorySearch] = useState("");

    // Génération de la liste des années de 1950 à 2026
    const years = useMemo(() => {
      const currentYear = 2026;
      const startYear = 1950;
      return Array.from({ length: currentYear - startYear + 1 }, (_, i) => (currentYear - i).toString());
    }, []);

    React.useEffect(() => {
      if (selectedMarque && !marqueQuery) {
        const found = brandOptions.find((brand) => brand.value === selectedMarque);
        if (found) {
          setMarqueQuery(found.label);
        }
      }
    }, [brandOptions, marqueQuery, selectedMarque]);

    const filteredBrands = useMemo(() => {
      const query = marqueQuery.trim().toLowerCase();
      if (!query) return brandOptions;
      return brandOptions.filter((brand) =>
        brand.label.toLowerCase().includes(query)
      );
    }, [brandOptions, marqueQuery]);

    const filteredModels = useMemo(() => {
      if (!selectedMarque) return modelOptions;
      return modelOptions.filter(
        (model) => !model.marque || model.marque === selectedMarque
      );
    }, [modelOptions, selectedMarque]);

    const handleBrandSelect = (value: string, label: string) => {
      setValue("marque", value, { shouldValidate: true });
      setValue("modele", "");
      setMarqueQuery(label);
      setShowSuggestions(false);
    };

    const filteredCategories = useMemo(() => {
      if (!categorySearch.trim()) return categories;
      return categories.filter((cat) =>
        cat.label.toLowerCase().includes(categorySearch.trim().toLowerCase())
      );
    }, [categories, categorySearch]);

    const selectedCategory = watch("categorie");
    const selectedTypeVehicule = useWatch({ name: "type_vehicule" }) ?? "";

    // Filtrage pour éviter les options vides provenant des props
    const safeTransmissions = transmissions.filter((t) => t.value !== "");
    const safeFuels = fuels.filter((f) => f.value !== "");
    const safeStatuses = statuses.filter((s) => s.value !== "");
    
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full"
      >
        <Card className="rounded-3xl bg-white shadow-sm border border-slate-100 overflow-hidden">
          <CardHeader className="pb-4 pt-6 px-6 border-b border-slate-50/50">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm transition-colors"
              >
                <Car className="w-6 h-6 text-slate-800" />
              </motion.div>
              <div className="space-y-1">
                <CardTitle className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
                  Étape {stepNumber} · Identité & typologie
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                  >
                    <BadgeCheck className="w-5 h-5 text-emerald-500" />
                  </motion.div>
                </CardTitle>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Identifiez précisément votre véhicule pour optimiser la confiance et les réservations.
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-10 pt-8 space-y-12">
            <section className="space-y-6">
              <motion.div variants={itemVariants} className="space-y-2">
                <p className="text-[11px] font-medium font-poppins uppercase tracking-[0.15em] text-slate-400">
                  Identité du véhicule
                </p>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Renseignez ici les informations permettant d’identifier clairement votre véhicule.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2" id="field-titre">
                <Label className={`text-sm ${errors.titre ? "text-red-500" : "text-slate-700"}`}>Titre *</Label>
                {loading ? <Skeleton className="h-12 w-full rounded-xl" /> : (
                  <Input
                    {...register("titre", { required: "Le titre est requis pour l'annonce" })}
                    placeholder="Ex: SUV premium, confort et sécurité"
                    className={`bg-white rounded-xl h-12 transition-all duration-300 ${errors.titre
                      ? "border-red-500 focus-visible:ring-red-200 bg-red-50/30"
                      : "border-slate-200 focus:ring-slate-300"
                      }`}
                  />
                )}
                <ErrorMessage message={errors.titre?.message as string} />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={itemVariants} className="space-y-2" id="field-marque">
                  <Label className={`text-sm ${errors.marque ? "text-red-500" : "text-slate-700"}`}>Marque *</Label>
                  {loading ? <Skeleton className="h-12 w-full rounded-xl" /> : (
                    <div className="relative">
                      <input type="hidden" {...register("marque", { required: "La marque est requise" })} />
                      <Input
                        value={marqueQuery}
                        onChange={(e) => {
                          setMarqueQuery(e.target.value);
                          if (!e.target.value) setValue("marque", "");
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        placeholder="Rechercher une marque"
                        className={`bg-white rounded-xl h-12 ${errors.marque
                          ? "border-red-500 focus-visible:ring-red-200 bg-red-50/30"
                          : "border-slate-200"
                          }`}
                      />
                      <AnimatePresence>
                        {showSuggestions && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute z-20 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-xl max-h-64 overflow-y-auto"
                          >
                            {filteredBrands.length === 0 ? (
                              <p className="px-3 py-2 text-sm text-slate-500">Aucune marque trouvée</p>
                            ) : (
                              filteredBrands.map((brand) => (
                                <button
                                  key={brand.value}
                                  type="button"
                                  onClick={() => handleBrandSelect(brand.value, brand.label)}
                                  className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                                >
                                  <span className="text-sm text-slate-800">{brand.label}</span>
                                  {selectedMarque === brand.value && (
                                    <Check className="w-4 h-4 text-emerald-500" />
                                  )}
                                </button>
                              ))
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                  <ErrorMessage message={errors.marque?.message as string} />
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2" id="field-modele">
                  {loading ? <Skeleton className="h-12 w-full rounded-xl" /> : (
                    <SearchableSelect
                      name="modele"
                      label="Modèle *"
                      hideLabel
                      required
                      placeholder="Choisir un modèle"
                      options={filteredModels.filter((m) => m.value !== "")}
                    />
                  )}
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={itemVariants} className="space-y-2" id="field-annee">
                  <Label className={errors.annee ? "text-red-500" : "text-slate-700"}>Année *</Label>
                  {loading ? <Skeleton className="h-12 w-full rounded-xl" /> : (
                    <Controller
                      name="annee"
                      control={control}
                      rules={{ required: "L'année est requise" }}
                      render={({ field }) => (
                        <Select
                          onValueChange={(val) => field.onChange(parseInt(val))}
                          value={field.value?.toString()}
                        >
                          <SelectTrigger className={`rounded-xl h-12 bg-white ${errors.annee ? "border-red-500 bg-red-50/30" : "border-slate-200"}`}>
                            <SelectValue placeholder="Choisir l'année" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {years.map((y) => (
                              <SelectItem key={y} value={y}>{y}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  )}
                  <ErrorMessage message={errors.annee?.message as string} />
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2" id="field-numero_immatriculation">
                  <Label className="text-sm text-slate-700">N° immatriculation *</Label>
                  {loading ? <Skeleton className="h-12 w-full rounded-xl" /> : (
                    <div className="relative">
                      <Hash className={`absolute left-3 top-3 h-4 w-4 ${errors.numero_immatriculation ? "text-red-400" : "text-slate-400"}`} />
                      <Input
                        {...register("numero_immatriculation", { required: "L'immatriculation est requise" })}
                        className={`pl-9 bg-white rounded-xl h-12 uppercase ${errors.numero_immatriculation ? "border-red-500 bg-red-50/30" : "border-slate-200"}`}
                        placeholder="0000 TBA"
                      />
                    </div>
                  )}
                  <ErrorMessage message={errors.numero_immatriculation?.message as string} />
                </motion.div>
              </div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label className="text-sm text-slate-700">N° série (VIN)</Label>
                {loading ? <Skeleton className="h-12 w-full rounded-xl" /> : (
                  <Input
                    {...register("numero_serie")}
                    className="bg-white border-slate-200 rounded-xl h-12 uppercase text-xs tracking-wide focus:border-slate-400"
                    placeholder="Ex: WBA..."
                  />
                )}
              </motion.div>
            </section>

            <section className="space-y-6 pt-8 border-t border-slate-200">
              <motion.div variants={itemVariants} className="space-y-2">
                <p className="text-[11px] font-medium font-poppins uppercase tracking-[0.15em] text-slate-400">
                  Typologie du véhicule
                </p>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Sélectionnez les paramètres techniques.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-3" id="field-categorie">
                <input
                  type="hidden"
                  {...register("categorie", { required: "Veuillez choisir une catégorie" })}
                />
                <Label className={`text-sm ${errors.categorie ? "text-red-500" : "text-slate-700"}`}>
                  Catégorie *
                </Label>
                {loading ? (
                   <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                     {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-10 w-full rounded-xl" />)}
                   </div>
                ) : (
                  <>
                    <div className="relative">
                      <Input
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        placeholder="Rechercher une catégorie..."
                        className="rounded-xl h-11 pl-10 bg-white border-slate-300 focus:border-slate-400"
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7 7 0 1010 17a7 7 0 006.65-4.35z" />
                      </svg>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                      {filteredCategories
                        .filter((cat) => cat.value !== "")
                        .map((cat) => (
                          <motion.button
                            key={cat.value}
                            type="button"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setValue("categorie", cat.value, { shouldValidate: true })}
                            className={`border rounded-xl px-2 py-2 text-[13px] transition-all shadow-sm ${selectedCategory === cat.value
                              ? "border-emerald-500 bg-emerald-50 text-emerald-600 ring-2 ring-emerald-100"
                              : errors.categorie
                                ? "border-red-200 bg-red-50/20 text-slate-600 hover:border-red-300"
                                : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
                              }`}
                          >
                            {cat.label}
                          </motion.button>
                        ))}
                    </div>
                  </>
                )}
                <ErrorMessage message={errors.categorie?.message as string} />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={itemVariants} className="space-y-2" id="field-transmission">
                  <Label className={errors.transmission ? "text-red-500" : ""}>
                    Transmission *
                  </Label>
                  {loading ? <Skeleton className="h-12 w-full rounded-xl" /> : (
                    <Controller
                      name="transmission"
                      control={control}
                      rules={{ required: "Transmission requise" }}
                      render={({ field }) => (
                        <Select
                          value={field.value ?? undefined}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            className={`rounded-xl h-12 transition-all ${errors.transmission
                              ? "border-red-500 bg-red-50/30 focus:ring-red-200"
                              : "border-slate-300 bg-white"
                              }`}
                          >
                            <SelectValue placeholder="Choisir" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectGroup>
                              {safeTransmissions.map((t) => (
                                <SelectItem key={t.value} value={t.value}>
                                  {t.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  )}
                  <ErrorMessage message={errors.transmission?.message as string} />
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2" id="field-type_carburant">
                  <Label className={errors.type_carburant ? "text-red-500" : ""}>Carburant *</Label>
                  {loading ? <Skeleton className="h-12 w-full rounded-xl" /> : (
                    <Controller
                      name="type_carburant"
                      control={control}
                      rules={{ required: "Carburant requis" }}
                      render={({ field }) => (
                        <Select
                          value={field.value ?? undefined}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className={`rounded-xl h-12 transition-all ${errors.type_carburant
                            ? "border-red-500 bg-red-50/30 focus:ring-red-200"
                            : "border-slate-300 bg-white"
                            }`}>
                            <SelectValue placeholder="Choisir" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {safeFuels.map((f) => (
                              <SelectItem key={f.value} value={f.value}>
                                {f.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  )}
                  <ErrorMessage message={errors.type_carburant?.message as string} />
                </motion.div>
              </div>

              <motion.div variants={itemVariants} className="space-y-2" id="field-statut">
                <Label className={errors.statut ? "text-red-500" : ""}>Statut *</Label>
                {loading ? <Skeleton className="h-12 w-full rounded-xl" /> : (
                   <Controller
                   name="statut"
                   control={control}
                   rules={{ required: "Statut requis" }}
                   render={({ field }) => (
                     <Select
                       value={field.value ?? undefined}
                       onValueChange={field.onChange}
                     >
                       <SelectTrigger className={`rounded-xl h-12 transition-all ${errors.statut
                         ? "border-red-500 bg-red-50/30 focus:ring-red-200"
                         : "border-slate-300 bg-white"
                         }`}>
                         <SelectValue placeholder="Choisir" />
                       </SelectTrigger>
                       <SelectContent className="bg-white">
                         {safeStatuses.map((s) => (
                           <SelectItem key={s.value} value={s.value}>
                             {s.label}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                   )}
                 />
                )}
                <ErrorMessage message={errors.statut?.message as string} />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2" id="field-type_vehicule">
                <Label className={errors.type_vehicule ? "text-red-500" : ""}>Type de véhicule *</Label>
                {loading ? <Skeleton className="h-12 w-full rounded-xl" /> : (
                   <Controller
                   name="type_vehicule"
                   control={control}
                   rules={{ required: "Type requis" }}
                   render={({ field }) => (
                    <Select
                      value={field.value ?? undefined}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className={`rounded-xl h-12 transition-all ${errors.type_vehicule
                        ? "border-red-500 bg-red-50/30 focus:ring-red-200"
                        : "border-slate-300 bg-white"
                        }`}>
                        <SelectValue placeholder="Choisir" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="TOURISME">Véhicule de tourisme</SelectItem>
                        <SelectItem value="UTILITAIRE">Véhicule utilitaire</SelectItem>
                      </SelectContent>
                    </Select>
                   )}
                  />
                )}
                <ErrorMessage message={errors.type_vehicule?.message as string} />
              </motion.div>
            </section>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

Step1Identity.displayName = "Step1Identity";