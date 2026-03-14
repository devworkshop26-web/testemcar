// app/admin/vehicles/_components/CreateStatusVehiculeDialog.tsx
"use client";

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
import { useCreateStatusVehiculeMutation } from "@/useQuery/statusVehiculeUseQuery";
import { StatusVehicule } from "@/types/StatusVehiculeType";


interface CreateStatusVehiculeDialogProps {
  onCreated?: (status: StatusVehicule) => void;
}

export function CreateStatusVehiculeDialog({
  onCreated,
}: CreateStatusVehiculeDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [nom, setNom] = useState("");
  const [error, setError] = useState<string | null>(null);
  const createMutation = useCreateStatusVehiculeMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!nom.trim()) {
      setError("Le nom du statut est obligatoire.");
      return;
    }

    setError(null);
    try {
      const created = await createMutation.mutateAsync({ nom });
      setNom("");
      setOpen(false);
      onCreated?.(created);

      toast({
        title: "Statut créé",
        description: `Le statut "${created.nom}" a été ajouté.`,
      });
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: err.message || "Impossible de créer le statut.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl">Ajouter un statut</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[420px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Nouveau statut de véhicule</DialogTitle>
            <DialogDescription>
              Exemples : Disponible, En maintenance, En location, Hors ligne...
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="nom-status">Nom</Label>
              <Input
                id="nom-status"
                placeholder="Ex : Disponible, En maintenance..."
                value={nom}
                onChange={(e) => setNom(e.target.value)}
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
