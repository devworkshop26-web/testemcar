import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Coins, BadgeCheck, Percent, AlertCircle } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VehicleFormData } from "@/types/addVehicleType";

interface Step3PricingProps {
  stepNumber: number;
}

/* ---------------- Animations ---------------- */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 60 } },
};

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

/* ---------------- INPUT MONÉTAIRE ---------------- */
const CurrencyInput = ({ register, name, placeholder, label, error }: any) => (
  <div className="space-y-2" id={`field-${name}`}>
    <Label className={`text-sm ${error ? "text-red-500" : "text-slate-700"}`}>{label}</Label>

    <div className="relative">
      <span className="absolute left-3 top-[50%] -translate-y-1/2 text-slate-500 font-medium">
        Ar
      </span>

      <Input
        type="number"
        step="any"
        {...register(name, {
          required: name === "prix_jour" ? "Ce prix est requis" : false,
          valueAsNumber: true,
          min: { value: 0, message: "La valeur ne peut être négative" },
        })}
        placeholder={placeholder}
        className={`rounded-xl h-12 pl-8 transition-all ${error ? "border-red-500 bg-red-50/30" : "border-slate-300"
          }`}
      />
    </div>

    <ErrorMessage message={error?.message} />
  </div>
);

/* ---------------- INPUT POURCENTAGE ---------------- */
const PercentInput = ({ register, errors, name, placeholder, label, max }: any) => {
  const error = errors?.[name];

  return (
    <div className="space-y-2" id={`field-${name}`}>
      <Label className={`text-sm ${error ? "text-red-500" : "text-slate-700"}`}>{label}</Label>

      <div className="relative">
        <Input
          type="number"
          step="0.5"
          {...register(name, {
            valueAsNumber: true,
            min: { value: 0, message: "Min 0%" },
            max: { value: max, message: `Max ${max}%` },
          })}
          placeholder={placeholder}
          className={`rounded-xl h-12 pr-8 transition-all ${error ? "border-red-500 bg-red-50/30" : "border-slate-300"
            }`}
        />

        <Percent className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
      </div>

      <ErrorMessage message={error?.message} />
    </div>
  );
};

/* ---------------- COMPONENT PRINCIPAL ---------------- */
export const Step3Pricing = React.memo(({ stepNumber }: Step3PricingProps) => {
  const { register: rhfRegister, formState: { errors, submitCount } } =
    useFormContext<VehicleFormData>();

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstError = Object.keys(errors)[0];
      const target =
        document.querySelector(`[name="${firstError}"]`) ||
        document.getElementById(`field-${firstError}`);

      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [submitCount, errors]);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full">
      <Card className="rounded-3xl bg-white shadow-sm border border-slate-100">

        {/* Header */}
        <CardHeader className="pb-4 pt-6 px-6 border-b border-slate-50/50">
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <Coins className="w-6 h-6 text-slate-800" />
            </motion.div>

            <div>
              <CardTitle className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
                Étape {stepNumber} · Tarification
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.5 }}>
                  <BadgeCheck className="w-5 h-5 text-emerald-500" />
                </motion.div>
              </CardTitle>
              <p className="text-sm text-slate-500">Définissez vos tarifs pour chaque zone.</p>
            </div>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="px-6 pb-10 pt-8 space-y-12">

          <Tabs defaultValue="URBAIN" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="URBAIN">Zone Urbaine (Standard)</TabsTrigger>
              <TabsTrigger value="PROVINCE">Province (Hors-ville)</TabsTrigger>
            </TabsList>

            <TabsContent value="URBAIN" className="space-y-12">
              {/* ---- TARIFS URBAIN ---- */}
              <section className="space-y-6">
                <motion.p variants={itemVariants} className="text-[11px] uppercase tracking-[0.15em] text-slate-400">
                  Tarifs de base (Urbain)
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div variants={itemVariants}>
                    <CurrencyInput register={rhfRegister} name="prix_jour" label="Prix par jour *" placeholder="Ex: 120000" error={errors.prix_jour} />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <CurrencyInput register={rhfRegister} name="prix_par_semaine" label="Prix par semaine" placeholder="Ex: 700000" error={errors.prix_par_semaine} />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <CurrencyInput register={rhfRegister} name="prix_mois" label="Prix par mois" placeholder="Ex: 1800000" error={errors.prix_mois} />
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  <motion.div variants={itemVariants}>
                    <CurrencyInput register={rhfRegister} name="prix_heure" label="Prix par heure" placeholder="Ex: 35000" error={errors.prix_heure} />
                  </motion.div>
                </div>
              </section>

              {/* ---- REMISES URBAIN ---- */}
              <section className="space-y-6 pt-6 border-t border-slate-200">
                <motion.p variants={itemVariants} className="text-[11px] uppercase tracking-[0.15em] text-slate-400">
                  Remises longue durée (Urbain)
                </motion.p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <motion.div variants={itemVariants}>
                    <PercentInput register={rhfRegister} errors={errors} name="remise_par_heure" label="Remise/heure (%)" placeholder="0 - 50" max={50} />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <PercentInput register={rhfRegister} errors={errors} name="remise_par_jour" label="Remise/jour (%)" placeholder="0 - 30" max={30} />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <PercentInput register={rhfRegister} errors={errors} name="remise_par_mois" label="Remise/mois (%)" placeholder="0 - 50" max={50} />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <PercentInput register={rhfRegister} errors={errors} name="remise_longue_duree_pourcent" label="Remise longue durée (%)" placeholder="0 - 50" max={50} />
                  </motion.div>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="PROVINCE" className="space-y-12">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-amber-800">
                  Les tarifs province sont optionnels. Si non définis, ils ne seront pas disponibles pour la réservation en province.
                </p>
              </div>

              {/* ---- TARIFS PROVINCE ---- */}
              <section className="space-y-6">
                <motion.p variants={itemVariants} className="text-[11px] uppercase tracking-[0.15em] text-slate-400">
                  Tarifs de base (Province)
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div variants={itemVariants}>
                    <CurrencyInput register={rhfRegister} name="province_prix_jour" label="Prix par jour (Province)" placeholder="Ex: 150000" error={errors.province_prix_jour} />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <CurrencyInput register={rhfRegister} name="province_prix_par_semaine" label="Prix par semaine (Province)" placeholder="Ex: 900000" error={errors.province_prix_par_semaine} />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <CurrencyInput register={rhfRegister} name="province_prix_mois" label="Prix par mois (Province)" placeholder="Ex: 2500000" error={errors.province_prix_mois} />
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  <motion.div variants={itemVariants}>
                    <CurrencyInput register={rhfRegister} name="province_prix_heure" label="Prix par heure (Province)" placeholder="Ex: 40000" error={errors.province_prix_heure} />
                  </motion.div>
                </div>
              </section>

              {/* ---- REMISES PROVINCE ---- */}
              <section className="space-y-6 pt-6 border-t border-slate-200">
                <motion.p variants={itemVariants} className="text-[11px] uppercase tracking-[0.15em] text-slate-400">
                  Remises longue durée (Province)
                </motion.p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <motion.div variants={itemVariants}>
                    <PercentInput register={rhfRegister} errors={errors} name="province_remise_par_heure" label="Remise/heure (%)" placeholder="0 - 50" max={50} />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <PercentInput register={rhfRegister} errors={errors} name="province_remise_par_jour" label="Remise/jour (%)" placeholder="0 - 30" max={30} />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <PercentInput register={rhfRegister} errors={errors} name="province_remise_par_mois" label="Remise/mois (%)" placeholder="0 - 50" max={50} />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <PercentInput register={rhfRegister} errors={errors} name="province_remise_longue_duree_pourcent" label="Remise longue durée (%)" placeholder="0 - 50" max={50} />
                  </motion.div>
                </div>
              </section>
            </TabsContent>
          </Tabs>

        </CardContent>
      </Card>
    </motion.div>
  );
});

Step3Pricing.displayName = "Step3Pricing";
