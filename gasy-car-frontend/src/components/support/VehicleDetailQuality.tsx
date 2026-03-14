import { Card } from "@/components/ui/card";

export default function VehicleDetailQuality({ vehicule }) {
  return (
    <Card className="p-5 shadow rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Qualité & Statut</h2>

      <p className="text-sm">
        <strong>Certifié :</strong>{" "}
        {vehicule.est_certifie ? "Oui" : "Non"}
      </p>


    </Card>
  );
}
