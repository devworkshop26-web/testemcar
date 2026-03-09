// src/utils/vehiculeMapper.ts

export const mapVehiculeToFleet = (v: any) => {
  if (!v) return null;

  // ✅ Support LIST endpoint (/vehicule/vehicule/) qui renvoie photo_principale
  const primaryPhoto =
    v.photo_principale ||
    v.photos?.find((p: any) => p.is_primary)?.image_url ||
    v.photos?.[0]?.image_url ||
    "/placeholder.jpg";

  return {
    id: v.id,
    titre: v.titre || "Véhicule sans titre",

    // ✅ Support LIST endpoint : marque_nom / modele_label
    marque: v.marque_nom || v.marque_data?.nom || "",
    modele: v.modele_label || v.modele_data?.label || "",

    plaque: v.numero_immatriculation || "N/A",

    // ✅ Dans LIST tu n'as pas statut_data donc fallback
    statut: v.statut_nom || v.statut_data?.nom || "Disponible",

    est_disponible: Boolean(v.est_disponible),

    // ✅ IMPORTANT : VehicleCard utilise car.image
    image: primaryPhoto,
  };
};

// ✅ Couleurs selon statut
export const statusColorMap: Record<string, string> = {
  Disponible: "bg-green-100 text-green-700",
  "En location": "bg-yellow-100 text-yellow-700",
  Maintenance: "bg-red-100 text-red-700",
  Indisponible: "bg-gray-200 text-gray-700",
};
