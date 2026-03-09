import React from "react";
import { Fuel, Calendar, Cog, Fingerprint, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Vehicule } from "@/types/vehiculeType";

interface VehicleInfoCardProps {
  vehicle: Vehicule;
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => (
  <div className="flex flex-col gap-1 p-2.5 rounded-2xl bg-slate-50/50 border border-slate-100/50 transition-all hover:bg-white hover:shadow-sm hover:border-slate-200 group">
    <div className="flex items-center gap-2">
      <div className="text-slate-400 group-hover:text-primary transition-colors">
        {React.cloneElement(icon as React.ReactElement, { size: 12 })}
      </div>
      <span className="text-[9px] font-bold uppercase tracking-tight text-slate-400">
        {label}
      </span>
    </div>
    <p className="text-sm font-bold text-slate-900 truncate">{value}</p>
  </div>
);

const VehicleInfoCard: React.FC<VehicleInfoCardProps> = ({ vehicle }) => {
  const clean = (val: unknown) => {
    if (val === null || val === undefined) return null;
    const text = String(val).trim();
    return text.length > 0 ? text : null;
  };

  const infoItems = [
    { key: "annee", icon: <Calendar />, label: "Année", value: clean(vehicle.annee) },
    {
      key: "places",
      icon: <Users />,
      label: "Places",
      value:
        typeof vehicle.nombre_places === "number" && vehicle.nombre_places > 0
          ? `${vehicle.nombre_places}`
          : null,
    },
    { key: "boite", icon: <Cog />, label: "Boîte", value: clean(vehicle.transmission_data?.nom) },
    { key: "energie", icon: <Fuel />, label: "Énergie", value: clean(vehicle.type_carburant_data?.nom) },
  ].filter((item) => item.value);

  return (
    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] bg-white overflow-hidden">
      <CardHeader className="pb-3 pt-5 px-5">
        <CardTitle className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 flex items-center gap-2">
          <Fingerprint className="w-3.5 h-3.5 text-primary" />
          Fiche Technique
        </CardTitle>
      </CardHeader>

      <CardContent className="px-3 pb-3">
        {infoItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {infoItems.map((item) => (
              <InfoItem key={item.key} icon={item.icon} label={item.label} value={item.value as string} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-xs text-slate-500">
            Aucune donnée technique renseignée pour ce véhicule.
          </div>
        )}

        {vehicle.numero_immatriculation ? (
          <div className="mt-3 p-2.5 rounded-xl bg-slate-900 flex items-center justify-between">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Immatriculation</span>
            <span className="text-[11px] font-mono font-bold text-white">
              {vehicle.numero_immatriculation.toUpperCase()}
            </span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default VehicleInfoCard;
