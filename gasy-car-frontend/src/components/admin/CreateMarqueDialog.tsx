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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// optionnel si tu utilises le toast shadcn
import { useToast } from "@/components/ui/use-toast";
import { useCreateMarqueMutation } from "@/useQuery/marquesUseQuery";

type Marque = {
  id: string;
  nom: string;
  created_at?: string;
  updated_at?: string;
};

interface CreateMarqueDialogProps {
  onCreated?: (marque: Marque) => void; // pour rafraîchir la liste parent
}

export function CreateMarqueDialog({ onCreated }: CreateMarqueDialogProps) {
  const { toast } = useToast(); // si tu n'as pas de toast, enlève-le
  const [open, setOpen] = useState(false);
  const [nom, setNom] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: createMarque } = useCreateMarqueMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!nom.trim()) {
      setError("Le nom de la marque est obligatoire.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const created = await createMarque({ nom });


      // reset form
      setNom("");
      setOpen(false);

      onCreated?.(created);

      toast({
        title: "Marque créée",
        description: `La marque "${created.nom}" a été ajoutée avec succès.`,
      });
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: err.message || "Impossible de créer la marque.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl" variant="default">
          Ajouter une marque
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[420px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Nouvelle marque</DialogTitle>
            <DialogDescription>
              Créez une nouvelle marque pour vos véhicules. Vous pourrez
              l’utiliser ensuite dans les modèles.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="nom-marque">Nom de la marque</Label>
              <Input
                id="nom-marque"
                name="nom"
                placeholder="Ex : Toyota, Hyundai..."
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                disabled={isSubmitting}
              />
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
              {isSubmitting ? "Enregistrement..." : "Créer la marque"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
