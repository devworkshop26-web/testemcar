
import React from "react";
import {
  Bookmark,
  ShoppingBag,
  Sparkles,
  Check,
  Info,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ImageCarousel from "../ImageCarousel";
import StatCard from "../StatCard";
import VehicleInfoCard from "../VehicleInfoCard";
import PricingReadCard from "../PricingReadCard";
import { Vehicule } from "@/types/vehiculeType";

interface OverviewTabProps {
  vehicle: Vehicule;
}

const money = (v: number | string | undefined | null) => {
  const n = Number(v);
  return Number.isFinite(n) ? n.toLocaleString() : "0";
};

const OverviewTab: React.FC<OverviewTabProps> = ({ vehicle }) => {
  return (
    <div className="space-y-12 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-10">
          <div className="animate-in fade-in slide-in-from-left-3 duration-500 overflow-hidden">
            <ImageCarousel photos={vehicle.photos || []} title={vehicle.titre} />
          </div>

          {/* STATS */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatItem
              label="Prix journalier"
              value={`${money(vehicle.prix_jour)} ${vehicle.devise}`}
              icon={<Layers className="w-4 h-4" />}
              delay="delay-0"
              color="text-blue-600"
              bg="bg-blue-50"
            />
            <StatItem
              label="Certification"
              value={vehicle.est_certifie ? "Premium" : "Standard"}
              icon={<ShieldCheck className="w-4 h-4" />}
              delay="delay-75"
              color={vehicle.est_certifie ? "text-amber-600" : "text-slate-400"}
              bg={vehicle.est_certifie ? "bg-amber-50" : "bg-slate-50"}
            />
            <StatItem
              label="Réservations"
              value={vehicle.nombre_locations || 0}
              icon={<ShoppingBag className="w-4 h-4" />}
              delay="delay-100"
              color="text-emerald-600"
              bg="bg-emerald-50"
            />
            <StatItem
              label="Favoris"
              value={vehicle.nombre_favoris || 0}
              icon={<Bookmark className="w-4 h-4" />}
              delay="delay-150"
              color="text-purple-600"
              bg="bg-purple-50"
            />
          </section>

          {/* DESCRIPTION */}
          <Card className="overflow-hidden rounded-[2rem] border-none bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
            <CardHeader className="flex flex-row items-center gap-3 bg-slate-50/50 border-b border-slate-100/80 px-8 py-5">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Info className="w-4 h-4 text-primary" />
              </div>
              <CardTitle className="text-xl font-semibold text-slate-900 tracking-tight">
                À propos de ce véhicule
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 py-8">
              <p className="text-[15px] text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                {vehicle.description ||
                  "Aucune description fournie pour ce véhicule."}
              </p>
            </CardContent>
          </Card>

          {/* ÉQUIPEMENTS */}
          {vehicle.equipements_details &&
            vehicle.equipements_details.length > 0 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300">
                <div className="flex items-center gap-3 px-2">
                  <h3 className="text-xl font-semibold text-slate-900 tracking-tight">
                    Équipements inclus
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vehicle.equipements_details.map((eq, i) => (
                    <div
                      key={eq.id}
                      className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                        <Check className="w-5 h-5 stroke-[3]" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 tracking-tight">
                        {eq.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="space-y-8 animate-in fade-in slide-in-from-right-5 duration-700 delay-150">
          <div className="sticky top-24 space-y-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-b from-primary/10 to-transparent rounded-[2rem] blur opacity-75" />
              <div className="relative space-y-8">
                <VehicleInfoCard vehicle={vehicle} />
                <PricingReadCard vehicle={vehicle} />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 text-white flex items-center gap-4 shadow-xl">
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest">
                  Garantie
                </p>
                <p className="text-xs font-medium text-white/90">
                  Véhicule vérifié et assuré par l'agence.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

/* STAT ITEM */
const StatItem = ({ label, value, icon, delay, color, bg }: any) => (
  <div
    className={`
      flex flex-col p-5 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm
      hover:shadow-md transition-all duration-500 animate-in fade-in slide-in-from-bottom-2 ${delay}
    `}
  >
    <div className={`h-8 w-8 ${bg} ${color} rounded-lg flex items-center justify-center mb-4`}>
      {icon}
    </div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
      {label}
    </p>
    <p className="text-lg font-black text-slate-900 truncate">{value}</p>
  </div>
);

export default OverviewTab;
