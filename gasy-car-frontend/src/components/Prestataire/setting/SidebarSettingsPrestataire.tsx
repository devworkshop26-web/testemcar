import { User, Building2, Lock, CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarSettingsProps {
  section: string;
  setSection: (section: string) => void;
  companyEnabled: boolean;
}

export const SidebarSettingsPrestataire = ({
  section,
  setSection,
  companyEnabled,
}: SidebarSettingsProps) => {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Navigation
        </p>
        <div className="h-px bg-border/70" />
      </div>

      <Button
        type="button"
        variant={section === "personal" ? "default" : "outline"}
        className={`w-full justify-start gap-3 rounded-xl h-11 transition-all ${
          section === "personal"
            ? "shadow-sm"
            : "hover:bg-muted/60 bg-transparent"
        }`}
        onClick={() => setSection("personal")}
      >
        <User className="w-4 h-4" />
        <span>Informations personnelles</span>
      </Button>

      <Button
        type="button"
        disabled={!companyEnabled}
        variant={section === "company" ? "default" : "outline"}
        className={`w-full justify-start gap-3 rounded-xl h-11 transition-all ${
          !companyEnabled
            ? "opacity-60 cursor-not-allowed bg-muted/30"
            : section === "company"
            ? "shadow-sm"
            : "hover:bg-muted/60 bg-transparent"
        }`}
        onClick={() => {
          if (companyEnabled) {
            setSection("company");
          }
        }}
      >
        <Building2 className="w-4 h-4" />
        <span className="flex-1 text-left">Informations de l'entreprise</span>
        {!companyEnabled && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
            Inactif
          </span>
        )}
      </Button>

      <Button
        type="button"
        variant={section === "security" ? "default" : "outline"}
        className={`w-full justify-start gap-3 rounded-xl h-11 transition-all ${
          section === "security"
            ? "shadow-sm"
            : "hover:bg-muted/60 bg-transparent"
        }`}
        onClick={() => setSection("security")}
      >
        <Lock className="w-4 h-4" />
        <span>Sécurité & mot de passe</span>
      </Button>

      <div className="mt-4 rounded-2xl border border-border/70 bg-muted/30 p-3">
        <div className="flex items-start gap-2">
          <CircleDot className="w-4 h-4 mt-0.5 text-primary" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            La section entreprise reste disponible uniquement si vous avez activé
            le mode entreprise.
          </p>
        </div>
      </div>
    </div>
  );
};
