import React from "react";
import { BarChart3, TrendingUp, Star, Percent, DollarSign, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "../StatCard";

import { Vehicule } from "@/types/vehiculeType";

interface StatisticsTabProps {
  vehicle: Vehicule;
}

const StatisticsTab: React.FC<StatisticsTabProps> = ({ vehicle }) => {
  const estimatedRevenue = (parseInt(String(vehicle.prix_jour) || "0") * (vehicle.nombre_locations || 0) * 0.7);

  return (
    <div className="space-y-6 slide-up">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Statistiques d'utilisation
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Suivez les performances de votre véhicule
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Taux d'occupation"
          value="65%"
          variant="blue"
          icon={<Percent className="w-5 h-5" />}
        />
        <StatCard
          label="Revenu estimé (mois)"
          value={estimatedRevenue.toLocaleString()}
          suffix={vehicle.devise}
          variant="green"
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatCard
          label="Note moyenne"
          value={vehicle.note_moyenne || "N/A"}
          suffix={vehicle.note_moyenne ? "/5" : ""}
          variant="amber"
          icon={<Star className="w-5 h-5" />}
        />
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Performance ce mois
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Nombre de locations</span>
                <span className="font-semibold text-foreground">{vehicle.nombre_locations}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-info rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(vehicle.nombre_locations * 10, 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Taux de conversion</span>
                <span className="font-semibold text-foreground">78%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-success to-primary rounded-full"
                  style={{ width: '78%' }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Satisfaction client</span>
                <span className="font-semibold text-foreground">92%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                  style={{ width: '92%' }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Views Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              Visibilité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <p className="text-3xl font-bold text-foreground">1.2k</p>
                <p className="text-sm text-muted-foreground mt-1">Vues ce mois</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <p className="text-3xl font-bold text-foreground">45</p>
                <p className="text-sm text-muted-foreground mt-1">Demandes</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <p className="text-3xl font-bold text-foreground">12</p>
                <p className="text-sm text-muted-foreground mt-1">Partages</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <p className="text-3xl font-bold text-foreground">89</p>
                <p className="text-sm text-muted-foreground mt-1">Favoris</p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-accent/50 border border-accent-foreground/10">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Conseil :</span> Ajoutez plus de photos
                de qualité pour augmenter votre taux de conversion de 25%.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatisticsTab;
