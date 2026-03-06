// app/account/password/change/page.tsx
"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ChangePasswordPayload } from "@/types/authType";
import { useChangePasswordMutation } from "@/useQuery/password-query";

export default function ChangePasswordPage() {
  const { toast } = useToast();
  const changeMutation = useChangePasswordMutation();

  const [form, setForm] = useState<ChangePasswordPayload>({
    old_password: "",
    new_password: "",
    new_password_confirm: "",
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleChange =
    (field: keyof ChangePasswordPayload) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const data = await changeMutation.mutateAsync(form);

      toast({
        title: "Mot de passe modifié",
        description: data.message ?? "Votre mot de passe a été mis à jour.",
      });

      setForm({
        old_password: "",
        new_password: "",
        new_password_confirm: "",
      });
    } catch (err: any) {
      const apiErrors = err?.response?.data ?? {};
      setErrors(apiErrors);

      const firstError =
        apiErrors.error ??
        apiErrors.detail ??
        "Impossible de modifier le mot de passe.";
      toast({
        variant: "destructive",
        title: "Erreur",
        description: String(firstError),
      });
    }
  };

  const getFieldError = (field: string) =>
    errors[field]?.join(" ") ?? undefined;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-900">
          Modifier mon mot de passe
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Pour votre sécurité, saisissez votre ancien mot de passe et le nouveau.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="old_password">Ancien mot de passe</Label>
            <Input
              id="old_password"
              type="password"
              autoComplete="current-password"
              value={form.old_password}
              onChange={handleChange("old_password")}
              disabled={changeMutation.isPending}
            />
            {getFieldError("old_password") && (
              <p className="text-xs text-red-500">
                {getFieldError("old_password")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="new_password">Nouveau mot de passe</Label>
            <Input
              id="new_password"
              type="password"
              autoComplete="new-password"
              value={form.new_password}
              onChange={handleChange("new_password")}
              disabled={changeMutation.isPending}
            />
            {getFieldError("new_password") && (
              <p className="text-xs text-red-500">
                {getFieldError("new_password")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="new_password_confirm">
              Confirmation du mot de passe
            </Label>
            <Input
              id="new_password_confirm"
              type="password"
              autoComplete="new-password"
              value={form.new_password_confirm}
              onChange={handleChange("new_password_confirm")}
              disabled={changeMutation.isPending}
            />
            {getFieldError("new_password_confirm") && (
              <p className="text-xs text-red-500">
                {getFieldError("new_password_confirm")}
              </p>
            )}
          </div>

          {errors.error && (
            <p className="text-xs text-red-500">{errors.error.join(" ")}</p>
          )}

          <Button
            type="submit"
            className="mt-2 w-full rounded-xl"
            disabled={changeMutation.isPending}
          >
            {changeMutation.isPending
              ? "Mise à jour..."
              : "Mettre à jour le mot de passe"}
          </Button>
        </form>
      </div>
    </div>
  );
}
