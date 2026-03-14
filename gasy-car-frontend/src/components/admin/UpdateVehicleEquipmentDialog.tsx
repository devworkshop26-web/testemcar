import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { AdminEntityForm } from "@/components/admin/AdminEntityForm";
import { useUpdateVehicleEquipmentMutation } from "@/useQuery/vehicleEquipmentsUseQuery";
import { VehicleEquipment, UpdateVehicleEquipmentPayload } from "@/types/VehicleEquipmentsType";
import { useState } from "react";

interface UpdateVehicleEquipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipment?: VehicleEquipment | null;
  onUpdated?: () => void;
}

export function UpdateVehicleEquipmentDialog({ open, onOpenChange, equipment, onUpdated }: UpdateVehicleEquipmentDialogProps) {
  const { toast } = useToast();
  const { mutateAsync: updateEquipment } = useUpdateVehicleEquipmentMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: UpdateVehicleEquipmentPayload) => {
    if (!equipment?.id) return;
    setIsSubmitting(true);
    try {
      const normalizedPrice =
        values.price === "" || values.price === undefined || values.price === null
          ? undefined
          : Number(values.price);

      if (normalizedPrice !== undefined && (!Number.isFinite(normalizedPrice) || normalizedPrice < 0)) {
        throw new Error("Le prix doit être un nombre positif.");
      }

      const normalizedPayload: UpdateVehicleEquipmentPayload = {
        ...values,
        price: normalizedPrice,
      };

      await updateEquipment({ id: equipment.id, payload: normalizedPayload });
      toast({
        title: "Équipement mis à jour",
        description: `L'équipement "${values.label}" a été mis à jour avec succès.`,
      });
      onUpdated?.();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error?.message || "Impossible de mettre à jour l'équipement.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Modifier l'équipement</DialogTitle>
        </DialogHeader>

        <AdminEntityForm<UpdateVehicleEquipmentPayload>
          defaultValues={equipment ?? undefined}
          fields={[
            {
              name: "code",
              label: "Code",
              placeholder: "Ex : GPS",
              required: true,
            },
            {
              name: "label",
              label: "Label",
              placeholder: "Ex : GPS intégré",
              required: true,
            },
            {
              name: "description",
              label: "Description",
              type: "textarea",
              placeholder: "Description optionnelle...",
            },
            {
              name: "price",
              label: "Prix / jour (Ar)",
              type: "number",
              placeholder: "Ex : 5000",
            },
          ]}
          submitLabel="Mettre à jour"
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
