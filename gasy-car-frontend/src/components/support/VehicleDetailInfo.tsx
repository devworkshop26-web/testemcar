import { Card, CardContent } from "@/components/ui/card";

export default function VehicleDetailInfo({ vehicule }) {
  const rows = [
    ["Marque", vehicule.marque_data?.nom],
    ["Modèle", vehicule.modele_data?.label],
    ["Année", vehicule.annee],
    ["Couleur", vehicule.couleur],
    ["Places", vehicule.nombre_places],
    ["Portes", vehicule.nombre_portes],
    ["Transmission", vehicule.transmission_data?.nom],
    ["Carburant", vehicule.type_carburant_data?.nom],
    ["Catégorie", vehicule.categorie_data?.nom],
    ["Kilométrage", vehicule.kilometrage_actuel_km + " km"],
    ["Volume coffre", vehicule.volume_coffre_litres + " L"],
  ];

  return (
    <Card className="p-5 shadow rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Informations générales</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {rows.map(([label, value], i) => (
          <p key={i} className="text-sm text-gray-700">
            <span className="font-semibold">{label} :</span>{" "}
            {value || "—"}
          </p>
        ))}
      </div>
    </Card>
  );
}
