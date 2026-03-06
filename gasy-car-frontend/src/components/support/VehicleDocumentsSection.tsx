import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { InstanceAxis } from "@/helper/InstanceAxios";

type Props = {
  vehicleId: string;
};

export default function VehicleDocumentsSection({ vehicleId }: Props) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!vehicleId) return;
      setLoading(true);

      try {
        const res = await InstanceAxis.get(
          `/vehicule/vehicle-documents/?vehicle=${vehicleId}`
        );
        setDocuments(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Erreur chargement documents :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [vehicleId]);

  const doc = documents.find((d) => d.vehicle === vehicleId);

  const docsList = [
    { label: "Carte grise", file: doc?.carte_grise },
    { label: "Assurance", file: doc?.assurance },
    { label: "Visite technique", file: doc?.visite_technique },
  ];

  return (
    <div className="bg-white shadow rounded-2xl p-6 space-y-4">
      <h2 className="text-xl font-bold">Documents du véhicule</h2>

      {loading ? (
        <p className="text-gray-500">Chargement des documents...</p>
      ) : !doc ? (
        <p className="text-gray-500">Aucun document trouvé pour ce véhicule.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {docsList.map((d) => (
            <div
              key={d.label}
              className="border rounded-xl p-3 space-y-2 relative"
            >
              <h3 className="font-semibold">{d.label}</h3>

              {d.file ? (
                <div className="relative group">
                  {/* ✅ PREVIEW IMAGE */}
                  <img
                    src={d.file}
                    alt={d.label}
                    className="h-40 w-full object-cover rounded-lg border"
                    onError={(e) =>
                      (e.currentTarget.src = "/placeholder.jpg")
                    }
                  />

                  {/* 👁️ OVERLAY */}
                  <a
                    href={d.file}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute inset-0 flex items-center justify-center
                               bg-black/40 opacity-0 group-hover:opacity-100
                               transition rounded-lg"
                    title="Voir le document"
                  >
                    <Eye className="w-8 h-8 text-white" />
                  </a>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Non fourni</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
