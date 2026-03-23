"use client";

import React from "react";
import {
  FileText,
  AlertCircle,
  CheckCircle2,
  Shield,
  Upload,
  Clock3,
  XCircle,
  FileWarning,
  Send,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UploadCard from "@/components/vehicleManage/UploadCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useVehicleDocumentsQuery,
  useCreateVehicleDocumentMutation,
  useUpdateVehicleDocumentMutation,
} from "@/useQuery/vehicleDocumentsUseQuery";
import { useSubmitVehicleForReviewMutation } from "@/useQuery/vehiculeUseQuery";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import type { Vehicule } from "@/types/vehiculeType";

interface DocumentsTabProps {
  vehicleId: string;
  vehicle?: Vehicule;
  highlightReview?: boolean;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({
  vehicleId,
  vehicle,
  highlightReview = false,
}) => {
  const { data: documents, isLoading } = useVehicleDocumentsQuery(vehicleId);
  const createMutation = useCreateVehicleDocumentMutation();
  const updateMutation = useUpdateVehicleDocumentMutation();
  const submitForReviewMutation = useSubmitVehicleForReviewMutation();

  const [uploadingType, setUploadingType] = React.useState<string | null>(null);

  const [localDocs, setLocalDocs] = React.useState<{
    carteGrise: File | null;
    visiteTechnique: File | null;
    assurance: File | null;
  }>({
    carteGrise: null,
    visiteTechnique: null,
    assurance: null,
  });

  const existingDoc = documents?.[0];

  const handleUpload = async (
    type: "carte_grise" | "visite_technique" | "assurance"
  ) => {
    const file =
      type === "carte_grise"
        ? localDocs.carteGrise
        : type === "visite_technique"
        ? localDocs.visiteTechnique
        : localDocs.assurance;

    if (!file) return;

    const formData = new FormData();
    formData.append("vehicle", vehicleId);
    formData.append(type, file);

    try {
      setUploadingType(type);

      if (existingDoc) {
        await updateMutation.mutateAsync({ id: existingDoc.id, formData });
      } else {
        await createMutation.mutateAsync(formData);
      }

      toast.success("Document téléversé avec succès");

      setLocalDocs((prev) => ({
        ...prev,
        [type === "carte_grise"
          ? "carteGrise"
          : type === "visite_technique"
          ? "visiteTechnique"
          : "assurance"]: null,
      }));
    } catch (error: any) {
      const detail =
        error?.response?.data?.detail || "Erreur lors du téléversement";
      toast.error(detail);
    } finally {
      setUploadingType(null);
    }
  };

  const handleSubmitForReview = async () => {
    try {
      await submitForReviewMutation.mutateAsync(vehicleId);
      toast.success("Le dossier a bien été envoyé pour validation.");
    } catch (error: any) {
      const detail =
        error?.response?.data?.detail ||
        "Impossible de soumettre le véhicule pour validation.";
      toast.error(detail);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-36 w-full rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-72 rounded-3xl" />
          <Skeleton className="h-72 rounded-3xl" />
          <Skeleton className="h-72 rounded-3xl" />
        </div>
        <Skeleton className="h-56 rounded-3xl" />
      </div>
    );
  }

  const completedDocs = [
    existingDoc?.carte_grise,
    existingDoc?.visite_technique,
    existingDoc?.assurance,
  ].filter(Boolean).length;

  const docsValidated = !!existingDoc?.is_valide;
  const docsRejected = !!existingDoc?.rejection_reason?.trim();
  const docsComplete = existingDoc
    ? !!(
        existingDoc.carte_grise &&
        existingDoc.visite_technique &&
        existingDoc.assurance
      )
    : false;

  const workflowStatus = vehicle?.workflow_status || "DRAFT";
  const vehicleRejected = workflowStatus === "REJECTED";
  const pendingReview = workflowStatus === "PENDING_REVIEW";
  const published = workflowStatus === "PUBLISHED";

  const canSubmitForReview =
    docsComplete &&
    !docsValidated &&
    !pendingReview &&
    !submitForReviewMutation.isPending;

  const submitLabel =
    vehicleRejected || docsRejected
      ? "Renvoyer à validation"
      : "Soumettre à validation";

  const statusConfig = (() => {
    if (published && docsValidated) {
      return {
        tone: "emerald" as const,
        badge: "Publié",
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />,
        title: "Dossier validé et publié",
        description:
          "Les documents sont approuvés et le véhicule est désormais publié.",
        detail:
          "Vous pouvez revenir plus tard pour remplacer un document si nécessaire. Toute modification importante relancera le contrôle.",
      };
    }

    if (pendingReview) {
      return {
        tone: "amber" as const,
        badge: "En attente",
        icon: <Clock3 className="w-5 h-5 text-amber-600 mt-0.5" />,
        title: "Dossier envoyé, validation en cours",
        description:
          "Votre dossier est déjà entre les mains du support ou de l’administrateur.",
        detail:
          "Aucune autre action n’est requise pour le moment. Vous serez averti dès qu’une décision sera prise.",
      };
    }

    if (vehicleRejected || docsRejected) {
      return {
        tone: "red" as const,
        badge: "Correction requise",
        icon: <XCircle className="w-5 h-5 text-red-600 mt-0.5" />,
        title: "Le dossier doit être corrigé",
        description:
          "Certains éléments ont été refusés. Remplacez les documents concernés puis renvoyez le dossier.",
        detail:
          existingDoc?.rejection_reason?.trim() ||
          vehicle?.review_comment?.trim() ||
          "Une correction est nécessaire avant une nouvelle validation.",
      };
    }

    if (docsComplete && !docsValidated) {
      return {
        tone: "indigo" as const,
        badge: "Prêt",
        icon: <Send className="w-5 h-5 text-indigo-600 mt-0.5" />,
        title: "Le dossier est prêt à être envoyé",
        description:
          "Les 3 documents sont présents. Il ne reste qu’à transmettre le dossier au support/admin.",
        detail:
          "Une fois envoyé, le véhicule passera en attente de validation et restera non public jusqu’à décision.",
      };
    }

    return {
      tone: "blue" as const,
      badge: "À compléter",
      icon: <FileWarning className="w-5 h-5 text-blue-600 mt-0.5" />,
      title: "Ajoutez les documents obligatoires",
      description:
        "Pour démarrer la validation, vous devez fournir la carte grise, la visite technique et l’assurance.",
      detail:
        "Vous pourrez envoyer le dossier uniquement quand les 3 documents seront présents.",
    };
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div
        className={`rounded-3xl border p-5 sm:p-6 ${toneClasses[statusConfig.tone].wrapper}`}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            {statusConfig.icon}
            <div className="space-y-2">
              <Badge className={toneClasses[statusConfig.tone].badge}>
                {statusConfig.badge}
              </Badge>
              <div>
                <h3 className={`text-lg font-bold ${toneClasses[statusConfig.tone].title}`}>
                  {statusConfig.title}
                </h3>
                <p className={`mt-1 text-sm ${toneClasses[statusConfig.tone].text}`}>
                  {statusConfig.description}
                </p>
              </div>
              <p className={`text-sm ${toneClasses[statusConfig.tone].detail}`}>
                {statusConfig.detail}
              </p>
            </div>
          </div>

          {docsComplete && !docsValidated && !pendingReview && (
            <Button
              onClick={handleSubmitForReview}
              disabled={!canSubmitForReview}
              className={`rounded-xl px-5 ${toneClasses[statusConfig.tone].button}`}
            >
              {submitForReviewMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Envoi...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {submitLabel}
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-white border border-border/60 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-primary/10 ring-1 ring-primary/15">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Espace documents
                </h2>
                <p className="text-sm text-muted-foreground">
                  Téléversement individuel, puis soumission finale du dossier.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Progression
              </p>
              <p className="mt-1 text-2xl font-black text-slate-900">
                {completedDocs}/3
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Workflow
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                {workflowStatus === "DRAFT"
                  ? "Brouillon"
                  : workflowStatus === "PENDING_REVIEW"
                  ? "En attente"
                  : workflowStatus === "REJECTED"
                  ? "Rejeté"
                  : "Publié"}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Validation docs
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                {docsValidated ? "Validés" : "Non validés"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {[
          {
            type: "carte_grise" as const,
            title: "Carte grise",
            subtitle: "Document d'immatriculation du véhicule",
            localFile: localDocs.carteGrise,
            existingFile: existingDoc?.carte_grise,
            setLocalFile: (f: File | null) =>
              setLocalDocs((d) => ({ ...d, carteGrise: f })),
          },
          {
            type: "visite_technique" as const,
            title: "Visite technique",
            subtitle: "Contrôle technique en cours de validité",
            localFile: localDocs.visiteTechnique,
            existingFile: existingDoc?.visite_technique,
            setLocalFile: (f: File | null) =>
              setLocalDocs((d) => ({ ...d, visiteTechnique: f })),
          },
          {
            type: "assurance" as const,
            title: "Assurance",
            subtitle: "Attestation d'assurance véhicule",
            localFile: localDocs.assurance,
            existingFile: existingDoc?.assurance,
            setLocalFile: (f: File | null) =>
              setLocalDocs((d) => ({ ...d, assurance: f })),
          },
        ].map((doc) => {
          const isUploading = uploadingType === doc.type;
          const hasExistingFile = !!doc.existingFile;

          return (
            <Card
              key={doc.type}
              className="rounded-3xl border border-border/60 shadow-sm overflow-hidden"
            >
              <CardContent className="p-5 space-y-4">
                <UploadCard
                  title={doc.title}
                  subtitle={doc.subtitle}
                  file={doc.localFile}
                  url={doc.existingFile}
                  onPick={doc.setLocalFile}
                  onClear={() => doc.setLocalFile(null)}
                />

                <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{doc.title}</p>
                    <p className="text-xs text-slate-500">
                      {hasExistingFile ? "Document déjà enregistré" : "Aucun document envoyé"}
                    </p>
                  </div>

                  <Badge
                    className={
                      hasExistingFile
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }
                  >
                    {hasExistingFile ? "Téléversé" : "En attente"}
                  </Badge>
                </div>

                <Button
                  className="w-full rounded-2xl h-11"
                  disabled={!doc.localFile || isUploading}
                  onClick={() => handleUpload(doc.type)}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      {hasExistingFile ? "Remplacer le document" : "Envoyer le document"}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-3xl border border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              Bonnes pratiques
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
              <span className="mt-0.5 h-2 w-2 rounded-full bg-amber-500 shrink-0" />
              <p>Envoyez de préférence un PDF ou une image nette, bien cadrée et lisible.</p>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
              <span className="mt-0.5 h-2 w-2 rounded-full bg-amber-500 shrink-0" />
              <p>Vérifiez les dates de validité avant soumission pour éviter un rejet.</p>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
              <span className="mt-0.5 h-2 w-2 rounded-full bg-amber-500 shrink-0" />
              <p>Remplacer un document relance le contrôle. Soumettez ensuite le dossier à nouveau.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="w-5 h-5 text-emerald-500" />
              Processus de validation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            {[
              "1. Téléversez les 3 documents obligatoires.",
              "2. Vérifiez qu’ils sont complets et lisibles.",
              "3. Cliquez sur “Soumettre à validation”.",
              "4. Le support/admin reçoit une notification et examine votre dossier.",
            ].map((step) => (
              <div
                key={step}
                className="flex items-start justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3"
              >
                <p>{step}</p>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentsTab;