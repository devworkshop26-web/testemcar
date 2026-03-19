"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useVehiculeQuery } from "@/useQuery/vehiculeUseQuery";
import { useVehicleDocumentsQuery } from "@/useQuery/vehicleDocumentsUseQuery";
import { vehiculeAPI } from "@/Actions/vehiculeApi";
import { vehicleDocumentsAPI } from "@/Actions/vehicleDocumentsApi";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import type { VehicleDocument } from "@/types/vehicleDocumentsType";

import {
  Eye,
  Calendar,
  MapPin,
  Gauge,
  ShieldCheck,
  User,
  FileText,
  ChevronLeft,
  BadgeCheck,
  CheckCircle2,
  XCircle,
  Heart,
  Clock3,
  FileWarning,
  Loader2,
  Send,
  Info,
} from "lucide-react";

const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-6 p-6">
    <div className="h-96 bg-gray-200 rounded-3xl" />
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      <div className="xl:col-span-8 space-y-6">
        <div className="h-40 bg-gray-200 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-72 bg-gray-200 rounded-3xl" />
          <div className="h-72 bg-gray-200 rounded-3xl" />
        </div>
      </div>
      <div className="xl:col-span-4 space-y-6">
        <div className="h-64 bg-gray-200 rounded-3xl" />
        <div className="h-64 bg-gray-200 rounded-3xl" />
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
  value: React.ReactNode;
  isMonospace?: boolean;
  highlight?: boolean;
}) => (
  <div className="flex justify-between items-center gap-4 py-2.5 border-b border-gray-100 last:border-0 text-sm px-2 rounded-lg hover:bg-gray-50/70 transition-colors">
    <span className="text-gray-500 font-medium">{label}</span>
    <span
      className={`font-semibold text-right text-gray-900 ${
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

export default function VehiculeDetailView() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { id } = useParams();

  const { data: vehicule, isLoading, isError } = useVehiculeQuery(id);
  const { data: documents = [], isLoading: docsLoading } = useVehicleDocumentsQuery(id);

  const document: VehicleDocument | null = useMemo(() => {
    if (!Array.isArray(documents) || documents.length === 0) return null;
    return [...documents].sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )[0];
  }, [documents]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [vehicleReason, setVehicleReason] = useState("");
  const [documentReason, setDocumentReason] = useState("");
  const [cautionDraft, setCautionDraft] = useState("");

  useEffect(() => {
    if (!vehicule) return;
    setCautionDraft(
      vehicule.montant_caution !== undefined && vehicule.montant_caution !== null
        ? String(vehicule.montant_caution)
        : ""
    );
  }, [vehicule]);

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
      console.error("Erreur review véhicule support :", error?.response?.data || error);
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
      return await vehicleDocumentsAPI.review_document(document.id, {
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
      console.error("Erreur review documents support :", error?.response?.data || error);
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
    onError: (error: any) => {
      const detail =
        error?.response?.data?.detail || "Impossible de mettre à jour la certification.";
      toast({
        title: "Erreur",
        description: detail,
        variant: "destructive",
      });
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
    onError: (error: any) => {
      const detail =
        error?.response?.data?.detail || "Impossible de mettre à jour le sponsoring.";
      toast({
        title: "Erreur",
        description: detail,
        variant: "destructive",
      });
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
    onError: (error: any) => {
      const detail =
        error?.response?.data?.detail || "Impossible de mettre à jour le coup de cœur.";
      toast({
        title: "Erreur",
        description: detail,
        variant: "destructive",
      });
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
    onError: (error: any) => {
      const detail =
        error?.response?.data?.detail || "Impossible de mettre à jour la caution.";
      toast({
        title: "Erreur",
        description: detail,
        variant: "destructive",
      });
    },
  });

  const busy =
    reviewVehicleMutation.isPending ||
    reviewDocumentsMutation.isPending ||
    certifyMutation.isPending ||
    sponsorMutation.isPending ||
    coupDeCoeurMutation.isPending ||
    cautionMutation.isPending;

  if (isLoading || docsLoading) return <LoadingSkeleton />;

  if (isError || !vehicule) {
    return (
      <div className="p-10 text-center text-red-500 font-bold">
        ❌ Erreur de chargement du dossier véhicule.
      </div>
    );
  }

  const photosList = Array.isArray(vehicule.photos) ? vehicule.photos : [];
  const pricingGrid = Array.isArray(vehicule.pricing_grid) ? vehicule.pricing_grid : [];
  const availabilities = Array.isArray(vehicule.availabilities) ? vehicule.availabilities : [];
  const equipments = Array.isArray(vehicule.equipements_details)
    ? vehicule.equipements_details
    : [];

  const photos =
    photosList.length > 0
      ? photosList
      : [{ image_url: "/placeholder.jpg", image: "/placeholder.jpg", id: "default" } as any];

  const mainPhoto = photos[selectedImageIndex]?.image_url || photos[selectedImageIndex]?.image;

  const urbain = pricingGrid.find((p) => p.zone_type === "URBAIN");
  const province = pricingGrid.find((p) => p.zone_type === "PROVINCE");

  const driver = vehicule.driver_data;
  const owner = vehicule.proprietaire_data;

  const ownerName =
    owner?.full_name ||
    `${owner?.first_name || ""} ${owner?.last_name || ""}`.trim() ||
    owner?.email ||
    "Prestataire inconnu";

  const ownerPhone =
    (owner as { phone?: string; phone_number?: string } | null)?.phone ||
    (owner as { phone?: string; phone_number?: string } | null)?.phone_number ||
    "—";

  const workflowStatus = vehicule.workflow_status || "DRAFT";
  const isValidated = !!vehicule.valide;
  const isCertified = !!vehicule.est_certifie;
  const isSponsored = !!vehicule.est_sponsorise;
  const isCoupDeCoeur = !!vehicule.est_coup_de_coeur;
  const docsComplete = !!vehicule.documents_complete;
  const docsValidated = !!vehicule.documents_validated || !!document?.is_valide;

  const isPendingReview = workflowStatus === "PENDING_REVIEW";
  const isPublished = workflowStatus === "PUBLISHED";
  const isRejected = workflowStatus === "REJECTED";
  const isDraft = workflowStatus === "DRAFT";

  const canApproveDocuments =
    !!document && docsComplete && !docsValidated && isPendingReview && !busy;

  const canRejectDocuments =
    !!document && !docsValidated && isPendingReview && !!documentReason.trim() && !busy;

  const canApproveVehicle =
    isPendingReview && docsValidated && !isPublished && !busy;

  const canRejectVehicle =
    isPendingReview && !!vehicleReason.trim() && !isPublished && !busy;

  const workflowBadge = (() => {
    if (isPendingReview) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/90 text-white shadow-sm backdrop-blur-md flex items-center gap-1">
          <Clock3 className="w-4 h-4" />
          EN ATTENTE
        </span>
      );
    }

    if (isPublished) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600/90 text-white shadow-sm backdrop-blur-md flex items-center gap-1">
          <CheckCircle2 className="w-4 h-4" />
          PUBLIÉ
        </span>
      );
    }

    if (isRejected) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600/90 text-white shadow-sm backdrop-blur-md flex items-center gap-1">
          <XCircle className="w-4 h-4" />
          REJETÉ
        </span>
      );
    }

    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-700/90 text-white shadow-sm backdrop-blur-md">
        BROUILLON
      </span>
    );
  })();

  const topBanner = (() => {
    if (isPublished) {
      return {
        wrapper: "border-emerald-200 bg-emerald-50",
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />,
        badgeClass: "bg-emerald-100 text-emerald-700",
        badge: "Publié",
        title: "Véhicule déjà publié",
        description:
          "Le véhicule est déjà validé et publié. Les actions de publication et de validation documentaire sont maintenant verrouillées.",
        detail: "Vous pouvez encore gérer la caution, la certification, le sponsoring et le coup de cœur.",
      };
    }

    if (isRejected) {
      return {
        wrapper: "border-red-200 bg-red-50",
        icon: <XCircle className="w-5 h-5 text-red-600 mt-0.5" />,
        badgeClass: "bg-red-100 text-red-700",
        badge: "Rejeté",
        title: "Dossier rejeté",
        description:
          "Le prestataire doit corriger le véhicule ou ses documents puis renvoyer le dossier avant une nouvelle décision.",
        detail:
          vehicule.review_comment?.trim() ||
          document?.rejection_reason?.trim() ||
          "Un motif de correction a été demandé.",
      };
    }

    if (isPendingReview && !document) {
      return {
        wrapper: "border-orange-200 bg-orange-50",
        icon: <FileWarning className="w-5 h-5 text-orange-600 mt-0.5" />,
        badgeClass: "bg-orange-100 text-orange-700",
        badge: "Dossier incomplet",
        title: "Aucun document exploitable",
        description:
          "Le véhicule est passé en file de contrôle, mais aucun dossier documentaire n’a été trouvé pour cette fiche.",
        detail: "Demande au prestataire de soumettre un dossier complet avant validation.",
      };
    }

    if (isPendingReview && !docsComplete) {
      return {
        wrapper: "border-orange-200 bg-orange-50",
        icon: <FileWarning className="w-5 h-5 text-orange-600 mt-0.5" />,
        badgeClass: "bg-orange-100 text-orange-700",
        badge: "Documents incomplets",
        title: "Le dossier documentaire est incomplet",
        description:
          "Le support ne peut pas valider les documents tant que les 3 pièces obligatoires ne sont pas présentes.",
        detail: "Carte grise, visite technique et assurance doivent être fournies.",
      };
    }

    if (isPendingReview && docsComplete && !docsValidated) {
      return {
        wrapper: "border-blue-200 bg-blue-50",
        icon: <Clock3 className="w-5 h-5 text-blue-600 mt-0.5" />,
        badgeClass: "bg-blue-100 text-blue-700",
        badge: "À contrôler",
        title: "Documents à vérifier",
        description:
          "Le dossier est soumis et complet. La prochaine étape consiste à valider ou rejeter les documents.",
        detail: `Dernière soumission : ${formatDate(document?.submitted_at || vehicule.submitted_at)}`,
      };
    }

    if (isPendingReview && docsValidated) {
      return {
        wrapper: "border-indigo-200 bg-indigo-50",
        icon: <Send className="w-5 h-5 text-indigo-600 mt-0.5" />,
        badgeClass: "bg-indigo-100 text-indigo-700",
        badge: "Prêt à publier",
        title: "Documents validés, publication en attente",
        description:
          "Les documents sont conformes. Le support peut maintenant publier ou rejeter le véhicule.",
        detail: "La publication n’est possible qu’après validation documentaire.",
      };
    }

    if (isDraft) {
      return {
        wrapper: "border-slate-200 bg-slate-50",
        icon: <Info className="w-5 h-5 text-slate-600 mt-0.5" />,
        badgeClass: "bg-slate-200 text-slate-700",
        badge: "Brouillon",
        title: "Véhicule non soumis",
        description:
          "Le prestataire n’a pas encore envoyé officiellement ce véhicule en file de validation.",
        detail: "Aucune décision finale ne devrait être prise tant que le dossier n’est pas soumis.",
      };
    }

    return null;
  })();

  return (
    <div className="bg-gray-50/60 min-h-screen pb-20 font-sans text-slate-800 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/support/fleet"
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour à la flotte
        </Link>
        <div className="text-xs text-gray-400 font-mono">
          Dernière synchro : {new Date().toLocaleDateString("fr-FR")}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden relative group">
            <div className="absolute top-4 left-4 z-10 flex gap-2 flex-wrap">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${
                  vehicule.est_disponible
                    ? "bg-green-500/90 text-white"
                    : "bg-red-500/90 text-white"
                }`}
              >
                {vehicule.est_disponible ? "DISPONIBLE" : "INDISPONIBLE"}
              </span>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-gray-800 shadow-sm backdrop-blur-md border">
                {vehicule.categorie_data?.nom || "Non classé"}
              </span>

              {workflowBadge}

              {isCertified ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600/90 text-white shadow-sm backdrop-blur-md flex items-center gap-1">
                  <BadgeCheck className="w-4 h-4" />
                  CERTIFIÉ
                </span>
              ) : null}

              {isSponsored ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/90 text-white shadow-sm backdrop-blur-md">
                  SPONSORISÉ
                </span>
              ) : null}

              {isCoupDeCoeur ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/90 text-white shadow-sm backdrop-blur-md flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5" />
                  COUP DE CŒUR
                </span>
              ) : null}
            </div>

            <div className="relative h-[500px] bg-gray-900 w-full flex items-center justify-center overflow-hidden">
              <img
                src={mainPhoto}
                alt="Vue véhicule"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.jpg";
                }}
              />

              <div className="absolute top-[58%] left-[30%]">
                <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg animate-pulse">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between bg-white">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  {vehicule.marque_data?.nom}{" "}
                  <span className="text-blue-600">{vehicule.modele_data?.label}</span>
                </h1>
                <p className="text-gray-500 mt-1 flex items-center gap-2 flex-wrap">
                  <MapPin className="w-4 h-4" />
                  {vehicule.ville} <span className="text-gray-300">|</span> {vehicule.zone}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-400 uppercase font-bold tracking-wider">
                  Prix Standard
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {urbain?.prix_jour ?? "—"}{" "}
                  <span className="text-base font-normal text-gray-500">
                    {vehicule.devise} / jour
                  </span>
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 flex gap-3 overflow-x-auto scrollbar-hide">
              {photos.map((p: any, idx: number) => (
                <button
                  key={p.id || idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative flex-shrink-0 w-24 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx
                      ? "border-blue-600 ring-2 ring-blue-100"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={p.image_url || p.image}
                    className="w-full h-full object-cover"
                    alt={`Photo ${idx + 1}`}
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.jpg";
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {topBanner && (
            <Card className={`${topBanner.wrapper} border shadow-sm`}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  {topBanner.icon}
                  <div className="space-y-2">
                    <Badge className={topBanner.badgeClass}>{topBanner.badge}</Badge>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{topBanner.title}</h3>
                      <p className="text-sm text-slate-700 mt-1">{topBanner.description}</p>
                      <p className="text-sm text-slate-600 mt-2">{topBanner.detail}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {vehicule.review_comment ? (
            <Card className="border-red-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-red-700">Motif de rejet véhicule</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-line text-red-900">
                  {vehicule.review_comment}
                </p>
              </CardContent>
            </Card>
          ) : null}

          {document?.rejection_reason ? (
            <Card className="border-red-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-red-700">Motif de rejet documents</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-line text-red-900">
                  {document.rejection_reason}
                </p>
              </CardContent>
            </Card>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="rounded-3xl shadow-sm border border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
                  <FileText className="w-5 h-5 text-blue-500" />
                  Fiche technique
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <DataRow
                  label="Plaque Immat."
                  value={vehicule.numero_immatriculation}
                  isMonospace
                  highlight
                />
                <DataRow
                  label="Numéro Série (VIN)"
                  value={vehicule.numero_serie}
                  isMonospace
                />
                <DataRow label="Année" value={vehicule.annee} />
                <DataRow label="Couleur" value={vehicule.couleur} />
                <DataRow
                  label="Portes / Places"
                  value={`${vehicule.nombre_portes} portes / ${vehicule.nombre_places} places`}
                />
                <DataRow
                  label="Kilométrage"
                  value={`${vehicule.kilometrage_actuel_km} km`}
                />
                <DataRow
                  label="Carburant"
                  value={vehicule.type_carburant_data?.nom}
                />
                <DataRow
                  label="Transmission"
                  value={vehicule.transmission_data?.nom}
                />
              </CardContent>
            </Card>

            <Card className="rounded-3xl shadow-sm border border-gray-200 flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  État & options
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-1 mb-6">
                  <DataRow label="Workflow" value={workflowStatus} highlight />
                  <DataRow label="Validé métier" value={isValidated ? "✅ Oui" : "Non"} />
                  <DataRow label="Docs complets" value={docsComplete ? "✅ Oui" : "Non"} />
                  <DataRow label="Docs validés" value={docsValidated ? "✅ Oui" : "Non"} />
                  <DataRow label="Certifié" value={isCertified ? "✅ Oui" : "Non"} />
                  <DataRow label="Sponsorisé" value={isSponsored ? "✅ Oui" : "Non"} />
                  <DataRow label="Coup de cœur" value={isCoupDeCoeur ? "✅ Oui" : "Non"} />
                  <DataRow
                    label="Caution"
                    value={`${vehicule.montant_caution ?? "0.00"} ${vehicule.devise}`}
                    highlight
                  />
                </div>

                <div className="mt-auto">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-2">
                    Équipements inclus
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {equipments.length > 0 ? (
                      equipments.map((eq: any) => (
                        <span
                          key={eq.id}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md border border-gray-200"
                        >
                          {eq.label}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400 italic">
                        Aucun équipement listé
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-100 p-4 flex justify-between items-center">
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800">
                <User className="w-5 h-5 text-purple-500" />
                Chauffeur assigné
              </h3>
              {driver ? (
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    driver.is_available
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {driver.is_available ? "DISPONIBLE" : "OCCUPÉ"}
                </span>
              ) : null}
            </div>

            {driver ? (
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center text-center space-y-2 md:w-1/4 border-r border-gray-100 pr-4">
                    <div className="relative">
                      <img
                        src={driver.profile_photo || "/placeholder.jpg"}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                        alt="Driver"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.jpg";
                        }}
                      />
                      <div className="absolute bottom-0 right-0 bg-blue-500 text-white text-[10px] px-1 rounded font-bold">
                        {driver.experience_years} ANS
                      </div>
                    </div>
                    <h4 className="font-bold text-lg text-gray-900">
                      {driver.first_name} {driver.last_name}
                    </h4>
                    <p className="text-sm text-gray-500">{driver.phone_number}</p>
                  </div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    <div>
                      <span className="text-gray-400 text-xs uppercase">Nationalité</span>
                      <p className="font-medium">{driver.nationality}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs uppercase">Ville / Adresse</span>
                      <p className="font-medium">
                        {driver.city}, {driver.address}
                      </p>
                    </div>

                    <div className="col-span-2 h-px bg-gray-100 my-2" />

                    <div>
                      <span className="text-gray-400 text-xs uppercase">Permis N°</span>
                      <p className="font-mono">{driver.license_number}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs uppercase">Expiration</span>
                      <p className="font-medium text-red-600">
                        {driver.license_expiry_date}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400 italic">
                Aucun chauffeur assigné à ce véhicule.
              </div>
            )}
          </Card>
        </div>

        <div className="xl:col-span-4 space-y-6">
          <Card className="rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-4">
              <h3 className="font-bold flex items-center gap-2">
                <Gauge className="w-5 h-5" />
                Grille tarifaire
              </h3>
            </div>

            <div className="p-0">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3">Période</th>
                    <th className="px-4 py-3 text-blue-600">Urbain</th>
                    <th className="px-4 py-3 text-orange-600">Province</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { label: "Heure", urbainValue: urbain?.prix_heure, provinceValue: province?.prix_heure },
                    { label: "Jour", urbainValue: urbain?.prix_jour, provinceValue: province?.prix_jour, strong: true },
                    { label: "Semaine", urbainValue: urbain?.prix_par_semaine, provinceValue: province?.prix_par_semaine },
                    { label: "Mois", urbainValue: urbain?.prix_mois, provinceValue: province?.prix_mois },
                  ].map((row) => (
                    <tr
                      key={row.label}
                      className={row.strong ? "bg-blue-50/50 font-semibold" : ""}
                    >
                      <td className="px-4 py-3 text-gray-600 font-medium">{row.label}</td>
                      <td className="px-4 py-3">
                        {row.urbainValue ? `${row.urbainValue} ${vehicule.devise}` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {row.provinceValue ? `${row.provinceValue} ${vehicule.devise}` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="rounded-3xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              Calendrier
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {availabilities.length > 0 ? (
                availabilities.map((a: any) => (
                  <div
                    key={a.id}
                    className="flex justify-between items-center p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-700">
                        {formatDate(a.start_date)}
                      </span>
                      <span className="text-xs text-gray-400">
                        au {formatDate(a.end_date)}
                      </span>
                    </div>
                    <span className="text-xs font-bold uppercase bg-white border px-2 py-1 rounded text-gray-600">
                      {a.type}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 italic">
                  Aucune indisponibilité prévue.
                </p>
              )}
            </div>
          </Card>

          {owner ? (
            <Card className="rounded-3xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-xs uppercase text-gray-400 mb-4 tracking-widest">
                Prestataire / propriétaire
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                  {owner.first_name?.[0]}
                  {owner.last_name?.[0]}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="font-bold text-gray-900 truncate">{ownerName}</p>
                  <p className="text-xs text-gray-500 truncate">{owner.email}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm">
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
          ) : null}

          <Card className="rounded-3xl shadow-sm border border-gray-200 p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-gray-800">Documents du véhicule</CardTitle>
            </CardHeader>

            <CardContent className="p-0 space-y-4">
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
                        className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-3 bg-white"
                      >
                        <span className="text-sm font-medium">{docItem.label}</span>
                        {docItem.url ? (
                          <a
                            href={docItem.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 text-sm hover:underline"
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
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-100">
                        <FileWarning className="w-3.5 h-3.5" />
                        Documents incomplets
                      </span>
                    ) : null}

                    {docsValidated ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Documents validés
                      </span>
                    ) : isPendingReview ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        <Clock3 className="w-3.5 h-3.5" />
                        Dossier à contrôler
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-100">
                        <Info className="w-3.5 h-3.5" />
                        Hors file de validation
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Motif de rejet des documents
                      </p>
                      <Input
                        value={documentReason}
                        onChange={(e) => setDocumentReason(e.target.value)}
                        placeholder="Expliquer précisément pourquoi les documents sont rejetés"
                        disabled={docsValidated || isPublished || !isPendingReview || busy}
                      />
                    </div>

                    {!isPendingReview ? (
                      <p className="text-xs text-slate-500">
                        Les actions documentaires sont disponibles uniquement quand le véhicule est en attente de validation.
                      </p>
                    ) : null}

                    {docsValidated ? (
                      <p className="text-xs text-emerald-600">
                        Les documents sont déjà validés. Les boutons de contrôle sont verrouillés.
                      </p>
                    ) : null}

                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={() => reviewDocumentsMutation.mutate({ action: "approve" })}
                        disabled={!canApproveDocuments}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        {reviewDocumentsMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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

          <Card className="rounded-3xl shadow-sm border border-gray-200 p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                Actions support
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0 space-y-6">
              <div className="rounded-2xl border border-gray-200 p-4 bg-gray-50/40">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">
                  Motif de rejet véhicule
                </p>

                <Input
                  value={vehicleReason}
                  onChange={(e) => setVehicleReason(e.target.value)}
                  placeholder="Expliquer précisément pourquoi le véhicule est rejeté"
                  disabled={isPublished || !isPendingReview || busy}
                />

                <div className="flex flex-wrap gap-2 mt-3">
                  <Button
                    disabled={!canApproveVehicle}
                    onClick={() => reviewVehicleMutation.mutate({ action: "approve" })}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {reviewVehicleMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Rejet...
                      </>
                    ) : (
                      "Rejeter le véhicule"
                    )}
                  </Button>
                </div>

                {isPublished ? (
                  <p className="text-xs text-emerald-600 mt-3">
                    Le véhicule est déjà publié. Les actions de validation finale sont verrouillées.
                  </p>
                ) : null}

                {!isPendingReview ? (
                  <p className="text-xs text-slate-500 mt-3">
                    La publication ou le rejet du véhicule ne doit être effectué que lorsqu’il est en attente de validation.
                  </p>
                ) : null}

                {isPendingReview && !docsValidated ? (
                  <p className="text-xs text-amber-600 mt-3">
                    Les documents doivent être validés avant publication du véhicule.
                  </p>
                ) : null}
              </div>

              <Separator />

              <div className="grid gap-4">
                <div className="rounded-2xl border border-gray-200 p-4">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-2">
                    Certification
                  </p>
                  <Button
                    disabled={busy}
                    onClick={() => certifyMutation.mutate(!vehicule.est_certifie)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {certifyMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enregistrement...
                      </>
                    ) : vehicule.est_certifie ? (
                      "Retirer certification"
                    ) : (
                      "Certifier"
                    )}
                  </Button>
                </div>

                <div className="rounded-2xl border border-gray-200 p-4">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-2">
                    Sponsoring
                  </p>
                  <Button
                    disabled={busy}
                    onClick={() => sponsorMutation.mutate(!vehicule.est_sponsorise)}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    {sponsorMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enregistrement...
                      </>
                    ) : vehicule.est_sponsorise ? (
                      "Retirer sponsoring"
                    ) : (
                      "Sponsoriser"
                    )}
                  </Button>
                </div>

                <div className="rounded-2xl border border-gray-200 p-4">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-2">
                    Coup de cœur
                  </p>
                  <Button
                    disabled={busy}
                    onClick={() => coupDeCoeurMutation.mutate(!vehicule.est_coup_de_coeur)}
                    className="bg-rose-600 hover:bg-rose-700"
                  >
                    {coupDeCoeurMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enregistrement...
                      </>
                    ) : vehicule.est_coup_de_coeur ? (
                      "Retirer coup de cœur"
                    ) : (
                      "Mettre en coup de cœur"
                    )}
                  </Button>
                </div>

                <div className="rounded-2xl border border-gray-200 p-4">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-2">Caution</p>

                  <Input
                    value={cautionDraft}
                    onChange={(e) => setCautionDraft(e.target.value)}
                    placeholder="Montant caution"
                  />

                  <Button
                    disabled={busy}
                    onClick={() => cautionMutation.mutate(cautionDraft)}
                    className="w-full mt-3 bg-slate-900 hover:bg-slate-800"
                  >
                    {cautionMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
        </div>
      </div>
    </div>
  );
}