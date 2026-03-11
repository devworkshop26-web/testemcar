import React from "react";
import { ArrowLeft, Briefcase, MapPin, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PricingRates } from "../reservationTypes";

export type VehicleHeaderProps = {
  vehicleTitle: string;
  vehicleLocation: string;
  vehicleRating: number;
  vehicleTrips: number;
  vehicleType: string;
  isCertified: boolean;
  pricingRates: PricingRates;
  onBack: () => void;
};

const VehicleHeader: React.FC<VehicleHeaderProps> = ({
  vehicleTitle,
  vehicleLocation,
  vehicleRating,
  vehicleTrips,
  vehicleType,
  isCertified,
  pricingRates,
  onBack,
}) => {
  return (
    <div className="mb-8">
      <div className="relative overflow-hidden rounded-[2rem] bg-white/80 backdrop-blur-xl border border-slate-200/70 shadow-lg shadow-slate-200/40 px-6 py-6 md:px-8 md:py-8">
        {/* Background neutre (pas de bleu) */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-28 -left-28 h-80 w-80 rounded-full bg-slate-200/25 blur-3xl" />
          <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-slate-100/60 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(2,6,23,0.04),transparent_45%),radial-gradient(circle_at_85%_5%,rgba(2,6,23,0.03),transparent_40%)]" />
        </div>

        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          {/* LEFT */}
          <div className="space-y-5">
            {/* Top row: Back + badges */}
            <div className="flex flex-wrap items-center gap-3">
              {/* ✅ Ton bouton Retour (style identique) */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="
                  gap-2
                  text-slate-600
                  rounded-lg
                  px-3
                  transition-all
                  hover:bg-slate-100/80
                  hover:text-slate-800
                  hover:shadow-sm
                  active:scale-[0.98]
                "
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-[14px] font-medium">Retour</span>
              </Button>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-slate-50 text-slate-700 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ring-1 ring-slate-200 font-poppins">
                  {vehicleType}
                </span>

                {isCertified && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider ring-1 ring-emerald-200/70">
                    <ShieldCheck size={14} />
                    Véhicule certifié
                  </span>
                )}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-3">
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
                {vehicleTitle}
              </h1>

              {/* Meta chips */}
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-slate-200/70 px-3 py-2 text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <MapPin size={16} className="text-slate-700" />
                  <span className="font-semibold">{vehicleLocation}</span>
                </span>

                <span className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-slate-200/70 px-3 py-2 text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <Star size={16} className="text-yellow-500" fill="currentColor" />
                  <span className="font-semibold">{vehicleRating}</span>
                  <span className="text-slate-400 font-medium">
                    ({vehicleTrips > 0 ? (vehicleTrips * 2.5).toFixed(0) : 0} avis)
                  </span>
                </span>

                <span className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-slate-200/70 px-3 py-2 text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <Briefcase size={16} className="text-slate-700" />
                  <span className="font-semibold">{vehicleTrips}</span>
                  <span className="text-slate-500 font-medium">voyages</span>
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="hidden md:flex flex-col items-end">
            <div className="rounded-2xl bg-white/70 border border-slate-200/70 px-6 py-4 shadow-sm">
              <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-[0.22em] mb-1 text-right">
                Prix par jour
              </p>
              <p className="text-4xl font-black text-slate-900 text-right leading-none">
                {(pricingRates.day ?? 0).toLocaleString("fr-FR")}{" "}
                <span className="text-lg text-slate-500 font-extrabold">Ar</span>
              </p>
            </div>
          </div>
        </div>

        {/* ligne séparatrice douce */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-70" />
      </div>
    </div>
  );
};

export default VehicleHeader;