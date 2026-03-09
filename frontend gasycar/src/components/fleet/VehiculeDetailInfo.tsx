// src/components/fleet/VehiculeDetailInfo.tsx

export default function VehiculeDetailInfo({ vehicule }) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 space-y-4">
      <h2 className="text-xl font-bold">Informations générales</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <div><strong>Marque :</strong> {vehicule.marque_data?.nom}</div>
        <div><strong>Modèle :</strong> {vehicule.modele_data?.label}</div>
        <div><strong>Année :</strong> {vehicule.annee}</div>
        <div><strong>Couleur :</strong> {vehicule.couleur}</div>
        <div><strong>Kilométrage :</strong> {vehicule.kilometrage_actuel_km} km</div>
        <div><strong>Transmission :</strong> {vehicule.transmission_data?.nom}</div>
        <div><strong>Carburant :</strong> {vehicule.type_carburant_data?.nom}</div>
      </div>
    </div>
  );
}
