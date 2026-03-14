import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <Card className="border-none shadow-md rounded-2xl bg-primary text-white overflow-hidden relative">
      <CardContent className="p-6 relative z-10">
        <h3 className="text-lg font-bold font-poppins mb-2">Action Rapide</h3>
        <p className="text-blue-100 text-sm mb-6">Ajoutez un nouveau véhicule à votre flotte pour augmenter vos revenus.</p>
        <Button
          onClick={() => navigate('/prestataire/fleet/addvehicle')}
          className="w-full bg-white text-primary hover:bg-blue-50 font-semibold border-none rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un véhicule
        </Button>
      </CardContent>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/30 rounded-full blur-xl"></div>
    </Card>
  );
};

export default QuickActions;
