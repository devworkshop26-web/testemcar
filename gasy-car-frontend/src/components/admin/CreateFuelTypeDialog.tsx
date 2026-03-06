// app/admin/vehicles/_components/CreateFuelTypeDialog.tsx
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
import { FuelType } from "@/types/fuelType";
import { useCreateFuelTypeMutation } from "@/useQuery/fueltypeUseQuery";

interface CreateFuelTypeDialogProps {
  onCreated?: (fuelType: FuelType) => void;
}

export function CreateFuelTypeDialog({
  onCreated,
}: CreateFuelTypeDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [nom, setNom] = useState("");
  const [error, setError] = useState<string | null>(null);
  const createMutation = useCreateFuelTypeMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!nom.trim()) {
      setError("Le nom du type de carburant est obligatoire.");
      return;
    }

    setError(null);
    try {
      const created = await createMutation.mutateAsync({ nom });
      setNom("");
      setOpen(false);
      onCreated?.(created);

      toast({
        title: "Type de carburant créé",
        description: `Le type "${created.nom}" a été ajouté.`,
      });
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          err.message || "Impossible de créer le type de carburant.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl">Ajouter un type de carburant</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[420px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Nouveau type de carburant</DialogTitle>
            <DialogDescription>
              Exemples : Essence, Diesel, Électrique, Hybride...
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="nom-fuel">Nom</Label>
              <Input
                id="nom-fuel"
                placeholder="Ex : Essence, Diesel, Électrique..."
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
