// app/admin/vehicles/_components/CreateVehicleEquipmentDialog.tsx
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { VehicleEquipment } from "@/types/VehicleEquipmentsType";
import { useCreateVehicleEquipmentMutation } from "@/useQuery/vehicleEquipmentsUseQuery";


interface CreateVehicleEquipmentDialogProps {
  onCreated?: (equipment: VehicleEquipment) => void;
}

export function CreateVehicleEquipmentDialog({
  onCreated,
}: CreateVehicleEquipmentDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState<string | null>(null);
  const createMutation = useCreateVehicleEquipmentMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!code.trim() || !label.trim()) {
      setError("Le code et le label sont obligatoires.");
      return;
    }

    const normalizedPrice = price.trim() === "" ? undefined : Number(price);
    if (normalizedPrice !== undefined && (!Number.isFinite(normalizedPrice) || normalizedPrice < 0)) {
      setError("Le prix doit être un nombre positif.");
      return;
    }

    setError(null);
    try {
      const created = await createMutation.mutateAsync({
        code,
        label,
        description,
        price: normalizedPrice,
      });

      setCode("");
      setLabel("");
      setDescription("");
      setPrice("");
      setOpen(false);
      onCreated?.(created);

      toast({
        title: "Équipement ajouté",
        description: `L'équipement "${created.label}" a été ajouté au véhicule.`,
      });
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          err.message || "Impossible d'ajouter l'équipement au véhicule.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl">Ajouter un équipement</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Nouvel équipement</DialogTitle>
            <DialogDescription>
              Ajoutez un équipement spécifique à ce véhicule (ex : GPS, Sièges
              bébé, Bluetooth, Caméra de recul...).
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="code-eq">Code (unique)</Label>
              <Input
                id="code-eq"
                placeholder="Ex : GPS, BABY_SEAT..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={createMutation.isPending}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="label-eq">Label</Label>
              <Input
                id="label-eq"
                placeholder="Ex : GPS intégré, Siège bébé..."
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                disabled={createMutation.isPending}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="desc-eq">Description (optionnel)</Label>
              <Textarea
                id="desc-eq"
                placeholder="Détaillez l'équipement si nécessaire..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={createMutation.isPending}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price-eq">Prix / jour (Ar)</Label>
              <Input
                id="price-eq"
                type="number"
                min="0"
                step="1"
                placeholder="Ex : 5000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
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
              {createMutation.isPending ? "Enregistrement..." : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
