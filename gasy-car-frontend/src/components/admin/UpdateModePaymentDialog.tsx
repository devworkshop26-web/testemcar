"use client";

import { useCallback, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  useUpdateModePaymentMutation,
} from "@/useQuery/modePaymentUseQuery";
import { ModePayment, UpdateModePaymentPayload } from "@/types/modePayment";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface UpdateModePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modePayment?: ModePayment | null;
  onUpdated?: () => void;
}

export function UpdateModePaymentDialog({
  open,
  onOpenChange,
  modePayment,
  onUpdated,
}: UpdateModePaymentDialogProps) {
  const { toast } = useToast();
  const { mutateAsync: updateModePayment } = useUpdateModePaymentMutation();
  const mediaBaseUrl =
    import.meta.env.VITE_MEDIA_BASE_URL ?? import.meta.env.VITE_API_BASE_URL ?? "";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState<UpdateModePaymentPayload>({
    name: modePayment?.name ?? "",
    numero: modePayment?.numero ?? "",
    operateur: modePayment?.operateur ?? "",
    description: modePayment?.description ?? "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const getImageUrl = useCallback(
    (image?: string | null) => {
      if (!image) return null;
      if (image.startsWith("http")) return image;
      return `${mediaBaseUrl}${image}`;
    },
    [mediaBaseUrl],
  );

  useEffect(() => {
    setFormState({
      name: modePayment?.name ?? "",
      numero: modePayment?.numero ?? "",
      operateur: modePayment?.operateur ?? "",
      description: modePayment?.description ?? "",
    });
    setImageFile(null);
    setPreview(getImageUrl(modePayment?.image));
  }, [modePayment, getImageUrl]);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleSubmit = async (values: UpdateModePaymentPayload) => {
    if (!modePayment?.id) return;
    setIsSubmitting(true);
    try {
      const payload: UpdateModePaymentPayload = {
        ...values,
        name: values.name?.trim() || values.name,
        numero: values.numero?.trim() || values.numero,
        operateur: values.operateur?.trim() || null,
        description: values.description?.trim() || "",
        image: imageFile ?? undefined,
      };

      await updateModePayment({ id: modePayment.id, payload });
      toast({
        title: "Mode de paiement mis à jour",
        description: `"${values.name || modePayment.name}" a été mis à jour.`,
      });
      onUpdated?.();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error?.message || "Impossible de mettre à jour le mode de paiement.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Modifier le mode de paiement</DialogTitle>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            await handleSubmit(formState);
          }}
        >
          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="edit-mode-name">Nom</Label>
              <Input
                id="edit-mode-name"
                value={formState.name}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, name: event.target.value }))
                }
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-mode-numero">Numéro / Référence</Label>
              <Input
                id="edit-mode-numero"
                value={formState.numero}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, numero: event.target.value }))
                }
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-mode-operateur">Opérateur</Label>
              <Input
                id="edit-mode-operateur"
                value={formState.operateur ?? ""}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, operateur: event.target.value }))
                }
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-mode-description">Description</Label>
              <Textarea
                id="edit-mode-description"
                value={formState.description ?? ""}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, description: event.target.value }))
                }
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-mode-image">Image</Label>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Input
                  id="edit-mode-image"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    if (preview?.startsWith("blob:")) {
                      URL.revokeObjectURL(preview);
                    }
                    setImageFile(file);
                    setPreview(file ? URL.createObjectURL(file) : getImageUrl(modePayment?.image));
                  }}
                  disabled={isSubmitting}
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
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Mettre à jour
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
