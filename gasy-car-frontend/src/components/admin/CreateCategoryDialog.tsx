import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// optionnel si tu as le système de toast shadcn
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useCreateCategoryMutation } from "@/useQuery/categoryUseQuery";
const NO_PARENT_VALUE = "none";

type Category = {
  id: string;
  nom: string;
  parent?: string | null;
};

interface CreateCategoryDialogProps {
  categories: Category[]; // pour la liste des parents possibles
  onCreated?: (category: Category) => void;
}

export function CreateCategoryDialog({
  categories,
  onCreated,
}: CreateCategoryDialogProps) {
  const { toast } = useToast(); // enlève-le si tu n'utilises pas les toasts
  const [open, setOpen] = useState(false);
  const [nom, setNom] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: createCategory } = useCreateCategoryMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!nom.trim()) {
      setError("Le nom de la catégorie est obligatoire.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {

        const forme = { nom, parent: parentId || null }
        
      const created = await createCategory(forme);

      setNom("");
      setParentId(null);
      setOpen(false);

      onCreated?.(created);

      toast({
        title: "Catégorie créée",
        description: `La catégorie "${created.nom}" a été ajoutée avec succès.`,
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Une erreur est survenue.");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: err.message || "Impossible de créer la catégorie.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl">Ajouter une catégorie</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Nouvelle catégorie</DialogTitle>
            <DialogDescription>
              Créez une catégorie de véhicule. Vous pouvez aussi la rattacher à
              une catégorie parente pour structurer votre catalogue.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {/* Nom */}
            <div className="grid gap-2">
              <Label htmlFor="nom-category">Nom de la catégorie</Label>
              <Input
                id="nom-category"
                name="nom"
                placeholder="Ex : SUV, Citadine, Utilitaire..."
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* Parent */}
            <div className="grid gap-2">
              <Label>Catégorie parente (optionnel)</Label>
              <Select
                value={parentId ?? NO_PARENT_VALUE}
                onValueChange={(value) => {
                  if (value === NO_PARENT_VALUE) {
                    setParentId(null);
                  } else {
                    setParentId(value);
                  }
                }}
                disabled={isSubmitting || categories.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Aucune (catégorie racine)" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value={NO_PARENT_VALUE}>
                    Aucune (catégorie racine)
                  </SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {categories.length === 0 && (
                <p className="text-xs text-gray-400">
                  Aucune catégorie existante pour le moment.
                </p>
              )}
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>

          <DialogFooter className="flex gap-2 sm:justify-end">
            <DialogClose asChild disabled={isSubmitting}>
              <Button type="button" variant="outline" className="rounded-xl">
                Annuler
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="rounded-xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enregistrement..." : "Créer la catégorie"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
