import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

import { UseFormRegister } from "react-hook-form";
import { ClientSettingsFormValues } from "@/hooks/useClientSetting";

export const SecurityForm = ({ register }: { register: UseFormRegister<ClientSettingsFormValues> }) => {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="space-y-4">

      {/* Ancien mot de passe */}
      <div className="relative">
        <Input
          type={showOld ? "text" : "password"}
          {...register("old_password")}
          placeholder="Ancien mot de passe"
          className="rounded-xl pr-10"
        />
        <button
          type="button"
          onClick={() => setShowOld(!showOld)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Nouveau mot de passe */}
      <div className="relative">
        <Input
          type={showNew ? "text" : "password"}
          {...register("new_password")}
          placeholder="Nouveau mot de passe"
          className="rounded-xl pr-10"
        />
        <button
          type="button"
          onClick={() => setShowNew(!showNew)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Confirmation mot de passe */}
      <div className="relative">
        <Input
          type={showConfirm ? "text" : "password"}
          {...register("new_password_confirm")}
          placeholder="Confirmer le nouveau mot de passe"
          className="rounded-xl pr-10"
        />
        <button
          type="button"
          onClick={() => setShowConfirm(!showConfirm)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

    </div>
  );
};
