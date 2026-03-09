import { User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SidebarSettings = ({ section, setSection }: { section: string; setSection: (section: string) => void }) => {
  return (
    <div className="space-y-2">
      <Button
        variant={section === "profile" ? "default" : "outline"}
        className="w-full justify-start gap-3 rounded-xl"
        onClick={() => setSection("profile")}
      >
        <User className="w-4 h-4" /> Informations personnelles
      </Button>

      <Button
        variant={section === "security" ? "default" : "outline"}
        className="w-full justify-start gap-3 rounded-xl"
        onClick={() => setSection("security")}
      >
        <Lock className="w-4 h-4" /> Sécurité & Mot de passe
      </Button>
    </div>
  );
};
