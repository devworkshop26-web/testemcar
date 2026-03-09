import { Card } from "@/components/ui/card";

export default function VehicleDetailPricing({ vehicule }) {
  return (
    <Card className="p-5 shadow rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Tarification</h2>

      <div className="space-y-2 text-sm">
        <p>
          <strong>Jour :</strong>{" "}
          {vehicule.prix_jour} {vehicule.devise}
        </p>

        {vehicule.prix_heure && (
          <p>
            <strong>Heure :</strong>{" "}
            {vehicule.prix_heure} {vehicule.devise}
          </p>
        )}

        {vehicule.prix_mois && (
          <p>
            <strong>Mois :</strong>{" "}
            {vehicule.prix_mois} {vehicule.devise}
          </p>
        )}

        <p>
          <strong>Caution :</strong>{" "}
          {vehicule.montant_caution} {vehicule.devise}
        </p>
      </div>
    </Card>
  );
}
