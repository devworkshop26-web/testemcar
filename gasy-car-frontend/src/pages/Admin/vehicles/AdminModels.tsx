"use client";

import { CreateModeleVehiculeDialog } from "@/components/admin/CreateModeleVehiculeDialog";
import { ResourceListPage } from "@/components/admin/ResourceListPage";
import { formatDate } from "@/helper/utils";
import { ModeleVehicule } from "@/types/ModeleVehiculeType";
import { useDeleteModeleVehiculeMutation, useModelesVehiculeQuery } from "@/useQuery/ModeleVehiculeUseQuery";
import { useState } from "react";

const mockModels = [
  { id: "1", nom: "Corolla", marque: "Toyota" },
  { id: "2", nom: "Tucson", marque: "Hyundai" },
];

export default function AdminModelsPage() {
 const { data: modeles = [] } = useModelesVehiculeQuery();
  const deleteMutation = useDeleteModeleVehiculeMutation();
  const [localData, setLocalData] = useState<ModeleVehicule[] | null>(null);

  const rows = localData ?? modeles;

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <CreateModeleVehiculeDialog
          onCreated={(m) =>
            setLocalData((prev) => (prev ? [m, ...prev] : [m, ...modeles]))
          }
        />
      </div>

      <ResourceListPage
        title="Modèles de véhicules"
        description="Gérez les modèles disponibles pour les différentes marques."
        columns={[
          { key: "label", header: "Nom du modèle" },
          { key: "created_at", header: "Créé le",

                        render: (row) => formatDate(row.created_at) ?? "—",
            
           },
        ]}
        data={rows}
        onDeleteRow={(row) => {
          deleteMutation.mutate(row.id, {
            onSuccess: () => {
              setLocalData((prev) =>
                (prev ?? modeles).filter((m) => m.id !== row.id),
              );
            },
          });
        }}
      />
    </div>
  );
}
