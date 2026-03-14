"use client";

import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { MarketingHero, MarketingHeroFormValues } from "@/types/MarketingHeroType";
import { useUpdateMarketingHeroMutation } from "@/useQuery/marketingUseQuery";

interface UpdateMarketingHeroDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hero: MarketingHero | null;
  onUpdated?: () => void;
}

export function UpdateMarketingHeroDialog({
  open,
  onOpenChange,
  hero,
  onUpdated,
}: UpdateMarketingHeroDialogProps) {
  const { toast } = useToast();
  const [form, setForm] = useState<MarketingHeroFormValues>({
    name: "",
    titre: "",
    description: "",
    start_date: "",
    end_date: "",
    price: "",
    active: true,
    imageFile: null,
  });
  const [error, setError] = useState<string | null>(null);
  const updateMutation = useUpdateMarketingHeroMutation();

  useEffect(() => {
    if (hero) {
      setForm({
        name: hero.name,
        titre: hero.titre,
        description: hero.description,
        start_date: hero.start_date,
        end_date: hero.end_date,
        price: hero.price,
        active: hero.active,
        imageFile: null, // Image file is reset, user uploads new one if needed
      });
    }
  }, [hero]);

  const handleChange =
    (field: keyof MarketingHeroFormValues) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, imageFile: file }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!hero) return;

    if (!form.name.trim() || !form.titre.trim()) {
      setError("Le nom et le titre sont obligatoires.");
      return;
    }
    if (!form.start_date || !form.end_date) {
      setError("Les dates de début et de fin sont obligatoires.");
      return;
    }
    if (!form.price) {
      setError("Le prix est obligatoire.");
      return;
    }

    setError(null);
    try {
      await updateMutation.mutateAsync({ id: hero.id, values: form });

      onUpdated?.();
      onOpenChange(false);

      toast({
        title: "Hero marketing mis à jour",
        description: `La campagne "${form.name}" a été modifiée.`,
      });
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          err.message || "Impossible de mettre à jour le hero marketing.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Modifier la bannière marketing</DialogTitle>
            <DialogDescription>
              Modifiez les informations de la campagne. Laissez l'image vide pour conserver l'actuelle.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-hero-name">Nom interne</Label>
              <Input
                id="edit-hero-name"
                placeholder="Ex : Promo Nouvel An"
                value={form.name}
                onChange={handleChange("name")}
                disabled={updateMutation.isPending}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-hero-titre">Titre affiché</Label>
              <Input
                id="edit-hero-titre"
                placeholder="Ex : -30% sur les locations longue durée"
                value={form.titre}
                onChange={handleChange("titre")}
                disabled={updateMutation.isPending}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-hero-desc">Description</Label>
              <Textarea
                id="edit-hero-desc"
                placeholder="Texte descriptif de la campagne..."
                value={form.description}
                onChange={handleChange("description")}
                disabled={updateMutation.isPending}
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="edit-hero-start">Date de début</Label>
                <Input
                  id="edit-hero-start"
                  type="date"
                  value={form.start_date}
                  onChange={handleChange("start_date")}
                  disabled={updateMutation.isPending}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-hero-end">Date de fin</Label>
                <Input
                  id="edit-hero-end"
                  type="date"
                  value={form.end_date}
                  onChange={handleChange("end_date")}
                  disabled={updateMutation.isPending}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-hero-price">Prix mis en avant</Label>
              <Input
                id="edit-hero-price"
                type="number"
                step="0.01"
                placeholder="Ex : 199900.00"
                value={form.price}
                onChange={handleChange("price")}
                disabled={updateMutation.isPending}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-hero-image">Nouvelle image (optionnel)</Label>
              <Input
                id="edit-hero-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={updateMutation.isPending}
              />
            </div>

            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Activer la bannière
                </p>
                <p className="text-xs text-gray-500">
                  Si désactivée, elle ne sera pas affichée sur le site.
                </p>
              </div>
              <Switch
                checked={form.active}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, active: checked }))
                }
                disabled={updateMutation.isPending}
              />
            </div>

            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}
          </div>

          <DialogFooter className="flex gap-2 sm:justify-end">
            <DialogClose asChild disabled={updateMutation.isPending}>
              <Button type="button" variant="outline" className="rounded-xl">
                Annuler
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="rounded-xl"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
