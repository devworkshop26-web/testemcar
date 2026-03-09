// src/components/fleet/VehiculeDetailHeader.tsx

import { statusColorMap } from "@/helper/vehiculeMapper";


export default function VehiculeDetailHeader({ vehicule }) {
  const photo =
    vehicule.photos?.find((p) => p.is_primary)?.image_url ||
    vehicule.photos?.[0]?.image_url;

  const statutColor = statusColorMap[vehicule.statut_data?.nom] || "bg-gray-300";

  return (
    <div className="bg-white shadow-md rounded-2xl overflow-hidden">
      <div className="h-60 w-full bg-gray-100">
        <img
          src={photo}
          className="w-full h-full object-cover"
          alt="Photo véhicule"
        />
      </div>

      <div className="p-5 space-y-3">
        <h1 className="text-2xl font-bold">
          {vehicule.marque_data?.nom} {vehicule.modele_data?.label} ({vehicule.annee})
        </h1>

        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${statutColor}`}
        >
          {vehicule.statut_data?.nom}
        </span>

        <p className="text-gray-500 font-mono">
          {vehicule.numero_immatriculation}
        </p>
      </div>
    </div>
  );
}
