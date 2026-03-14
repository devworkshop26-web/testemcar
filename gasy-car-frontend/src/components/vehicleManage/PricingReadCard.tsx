import React from "react";
import { Coins, Clock, CalendarDays, CalendarRange, CalendarCheck, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Vehicule } from "@/types/vehiculeType";

interface PricingReadCardProps {
  vehicle: Vehicule;
}

const money = (v: number | string | undefined | null) => {
  const n = Number(v);
  return Number.isFinite(n) ? n.toLocaleString() : "—";
};

interface PriceRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  devise: string;
  highlight?: boolean;
}

const PriceRow: React.FC<PriceRowProps> = ({ icon, label, value, devise, highlight }) => (
  <div className={`
    flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200
    ${highlight ? "bg-slate-900 text-white shadow-md shadow-slate-200" : "hover:bg-slate-50"}
  `}>
    <div className="flex items-center gap-3">
      <div className={`
        flex items-center justify-center shrink-0
        ${highlight ? "text-slate-400" : "text-slate-400"}
      `}>
        {icon}
      </div>
      <span className={`text-xs font-bold uppercase tracking-wider ${highlight ? "text-slate-400" : "text-slate-500"}`}>
        {label}
      </span>
    </div>
    
    <div className="flex items-baseline gap-1">
      <span className={`text-sm font-black ${highlight ? "text-white" : "text-slate-900"}`}>
        {value}
      </span>
      <span className={`text-[10px] font-bold ${highlight ? "text-slate-500" : "text-slate-400"}`}>
        {devise}
      </span>
    </div>
  </div>
);

const PricingReadCard: React.FC<PricingReadCardProps> = ({ vehicle }) => {
  return (
    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden rounded-[2rem] bg-white">
      <CardHeader className="pb-4 pt-6 px-6">
        <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <Coins className="w-4 h-4 text-primary" />
          Structure de Prix
        </CardTitle>
      </CardHeader>
      
      <CardContent className="px-3 pb-3 space-y-1">
        <PriceRow
          icon={<CalendarDays className="w-4 h-4" />}
          label="Journée"
          value={money(vehicle.prix_jour)}
          devise={vehicle.devise || "Ar"}
          highlight
        />
        
        {vehicle.prix_heure && (
          <PriceRow
            icon={<Clock className="w-4 h-4" />}
            label="Heure"
            value={money(vehicle.prix_heure)}
            devise={vehicle.devise || "Ar"}
          />
        )}
        
        {vehicle.prix_par_semaine && (
          <PriceRow
            icon={<CalendarRange className="w-4 h-4" />}
            label="Semaine"
            value={money(vehicle.prix_par_semaine)}
            devise={vehicle.devise || "Ar"}
          />
        )}
        
        {vehicle.prix_mois && (
          <PriceRow
            icon={<CalendarCheck className="w-4 h-4" />}
            label="Mois"
            value={money(vehicle.prix_mois)}
            devise={vehicle.devise || "Ar"}
          />
        )}

        {/* Note informative plus discrète et moderne */}
        <div className="mt-4 mx-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2">
          <Info className="w-3 h-3 text-slate-400 mt-0.5 shrink-0" />
          <p className="text-[10px] leading-tight text-slate-500 font-medium">
           La tarification est fixe. Toute modification doit être effectuée via la section Tarifs située en haut.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingReadCard;