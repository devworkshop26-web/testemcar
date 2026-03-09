"use client";

import { CreateCategoryDialog } from "@/components/admin/CreateCategoryDialog";
import { ResourceListPage } from "@/components/admin/ResourceListPage";
import { formatDate } from "@/helper/utils";
import { Category } from "@/types/categoryType";
import { categoryVehiculeUseQuery, useDeleteCategoryMutation } from "@/useQuery/categoryUseQuery";
import { useEffect, useState } from "react";
import { UpdateCategoryDialog } from "@/components/admin/UpdateCategoryDialog";
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

const mockCategories = [
  { id: "1", nom: "Citadine", parent: "Voiture" },
  { id: "2", nom: "SUV", parent: "Voiture" },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const { CategoryData } = categoryVehiculeUseQuery();
  const deleteMutation = useDeleteCategoryMutation();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  useEffect(() => {
    (async () => {
      if (CategoryData) {
        setCategories(CategoryData);
      }
    })();
  }, [CategoryData]);

  const handleDelete = (category: Category) => {
    setDeletingCategory(category);
  };

  const confirmDelete = () => {
    if (deletingCategory) {
      deleteMutation.mutate(deletingCategory.id, {
        onSuccess: () => {
          setCategories((prev) => prev.filter((c) => c.id !== deletingCategory.id));
          setDeletingCategory(null);
        },
      });
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <CreateCategoryDialog
          categories={categories}
          onCreated={(cat) => setCategories((prev) => [cat, ...prev])}
        />
      </div>

      <ResourceListPage
        title="Catégories"
        description="Structurez vos véhicules par catégories et sous-catégories."
        columns={[
          { key: "nom", header: "Nom" },
          {
            key: "parent",
            header: "Catégorie parente",
            render: (row) => row.parent_data?.nom ?? "—",
          },
          {
            key: "created_at",
            header: "Créé le",
            render: (row) => formatDate(row.created_at) ?? "—",
          },
        ]}
        data={categories}
        onEditRow={(row) => setEditingCategory(row)}
        onDeleteRow={handleDelete}
      />

      <UpdateCategoryDialog
        open={!!editingCategory}
        onOpenChange={(open) => !open && setEditingCategory(null)}
        category={editingCategory}
        categories={categories}
        onUpdated={() => {
            // Similar to FuelTypes, we might want to refetch or just rely on optimistic update/invalidation
            // Since we use local state 'categories', we should probably update it or refetch.
            // The mutation invalidates 'category-vehicule-all', so the query will refetch.
            // The useEffect will update 'categories' when 'CategoryData' changes.
            // So we might not need to do anything here if the query refetch triggers the effect.
        }}
      />

      <AlertDialog open={!!deletingCategory} onOpenChange={() => setDeletingCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement la catégorie "{deletingCategory?.nom}".
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
