// app/admin/marketing/_components/CreateMarketingHeroDialog.tsx
"use client";

import { useState, FormEvent, ChangeEvent } from "react";
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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { MarketingHero, MarketingHeroFormValues } from "@/types/MarketingHeroType";
import { useCreateMarketingHeroMutation } from "@/useQuery/marketingUseQuery";

interface CreateMarketingHeroDialogProps {
  onCreated?: (hero: MarketingHero) => void;
}

export function CreateMarketingHeroDialog({
  onCreated,
}: CreateMarketingHeroDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<MarketingHeroFormValues>({
    name: "",
    titre: "",
    subtitle: "",
    description: "",
    start_date: "",
    end_date: "",
    price: "",
    link: "",
    btn_text: "",
    active: true,
    imageFile: null,
  });
  const [error, setError] = useState<string | null>(null);
  const createMutation = useCreateMarketingHeroMutation();

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
    if (!form.imageFile) {
      setError("L'image est obligatoire.");
      return;
    }

    setError(null);
    try {
      const created = await createMutation.mutateAsync(form);

      // reset
      setForm({
        name: "",
        titre: "",
        subtitle: "",
        description: "",
        start_date: "",
        end_date: "",
        price: "",
        link: "",
        btn_text: "",
        active: true,
        imageFile: null,
      });
      setOpen(false);
      onCreated?.(created);

      toast({
        title: "Hero marketing créé",
        description: `La campagne "${created.name}" a été ajoutée.`,
      });
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          err.message || "Impossible de créer le hero marketing.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl">Nouvelle bannière marketing</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Créer une bannière marketing</DialogTitle>
            <DialogDescription>
              Configure une bannière pour la page d&apos;accueil (titre, image, période et prix).
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="hero-name">Nom interne</Label>
              <Input
                id="hero-name"
                placeholder="Ex : Promo Nouvel An"
                value={form.name}
                onChange={handleChange("name")}
                disabled={createMutation.isPending}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="hero-titre">Titre affiché</Label>
              <Input
                id="hero-titre"
                placeholder="Ex : -30% sur les locations longue durée"
                value={form.titre}
                onChange={handleChange("titre")}
                disabled={createMutation.isPending}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="hero-subtitle">Sous-titre</Label>
              <Input
                id="hero-subtitle"
                placeholder="Ex : Voyagez en toute liberté"
                value={form.subtitle}
                onChange={handleChange("subtitle")}
                disabled={createMutation.isPending}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="hero-desc">Description</Label>
              <Textarea
                id="hero-desc"
                placeholder="Texte descriptif de la campagne..."
                value={form.description}
                onChange={handleChange("description")}
                disabled={createMutation.isPending}
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="hero-start">Date de début</Label>
                <Input
                  id="hero-start"
                  type="date"
                  value={form.start_date}
                  onChange={handleChange("start_date")}
                  disabled={createMutation.isPending}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hero-end">Date de fin</Label>
                <Input
                  id="hero-end"
                  type="date"
                  value={form.end_date}
                  onChange={handleChange("end_date")}
                  disabled={createMutation.isPending}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="hero-price">Prix mis en avant</Label>
              <Input
                id="hero-price"
                type="number"
                step="0.01"
                placeholder="Ex : 199900.00"
                value={form.price}
                onChange={handleChange("price")}
                disabled={createMutation.isPending}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="hero-image">Image (hero)</Label>
              <Input
                id="hero-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={createMutation.isPending}
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="hero-link">Lien (URL)</Label>
                <Input
                  id="hero-link"
                  type="text"
                  placeholder="Ex : /allcars"
                  value={form.link}
                  onChange={handleChange("link")}
                  disabled={createMutation.isPending}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hero-btn-text">Texte du bouton</Label>
                <Input
                  id="hero-btn-text"
                  type="text"
                  placeholder="Ex : Réserver maintenant"
                  value={form.btn_text}
                  onChange={handleChange("btn_text")}
                  disabled={createMutation.isPending}
                />
              </div>
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
