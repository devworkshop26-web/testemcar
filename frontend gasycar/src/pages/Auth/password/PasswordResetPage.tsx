// app/auth/password/reset/page.tsx
"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { PasswordResetPayload } from "@/types/authType";
import { usePasswordResetMutation } from "@/useQuery/password-query";

export default function PasswordResetPage() {
  const { toast } = useToast();
  const resetMutation = usePasswordResetMutation();

  const [form, setForm] = useState<PasswordResetPayload>({
    email: "",
    code: "",
    new_password: "",
    new_password_confirm: "",
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleChange =
    (field: keyof PasswordResetPayload) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const data = await resetMutation.mutateAsync(form);

      
      toast({
        title: "Mot de passe réinitialisé",
        description: data.message ?? "Vous pouvez maintenant vous connecter.",
      });

      setForm({
        email: "",
        code: "",
        new_password: "",
        new_password_confirm: "",
      });
    } catch (err: any) {
      const apiErrors = err?.response?.data ?? {};
      setErrors(apiErrors);

      const firstError =
        apiErrors.error ??
        apiErrors.detail ??
        "Impossible de réinitialiser le mot de passe.";
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
          Réinitialiser le mot de passe
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Entrez le code reçu par email ainsi que votre nouveau mot de passe.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Adresse email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="vous@example.com"
              value={form.email}
              onChange={handleChange("email")}
              disabled={resetMutation.isPending}
            />
            {getFieldError("email") && (
              <p className="text-xs text-red-500">
                {getFieldError("email")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Code de vérification</Label>
            <Input
              id="code"
              type="text"
              placeholder="Code à 6 chiffres"
              value={form.code}
              onChange={handleChange("code")}
              disabled={resetMutation.isPending}
            />
            {getFieldError("code") && (
              <p className="text-xs text-red-500">
                {getFieldError("code")}
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
              disabled={resetMutation.isPending}
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
              disabled={resetMutation.isPending}
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
            disabled={resetMutation.isPending}
          >
            {resetMutation.isPending
              ? "Réinitialisation..."
              : "Réinitialiser le mot de passe"}
          </Button>
        </form>
      </div>
    </div>
  );
}
