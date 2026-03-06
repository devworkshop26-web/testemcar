// src/components/prestataire/settings/SecurityFormPrestataire.tsx
import { Input } from "@/components/ui/input";

import { UseFormRegister } from "react-hook-form";
import { PrestataireSettingsFormValues } from "@/hooks/usePrestataireSettings";

export const SecurityFormPrestataire = ({ register }: { register: UseFormRegister<PrestataireSettingsFormValues> }) => {
  return (
    <div className="space-y-4">
      <Input
        type="password"
        placeholder="Ancien mot de passe"
        {...register("old_password")}
        className="rounded-xl"
      />

      <Input
        type="password"
        placeholder="Nouveau mot de passe"
        {...register("new_password")}
        className="rounded-xl"
      />
    </div>
  );
};
