
import { useDeleteMarketingHeroMutation, useMarketingHerosQuery } from "@/useQuery/marketingUseQuery";
import { MarketingHero } from "@/types/MarketingHeroType";
import { useState } from "react";
import { CreateMarketingHeroDialog } from "@/components/admin/CreateMarketingHeroDialog";
import { ResourceListPage } from "@/components/admin/ResourceListPage";
import { UpdateMarketingHeroDialog } from "@/components/admin/UpdateMarketingHeroDialog";
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

export function AdminMarketingPage() {
  const { data: heros = [] } = useMarketingHerosQuery();
  const deleteMutation = useDeleteMarketingHeroMutation();
  const [localData, setLocalData] = useState<MarketingHero[] | null>(null);
  const [editingHero, setEditingHero] = useState<MarketingHero | null>(null);
  const [deletingHero, setDeletingHero] = useState<MarketingHero | null>(null);

  const rows = localData ?? heros;

  const handleDelete = (hero: MarketingHero) => {
    setDeletingHero(hero);
  };

  const confirmDelete = () => {
    if (deletingHero) {
      deleteMutation.mutate(deletingHero.id, {
        onSuccess: () => {
          setLocalData((prev) =>
            (prev ?? heros).filter((h) => h.id !== deletingHero.id)
          );
          setDeletingHero(null);
        },
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateMarketingHeroDialog
          onCreated={(hero) =>
            setLocalData((prev) => (prev ? [hero, ...prev] : [hero, ...heros]))
          }
        />
      </div>

      <ResourceListPage
        title="Bannières marketing"
        description="Gérez les campagnes hero affichées sur votre page d'accueil."
        columns={[
          {
            key: "image",
            header: "Visuel",
            render: (row) => (
              <div className="flex items-center gap-2">
                {row.image && (
                  <div className="relative h-10 w-20 overflow-hidden rounded-lg bg-gray-100">
                    {/* @ts-ignore src string */}
                    <img
                      src={row.image}
                      alt={row.titre}
                      width={100}
                      height={100}
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            ),
          },
          { key: "name", header: "Nom" },
          { key: "titre", header: "Titre" },
          {
            key: "period",
            header: "Période",
            render: (row) => (
              <span className="text-xs text-gray-600">
                {row.start_date} → {row.end_date}
              </span>
            ),
          },
          {
            key: "price",
            header: "Prix",
            render: (row) => (
              <span className="text-sm font-medium text-gray-800">
                {row.price} MGA
              </span>
            ),
          },
          {
            key: "active",
            header: "Statut",
            render: (row) =>
              row.active ? (
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  Actif
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                  Inactif
                </span>
              ),
          },
        ]}
        data={rows}
        onEditRow={(row) => setEditingHero(row)}
        onDeleteRow={handleDelete}
      />

      <UpdateMarketingHeroDialog
        open={!!editingHero}
        onOpenChange={(open) => !open && setEditingHero(null)}
        hero={editingHero}
        onUpdated={() => {
          setLocalData(null); // Force refresh from query
        }}
      />

      <AlertDialog open={!!deletingHero} onOpenChange={() => setDeletingHero(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement la campagne "{deletingHero?.name}".
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
