"use client";

import { CreateFuelTypeDialog } from "@/components/admin/CreateFuelTypeDialog";
import { ResourceListPage } from "@/components/admin/ResourceListPage";
import { formatDate } from "@/helper/utils";
import { FuelType } from "@/types/fuelType";
import { useDeleteFuelTypeMutation, useFuelTypesQuery } from "@/useQuery/fueltypeUseQuery";
import { useState } from "react";
import { UpdateFuelTypeDialog } from "@/components/admin/UpdateFuelTypeDialog";
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




export default function AdminFuelTypesPage() {
  const { data: fuelTypes = [] } = useFuelTypesQuery();
  const deleteMutation = useDeleteFuelTypeMutation();
  const [localData, setLocalData] = useState<FuelType[] | null>(null);
  const [editingFuelType, setEditingFuelType] = useState<FuelType | null>(null);
  const [deletingFuelType, setDeletingFuelType] = useState<FuelType | null>(null);

  const rows = localData ?? fuelTypes;

  const handleDelete = (fuelType: FuelType) => {
    setDeletingFuelType(fuelType);
  };

  const confirmDelete = () => {
    if (deletingFuelType) {
      deleteMutation.mutate(deletingFuelType.id, {
        onSuccess: () => {
          setLocalData((prev) =>
            (prev ?? fuelTypes).filter((ft) => ft.id !== deletingFuelType.id),
          );
          setDeletingFuelType(null);
        },
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateFuelTypeDialog
          onCreated={(ft) =>
            setLocalData((prev) => (prev ? [ft, ...prev] : [ft, ...fuelTypes]))
          }
        />
      </div>

      <ResourceListPage
        title="Types de carburant"
        description="Gérez les types de carburant disponibles pour les véhicules."
        columns={[
          { key: "nom", header: "Nom" },
          { key: "created_at", header: "Créé le" ,
            render: (row) => formatDate(row.created_at)  ?? "—",
          },

        ]}
        data={rows}
        onEditRow={(row) => setEditingFuelType(row)}
        onDeleteRow={handleDelete}
      />

      <UpdateFuelTypeDialog
        open={!!editingFuelType}
        onOpenChange={(open) => !open && setEditingFuelType(null)}
        fuelType={editingFuelType}
        onUpdated={() => {
           // Invalidate query or update local state if needed. 
           // Since useFuelTypesQuery will refetch on invalidation in mutation, 
           // we might just rely on that or update local state manually if we want instant feedback without refetch.
           // For simplicity and consistency with create/delete, let's rely on the query invalidation 
           // but we are using localData here which complicates things.
           // Ideally we should drop localData and rely on RQ cache, but to keep existing pattern:
           // We can't easily update localData without refetching or passing the updated item back.
           // Let's assume the mutation invalidates and we might need to reset localData or refetch.
           // Actually, the existing pattern uses localData to show optimistic updates or just immediate updates.
           // Let's just clear localData so it falls back to RQ data which should be fresh?
           // Or better, let's just rely on RQ data mostly. 
           // But existing code uses localData.
           setLocalData(null); // Reset local data to force fetch from updated cache
        }}
      />

      <AlertDialog open={!!deletingFuelType} onOpenChange={() => setDeletingFuelType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement le type de carburant "{deletingFuelType?.nom}".
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
