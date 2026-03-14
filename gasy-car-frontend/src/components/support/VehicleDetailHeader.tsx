import { Card } from "@/components/ui/card";

export default function VehicleDetailHeader({ vehicule }) {
  const photos = vehicule.photos || [];

  const primary =
    photos.find((p) => p.is_primary)?.image_url || photos[0]?.image_url;

  return (
    <Card className="shadow rounded-2xl overflow-hidden">
      {/* PHOTO PRINCIPALE */}
      <div className="relative h-64 w-full bg-gray-200">
        <img
          src={primary}
          className="w-full h-full object-cover"
          alt="Véhicule"
        />

        <span
          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold shadow
            ${
              vehicule.est_disponible
                ? "bg-emerald-600 text-white"
                : "bg-red-600 text-white"
            }
          `}
        >
          {vehicule.est_disponible ? "Disponible" : "Indisponible"}
        </span>
      </div>

      {/* MINIATURES */}
      {photos.length > 1 && (
        <div className="flex gap-3 p-3 overflow-x-auto">
          {photos.map((photo) => (
            <img
              key={photo.id}
              src={photo.image_url}
              className="h-20 w-28 rounded-lg object-cover border cursor-pointer hover:opacity-75 transition"
              alt="Miniature"
            />
          ))}
        </div>
      )}

      <div className="p-5">
        <h1 className="text-2xl font-bold">{vehicule.titre}</h1>

        <p className="text-gray-600 text-sm">
          {vehicule.marque_data?.nom} • {vehicule.modele_data?.label} •{" "}
          {vehicule.annee}
        </p>

        <p className="inline-block mt-2 px-3 py-1 bg-gray-100 text-xs border rounded font-mono">
          {vehicule.numero_immatriculation}
        </p>
      </div>
    </Card>
  );
}
