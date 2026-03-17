import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Eye,
  Calendar,
  Coins,
  FileText,
  BarChart3,
  Settings,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

import { useVehiculeQuery } from "@/useQuery/vehiculeUseQuery";
import {
  VehicleHeader,
  OverviewTab,
  AvailabilityTab,
  PricingTab,
  DocumentsTab,
  StatisticsTab,
  SettingsTab,
  DriverTab,
} from "@/components/vehicleManage";

/* ---------------------------------- */
/* Types */
/* ---------------------------------- */

type TabValue =
  | "overview"
  | "availability"
  | "pricing"
  | "documents"
  | "statistics"
  | "settings"
  | "chauffeur";

const tabs: Array<{
  value: TabValue;
  label: string;
  icon: React.ReactNode;
}> = [
  { value: "overview", label: "Aperçu", icon: <Eye className="w-4 h-4" /> },
  { value: "availability", label: "Disponibilités", icon: <Calendar className="w-4 h-4" /> },
  { value: "pricing", label: "Tarifs", icon: <Coins className="w-4 h-4" /> },
  { value: "documents", label: "Documents", icon: <FileText className="w-4 h-4" /> },
  { value: "statistics", label: "Statistiques", icon: <BarChart3 className="w-4 h-4" /> },
  { value: "settings", label: "Paramètres", icon: <Settings className="w-4 h-4" /> },
  { value: "chauffeur", label: "Chauffeur", icon: <User className="w-4 h-4" /> },
];

/* ---------------------------------- */
/* Page */
/* ---------------------------------- */

const VehicleManagePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: vehicle, isLoading } = useVehiculeQuery(id);

  const [tab, setTab] = useState<TabValue>("overview");

  const [pricing, setPricing] = useState({
    devise: "Ar",
    prix_heure: "",
    prix_jour: "",
    prix_par_semaine: "",
    prix_mois: "",
    montant_caution: "",
    province_prix_jour: "",
    province_prix_par_semaine: "",
  });

  useEffect(() => {
    if (!vehicle) return;

    setPricing({
      devise: vehicle.devise || "Ar",
      prix_heure: vehicle.prix_heure ? String(vehicle.prix_heure) : "",
      prix_jour: vehicle.prix_jour ? String(vehicle.prix_jour) : "",
      prix_par_semaine: vehicle.prix_par_semaine ? String(vehicle.prix_par_semaine) : "",
      prix_mois: vehicle.prix_mois ? String(vehicle.prix_mois) : "",
      montant_caution: vehicle.montant_caution ? String(vehicle.montant_caution) : "",
      province_prix_jour: vehicle.province_prix_jour ? String(vehicle.province_prix_jour) : "",
      province_prix_par_semaine: vehicle.province_prix_par_semaine
        ? String(vehicle.province_prix_par_semaine)
        : "",
    });
  }, [vehicle]);

  /* ---------------------------------- */
  /* Loading */
  /* ---------------------------------- */

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 p-6 rounded-3xl">
        <div className="container-wide space-y-6 animate-pulse">
          <Skeleton className="h-24 rounded-3xl" />
          <Skeleton className="h-12 w-full max-w-3xl rounded-full" />
          <Skeleton className="h-[420px] rounded-3xl" />
        </div>
      </div>
    );
  }

  /* ---------------------------------- */
  /* Not found */
  /* ---------------------------------- */

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center space-y-4 animate-in fade-in zoom-in">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-muted flex items-center justify-center">
            <Eye className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold">Véhicule non trouvé</h2>
          <p className="text-muted-foreground max-w-sm">
            Ce véhicule n’existe pas ou a été supprimé.
          </p>
          <Button onClick={() => navigate("/prestataire/fleet")}>
            Retour à la flotte
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container-wide">

        {/* MAIN CARD CONTAINER */}
        <div
          className="
            rounded-3xl
            bg-white
            border border-border/60
            shadow-sm
            px-4 py-6
            sm:px-6 sm:py-8
            lg:px-8 lg:py-10
            space-y-10
          "
        >
          {/* HEADER */}
          <div className="animate-in fade-in slide-in-from-top-4">
            <VehicleHeader vehicle={vehicle} />
          </div>

          {/* TABS */}
          <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as TabValue)}
            className="w-full"
          >
            {/* Tabs list */}
            <div className="
              sticky top-16 z-20
              bg-white
              border-b border-border/60
              rounded-t-2xl
              -mx-4 sm:-mx-6 lg:-mx-8
              px-4 sm:px-6 lg:px-8 py-2
            ">
              <div className="overflow-x-auto">
                <TabsList
                  className="
                    w-max min-w-full sm:w-auto
                    gap-1
                    bg-transparent
                    py-2
                    rounded-none
                  "
                >
                  {tabs.map((t) => (
                    <TabsTrigger
                      key={t.value}
                      value={t.value}
                      className="
                        gap-2
                        rounded-full
                        px-4 py-2
                        text-sm font-medium
                        text-muted-foreground
                        transition-all
                        data-[state=active]:bg-primary/10
                        data-[state=active]:text-primary
                        data-[state=active]:shadow-sm
                      "
                    >
                      {t.icon}
                      <span className="hidden sm:inline">{t.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>

            {/* Content */}
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-2">
              <TabsContent value="overview">
                <OverviewTab vehicle={vehicle} />
              </TabsContent>

              <TabsContent value="availability">
                <AvailabilityTab vehicle={vehicle} />
              </TabsContent>

              <TabsContent value="pricing">
                <PricingTab
                  pricing={pricing}
                  setPricing={setPricing}
                  vehicle={vehicle}
                />
              </TabsContent>

              <TabsContent value="documents">
                <DocumentsTab vehicleId={vehicle.id} />
              </TabsContent>

              <TabsContent value="statistics">
                <StatisticsTab vehicle={vehicle} />
              </TabsContent>

              <TabsContent value="settings">
                <SettingsTab vehicle={vehicle} />
              </TabsContent>

              <TabsContent value="chauffeur">
                <DriverTab vehicle={vehicle} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default VehicleManagePage;
