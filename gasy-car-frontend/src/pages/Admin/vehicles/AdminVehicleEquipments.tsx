import { CreateVehicleEquipmentDialog } from '@/components/admin/CreateVehicleEquipmentDialog';
import { ResourceListPage } from '@/components/admin/ResourceListPage';
import { VehicleEquipment } from '@/types/VehicleEquipmentsType';
import { useAllVehicleEquipmentsQuery, useDeleteVehicleEquipmentMutation } from '@/useQuery/vehicleEquipmentsUseQuery';
import React, { useState } from 'react';
import { UpdateVehicleEquipmentDialog } from '@/components/admin/UpdateVehicleEquipmentDialog';
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

export default function AdminVehicleEquipments() {
 
  const { data: equipments = [] } = useAllVehicleEquipmentsQuery();
  const deleteMutation = useDeleteVehicleEquipmentMutation();
  const [localData, setLocalData] = useState<VehicleEquipment[] | null>(null);
  const [editingEquipment, setEditingEquipment] = useState<VehicleEquipment | null>(null);
  const [deletingEquipment, setDeletingEquipment] = useState<VehicleEquipment | null>(null);

  const rows = localData ?? equipments;

  const handleDelete = (equipment: VehicleEquipment) => {
    setDeletingEquipment(equipment);
  };

  const confirmDelete = () => {
    if (deletingEquipment) {
      deleteMutation.mutate(deletingEquipment.id, {
        onSuccess: () => {
          setLocalData((prev) =>
            (prev ?? equipments).filter((e) => e.id !== deletingEquipment.id),
          );
          setDeletingEquipment(null);
        },
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateVehicleEquipmentDialog
          onCreated={(eq) =>
            setLocalData((prev) => (prev ? [eq, ...prev] : [eq, ...equipments]))
          }
        />
      </div>

      <ResourceListPage
        title="Équipements du véhicule"
        description="Gérez les équipements spécifiques à ce véhicule."
        columns={[
          { key: "code", header: "Code" },
          { key: "label", header: "Label" },
          { key: "description", header: "Description" },
        ]}
        data={rows}
        onEditRow={(row) => setEditingEquipment(row)}
        onDeleteRow={handleDelete}
      />

      <UpdateVehicleEquipmentDialog
        open={!!editingEquipment}
        onOpenChange={(open) => !open && setEditingEquipment(null)}
        equipment={editingEquipment}
        onUpdated={() => {
            setLocalData(null);
        }}
      />

      <AlertDialog open={!!deletingEquipment} onOpenChange={() => setDeletingEquipment(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement l'équipement "{deletingEquipment?.label}".
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
