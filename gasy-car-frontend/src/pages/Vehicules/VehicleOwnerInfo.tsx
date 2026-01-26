import { Vehicule } from "@/types/vehiculeType";
import { Star } from "lucide-react";

interface Props {
  vehicle: Vehicule;
}

export default function VehicleOwnerInfo({ vehicle }: Props) {
  const owner = vehicle.proprietaire_data;

  const ownerName = owner
    ? `${owner.first_name} ${owner.last_name}`
    : "Propriétaire";

  const ownerPhone = owner?.phone;

  return (
    <div>
      <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">
        Propriétaire
      </p>

      <p className="font-bold text-gray-900 text-lg">{ownerName}</p>

      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
        <span className="flex items-center gap-1 text-yellow-500 font-bold">
          <Star size={12} fill="currentColor" /> 4.8
        </span>

        {ownerPhone && (
          <>
            <span>•</span>
            <span>📞 {ownerPhone}</span>
          </>
        )}
      </div>
    </div>
  );
}
