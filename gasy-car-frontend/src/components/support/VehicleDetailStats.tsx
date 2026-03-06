import { Card } from "@/components/ui/card";

export default function VehicleDetailStats({ vehicule }) {
  return (
    <Card className="p-5 shadow rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Statistiques</h2>

      <p><strong>Locations :</strong> {vehicule.nombre_locations}</p>
      <p><strong>Favoris :</strong> {vehicule.nombre_favoris}</p>
      <p><strong>Note moyenne :</strong> {vehicule.note_moyenne || "—"}</p>
    </Card>
  );
}
