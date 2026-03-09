"use client";

import { CreateStatusVehiculeDialog } from "@/components/admin/CreateStatusVehiculeDialog";
import { ResourceListPage } from "@/components/admin/ResourceListPage";
import { formatDate } from "@/helper/utils";
import { StatusVehicule } from "@/types/StatusVehiculeType";
import {
  useDeleteStatusVehiculeMutation,
  useStatusVehiculesQuery,
} from "@/useQuery/statusVehiculeUseQuery";
import { useState } from "react";

const mockStatus = [
  { id: "1", nom: "Disponible", code: "AVAILABLE" },
  { id: "2", nom: "En location", code: "RENTED" },
  { id: "3", nom: "En maintenance", code: "MAINTENANCE" },
];

export default function AdminStatusPage() {
  const { data: statuses = [] } = useStatusVehiculesQuery();
  const deleteMutation = useDeleteStatusVehiculeMutation();
  const [localData, setLocalData] = useState<StatusVehicule[] | null>(null);

  const rows = localData ?? statuses;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateStatusVehiculeDialog
          onCreated={(status) =>
            setLocalData((prev) =>
              prev ? [status, ...prev] : [status, ...statuses]
            )
          }
        />
      </div>

      <ResourceListPage
        title="Statuts de véhicules"
        description="Gérez les statuts qui reflètent la disponibilité ou l'état de vos véhicules."
        columns={[
          { key: "nom", header: "Nom" },
          {
            key: "created_at",
            header: "Créée le",
            render: (row) => formatDate(row.created_at) ?? "—",
          },
        ]}
        data={rows}
        onDeleteRow={(row) => {
          deleteMutation.mutate(row.id, {
            onSuccess: () => {
              setLocalData((prev) =>
                (prev ?? statuses).filter((s) => s.id !== row.id)
              );
            },
          });
        }}
      />
    </div>
  );
}
