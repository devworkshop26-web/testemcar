// src/components/Prestataire/setting/SidebarSettingsPrestataire.tsx

import { User, Building2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarSettingsProps {
  section: string;
  setSection: (section: string) => void;
  companyEnabled: boolean;
}

export const SidebarSettingsPrestataire = ({ section, setSection, companyEnabled }: SidebarSettingsProps) => {
  return (
    <div className="space-y-2">

      {/* LIEN : INFORMATIONS PERSONNELLES */}
      <Button
        variant={section === "personal" ? "default" : "outline"}
        className="w-full justify-start gap-3 rounded-xl"
        onClick={() => setSection("personal")}
      >
        <User className="w-4 h-4" />
        Informations personnelles
      </Button>

      {/* LIEN : INFORMATIONS ENTREPRISE — activé/désactivé selon companyEnabled */}
      <Button
        disabled={!companyEnabled}
        variant={section === "company" ? "default" : "outline"}
        className={`w-full justify-start gap-3 rounded-xl ${!companyEnabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        onClick={() => {
          if (companyEnabled) {
            setSection("company");
          }
        }}
      >
        <Building2 className="w-4 h-4" />
        Informations de l'entreprise
      </Button>

      {/* LIEN : SÉCURITÉ */}
      <Button
        variant={section === "security" ? "default" : "outline"}
        className="w-full justify-start gap-3 rounded-xl"
        onClick={() => setSection("security")}
      >
        <Lock className="w-4 h-4" />
        Sécurité & Mot de passe
      </Button>

    </div>
  );
};
