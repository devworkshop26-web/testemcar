import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { AdminEntityForm } from "@/components/admin/AdminEntityForm";
import { useUpdateTransmissionMutation } from "@/useQuery/transmissionsUseQuery";
import { Transmission, UpdateTransmissionPayload } from "@/types/transmissionType";
import { useState } from "react";

interface UpdateTransmissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transmission?: Transmission | null;
  onUpdated?: () => void;
}

export function UpdateTransmissionDialog({ open, onOpenChange, transmission, onUpdated }: UpdateTransmissionDialogProps) {
  const { toast } = useToast();
  const { mutateAsync: updateTransmission } = useUpdateTransmissionMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: UpdateTransmissionPayload) => {
    if (!transmission?.id) return;
    setIsSubmitting(true);
    try {
      await updateTransmission({ id: transmission.id, payload: values });
      toast({
        title: "Transmission mise à jour",
        description: `La transmission "${values.nom}" a été mise à jour avec succès.`,
      });
      onUpdated?.();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error?.message || "Impossible de mettre à jour la transmission.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Modifier la transmission</DialogTitle>
        </DialogHeader>

        <AdminEntityForm<UpdateTransmissionPayload>
          defaultValues={transmission ?? undefined}
          fields={[
            {
              name: "nom",
              label: "Nom",
              placeholder: "Ex : Manuelle",
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
