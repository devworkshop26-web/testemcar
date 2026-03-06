import React from "react";
import { useFormContext } from "react-hook-form";
import { BadgeCheck, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { VehicleFormData } from "@/types/addVehicleType";

interface Step2LocationProps {
  stepNumber: number;
}

export const Step4Location = React.memo(({ stepNumber }: Step2LocationProps) => {
  const {
    register,
    formState: { errors },
    watch, // ✅ AJOUT IMPORTANT POUR GARDER LES VALEURS ENTRE LES ÉTAPES
  } = useFormContext<VehicleFormData>();

  return (
    <Card className="rounded-3xl bg-white shadow-sm border border-slate-100">
      
      {/* ------------------ HEADER ------------------ */}
      <CardHeader className="pb-4 pt-6 px-6">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <MapPin className="w-6 h-6 text-slate-800" />
          </div>

          <div className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
              Étape {stepNumber} · Localisation
              <BadgeCheck className="w-5 h-5 text-emerald-500" />
            </CardTitle>

            <p className="text-sm text-slate-500 leading-relaxed">
              Indiquez où se trouve le véhicule afin d’aider les clients à mieux anticiper leur déplacement.
            </p>
          </div>
        </div>
      </CardHeader>

      {/* ------------------ CONTENT ------------------ */}
      <CardContent className="px-6 pb-10 space-y-12">

        {/* SECTION TITRE */}
        <section className="space-y-6">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
              Adresse principale
            </p>
            <p className="text-sm text-slate-500 leading-relaxed">
              Entrez l’adresse exacte ou approximative où le véhicule peut être récupéré.
            </p>
          </div>

          {/* Adresse */}
          <div className="space-y-2">
            <Label className="text-sm text-slate-700">Adresse *</Label>
            <Input
              defaultValue={watch("adresse_localisation")}  // ✅ AJOUT POUR RÉTABLIR LA VALEUR
              {...register("adresse_localisation", { required: "Adresse requise" })}
              placeholder="Lot IV..., Rue ..., Quartier"
              className="bg-white border-slate-200 h-12 rounded-xl"
            />
            {errors.adresse_localisation && (
              <span className="text-xs text-red-500">Adresse requise</span>
            )}
            <p className="text-xs text-slate-500">
              Exemples : Lot XX Ambohitrarahaba, Immeuble Y Ankorondrano, etc.
            </p>
          </div>

          {/* Ville + Zone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">

            {/* Ville */}
            <div className="space-y-2">
              <Label className="text-sm text-slate-700">Ville *</Label>
              <Input
                defaultValue={watch("ville")} // ✅ AJOUT
                {...register("ville", { required: "Ville requise" })}
                className="bg-white border-slate-200 h-12 rounded-xl"
                placeholder="Antananarivo"
              />
              {errors.ville && (
                <span className="text-xs text-red-500">Ville requise</span>
              )}
            </div>

            {/* Zone */}
            <div className="space-y-2">
              <Label className="text-sm text-slate-700">Zone / Quartier *</Label>
              <Input
                defaultValue={watch("zone")} // ✅ AJOUT
                {...register("zone", { required: "Zone requise" })}
                className="bg-white border-slate-200 h-12 rounded-xl"
                placeholder="Ivandry, Ambatobe, Analamahitsy..."
              />
              {errors.zone && (
                <span className="text-xs text-red-500">Zone requise</span>
              )}
              <p className="text-xs text-slate-500">
                Indiquez un quartier précis pour faciliter la récupération du véhicule.
              </p>
            </div>

          </div>
        </section>

      </CardContent>
    </Card>
  );
});

Step4Location.displayName = "Step4Location";
