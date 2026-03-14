// src/components/Prestataire/StepFinalPublication.tsx
import React from "react";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import { BadgeCheck, FileText, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { VehicleFormData } from "@/types/addVehicleType";

interface StepFinalPublicationProps {
  stepNumber: number;
  photos?: any[]; // conservé pour compatibilité
  onAddPhotos?: (files: FileList | null) => void;
  onRemovePhoto?: (id: string) => void;
  error?: string | null;
  isAdding?: boolean;
  isEditMode?: boolean;
}

export const EditStepFinalPublication = React.memo(
  ({ stepNumber }: StepFinalPublicationProps) => {
    const {
      register,
      formState: { errors },
    } = useFormContext<VehicleFormData>();

    return (
      <Card className="rounded-3xl bg-white border border-slate-100 shadow-sm">
        {/* ========================= HEADER ========================= */}
        <CardHeader className="pb-4 pt-6 px-6">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm"
            >
              <FileText className="w-6 h-6 text-slate-800" />
            </motion.div>

            <div className="space-y-1">
              <CardTitle className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
                Étape {stepNumber} · Publication
                <BadgeCheck className="w-5 h-5 text-emerald-500" />
              </CardTitle>
              <p className="text-sm text-slate-500 leading-relaxed">
                Rédigez une description claire et les conditions particulières.
              </p>
            </div>
          </div>
        </CardHeader>

        {/* ========================= CONTENT ========================= */}
        <CardContent className="px-6 pb-10 space-y-12">
          {/* ================= DESCRIPTION ================= */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                Description de l'annonce
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-700">Description *</label>
              <Textarea
                {...register("description", {
                  required: "Description requise",
                  minLength: { value: 30, message: "Minimum 30 caractères" },
                })}
                placeholder="Décrivez le véhicule, son confort, son usage idéal..."
                className="bg-white border-slate-200 rounded-xl min-h-[140px]"
              />
              {errors.description && (
                <p className="text-xs text-red-500">
                  {errors.description.message as string}
                </p>
              )}

              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Check className="w-4 h-4 text-emerald-500" />
                Une description détaillée améliore le taux de réservation.
              </p>
            </div>

            {/* ================= CONDITIONS ================= */}
            <div className="space-y-2">
              <label className="text-sm text-slate-700">
                Conditions particulières
              </label>
              <Textarea
                {...register("conditions_particulieres")}
                placeholder="Ex : Pas d’animaux, trajets urbains uniquement..."
                className="bg-white border-slate-200 rounded-xl min-h-[120px]"
              />
            </div>
          </motion.section>
        </CardContent>
      </Card>
    );
  }
);

EditStepFinalPublication.displayName = "StepFinalPublication";
