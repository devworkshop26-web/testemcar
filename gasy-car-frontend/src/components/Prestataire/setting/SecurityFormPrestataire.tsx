import { Input } from "@/components/ui/input";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { PrestataireSettingsFormValues } from "@/hooks/usePrestataireSettings";
import { LockKeyhole, ShieldCheck } from "lucide-react";

interface SecurityFormPrestataireProps {
  register: UseFormRegister<PrestataireSettingsFormValues>;
  errors: FieldErrors<PrestataireSettingsFormValues>;
}

export const SecurityFormPrestataire = ({
  register,
  errors,
}: SecurityFormPrestataireProps) => {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground">
              Modifier votre mot de passe
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Utilisez un mot de passe solide pour mieux protéger votre compte.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <LockKeyhole className="w-4 h-4 text-primary" />
          Ancien mot de passe
        </label>
        <Input
          type="password"
          placeholder="Entrez votre ancien mot de passe"
          {...register("old_password", {
            required: "L'ancien mot de passe est obligatoire",
          })}
          className={`rounded-xl h-11 ${
            errors?.old_password ? "border-red-500 focus-visible:ring-red-500/20" : ""
          }`}
        />
        {errors?.old_password && (
          <p className="text-red-600 text-xs">{String(errors.old_password.message)}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <LockKeyhole className="w-4 h-4 text-primary" />
          Nouveau mot de passe
        </label>
        <Input
          type="password"
          placeholder="Entrez votre nouveau mot de passe"
          {...register("new_password", {
            required: "Le nouveau mot de passe est obligatoire",
            minLength: {
              value: 8,
              message: "Le mot de passe doit contenir au moins 8 caractères",
            },
          })}
          className={`rounded-xl h-11 ${
            errors?.new_password ? "border-red-500 focus-visible:ring-red-500/20" : ""
          }`}
        />
        {errors?.new_password && (
          <p className="text-red-600 text-xs">{String(errors.new_password.message)}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <LockKeyhole className="w-4 h-4 text-primary" />
          Confirmer le nouveau mot de passe
        </label>
        <Input
          type="password"
          placeholder="Confirmez votre nouveau mot de passe"
          {...register("new_password_confirm", {
            required: "La confirmation du mot de passe est obligatoire",
          })}
          className={`rounded-xl h-11 ${
            errors?.new_password_confirm
              ? "border-red-500 focus-visible:ring-red-500/20"
              : ""
          }`}
        />
        {errors?.new_password_confirm && (
          <p className="text-red-600 text-xs">
            {String(errors.new_password_confirm.message)}
          </p>
        )}
      </div>
    </div>
  );
};