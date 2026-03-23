"use client";

import type React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Award,
  ExternalLink,
  Camera,
  Pencil,
  MapPin,
  Clock3,
  XCircle,
  FileWarning,
  Send,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSubmitVehicleForReviewMutation } from "@/useQuery/vehiculeUseQuery";

interface VehicleHeaderProps {
  vehicle: {
    id: string;
    titre: string;
    numero_immatriculation: string;
    ville: string;
    zone?: string;
    est_disponible: boolean;
    est_certifie: boolean;
    workflow_status: "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "REJECTED";
    review_comment?: string;
    documents_complete?: boolean;
    documents_validated?: boolean;
  };
}

const VehicleHeader: React.FC<VehicleHeaderProps> = ({ vehicle }) => {
  const navigate = useNavigate();
  const submitMutation = useSubmitVehicleForReviewMutation();

  const canSubmit =
    vehicle.workflow_status === "DRAFT" || vehicle.workflow_status === "REJECTED";

  const handleSubmitForReview = async () => {
    try {
      await submitMutation.mutateAsync(vehicle.id);
    } catch (error) {
      console.error(error);
    }
  };

  const workflowBadge = () => {
    switch (vehicle.workflow_status) {
      case "DRAFT":
        return (
          <Badge className="h-6 bg-slate-100 text-slate-700 border border-slate-200 rounded-full px-3 text-xs">
            Brouillon
          </Badge>
        );
      case "PENDING_REVIEW":
        return (
          <Badge className="h-6 bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-3 text-xs flex items-center gap-1">
            <Clock3 className="w-3.5 h-3.5" />
            En attente
          </Badge>
        );
      case "PUBLISHED":
        return (
          <Badge className="h-6 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 text-xs flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            Publié
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="h-6 bg-red-50 text-red-700 border border-red-200 rounded-full px-3 text-xs flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            Rejeté
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <section className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="flex items-center gap-2.5 text-sm text-muted-foreground/80">
        <button
          onClick={() => navigate("/prestataire/fleet")}
          className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="font-medium">Ma flotte</span>
        </button>
        <span className="text-muted-foreground/40">/</span>
        <span className="font-medium text-foreground/90 truncate max-w-[280px]">{vehicle.titre}</span>
      </div>

      {(vehicle.workflow_status === "REJECTED" && vehicle.review_comment) ||
      (vehicle.workflow_status !== "PUBLISHED" && !vehicle.documents_complete) ||
      (vehicle.workflow_status !== "PUBLISHED" && vehicle.documents_complete && !vehicle.documents_validated) ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          {vehicle.workflow_status === "REJECTED" && vehicle.review_comment ? (
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-700">Véhicule rejeté</p>
                <p className="text-sm text-red-700/90 mt-1 whitespace-pre-line">
                  {vehicle.review_comment}
                </p>
              </div>
            </div>
          ) : !vehicle.documents_complete ? (
            <div className="flex items-start gap-3">
              <FileWarning className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-700">Documents incomplets</p>
                <p className="text-sm text-amber-700/90 mt-1">
                  Ajoutez la carte grise, la visite technique et l’assurance avant soumission.
                </p>
              </div>
            </div>
          ) : vehicle.documents_complete && !vehicle.documents_validated ? (
            <div className="flex items-start gap-3">
              <Clock3 className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-700">En attente de validation documentaire</p>
                <p className="text-sm text-amber-700/90 mt-1">
                  Vos documents sont complets. Soumettez le véhicule ou attendez la validation par le support/admin.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <div
        className="
          relative overflow-hidden
          rounded-3xl
          border border-border/40
          bg-gradient-to-br from-background via-background to-muted/20
          shadow-lg shadow-black/5
        "
      >
        <div className="relative px-6 py-5 sm:px-8 flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-1 space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
                    {vehicle.titre}
                  </h1>

                  {workflowBadge()}

                  {vehicle.est_disponible ? (
                    <Badge className="h-6 bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 rounded-full px-3 text-xs flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Disponible
                    </Badge>
                  ) : (
                    <Badge className="h-6 bg-slate-500/10 text-slate-600 border border-slate-500/20 rounded-full px-3 text-xs">
                      Indisponible
                    </Badge>
                  )}

                  {vehicle.est_certifie && (
                    <Badge className="h-6 bg-amber-500/10 text-amber-700 border border-amber-500/20 rounded-full px-3 text-xs flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      Certifié
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="font-mono font-semibold bg-muted/80 px-3 py-1.5 rounded-lg border border-border/60">
                {vehicle.numero_immatriculation || "NON ATTRIBUÉE"}
              </div>

              <span className="text-muted-foreground/30">•</span>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary/70" />
                <span className="font-medium">{vehicle.ville}</span>
              </div>

              {vehicle.zone && (
                <>
                  <span className="text-muted-foreground/30">•</span>
                  <span className="text-muted-foreground">{vehicle.zone}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-row flex-wrap gap-2.5 w-full lg:w-auto">
            {canSubmit && (
              <Button
                onClick={handleSubmitForReview}
                disabled={submitMutation.isPending || !vehicle.documents_complete}
                className="gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200"
              >
                {submitMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Soumettre pour validation
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => navigate(`/prestataire/vehicle/${vehicle.id}/edit`)}
              className="gap-2 rounded-xl"
            >
              <Pencil className="w-4 h-4" />
              Modifier
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate(`/vehicule/${vehicle.id}`)}
              className="gap-2 rounded-xl"
            >
              <ExternalLink className="w-4 h-4" />
              Page publique
            </Button>

            <Button
              onClick={() => navigate(`/prestataire/vehicle/${vehicle.id}/photos`)}
              className="gap-2 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
            >
              <Camera className="w-4 h-4" />
              Gérer les photos
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VehicleHeader;