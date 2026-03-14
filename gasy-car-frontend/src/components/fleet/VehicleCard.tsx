// src/components/fleet/VehicleCard.tsx

import { Card, CardContent } from "@/components/ui/card";
import { statusColorMap } from "@/helper/vehiculeMappersupport";
import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

export default function VehicleCard({ car }) {
  const color = statusColorMap[car.statut] || "bg-gray-200 text-gray-700";

  return (
    <Card className="border-none shadow-md rounded-2xl overflow-hidden">
      <div className="relative h-40 bg-gray-200">
        <img
  src={car.image}
  alt={car.titre}
  className="w-full h-full object-cover"
/>

        {car.statut === "Maintenance" && (
          <div className="absolute top-3 right-3 p-2 bg-red-600 text-white rounded-full shadow-lg">
            <AlertTriangle className="w-5 h-5" />
          </div>
        )}
      </div>

      <CardContent className="p-5 space-y-3">
        <h3 className="font-bold text-lg text-gray-900">{car.marque} {car.modele}</h3>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 font-mono">{car.plaque}</span>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${color}`}>
            {car.statut}
          </span>
        </div>




        <Link
          to={`/support/fleet/vehicule/${car.id}`}
          className="block text-center w-full border border-blue-200 rounded-xl text-blue-600 py-2 hover:bg-blue-50 transition"
        >
          Gérer
        </Link>


      </CardContent>
    </Card>
  );
}
