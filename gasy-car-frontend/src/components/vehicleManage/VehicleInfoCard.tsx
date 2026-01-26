import React from "react";
import { Car, Fuel, Settings2, Calendar, Palette, Cog, Fingerprint } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Vehicule } from "@/types/vehiculeType";

interface VehicleInfoCardProps {
  vehicle: Vehicule;
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string; // Ajout pour gérer des styles spécifiques
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, className }) => (
  <div className="flex flex-col gap-1 p-2.5 rounded-2xl bg-slate-50/50 border border-slate-100/50 transition-all hover:bg-white hover:shadow-sm hover:border-slate-200 group">
    <div className="flex items-center gap-2">
      <div className="text-slate-400 group-hover:text-primary transition-colors">
        {React.cloneElement(icon as React.ReactElement, { size: 12 })}
      </div>
      <span className="text-[9px] font-bold uppercase tracking-tight text-slate-400">
        {label}
      </span>
    </div>
    <p className={`text-sm font-bold text-slate-900 truncate ${className}`}>
      {value}
    </p>
  </div>
);

const VehicleInfoCard: React.FC<VehicleInfoCardProps> = ({ vehicle }) => {
  // Utilitaire pour mettre la première lettre en majuscule si c'est une chaîne
  const formatValue = (val: any) => {
    if (!val) return "—";
    const str = String(val);
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] bg-white overflow-hidden">
      <CardHeader className="pb-3 pt-5 px-5">
        <CardTitle className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 flex items-center gap-2">
          <Fingerprint className="w-3.5 h-3.5 text-primary" />
          Fiche Technique
        </CardTitle>
      </CardHeader>

      <CardContent className="px-3 pb-3">
        <div className="grid grid-cols-2 gap-2">
          <InfoItem
            icon={<Car />}
            label="Marque"
            value={formatValue(vehicle.marque_data?.nom)}
          />
          <InfoItem
            icon={<Settings2 />}
            label="Modèle"
            value={formatValue(vehicle.modele_data?.label)}
          />
          <InfoItem
            icon={<Calendar />}
            label="Année"
            value={String(vehicle.annee || "—")}
          />
          <InfoItem
            icon={<Palette />}
            label="Couleur"
            value={formatValue(vehicle.couleur)}
            className="capitalize" // Sécurité CSS supplémentaire
          />
          <InfoItem
            icon={<Cog />}
            label="Boîte"
            value={formatValue(vehicle.transmission_data?.nom)}
          />
          <InfoItem
            icon={<Fuel />}
            label="Énergie"
            value={formatValue(vehicle.type_carburant_data?.nom)}
          />
        </div>

        {/* Badge matricule compact */}
        <div className="mt-3 p-2.5 rounded-xl bg-slate-900 flex items-center justify-between">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Immatriculation</span>
          <span className="text-[11px] font-mono font-bold text-white">
            {vehicle.numero_immatriculation?.toUpperCase() || "N/A"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleInfoCard;