

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
import { useToast } from "@/components/ui/use-toast";
import { useCreateModeleVehiculeMutation } from "@/useQuery/ModeleVehiculeUseQuery";
import { ModeleVehicule } from "@/types/ModeleVehiculeType";

interface CreateModeleVehiculeDialogProps {
  onCreated?: (modele: ModeleVehicule) => void;
}

export function CreateModeleVehiculeDialog({
  onCreated,
}: CreateModeleVehiculeDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const createMutation = useCreateModeleVehiculeMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!label.trim()) {
      setError("Le nom du modèle est obligatoire.");
      return;
    }

    setError(null);
    try {
      const created = await createMutation.mutateAsync({ label });
      setLabel("");
      setOpen(false);
      onCreated?.(created);

      toast({
        title: "Modèle créé",
        description: `Le modèle "${created.label}" a été ajouté.`,
      });
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: err.message || "Impossible de créer le modèle.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl">Ajouter un modèle</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[420px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Nouveau modèle de véhicule</DialogTitle>
            <DialogDescription>
              Exemple : Corolla, i10, Sandero, Model 3, etc.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="label-modele">Nom du modèle</Label>
              <Input
                id="label-modele"
                placeholder="Ex : Corolla, i10..."
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                disabled={createMutation.isPending}
              />
            </div>
            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}
          </div>

          <DialogFooter className="flex gap-2 sm:justify-end">
            <DialogClose asChild disabled={createMutation.isPending}>
              <Button type="button" variant="outline" className="rounded-xl">
                Annuler
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="rounded-xl"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Enregistrement..." : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
