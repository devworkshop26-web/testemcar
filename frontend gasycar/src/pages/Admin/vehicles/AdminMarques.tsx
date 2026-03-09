import { useState } from "react";
import { CreateMarqueDialog } from "@/components/admin/CreateMarqueDialog";
import { ResourceListPage } from "@/components/admin/ResourceListPage";
import { UpdateMarqueForm } from "@/components/admin/Marques/UpdateForm";
import { useToast } from "@/components/ui/use-toast";
import { formatDate } from "@/helper/utils";
import { Marque } from "@/types/marqueType";
import {
  marquesVehiculeUseQuery,
  useDeleteMarqueMutation,
} from "@/useQuery/marquesUseQuery";
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

export default function AdminMarquesPage() {
  const { toast } = useToast();
  const marqueQuery = marquesVehiculeUseQuery();
  const { mutateAsync: deleteMarque } = useDeleteMarqueMutation();
  const [selectedMarque, setSelectedMarque] = useState<Marque | null>(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [deletingMarque, setDeletingMarque] = useState<Marque | null>(null);

  const handleDelete = (marque: Marque) => {
    setDeletingMarque(marque);
  };

  const confirmDelete = async () => {
    if (!deletingMarque?.id) return;
    try {
      await deleteMarque(deletingMarque.id);
      await marqueQuery.refetch();
      toast({
        title: "Marque supprimée",
        description: `La marque "${deletingMarque.nom}" a été supprimée.`,
      });
      setDeletingMarque(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          error?.message || "Impossible de supprimer la marque pour le moment.",
      });
    }
  };

  const handleEdit = (marque: Marque) => {
    setSelectedMarque(marque);
    setIsUpdateOpen(true);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <CreateMarqueDialog onCreated={() => marqueQuery.refetch()} />
      </div>

      <ResourceListPage
        title="Marques"
        description="Gérez les marques de véhicules disponibles sur la plateforme."
        columns={[
          { key: "nom", header: "Nom" },
          {
            key: "created_at",
            header: "Créée le",
            render: (row) => formatDate(row.created_at) ?? "—",
          },
        ]}
        data={marqueQuery.data ?? []}
        onEditRow={handleEdit}
        onDeleteRow={handleDelete}
      />

      <UpdateMarqueForm
        open={isUpdateOpen}
        onOpenChange={setIsUpdateOpen}
        marque={selectedMarque}
        onUpdated={() => marqueQuery.refetch()}
      />

      <AlertDialog open={!!deletingMarque} onOpenChange={() => setDeletingMarque(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement la marque "{deletingMarque?.nom}".
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
