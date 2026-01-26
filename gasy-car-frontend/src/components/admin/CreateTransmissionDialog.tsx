// app/admin/vehicles/_components/CreateTransmissionDialog.tsx
"use client";

import { useState, FormEvent } from "react";
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
import { Transmission } from "@/types/transmissionType";
import { useCreateTransmissionMutation } from "@/useQuery/transmissionsUseQuery";
import { Button } from "../ui/button";

interface CreateTransmissionDialogProps {
  onCreated?: (transmission: Transmission) => void;
}

export function CreateTransmissionDialog({
  onCreated,
}: CreateTransmissionDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [nom, setNom] = useState("");
  const [error, setError] = useState<string | null>(null);
  const createMutation = useCreateTransmissionMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!nom.trim()) {
      setError("Le nom de la transmission est obligatoire.");
      return;
    }

    setError(null);
    try {
      const created = await createMutation.mutateAsync({ nom });
      setNom("");
      setOpen(false);
      onCreated?.(created);

      toast({
        title: "Transmission créée",
        description: `La transmission "${created.nom}" a été ajoutée.`,
      });
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: err.message || "Impossible de créer la transmission.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl">Ajouter une transmission</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[420px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Nouvelle transmission</DialogTitle>
            <DialogDescription>
              Définissez un type de boîte de vitesse (ex : Manuelle, Automatique).
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="nom-transmission">Nom</Label>
              <Input
                id="nom-transmission"
                placeholder="Ex : Manuelle, Automatique..."
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                disabled={createMutation.isPending}
              />
            </div>
            {error && (
              <p className="text-xs text-red-500">
                {error}
              </p>
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
