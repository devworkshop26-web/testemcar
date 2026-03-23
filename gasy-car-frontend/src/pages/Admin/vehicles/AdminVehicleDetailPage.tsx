import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { useToast } from "@/components/ui/use-toast";

import { vehiculeAPI } from "@/Actions/vehiculeApi";
import { useVehicleDocumentsQuery } from "@/useQuery/vehicleDocumentsUseQuery";
import { useVehiculeQuery } from "@/useQuery/vehiculeUseQuery";

import type { VehicleDocument } from "@/types/vehicleDocumentsType";

import {
  ArrowLeft,
  Edit,
  MapPin,
  Calendar,
  DollarSign,
  Settings,
  Loader2,
  User,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Clock3,
  FileWarning,
  BadgeCheck,
  Heart,
  ShieldCheck,
  FileText,
  Send,
  Eye,
  Gauge,
  Info,
  ChevronLeft,
} from "lucide-react";

const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-[420px] rounded-3xl bg-gray-200" />
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      <div className="xl:col-span-8 space-y-6">
        <div className="h-40 rounded-3xl bg-gray-200" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-72 rounded-3xl bg-gray-200" />
          <div className="h-72 rounded-3xl bg-gray-200" />
        </div>
        <div className="h-72 rounded-3xl bg-gray-200" />
      </div>
      <div className="xl:col-span-4 space-y-6">
        <div className="h-64 rounded-3xl bg-gray-200" />
        <div className="h-72 rounded-3xl bg-gray-200" />
        <div className="h-72 rounded-3xl bg-gray-200" />
      </div>
    </div>
  </div>
);

const DataRow = ({
  label,
  value,
  isMonospace = false,
  highlight = false,
}: {
  label: string;
  value: ReactNode;
  isMonospace?: boolean;
  highlight?: boolean;
}) => (
  <div className="flex items-center justify-between gap-4 rounded-lg px-2 py-2.5 text-sm border-b border-gray-100 last:border-0 hover:bg-gray-50/70 transition-colors">
    <span className="font-medium text-gray-500">{label}</span>
    <span
      className={`text-right font-semibold text-gray-900 ${
        isMonospace ? "font-mono tracking-tight" : ""
      } ${highlight ? "text-blue-600" : ""}`}
    >
      {value || "—"}
    </span>
  </div>
);

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("fr-FR");
};

export function AdminVehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: vehicle, isLoading } = useVehiculeQuery(id);
  const { data: documents = [], isLoading: isDocsLoading } = useVehicleDocumentsQuery(id);

  const document: VehicleDocument | null = useMemo(() => {
    if (!Array.isArray(documents) || documents.length === 0) return null;
    return [...documents].sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )[0];
  }, [documents]);

  const [vehicleReason, setVehicleReason] = useState("");
  const [documentReason, setDocumentReason] = useState("");
  const [cautionDraft, setCautionDraft] = useState("");

  useEffect(() => {
    if (!vehicle) return;
    setCautionDraft(vehicle.montant_caution ? String(vehicle.montant_caution) : "");
  }, [vehicle]);

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["vehicule-one", id] });
    queryClient.invalidateQueries({ queryKey: ["vehicle-documents", id] });
    queryClient.invalidateQueries({ queryKey: ["vehicules-all"] });
    queryClient.invalidateQueries({ queryKey: ["vehicules-review-queue"] });
    queryClient.invalidateQueries({ queryKey: ["vehicules-public"] });
  };

  const reviewVehicleMutation = useMutation({
    mutationFn: async ({
      action,
      reason,
    }: {
      action: "approve" | "reject";
      reason?: string;
    }) => {
      return await vehiculeAPI.review_vehicle(id!, {
        action,
        review_comment: reason || "",
      });
    },
    onSuccess: () => {
      invalidateAll();
      setVehicleReason("");
      toast({
        title: "Succès",
        description: "Le statut du véhicule a été mis à jour.",
      });
    },
    onError: (error: any) => {
      const detail =
        error?.response?.data?.detail || "Impossible de traiter le véhicule.";
      toast({
        title: "Erreur",
        description: detail,
        variant: "destructive",
      });
      console.error("Erreur review véhicule admin :", error?.response?.data || error);
    },
  });

  const reviewDocumentsMutation = useMutation({
    mutationFn: async ({
      action,
      reason,
    }: {
      action: "approve" | "reject";
      reason?: string;
    }) => {
      if (!document?.id) throw new Error("Aucun document disponible");
      return await vehiculeAPI.review_vehicle_documents(document.id, {
        action,
        rejection_reason: reason || "",
      });
    },
    onSuccess: () => {
      invalidateAll();
      setDocumentReason("");
      toast({
        title: "Succès",
        description: "Le statut des documents a été mis à jour.",
      });
    },
    onError: (error: any) => {
      const detail =
        error?.response?.data?.detail || "Impossible de traiter les documents.";
      toast({
        title: "Erreur",
        description: detail,
        variant: "destructive",
      });
      console.error("Erreur review documents admin :", error?.response?.data || error);
    },
  });

  const certifyMutation = useMutation({
    mutationFn: async (est_certifie: boolean) => {
      return await vehiculeAPI.patch_vehicule(id!, { est_certifie } as any);
    },
    onSuccess: () => {
      invalidateAll();
      toast({ title: "Succès", description: "Certification mise à jour." });
    },
  });

  const sponsorMutation = useMutation({
    mutationFn: async (est_sponsorise: boolean) => {
      return await vehiculeAPI.patch_vehicule(id!, { est_sponsorise } as any);
    },
    onSuccess: () => {
      invalidateAll();
      toast({ title: "Succès", description: "Sponsoring mis à jour." });
    },
  });

  const coupDeCoeurMutation = useMutation({
    mutationFn: async (est_coup_de_coeur: boolean) => {
      return await vehiculeAPI.patch_vehicule(id!, { est_coup_de_coeur } as any);
    },
    onSuccess: () => {
      invalidateAll();
      toast({ title: "Succès", description: "Coup de cœur mis à jour." });
    },
  });

  const cautionMutation = useMutation({
    mutationFn: async (montant_caution: string) => {
      return await vehiculeAPI.patch_vehicule(id!, { montant_caution } as any);
    },
    onSuccess: () => {
      invalidateAll();
      toast({ title: "Succès", description: "Caution mise à jour." });
    },
  });

  const busy =
    reviewVehicleMutation.isPending ||
    reviewDocumentsMutation.isPending ||
    certifyMutation.isPending ||
    sponsorMutation.isPending ||
    coupDeCoeurMutation.isPending ||
    cautionMutation.isPending;

  const photos = Array.isArray(vehicle?.photos) ? vehicle.photos : [];
  const pricingGrid = Array.isArray(vehicle?.pricing_grid) ? vehicle.pricing_grid : [];
  const equipments = Array.isArray(vehicle?.equipements_details)
    ? vehicle.equipements_details
    : [];

  const urbain = pricingGrid.find((p) => p.zone_type === "URBAIN");
  const province = pricingGrid.find((p) => p.zone_type === "PROVINCE");

  const docsComplete = !!vehicle?.documents_complete;
  const docsValidated = !!vehicle?.documents_validated || !!document?.is_valide;
  const workflowStatus = vehicle?.workflow_status || "DRAFT";
  const isPublished = workflowStatus === "PUBLISHED";
  const isPending = workflowStatus === "PENDING_REVIEW";
  const isRejected = workflowStatus === "REJECTED";

  const canApproveDocuments = !!document && docsComplete && !docsValidated && !busy;

  const canRejectDocuments =
    !!document && !docsValidated && !busy && documentReason.trim().length > 0;

  const canPublishVehicle = docsValidated && !isPublished && !busy;

  const canRejectVehicle =
    !isPublished && !busy && vehicleReason.trim().length > 0;

  const workflowBadge = useMemo(() => {
    switch (workflowStatus) {
      case "PENDING_REVIEW":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/90 text-white shadow-sm backdrop-blur-md flex items-center gap-1">
            <Clock3 className="w-4 h-4" />
            EN ATTENTE
          </span>
        );
      case "PUBLISHED":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600/90 text-white shadow-sm backdrop-blur-md flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            PUBLIÉ
          </span>
        );
      case "REJECTED":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600/90 text-white shadow-sm backdrop-blur-md flex items-center gap-1">
            <XCircle className="w-4 h-4" />
            REJETÉ
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-700/90 text-white shadow-sm backdrop-blur-md">
            BROUILLON
          </span>
        );
    }
  }, [workflowStatus]);

  if (isLoading || isDocsLoading) {
    return (
      <AdminPageShell title="Détails du véhicule" description="Chargement...">
        <LoadingSkeleton />
      </AdminPageShell>
    );
  }

  if (!vehicle) {
    return (
      <AdminPageShell title="Véhicule introuvable" description="Ce véhicule n'existe pas.">
        <Card className="rounded-3xl border border-red-200 shadow-sm">
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">Véhicule introuvable</p>
            <Button onClick={() => navigate("/admin/vehicles")} className="mt-4">
              Retour à la liste
            </Button>
          </CardContent>
        </Card>
      </AdminPageShell>
    );
  }

  const adminBanner = (() => {
    if (isPublished) {
      return {
        wrapper: "border-emerald-200 bg-emerald-50",
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />,
        badgeClass: "bg-emerald-100 text-emerald-700",
        badge: "Publié",
        title: "Véhicule déjà publié",
        description:
          "Le véhicule est visible publiquement. Les actions de validation sont verrouillées.",
        detail:
          "Vous pouvez encore gérer la caution, la certification, le sponsoring et le coup de cœur.",
      };
    }

    if (isRejected) {
      return {
        wrapper: "border-red-200 bg-red-50",
        icon: <XCircle className="w-5 h-5 text-red-600 mt-0.5" />,
        badgeClass: "bg-red-100 text-red-700",
        badge: "Rejeté",
        title: "Véhicule rejeté",
        description:
          "Le dossier a été refusé. Le prestataire doit corriger puis renvoyer le véhicule.",
        detail:
          vehicle.review_comment?.trim() ||
          document?.rejection_reason?.trim() ||
          "Une correction a été demandée avant une nouvelle soumission.",
      };
    }

    if (isPending && !document) {
      return {
        wrapper: "border-orange-200 bg-orange-50",
        icon: <FileWarning className="w-5 h-5 text-orange-600 mt-0.5" />,
        badgeClass: "bg-orange-100 text-orange-700",
        badge: "Dossier incomplet",
        title: "Aucun document exploitable",
        description:
          "Le véhicule a été soumis mais aucun dossier documentaire n’a été trouvé pour cette fiche.",
        detail:
          "Demande au prestataire de soumettre un dossier complet avant validation.",
      };
    }

    if (isPending && !docsComplete) {
      return {
        wrapper: "border-orange-200 bg-orange-50",
        icon: <FileWarning className="w-5 h-5 text-orange-600 mt-0.5" />,
        badgeClass: "bg-orange-100 text-orange-700",
        badge: "Documents incomplets",
        title: "Contrôle documentaire requis",
        description:
          "Les documents doivent être examinés avant toute publication du véhicule.",
        detail: "Carte grise, visite technique et assurance doivent être fournies.",
      };
    }

    if (isPending && docsComplete && !docsValidated) {
      return {
        wrapper: "border-blue-200 bg-blue-50",
        icon: <Clock3 className="w-5 h-5 text-blue-600 mt-0.5" />,
        badgeClass: "bg-blue-100 text-blue-700",
        badge: "À contrôler",
        title: "Dossier en attente",
        description:
          "Le véhicule a été soumis et attend une décision administrative.",
        detail: `Dernière mise à jour des documents : ${formatDate(document?.updated_at)}`,
      };
    }

    if (docsValidated) {
      return {
        wrapper: "border-indigo-200 bg-indigo-50",
        icon: <Send className="w-5 h-5 text-indigo-600 mt-0.5" />,
        badgeClass: "bg-indigo-100 text-indigo-700",
        badge: "Prêt à publier",
        title: "Documents validés, véhicule prêt à publier",
        description:
          "Le contrôle documentaire est terminé. Vous pouvez maintenant publier ou rejeter le véhicule.",
        detail:
          "La publication n’est possible qu’après validation documentaire.",
      };
    }

    return {
      wrapper: "border-slate-200 bg-slate-50",
      icon: <Info className="w-5 h-5 text-slate-600 mt-0.5" />,
      badgeClass: "bg-slate-200 text-slate-700",
      badge: "Brouillon",
      title: "Véhicule non soumis",
      description:
        "Le prestataire n’a pas encore envoyé officiellement ce véhicule en file de validation.",
      detail:
        "Aucune décision finale ne devrait être prise tant que le dossier n’est pas soumis.",
    };
  })();

  const ownerName =
    vehicle.proprietaire_data?.full_name ||
    `${vehicle.proprietaire_data?.first_name || ""} ${
      vehicle.proprietaire_data?.last_name || ""
    }`.trim() ||
    vehicle.proprietaire_data?.email ||
    "Prestataire inconnu";

  const ownerPhone =
    (vehicle.proprietaire_data as { phone?: string; phone_number?: string } | undefined)?.phone ||
    (vehicle.proprietaire_data as { phone?: string; phone_number?: string } | undefined)
      ?.phone_number ||
    "—";

  const mainPhoto =
    photos.find((photo) => photo.is_primary)?.image ||
    photos.find((photo) => photo.is_primary)?.image_url ||
    photos[0]?.image ||
    photos[0]?.image_url ||
    "/placeholder.jpg";

  return (
    <AdminPageShell
      title={vehicle.titre}
      description={`${vehicle.marque_data?.nom || "N/A"} ${vehicle.modele_data?.label || ""} - ${vehicle.annee}`}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/vehicles")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <Button onClick={() => navigate(`/admin/vehicles/${id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
        </div>
      }
    >
      <div className="min-h-screen bg-gray-50/60 pb-20 font-sans text-slate-800 animate-in fade-in duration-500">
        <div className="mx-auto max-w-7xl px-1 sm:px-2">
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => navigate("/admin/vehicles")}
              className="flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-blue-600"
            >
              <ChevronLeft className="h-4 w-4" />
              Retour à la flotte
            </button>

            <div className="text-xs font-mono text-gray-400">
              Dernière synchro : {new Date().toLocaleDateString("fr-FR")}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div className="space-y-6 xl:col-span-8">
              <div className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
                  {typeof vehicle.est_disponible === "boolean" ? (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-md ${
                        vehicle.est_disponible
                          ? "bg-green-500/90"
                          : "bg-red-500/90"
                      }`}
                    >
                      {vehicle.est_disponible ? "DISPONIBLE" : "INDISPONIBLE"}
                    </span>
                  ) : null}

                  <span className="rounded-full border bg-white/90 px-3 py-1 text-xs font-bold text-gray-800 shadow-sm backdrop-blur-md">
                    {vehicle.categorie_data?.nom || "Non classé"}
                  </span>

                  {workflowBadge}

                  {vehicle.est_certifie ? (
                    <span className="flex items-center gap-1 rounded-full bg-blue-600/90 px-3 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-md">
                      <BadgeCheck className="h-4 w-4" />
                      CERTIFIÉ
                    </span>
                  ) : null}

                  {vehicle.est_sponsorise ? (
                    <span className="rounded-full bg-amber-500/90 px-3 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-md">
                      SPONSORISÉ
                    </span>
                  ) : null}

                  {vehicle.est_coup_de_coeur ? (
                    <span className="flex items-center gap-1 rounded-full bg-rose-500/90 px-3 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-md">
                      <Heart className="h-3.5 w-3.5" />
                      COUP DE CŒUR
                    </span>
                  ) : null}
                </div>

                <div className="relative flex h-[460px] w-full items-center justify-center overflow-hidden bg-gray-900">
                  <img
                    src={mainPhoto}
                    alt="Vue véhicule"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.jpg";
                    }}
                  />

                  <div className="absolute left-[28%] top-[58%]">
                    <div className="rounded-full bg-blue-600 p-2 text-white shadow-lg animate-pulse">
                      <Eye className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 bg-white p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        {vehicle.marque_data?.nom}{" "}
                        <span className="text-blue-600">
                          {vehicle.modele_data?.label}
                        </span>
                      </h1>

                      <p className="mt-1 flex flex-wrap items-center gap-2 text-gray-500">
                        <MapPin className="h-4 w-4" />
                        {vehicle.ville || "Ville inconnue"}
                        <span className="text-gray-300">|</span>
                        {vehicle.zone || "Zone inconnue"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold uppercase tracking-wider text-gray-400">
                        Prix standard
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {urbain?.prix_jour ?? vehicle.prix_jour ?? "—"}{" "}
                        <span className="text-base font-normal text-gray-500">
                          {vehicle.devise} / jour
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 overflow-x-auto px-6 pb-6 scrollbar-hide">
                  {photos.length > 0 ? (
                    photos.map((photo, index) => (
                      <div
                        key={photo.id || index}
                        className="relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white"
                      >
                        <img
                          src={photo.image || photo.image_url || "/placeholder.jpg"}
                          className="h-full w-full object-cover"
                          alt={`Photo ${index + 1}`}
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.jpg";
                          }}
                        />
                        {photo.is_primary ? (
                          <div className="absolute right-1.5 top-1.5">
                            <Badge className="bg-blue-600 text-[10px]">Principale</Badge>
                          </div>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <div className="flex h-20 w-full items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 text-sm text-gray-400">
                      Aucune photo disponible
                    </div>
                  )}
                </div>
              </div>

              <Card className={`${adminBanner.wrapper} border shadow-sm`}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    {adminBanner.icon}
                    <div className="space-y-2">
                      <Badge className={adminBanner.badgeClass}>{adminBanner.badge}</Badge>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          {adminBanner.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-700">
                          {adminBanner.description}
                        </p>
                        <p className="mt-2 text-sm text-slate-600">
                          {adminBanner.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {vehicle.review_comment ? (
                <Card className="border-red-200 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-red-700">
                      Motif de rejet véhicule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line text-sm text-red-900">
                      {vehicle.review_comment}
                    </p>
                  </CardContent>
                </Card>
              ) : null}

              {document?.rejection_reason ? (
                <Card className="border-red-200 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-red-700">
                      Motif de rejet documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line text-sm text-red-900">
                      {document.rejection_reason}
                    </p>
                  </CardContent>
                </Card>
              ) : null}

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card className="rounded-3xl border border-gray-200 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
                      <FileText className="h-5 w-5 text-blue-500" />
                      Fiche technique
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <DataRow
                      label="Titre"
                      value={vehicle.titre}
                      highlight
                    />
                    <DataRow
                      label="Plaque Immat."
                      value={vehicle.numero_immatriculation}
                      isMonospace
                      highlight
                    />
                    <DataRow
                      label="Numéro Série (VIN)"
                      value={vehicle.numero_serie}
                      isMonospace
                    />
                    <DataRow label="Année" value={vehicle.annee} />
                    <DataRow label="Couleur" value={vehicle.couleur} />
                    <DataRow
                      label="Portes / Places"
                      value={`${vehicle.nombre_portes || "—"} portes / ${
                        vehicle.nombre_places || "—"
                      } places`}
                    />
                    <DataRow
                      label="Kilométrage"
                      value={
                        vehicle.kilometrage_actuel_km !== undefined &&
                        vehicle.kilometrage_actuel_km !== null
                          ? `${vehicle.kilometrage_actuel_km.toLocaleString()} km`
                          : "—"
                      }
                    />
                    <DataRow
                      label="Carburant"
                      value={vehicle.type_carburant_data?.nom || "N/A"}
                    />
                    <DataRow
                      label="Transmission"
                      value={vehicle.transmission_data?.nom || "N/A"}
                    />
                  </CardContent>
                </Card>

                <Card className="flex flex-col rounded-3xl border border-gray-200 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
                      <ShieldCheck className="h-5 w-5 text-green-500" />
                      État & options
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex flex-1 flex-col">
                    <div className="mb-6 space-y-1">
                      <DataRow label="Workflow" value={workflowStatus} highlight />
                      <DataRow
                        label="Docs complets"
                        value={docsComplete ? "✅ Oui" : "Non"}
                      />
                      <DataRow
                        label="Docs validés"
                        value={docsValidated ? "✅ Oui" : "Non"}
                      />
                      <DataRow
                        label="Certifié"
                        value={vehicle.est_certifie ? "✅ Oui" : "Non"}
                      />
                      <DataRow
                        label="Sponsorisé"
                        value={vehicle.est_sponsorise ? "✅ Oui" : "Non"}
                      />
                      <DataRow
                        label="Coup de cœur"
                        value={vehicle.est_coup_de_coeur ? "✅ Oui" : "Non"}
                      />
                      <DataRow
                        label="Caution"
                        value={`${vehicle.montant_caution ?? "0.00"} ${vehicle.devise}`}
                        highlight
                      />
                    </div>

                    <div className="mt-auto">
                      <p className="mb-2 text-xs font-bold uppercase text-gray-400">
                        Équipements inclus
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {equipments.length > 0 ? (
                          equipments.map((equipment) => (
                            <span
                              key={equipment.id}
                              className="rounded-md border border-gray-200 bg-gray-100 px-2 py-1 text-xs text-gray-600"
                            >
                              {equipment.label}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm italic text-gray-400">
                            Aucun équipement listé
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card className="rounded-3xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 p-4">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800">
                      <MapPin className="h-5 w-5 text-purple-500" />
                      Localisation
                    </h3>
                  </div>

                  <CardContent className="pt-4">
                    <div className="space-y-1">
                      <DataRow
                        label="Adresse"
                        value={vehicle.adresse_localisation || "—"}
                      />
                      <DataRow label="Ville" value={vehicle.ville || "—"} />
                      <DataRow label="Zone" value={vehicle.zone || "—"} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 p-4">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800">
                      <Settings className="h-5 w-5 text-orange-500" />
                      Informations principales
                    </h3>
                  </div>

                  <CardContent className="pt-4">
                    <div className="space-y-1">
                      <DataRow
                        label="Marque"
                        value={vehicle.marque_data?.nom || "N/A"}
                      />
                      <DataRow
                        label="Modèle"
                        value={vehicle.modele_data?.label || "N/A"}
                      />
                      <DataRow
                        label="Catégorie"
                        value={vehicle.categorie_data?.nom || "N/A"}
                      />
                      <DataRow
                        label="Propriétaire"
                        value={ownerName}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {(vehicle.description || vehicle.conditions_particulieres) && (
                <div className="grid gap-6 md:grid-cols-2">
                  {vehicle.description ? (
                    <Card className="rounded-3xl border border-gray-200 shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle>Description</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-line text-sm text-slate-700">
                          {vehicle.description}
                        </p>
                      </CardContent>
                    </Card>
                  ) : null}

                  {vehicle.conditions_particulieres ? (
                    <Card className="rounded-3xl border border-gray-200 shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle>Conditions particulières</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-line text-sm text-slate-700">
                          {vehicle.conditions_particulieres}
                        </p>
                      </CardContent>
                    </Card>
                  ) : null}
                </div>
              )}
            </div>

            <div className="space-y-6 xl:col-span-4">
              <Card className="overflow-hidden rounded-3xl border border-gray-200 shadow-sm">
                <div className="bg-slate-900 p-4 text-white">
                  <h3 className="flex items-center gap-2 font-bold">
                    <Gauge className="h-5 w-5" />
                    Grille tarifaire
                  </h3>
                </div>

                <div className="p-0">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-gray-200 bg-gray-50 text-xs font-bold uppercase text-gray-500">
                      <tr>
                        <th className="px-4 py-3">Période</th>
                        <th className="px-4 py-3 text-blue-600">Urbain</th>
                        <th className="px-4 py-3 text-orange-600">Province</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        {
                          label: "Heure",
                          urbainValue: urbain?.prix_heure ?? vehicle.prix_heure,
                          provinceValue: province?.prix_heure,
                        },
                        {
                          label: "Jour",
                          urbainValue: urbain?.prix_jour ?? vehicle.prix_jour,
                          provinceValue: province?.prix_jour,
                          strong: true,
                        },
                        {
                          label: "Semaine",
                          urbainValue:
                            urbain?.prix_par_semaine ?? vehicle.prix_par_semaine,
                          provinceValue: province?.prix_par_semaine,
                        },
                        {
                          label: "Mois",
                          urbainValue: urbain?.prix_mois ?? vehicle.prix_mois,
                          provinceValue: province?.prix_mois,
                        },
                      ].map((row) => (
                        <tr
                          key={row.label}
                          className={row.strong ? "bg-blue-50/50 font-semibold" : ""}
                        >
                          <td className="px-4 py-3 font-medium text-gray-600">
                            {row.label}
                          </td>
                          <td className="px-4 py-3">
                            {row.urbainValue ? `${row.urbainValue} ${vehicle.devise}` : "—"}
                          </td>
                          <td className="px-4 py-3">
                            {row.provinceValue
                              ? `${row.provinceValue} ${vehicle.devise}`
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card className="rounded-3xl border border-gray-200 p-6 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                  <User className="h-4 w-4" />
                  Prestataire / propriétaire
                </h3>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                    {vehicle.proprietaire_data?.first_name?.[0]}
                    {vehicle.proprietaire_data?.last_name?.[0]}
                  </div>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <p className="truncate font-bold text-gray-900">{ownerName}</p>
                    <p className="truncate text-xs text-gray-500">
                      {vehicle.proprietaire_data?.email || "—"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 text-sm">
                  <span className="text-gray-500">Tél :</span>
                  {ownerPhone !== "—" ? (
                    <a
                      href={`tel:${ownerPhone}`}
                      className="font-mono text-blue-600 hover:underline"
                    >
                      {ownerPhone}
                    </a>
                  ) : (
                    <span className="font-mono text-gray-400">—</span>
                  )}
                </div>
              </Card>

              <Card className="rounded-3xl border border-gray-200 p-6 shadow-sm">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Documents du véhicule
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 p-0">
                  {!document ? (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-5 text-sm text-gray-500">
                      Aucun document trouvé pour ce véhicule.
                    </div>
                  ) : (
                    <>
                      <div className="grid gap-3">
                        {[
                          { label: "Carte grise", url: document.carte_grise },
                          { label: "Visite technique", url: document.visite_technique },
                          { label: "Assurance", url: document.assurance },
                        ].map((docItem) => (
                          <div
                            key={docItem.label}
                            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-3"
                          >
                            <div>
                              <span className="text-sm font-medium">{docItem.label}</span>
                              <p className="text-xs text-gray-400">
                                {docItem.url ? "Disponible" : "Non fourni"}
                              </p>
                            </div>

                            {docItem.url ? (
                              <a
                                href={docItem.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm text-blue-600 hover:underline"
                              >
                                Ouvrir
                              </a>
                            ) : (
                              <span className="text-xs text-gray-400">Non fourni</span>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs">
                        {!docsComplete ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-orange-100 bg-orange-50 px-2.5 py-1 text-orange-700">
                            <FileWarning className="h-3.5 w-3.5" />
                            Documents incomplets
                          </span>
                        ) : null}

                        {docsValidated ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-indigo-700">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Documents validés
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-slate-100 bg-slate-50 px-2.5 py-1 text-slate-700">
                            <Clock3 className="h-3.5 w-3.5" />
                            Documents à contrôler
                          </span>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="mb-2 text-sm font-medium text-gray-700">
                            Motif de rejet des documents
                          </p>
                          <Input
                            value={documentReason}
                            onChange={(e) => setDocumentReason(e.target.value)}
                            placeholder="Expliquer précisément pourquoi les documents sont rejetés"
                            disabled={docsValidated || busy}
                          />
                        </div>

                        {docsValidated ? (
                          <p className="text-xs text-emerald-600">
                            Les documents sont déjà validés. Les actions documentaires sont verrouillées.
                          </p>
                        ) : null}

                        <div className="flex flex-wrap gap-2">
                          <Button
                            onClick={() =>
                              reviewDocumentsMutation.mutate({ action: "approve" })
                            }
                            disabled={!canApproveDocuments}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            {reviewDocumentsMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Validation...
                              </>
                            ) : (
                              "Valider les documents"
                            )}
                          </Button>

                          <Button
                            variant="outline"
                            onClick={() =>
                              reviewDocumentsMutation.mutate({
                                action: "reject",
                                reason: documentReason,
                              })
                            }
                            disabled={!canRejectDocuments}
                          >
                            {reviewDocumentsMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Rejet...
                              </>
                            ) : (
                              "Rejeter les documents"
                            )}
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-3xl border border-gray-200 p-6 shadow-sm">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                    Actions admin
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6 p-0">
                  <div className="rounded-2xl border border-gray-200 bg-gray-50/40 p-4">
                    <p className="mb-2 text-xs font-bold uppercase text-gray-400">
                      Motif de rejet véhicule
                    </p>

                    <Input
                      value={vehicleReason}
                      onChange={(e) => setVehicleReason(e.target.value)}
                      placeholder="Expliquer précisément pourquoi le véhicule est rejeté"
                      disabled={isPublished || busy}
                    />

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        disabled={!canPublishVehicle}
                        onClick={() => reviewVehicleMutation.mutate({ action: "approve" })}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        {reviewVehicleMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Publication...
                          </>
                        ) : (
                          "Publier le véhicule"
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        disabled={!canRejectVehicle}
                        onClick={() =>
                          reviewVehicleMutation.mutate({
                            action: "reject",
                            reason: vehicleReason,
                          })
                        }
                      >
                        {reviewVehicleMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Rejet...
                          </>
                        ) : (
                          "Rejeter le véhicule"
                        )}
                      </Button>
                    </div>

                    {!docsValidated && !isPublished ? (
                      <p className="mt-3 text-xs text-amber-600">
                        Les documents doivent être validés avant publication du véhicule.
                      </p>
                    ) : null}

                    {isPublished ? (
                      <p className="mt-3 text-xs text-emerald-600">
                        Le véhicule est déjà publié. Les actions de décision sont verrouillées.
                      </p>
                    ) : null}
                  </div>

                  <Separator />

                  <div className="grid gap-4">
                    <div className="rounded-2xl border border-gray-200 p-4">
                      <p className="mb-2 text-xs font-bold uppercase text-gray-400">
                        Certification
                      </p>
                      <Button
                        variant={vehicle.est_certifie ? "outline" : "default"}
                        onClick={() => certifyMutation.mutate(!vehicle.est_certifie)}
                        disabled={busy}
                        className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                      >
                        {certifyMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enregistrement...
                          </>
                        ) : vehicle.est_certifie ? (
                          "Retirer certification"
                        ) : (
                          "Certifier"
                        )}
                      </Button>
                    </div>

                    <div className="rounded-2xl border border-gray-200 p-4">
                      <p className="mb-2 text-xs font-bold uppercase text-gray-400">
                        Sponsoring
                      </p>
                      <Button
                        variant={vehicle.est_sponsorise ? "outline" : "default"}
                        onClick={() => sponsorMutation.mutate(!vehicle.est_sponsorise)}
                        disabled={busy}
                        className="bg-amber-600 hover:bg-amber-700 text-white border-amber-600"
                      >
                        {sponsorMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enregistrement...
                          </>
                        ) : vehicle.est_sponsorise ? (
                          "Retirer sponsoring"
                        ) : (
                          "Sponsoriser"
                        )}
                      </Button>
                    </div>

                    <div className="rounded-2xl border border-gray-200 p-4">
                      <p className="mb-2 text-xs font-bold uppercase text-gray-400">
                        Coup de cœur
                      </p>
                      <Button
                        variant={vehicle.est_coup_de_coeur ? "outline" : "default"}
                        onClick={() =>
                          coupDeCoeurMutation.mutate(!vehicle.est_coup_de_coeur)
                        }
                        disabled={busy}
                        className="bg-rose-600 hover:bg-rose-700 text-white border-rose-600"
                      >
                        {coupDeCoeurMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enregistrement...
                          </>
                        ) : vehicle.est_coup_de_coeur ? (
                          "Retirer coup de cœur"
                        ) : (
                          "Mettre en coup de cœur"
                        )}
                      </Button>
                    </div>

                    <div className="rounded-2xl border border-gray-200 p-4">
                      <p className="mb-2 text-xs font-bold uppercase text-gray-400">
                        Caution
                      </p>

                      <Input
                        value={cautionDraft}
                        onChange={(e) => setCautionDraft(e.target.value)}
                        placeholder="Montant caution"
                      />

                      <Button
                        onClick={() => cautionMutation.mutate(cautionDraft)}
                        disabled={busy}
                        className="mt-3 w-full bg-slate-900 hover:bg-slate-800"
                      >
                        {cautionMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enregistrement...
                          </>
                        ) : (
                          "Enregistrer la caution"
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {photos.length === 0 ? (
                <Card className="rounded-3xl border border-gray-200 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-slate-500" />
                      Photos du véhicule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="py-8 text-center text-muted-foreground">
                      <ImageIcon className="mx-auto mb-2 h-12 w-12 opacity-50" />
                      <p>Aucune photo disponible pour ce véhicule</p>
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </AdminPageShell>
  );
}