import { Card } from "@/components/ui/card";

export default function VehicleDetailEquipments({ vehicule }) {
  const equipements = vehicule.equipements_details || [];

  return (
    <Card className="p-5 shadow rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Équipements</h2>

      {equipements.length === 0 && (
        <p className="text-gray-500 text-sm">Aucun équipement renseigné.</p>
      )}

      <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
        {equipements.map((eq) => (
          <li
            key={eq.id}
            className="px-3 py-2 bg-gray-100 rounded-lg border"
          >
            {eq.label}
          </li>
        ))}
      </ul>
    </Card>
  );
}
