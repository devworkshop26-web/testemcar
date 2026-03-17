import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { AdminEntityForm } from "@/components/admin/AdminEntityForm";
import { useUpdateCategoryMutation } from "@/useQuery/categoryUseQuery";
import { Category, UpdateCategoryPayload } from "@/types/categoryType";
import { useState } from "react";

interface UpdateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  categories: Category[]; // For parent selection
  onUpdated?: () => void;
}

export function UpdateCategoryDialog({ open, onOpenChange, category, categories, onUpdated }: UpdateCategoryDialogProps) {
  const { toast } = useToast();
  const { mutateAsync: updateCategory } = useUpdateCategoryMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: UpdateCategoryPayload) => {
    if (!category?.id) return;
    setIsSubmitting(true);
    try {
      await updateCategory({ id: category.id, payload: values });
      toast({
        title: "Catégorie mise à jour",
        description: `La catégorie "${values.nom}" a été mise à jour avec succès.`,
      });
      onUpdated?.();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error?.message || "Impossible de mettre à jour la catégorie.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const parentOptions = categories
    .filter((c) => c.id !== category?.id) // Prevent selecting itself as parent
    .map((c) => ({ label: c.nom, value: c.id }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Modifier la catégorie</DialogTitle>
        </DialogHeader>

        <AdminEntityForm<UpdateCategoryPayload>
          defaultValues={{
            nom: category?.nom,
            parent: category?.parent || undefined,
          }}
          fields={[
            {
              name: "nom",
              label: "Nom",
              placeholder: "Ex : SUV",
              required: true,
            },
            {
              name: "parent",
              label: "Catégorie parente",
              type: "select",
              options: parentOptions,
              placeholder: "Aucune (catégorie racine)",
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
