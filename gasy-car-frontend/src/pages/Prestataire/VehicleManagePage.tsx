import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Eye,
  Calendar,
  Coins,
  FileText,
  BarChart3,
  Settings,
  User,
  CheckCircle2,
  Clock3,
  XCircle,
  Send,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

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

const ALLOWED_TABS: TabValue[] = [
  "overview",
  "availability",
  "pricing",
  "documents",
  "statistics",
  "settings",
  "chauffeur",
];

const VehicleManagePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: vehicle, isLoading } = useVehiculeQuery(id);

  const initialTab = useMemo<TabValue>(() => {
    const fromUrl = searchParams.get("tab");
    return ALLOWED_TABS.includes(fromUrl as TabValue)
      ? (fromUrl as TabValue)
      : "overview";
  }, [searchParams]);

  const [tab, setTab] = useState<TabValue>(initialTab);

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

  const focusReview = searchParams.get("focusReview") === "1";

  useEffect(() => {
    if (!ALLOWED_TABS.includes(initialTab)) return;
    setTab(initialTab);
  }, [initialTab]);

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

  const handleTabChange = (value: string) => {
    const nextTab = value as TabValue;
    setTab(nextTab);

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("tab", nextTab);

    // Si on quitte Documents sans avoir soumis réellement,
    // on ré-affiche les messages d'aide en haut.
    if (nextTab !== "documents") {
      nextParams.delete("focusReview");
    }

    setSearchParams(nextParams, { replace: true });
  };

  const clearFocusReview = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("focusReview");
    setSearchParams(nextParams, { replace: true });
  };

  const openDocumentsTab = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("tab", "documents");
    nextParams.set("focusReview", "1");
    setSearchParams(nextParams, { replace: true });
    setTab("documents");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 p-6 rounded-3xl">
        <div className="container-wide space-y-6 animate-pulse">
          <Skeleton className="h-24 rounded-3xl" />
          <Skeleton className="h-24 rounded-3xl" />
          <Skeleton className="h-12 w-full max-w-3xl rounded-full" />
          <Skeleton className="h-[420px] rounded-3xl" />
        </div>
      </div>
    );
  }

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

  const workflowStatus = vehicle.workflow_status || "DRAFT";
  const reviewComment = vehicle.review_comment?.trim() || "";
  const documentsValidated = !!vehicle.documents_validated;
  const documentsComplete = !!vehicle.documents_complete;

  const isGuidedOnDocuments = tab === "documents" && focusReview;

  const readyButNotSubmitted =
    documentsComplete &&
    !documentsValidated &&
    workflowStatus !== "PENDING_REVIEW" &&
    workflowStatus !== "REJECTED" &&
    workflowStatus !== "PUBLISHED";

  const incompleteDocsAndNotSubmitted =
    !documentsComplete &&
    workflowStatus !== "PENDING_REVIEW" &&
    workflowStatus !== "REJECTED" &&
    workflowStatus !== "PUBLISHED";

  const shouldHideIncompleteBanner =
    incompleteDocsAndNotSubmitted && isGuidedOnDocuments;

  const shouldHideReadyBanner =
    readyButNotSubmitted && isGuidedOnDocuments;

  const banner = (() => {
    if (workflowStatus === "PUBLISHED" && documentsValidated) {
      return {
        tone: "emerald" as const,
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />,
        badge: "Publié",
        title: "Votre véhicule est publié",
        description:
          "Le dossier a été validé par l’équipe. Votre véhicule peut maintenant apparaître publiquement sur la plateforme.",
        detail:
          "Vous pouvez continuer à gérer les tarifs, disponibilités, documents et chauffeur depuis cette page.",
        actionLabel: undefined,
        action: undefined,
      };
    }

    if (workflowStatus === "REJECTED") {
      return {
        tone: "red" as const,
        icon: <XCircle className="w-5 h-5 text-red-600 mt-0.5" />,
        badge: "Rejeté",
        title: "Votre dossier a été rejeté",
        description:
          "Corrigez les éléments demandés puis renvoyez le véhicule pour validation depuis l’onglet Documents.",
        detail:
          reviewComment || "Un ajustement est demandé avant publication.",
        actionLabel: "Corriger les documents",
        action: openDocumentsTab,
      };
    }

    if (workflowStatus === "PENDING_REVIEW") {
      return {
        tone: "amber" as const,
        icon: <Clock3 className="w-5 h-5 text-amber-600 mt-0.5" />,
        badge: "En attente",
        title: "Votre dossier est en attente de validation",
        description:
          "Le support ou l’administrateur examine actuellement votre véhicule et les documents transmis.",
        detail:
          "Aucune action n’est requise pour le moment. Vous serez notifié dès qu’une décision sera prise.",
        actionLabel: focusReview ? "Fermer" : undefined,
        action: focusReview ? clearFocusReview : undefined,
      };
    }

    if (incompleteDocsAndNotSubmitted && !shouldHideIncompleteBanner) {
      return {
        tone: "blue" as const,
        icon: <FileText className="w-5 h-5 text-blue-600 mt-0.5" />,
        badge: "Étape suivante",
        title: "Ajoutez les documents du véhicule",
        description:
          "Pour lancer la validation, vous devez envoyer la carte grise, la visite technique et l’assurance.",
        detail:
          "Ouvrez l’onglet Documents pour compléter le dossier. Tant que les 3 documents ne sont pas présents, le véhicule ne pourra pas être soumis.",
        actionLabel: "Ouvrir les documents",
        action: openDocumentsTab,
      };
    }

    if (readyButNotSubmitted && !shouldHideReadyBanner) {
      return {
        tone: "indigo" as const,
        icon: <Send className="w-5 h-5 text-indigo-600 mt-0.5" />,
        badge: "À envoyer",
        title: "Votre dossier est prêt",
        description:
          "Les documents sont présents, mais le véhicule n’a pas encore été envoyé ou re-envoyé pour validation.",
        detail:
          "Ouvrez l’onglet Documents pour transmettre officiellement le dossier au support/admin.",
        actionLabel: "Envoyer le dossier",
        action: openDocumentsTab,
      };
    }

    return null;
  })();

  const toneClasses = {
    blue: {
      wrapper: "border-blue-200 bg-blue-50",
      badge: "bg-blue-100 text-blue-700",
      title: "text-blue-950",
      text: "text-blue-800",
      detail: "text-blue-900/90",
      button: "bg-blue-600 hover:bg-blue-700 text-white",
    },
    amber: {
      wrapper: "border-amber-200 bg-amber-50",
      badge: "bg-amber-100 text-amber-700",
      title: "text-amber-950",
      text: "text-amber-800",
      detail: "text-amber-900/90",
      button: "bg-amber-600 hover:bg-amber-700 text-white",
    },
    red: {
      wrapper: "border-red-200 bg-red-50",
      badge: "bg-red-100 text-red-700",
      title: "text-red-950",
      text: "text-red-800",
      detail: "text-red-900/90",
      button: "bg-red-600 hover:bg-red-700 text-white",
    },
    emerald: {
      wrapper: "border-emerald-200 bg-emerald-50",
      badge: "bg-emerald-100 text-emerald-700",
      title: "text-emerald-950",
      text: "text-emerald-800",
      detail: "text-emerald-900/90",
      button: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
    indigo: {
      wrapper: "border-indigo-200 bg-indigo-50",
      badge: "bg-indigo-100 text-indigo-700",
      title: "text-indigo-950",
      text: "text-indigo-800",
      detail: "text-indigo-900/90",
      button: "bg-indigo-600 hover:bg-indigo-700 text-white",
    },
  };

  return (
    <div className="min-h-screen">
      <div className="container-wide">
        <div
          className="
            rounded-3xl
            bg-white
            border border-border/60
            shadow-sm
            px-4 py-6
            sm:px-6 sm:py-8
            lg:px-8 lg:py-10
            space-y-8
          "
        >
          <div className="animate-in fade-in slide-in-from-top-4">
            <VehicleHeader vehicle={vehicle} />
          </div>

          {banner && (
            <div
              className={`rounded-3xl border p-5 sm:p-6 animate-in fade-in slide-in-from-top-2 ${toneClasses[banner.tone].wrapper}`}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-3">
                  {banner.icon}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={toneClasses[banner.tone].badge}>
                        {banner.badge}
                      </Badge>
                    </div>

                    <div>
                      <h3 className={`text-lg font-bold ${toneClasses[banner.tone].title}`}>
                        {banner.title}
                      </h3>
                      <p className={`mt-1 text-sm ${toneClasses[banner.tone].text}`}>
                        {banner.description}
                      </p>
                    </div>

                    <p className={`text-sm ${toneClasses[banner.tone].detail}`}>
                      {banner.detail}
                    </p>
                  </div>
                </div>

                {banner.actionLabel && banner.action && (
                  <Button
                    type="button"
                    onClick={banner.action}
                    className={`shrink-0 rounded-xl px-5 ${toneClasses[banner.tone].button}`}
                  >
                    {banner.actionLabel}
                  </Button>
                )}
              </div>
            </div>
          )}

          <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
            <div
              className="
                sticky top-16 z-20
                bg-white
                border-b border-border/60
                rounded-t-2xl
                -mx-4 sm:-mx-6 lg:-mx-8
                px-4 sm:px-6 lg:px-8 py-2
              "
            >
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
                <DocumentsTab
                  vehicleId={vehicle.id}
                  vehicle={vehicle}
                  highlightReview={focusReview}
                />
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