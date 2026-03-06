import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const MaintenanceAlerts = () => {
  return (
    <Card className="border-none shadow-md rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-900 font-poppins">Maintenance & Alertes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-4 p-3 rounded-xl bg-blue-50 border border-blue-100">
          <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">Aucune alerte</h4>
            <p className="text-xs text-gray-500 mt-0.5">Tous vos véhicules sont en bon état</p>
          </div>
        </div>
        <Button variant="outline" className="w-full rounded-xl border-dashed border-2 mt-2 text-gray-500 hover:text-primary hover:border-primary hover:bg-blue-50">
          Voir calendrier entretien
        </Button>
      </CardContent>
    </Card>
  );
};

export default MaintenanceAlerts;
