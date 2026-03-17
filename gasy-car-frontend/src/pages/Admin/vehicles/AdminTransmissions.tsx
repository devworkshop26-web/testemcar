"use client";

import { CreateTransmissionDialog } from "@/components/admin/CreateTransmissionDialog";
import { ResourceListPage } from "@/components/admin/ResourceListPage";
import { formatDate } from "@/helper/utils";
import { Transmission } from "@/types/transmissionType";
import {
  transmissionsVehiculeUseQuery,
  useDeleteTransmissionMutation,
} from "@/useQuery/transmissionsUseQuery";
import { useState } from "react";
import { UpdateTransmissionDialog } from "@/components/admin/UpdateTransmissionDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const mockTransmissions = [
  { id: "1", nom: "Manuelle", code: "MANUAL" },
  { id: "2", nom: "Automatique", code: "AUTO" },
];

export default function AdminTransmissionsPage() {
  const { data: transmissions = [] } = transmissionsVehiculeUseQuery();
  const deleteMutation = useDeleteTransmissionMutation();
  const [localData, setLocalData] = useState<Transmission[] | null>(null);
  const [editingTransmission, setEditingTransmission] = useState<Transmission | null>(null);
  const [deletingTransmission, setDeletingTransmission] = useState<Transmission | null>(null);

  const rows = localData ?? transmissions;

  const handleDelete = (transmission: Transmission) => {
    setDeletingTransmission(transmission);
  };

  const confirmDelete = () => {
    if (deletingTransmission) {
      deleteMutation.mutate(deletingTransmission.id, {
        onSuccess: () => {
          setLocalData((prev) =>
            (prev ?? transmissions).filter((t) => t.id !== deletingTransmission.id)
          );
          setDeletingTransmission(null);
        },
      });
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <CreateTransmissionDialog
          onCreated={(t) =>
            setLocalData((prev) =>
              prev ? [t, ...prev] : [t, ...transmissions]
            )
          }
        />
      </div>

      <ResourceListPage
        title="Transmissions"
        description="Configurez les types de boîte de vitesse proposés sur la plateforme."
        columns={[
          { key: "nom", header: "Nom" },
          {
            key: "created_at",
            header: "Créée le",
            render: (row) => formatDate(row.created_at) ?? "—",
          },
        ]}
        data={rows}
        onEditRow={(row) => setEditingTransmission(row)}
        onDeleteRow={handleDelete}
      />

      <UpdateTransmissionDialog
        open={!!editingTransmission}
        onOpenChange={(open) => !open && setEditingTransmission(null)}
        transmission={editingTransmission}
        onUpdated={() => {
            setLocalData(null);
        }}
      />

      <AlertDialog open={!!deletingTransmission} onOpenChange={() => setDeletingTransmission(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement la transmission "{deletingTransmission?.nom}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
