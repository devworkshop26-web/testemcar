import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { AdminEntityForm } from "@/components/admin/AdminEntityForm";
import { useUpdateFuelTypeMutation } from "@/useQuery/fueltypeUseQuery";
import { FuelType, UpdateFuelTypePayload } from "@/types/fuelType";
import { useState } from "react";

interface UpdateFuelTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fuelType?: FuelType | null;
  onUpdated?: () => void;
}

export function UpdateFuelTypeDialog({ open, onOpenChange, fuelType, onUpdated }: UpdateFuelTypeDialogProps) {
  const { toast } = useToast();
  const { mutateAsync: updateFuelType } = useUpdateFuelTypeMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: UpdateFuelTypePayload) => {
    if (!fuelType?.id) return;
    setIsSubmitting(true);
    try {
      await updateFuelType({ id: fuelType.id, payload: values });
      toast({
        title: "Type de carburant mis à jour",
        description: `Le type "${values.nom}" a été mis à jour avec succès.`,
      });
      onUpdated?.();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error?.message || "Impossible de mettre à jour le type de carburant.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Modifier le type de carburant</DialogTitle>
        </DialogHeader>

        <AdminEntityForm<UpdateFuelTypePayload>
          defaultValues={fuelType ?? undefined}
          fields={[
            {
              name: "nom",
              label: "Nom",
              placeholder: "Ex : Essence",
              required: true,
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
