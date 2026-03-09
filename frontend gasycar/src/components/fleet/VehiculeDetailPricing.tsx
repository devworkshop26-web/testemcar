// src/components/fleet/VehiculeDetailPricing.tsx

export default function VehiculeDetailPricing({ vehicule }) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 space-y-3">
      <h2 className="text-xl font-bold">Tarification</h2>

      <div className="text-sm space-y-2">
        <p><strong>Prix par jour :</strong> {vehicule.prix_jour} {vehicule.devise}</p>
        {vehicule.prix_heure && (
          <p><strong>Prix par heure :</strong> {vehicule.prix_heure} {vehicule.devise}</p>
        )}
        {vehicule.prix_mois && (
          <p><strong>Prix par mois :</strong> {vehicule.prix_mois} {vehicule.devise}</p>
        )}
        <p><strong>Caution :</strong> {vehicule.montant_caution} {vehicule.devise}</p>
      </div>
    </div>
  );
}
