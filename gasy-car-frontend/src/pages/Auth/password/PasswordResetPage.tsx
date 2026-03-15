"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LockKeyhole, CheckCircle2, TriangleAlert, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { PasswordResetPayload } from "@/types/authType";
import { useConfirmPasswordResetMutation } from "@/useQuery/password-query";

interface LocationState {
  email?: string;
  reset_token?: string;
}

type ErrorMap = Record<string, string[] | string>;

export default function PasswordResetPage() {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const resetMutation = useConfirmPasswordResetMutation();

  const [form, setForm] = useState<PasswordResetPayload>({
    email: "",
    reset_token: "",
    new_password: "",
    new_password_confirm: "",
  });

  const [errors, setErrors] = useState<ErrorMap>({});
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  useEffect(() => {
    const state = location.state as LocationState | null;
    const emailFromStorage = localStorage.getItem("password_reset_email") || "";
    const tokenFromStorage = localStorage.getItem("password_reset_token") || "";

    if (state?.email || state?.reset_token) {
      setForm((prev) => ({
        ...prev,
        email: state?.email || emailFromStorage,
        reset_token: state?.reset_token || tokenFromStorage,
      }));
      return;
    }

    if (emailFromStorage && tokenFromStorage) {
      setForm((prev) => ({
        ...prev,
        email: emailFromStorage,
        reset_token: tokenFromStorage,
      }));
      return;
    }

    navigate("/forgot-password", { replace: true });
  }, [location.state, navigate]);

  const handleChange =
    (field: keyof PasswordResetPayload) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const normalizeError = (value: unknown): string | undefined => {
    if (!value) return undefined;
    if (Array.isArray(value)) return value.join(" ");
    if (typeof value === "string") return value;
    return undefined;
  };

  const globalError = useMemo(() => {
    return (
      normalizeError(errors.error) ||
      normalizeError(errors.detail) ||
      normalizeError(errors.reset_token) ||
      normalizeError(errors.non_field_errors)
    );
  }, [errors]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!form.email.trim()) {
      toast({
        variant: "destructive",
        title: "Email manquant",
        description: "Veuillez recommencer la procédure de réinitialisation.",
      });
      navigate("/forgot-password", { replace: true });
      return;
    }

    if (!form.reset_token.trim()) {
      toast({
        variant: "destructive",
        title: "Session invalide",
        description: "Votre session a expiré. Veuillez redemander un nouveau code.",
      });
      navigate("/password-reset/verify", {
        state: { email: form.email },
        replace: true,
      });
      return;
    }

    if (!form.new_password.trim() || !form.new_password_confirm.trim()) {
      toast({
        variant: "destructive",
        title: "Champs requis",
        description: "Veuillez remplir les deux champs mot de passe.",
      });
      return;
    }

    if (form.new_password !== form.new_password_confirm) {
      setErrors({
        new_password_confirm: ["Les mots de passe ne correspondent pas."],
      });
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
      });
      return;
    }

    try {

      const data = await resetMutation.mutateAsync({
        email: form.email.trim().toLowerCase(),
        reset_token: String(form.reset_token).trim(),
        new_password: form.new_password,
        new_password_confirm: form.new_password_confirm,
      });

      toast({
        title: "Mot de passe mis à jour",
        description: data.message ?? "Vous pouvez maintenant vous connecter.",
      });

      localStorage.removeItem("password_reset_email");
      localStorage.removeItem("password_reset_token");

      navigate("/login");
    } catch (err: any) {

      const apiErrors = (err?.response?.data ?? {}) as ErrorMap;
      setErrors(apiErrors);

      const firstError =
        normalizeError(apiErrors.error) ||
        normalizeError(apiErrors.detail) ||
        normalizeError(apiErrors.reset_token) ||
        normalizeError(apiErrors.non_field_errors) ||
        normalizeError(apiErrors.new_password) ||
        normalizeError(apiErrors.new_password_confirm) ||
        "Impossible de réinitialiser le mot de passe.";

      toast({
        variant: "destructive",
        title: "Erreur",
        description: firstError,
      });
    }
  };

  const getFieldError = (field: string) => normalizeError(errors[field]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-violet-50/40 to-blue-50/40 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center space-y-3 mb-8">
          <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto">
            <LockKeyhole className="w-8 h-8 text-violet-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Nouveau mot de passe
          </h1>
          <p className="text-sm text-slate-600">
            Choisissez un nouveau mot de passe sécurisé pour
            <br />
            <span className="font-semibold text-violet-700">{form.email}</span>
          </p>
        </div>

        {globalError && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-3">
            <TriangleAlert className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{globalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="new_password">Nouveau mot de passe</Label>
            <div className="relative">
              <Input
                id="new_password"
                type={isNewPasswordVisible ? "text" : "password"}
                autoComplete="new-password"
                value={form.new_password}
                onChange={handleChange("new_password")}
                disabled={resetMutation.isPending}
                className="rounded-2xl h-12 pr-12"
              />
              <button
                type="button"
                onClick={() => setIsNewPasswordVisible((prev) => !prev)}
                disabled={resetMutation.isPending}
                className="absolute inset-y-0 right-0 px-4 text-slate-500 hover:text-slate-700 disabled:opacity-50"
                aria-label={isNewPasswordVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {isNewPasswordVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
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
            <div className="relative">
              <Input
                id="new_password_confirm"
                type={isConfirmPasswordVisible ? "text" : "password"}
                autoComplete="new-password"
                value={form.new_password_confirm}
                onChange={handleChange("new_password_confirm")}
                disabled={resetMutation.isPending}
                className="rounded-2xl h-12 pr-12"
              />
              <button
                type="button"
                onClick={() => setIsConfirmPasswordVisible((prev) => !prev)}
                disabled={resetMutation.isPending}
                className="absolute inset-y-0 right-0 px-4 text-slate-500 hover:text-slate-700 disabled:opacity-50"
                aria-label={isConfirmPasswordVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {isConfirmPasswordVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {getFieldError("new_password_confirm") && (
              <p className="text-xs text-red-500">
                {getFieldError("new_password_confirm")}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-2xl bg-violet-600 hover:bg-violet-700 transition-all"
            disabled={resetMutation.isPending}
          >
            {resetMutation.isPending ? (
              "Mise à jour..."
            ) : (
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Enregistrer le nouveau mot de passe
              </span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}