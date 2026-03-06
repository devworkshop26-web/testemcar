import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900 p-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-9xl font-extrabold text-slate-200">404</h1>
        <h2 className="text-3xl font-bold tracking-tight">Page introuvable</h2>
        <p className="text-slate-600">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate(-1)} variant="outline">
            Retour
          </Button>
          <Button onClick={() => navigate("/")} className="bg-emerald-600 hover:bg-emerald-700">
            Aller à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
}
