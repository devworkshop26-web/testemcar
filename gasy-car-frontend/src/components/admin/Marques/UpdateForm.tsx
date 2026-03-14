import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { AdminEntityForm } from "@/components/admin/AdminEntityForm";
import { useUpdateMarqueMutation } from "@/useQuery/marquesUseQuery";
import { Marque, UpdateMarquePayload } from "@/types/marqueType";
import { useState } from "react";

interface UpdateMarqueFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  marque?: Marque | null;
  onUpdated?: () => void;
}

export function UpdateMarqueForm({ open, onOpenChange, marque, onUpdated }: UpdateMarqueFormProps) {
  const { toast } = useToast();
  const { mutateAsync: updateMarque } = useUpdateMarqueMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: UpdateMarquePayload) => {
    if (!marque?.id) return;
    setIsSubmitting(true);
    try {
      await updateMarque({ id: marque.id, payload: values });
      toast({
        title: "Marque mise à jour",
        description: `La marque "${values.nom}" a été mise à jour avec succès.`,
      });
      onUpdated?.();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error?.message || "Impossible de mettre à jour la marque.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Modifier la marque</DialogTitle>
        </DialogHeader>

        <AdminEntityForm<UpdateMarquePayload>
          defaultValues={marque ?? undefined}
          fields={[
            {
              name: "nom",
              label: "Nom de la marque",
              placeholder: "Ex : Toyota",
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
