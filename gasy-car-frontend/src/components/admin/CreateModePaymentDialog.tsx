"use client";

import { useEffect, useState, FormEvent } from "react";
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
import { Loader2, Plus } from "lucide-react";
import {
  useCreateModePaymentMutation,
} from "@/useQuery/modePaymentUseQuery";
import { ModePayment } from "@/types/modePayment";

interface CreateModePaymentDialogProps {
  onCreated?: (modePayment: ModePayment) => void;
}

export function CreateModePaymentDialog({ onCreated }: CreateModePaymentDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [numero, setNumero] = useState("");
  const [operateur, setOperateur] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const createMutation = useCreateModePaymentMutation();

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !numero.trim()) {
      setError("Le nom et le numéro sont obligatoires.");
      return;
    }

    setError(null);

    try {
      const created = await createMutation.mutateAsync({
        name: name.trim(),
        numero: numero.trim(),
        operateur: operateur.trim() || null,
        description: description.trim(),
        image: imageFile,
      });
      setName("");
      setNumero("");
      setOperateur("");
      setDescription("");
      setImageFile(null);
      setPreview(null);
      setOpen(false);
      onCreated?.(created);

      toast({
        title: "Mode de paiement créé",
        description: `Le mode "${created.name}" a été ajouté avec succès.`,
      });
    } catch (err: any) {
      const message = err?.message || "Impossible de créer le mode de paiement.";
      setError(message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un mode de paiement
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Nouveau mode de paiement</DialogTitle>
            <DialogDescription>
              Ajoutez une méthode que vos clients pourront utiliser pour payer leurs réservations.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="mode-name">Nom</Label>
              <Input
                id="mode-name"
                placeholder="Ex : Mobile Money"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={createMutation.isPending}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mode-numero">Numéro / Référence</Label>
              <Input
                id="mode-numero"
                placeholder="Ex : +261 32 00 000 00"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                disabled={createMutation.isPending}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mode-operateur">Opérateur</Label>
              <Input
                id="mode-operateur"
                placeholder="Ex : Orange Money"
                value={operateur}
                onChange={(e) => setOperateur(e.target.value)}
                disabled={createMutation.isPending}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mode-description">Description</Label>
              <Textarea
                id="mode-description"
                placeholder="Détails ou instructions spécifiques pour ce mode de paiement."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={createMutation.isPending}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mode-image">Image</Label>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Input
                  id="mode-image"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    if (preview) {
                      URL.revokeObjectURL(preview);
                    }
                    setImageFile(file);
                    setPreview(file ? URL.createObjectURL(file) : null);
                  }}
                  disabled={createMutation.isPending}
                  className="cursor-pointer"
                />
                <div className="flex items-center gap-3">
                  {preview ? (
                    <div className="h-16 w-16 overflow-hidden rounded-md border bg-muted">
                      <img src={preview} alt="Prévisualisation" className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-md border border-dashed bg-muted/40 text-[10px] text-muted-foreground">
                      Pas d'image
                    </div>
                  )}
                </div>
              </div>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
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
              {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
