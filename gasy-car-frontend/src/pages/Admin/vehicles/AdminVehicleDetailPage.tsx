import { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";

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

  const canApproveDocuments =
    !!document && docsComplete && !docsValidated && !busy;

  const canRejectDocuments =
    !!document && !docsValidated && !busy && documentReason.trim().length > 0;

  const canPublishVehicle =
    docsValidated && !isPublished && !busy;

  const canRejectVehicle =
    !isPublished && !busy && vehicleReason.trim().length > 0;

  const workflowBadge = useMemo(() => {
    switch (workflowStatus) {
      case "PENDING_REVIEW":
        return (
          <Badge className="bg-amber-100 text-amber-700 gap-1">
            <Clock3 className="h-3.5 w-3.5" />
            En attente
          </Badge>
        );
      case "PUBLISHED":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Publié
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-100 text-red-700 gap-1">
            <XCircle className="h-3.5 w-3.5" />
            Rejeté
          </Badge>
        );
      default:
        return <Badge className="bg-slate-100 text-slate-700">Brouillon</Badge>;
    }
  }, [workflowStatus]);

  if (isLoading || isDocsLoading) {
    return (
      <AdminPageShell title="Détails du véhicule" description="Chargement...">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminPageShell>
    );
  }

  if (!vehicle) {
    return (
      <AdminPageShell title="Véhicule introuvable" description="Ce véhicule n'existe pas.">
        <Card>
          <CardContent className="py-8 text-center">
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
        tone: "emerald" as const,
        title: "Véhicule déjà publié",
        text: "Le véhicule est visible publiquement. Les actions de validation sont verrouillées.",
      };
    }

    if (isRejected) {
      return {
        tone: "red" as const,
        title: "Véhicule rejeté",
        text: "Le dossier a été refusé. Le prestataire doit corriger puis renvoyer le véhicule.",
      };
    }

    if (isPending) {
      return {
        tone: "amber" as const,
        title: "Dossier en attente",
        text: "Le véhicule a été soumis et attend une décision administrative.",
      };
    }

    if (docsValidated) {
      return {
        tone: "indigo" as const,
        title: "Documents validés, véhicule prêt à publier",
        text: "Le contrôle documentaire est terminé. Vous pouvez maintenant publier ou rejeter le véhicule.",
      };
    }

    return {
      tone: "blue" as const,
      title: "Contrôle documentaire requis",
      text: "Les documents doivent être examinés avant toute publication du véhicule.",
    };
  })();

  const bannerClasses = {
    blue: "border-blue-200 bg-blue-50 text-blue-900",
    amber: "border-amber-200 bg-amber-50 text-amber-900",
    red: "border-red-200 bg-red-50 text-red-900",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-900",
    indigo: "border-indigo-200 bg-indigo-50 text-indigo-900",
  };

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
      <div className="space-y-6">
        <Card className={`border ${bannerClasses[adminBanner.tone]}`}>
          <CardContent className="p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {workflowBadge}
                  {vehicle.est_certifie ? (
                    <Badge className="bg-blue-100 text-blue-700 gap-1">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Certifié
                    </Badge>
                  ) : null}
                  {vehicle.est_sponsorise ? (
                    <Badge className="bg-amber-100 text-amber-700">Sponsorisé</Badge>
                  ) : null}
                  {vehicle.est_coup_de_coeur ? (
                    <Badge className="bg-rose-100 text-rose-700 gap-1">
                      <Heart className="h-3.5 w-3.5" />
                      Coup de cœur
                    </Badge>
                  ) : null}
                  {!docsComplete ? (
                    <Badge className="bg-orange-100 text-orange-700 gap-1">
                      <FileWarning className="h-3.5 w-3.5" />
                      Docs incomplets
                    </Badge>
                  ) : docsValidated ? (
                    <Badge className="bg-indigo-100 text-indigo-700">Docs validés</Badge>
                  ) : (
                    <Badge className="bg-slate-100 text-slate-700">Docs à contrôler</Badge>
                  )}
                </div>

                <h3 className="text-lg font-bold">{adminBanner.title}</h3>
                <p className="text-sm opacity-90 mt-1">{adminBanner.text}</p>
              </div>

              <div className="grid grid-cols-3 gap-3 min-w-[280px]">
                <div className="rounded-2xl border border-white/40 bg-white/70 px-4 py-3 text-center">
                  <p className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
                    Documents
                  </p>
                  <p className="mt-1 text-sm font-bold">
                    {docsComplete ? "Complets" : "Incomplets"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/40 bg-white/70 px-4 py-3 text-center">
                  <p className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
                    Validation docs
                  </p>
                  <p className="mt-1 text-sm font-bold">
                    {docsValidated ? "Validés" : "En attente"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/40 bg-white/70 px-4 py-3 text-center">
                  <p className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
                    Workflow
                  </p>
                  <p className="mt-1 text-sm font-bold">
                    {workflowStatus === "DRAFT"
                      ? "Brouillon"
                      : workflowStatus === "PENDING_REVIEW"
                      ? "En attente"
                      : workflowStatus === "REJECTED"
                      ? "Rejeté"
                      : "Publié"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {vehicle.review_comment && (
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-700">Motif de rejet véhicule</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-line">{vehicle.review_comment}</p>
            </CardContent>
          </Card>
        )}

        {document?.rejection_reason && (
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-700">Motif de rejet documents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-line">{document.rejection_reason}</p>
            </CardContent>
          </Card>
        )}

        {photos.length > 0 ? (
          <Card className="rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Photos du véhicule ({photos.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((photo, index) => (
                  <div
                    key={photo.id || index}
                    className="relative aspect-video rounded-2xl overflow-hidden border border-gray-200"
                  >
                    <img
                      src={photo.image || photo.image_url || "/placeholder.jpg"}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f0f0f0' width='100' height='100'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImage%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    {photo.is_primary && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-blue-600">Principale</Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Photos du véhicule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Aucune photo disponible pour ce véhicule</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Informations principales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Titre</p>
                  <p className="font-medium">{vehicle.titre}</p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Marque</p>
                    <p className="font-medium">{vehicle.marque_data?.nom || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Modèle</p>
                    <p className="font-medium">{vehicle.modele_data?.label || "N/A"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Année</p>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {vehicle.annee}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Immatriculation</p>
                    <p className="font-medium">{vehicle.numero_immatriculation}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Numéro de série</p>
                  <p className="font-medium">{vehicle.numero_serie}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Propriétaire</p>
                  <p className="font-medium flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {vehicle.proprietaire_data?.full_name ||
                      `${vehicle.proprietaire_data?.first_name || ""} ${vehicle.proprietaire_data?.last_name || ""}`.trim() ||
                      vehicle.proprietaire_data?.email ||
                      "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Localisation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Adresse</p>
                  <p className="font-medium">{vehicle.adresse_localisation}</p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Ville</p>
                    <p className="font-medium">{vehicle.ville}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Zone</p>
                    <p className="font-medium">{vehicle.zone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Tarification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Prix / Jour</p>
                    <p className="font-medium text-lg">
                      {vehicle.prix_jour} {vehicle.devise}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Prix / Heure</p>
                    <p className="font-medium">
                      {vehicle.prix_heure || "N/A"} {vehicle.devise}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Prix / Semaine</p>
                    <p className="font-medium">
                      {vehicle.prix_par_semaine || "N/A"} {vehicle.devise}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Prix / Mois</p>
                    <p className="font-medium">
                      {vehicle.prix_mois || "N/A"} {vehicle.devise}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Caution</p>
                  <Input
                    value={cautionDraft}
                    onChange={(e) => setCautionDraft(e.target.value)}
                    placeholder="Montant caution"
                  />
                  <Button
                    onClick={() => cautionMutation.mutate(cautionDraft)}
                    disabled={busy}
                    className="rounded-xl"
                  >
                    Enregistrer la caution
                  </Button>
                </div>

                {urbain || province ? (
                  <>
                    <Separator />
                    <div className="space-y-2 text-sm">
                      <p className="font-medium">Tarifs grille</p>
                      <p>
                        Urbain : {urbain?.prix_jour || "—"} {vehicle.devise}
                      </p>
                      <p>
                        Province : {province?.prix_jour || "—"} {vehicle.devise}
                      </p>
                    </div>
                  </>
                ) : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Caractéristiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Catégorie</p>
                    <p className="font-medium">{vehicle.categorie_data?.nom || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Transmission</p>
                    <p className="font-medium">{vehicle.transmission_data?.nom || "N/A"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Carburant</p>
                    <p className="font-medium">{vehicle.type_carburant_data?.nom || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Couleur</p>
                    <p className="font-medium">{vehicle.couleur}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Places</p>
                    <p className="font-medium">{vehicle.nombre_places}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Portes</p>
                    <p className="font-medium">{vehicle.nombre_portes}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Coffre (L)</p>
                    <p className="font-medium">{vehicle.volume_coffre_litres || "N/A"}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground">Kilométrage</p>
                  <p className="font-medium">
                    {vehicle.kilometrage_actuel_km?.toLocaleString()} km
                  </p>
                </div>

                {equipments.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Équipements</p>
                      <div className="flex flex-wrap gap-2">
                        {equipments.map((equipment) => (
                          <Badge key={equipment.id} variant="outline">
                            {equipment.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documents du véhicule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!document ? (
                  <p className="text-muted-foreground">Aucun document trouvé pour ce véhicule.</p>
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
                          className="border rounded-2xl p-4 flex items-center justify-between gap-3"
                        >
                          <div>
                            <p className="font-medium">{docItem.label}</p>
                            <p className="text-xs text-muted-foreground">
                              {docItem.url ? "Disponible" : "Non fourni"}
                            </p>
                          </div>

                          {docItem.url ? (
                            <a
                              href={docItem.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline text-sm"
                            >
                              Ouvrir
                            </a>
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge className={docsComplete ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}>
                        {docsComplete ? "Documents complets" : "Documents incomplets"}
                      </Badge>
                      <Badge className={docsValidated ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-700"}>
                        {docsValidated ? "Documents validés" : "Non validés"}
                      </Badge>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <p className="text-sm font-medium text-slate-900">
                        Action documentaire
                      </p>

                      <Input
                        value={documentReason}
                        onChange={(e) => setDocumentReason(e.target.value)}
                        placeholder="Motif de rejet des documents"
                        disabled={docsValidated || busy}
                      />

                      <div className="grid grid-cols-1 gap-2">
                        <Button
                          onClick={() => reviewDocumentsMutation.mutate({ action: "approve" })}
                          disabled={!canApproveDocuments}
                          className="bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          {docsValidated ? "Documents déjà validés" : "Valider les documents"}
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
                          className="rounded-xl"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Rejeter les documents
                        </Button>
                      </div>

                      {docsValidated && (
                        <p className="text-xs text-emerald-700">
                          Les documents sont déjà validés. Les actions documentaires sont verrouillées.
                        </p>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  Décision véhicule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                  <p className="text-sm font-medium text-slate-900">
                    Publication métier
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    La publication n’est possible qu’après validation des documents.
                  </p>
                </div>

                <Input
                  value={vehicleReason}
                  onChange={(e) => setVehicleReason(e.target.value)}
                  placeholder="Motif de rejet du véhicule"
                  disabled={isPublished || busy}
                />

                <div className="grid grid-cols-1 gap-2">
                  <Button
                    onClick={() => reviewVehicleMutation.mutate({ action: "approve" })}
                    disabled={!canPublishVehicle}
                    className="bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isPublished ? "Véhicule déjà publié" : "Publier le véhicule"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() =>
                      reviewVehicleMutation.mutate({
                        action: "reject",
                        reason: vehicleReason,
                      })
                    }
                    disabled={!canRejectVehicle}
                    className="rounded-xl"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Rejeter le véhicule
                  </Button>
                </div>

                {!docsValidated && !isPublished && (
                  <p className="text-xs text-amber-600">
                    Les documents doivent être validés avant publication.
                  </p>
                )}

                {isPublished && (
                  <p className="text-xs text-emerald-700">
                    Le véhicule est déjà publié. Les actions de décision sont verrouillées.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle>Options éditoriales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant={vehicle.est_certifie ? "outline" : "default"}
                  onClick={() => certifyMutation.mutate(!vehicle.est_certifie)}
                  disabled={busy}
                  className="w-full rounded-xl"
                >
                  {vehicle.est_certifie ? "Retirer certification" : "Certifier"}
                </Button>

                <Button
                  variant={vehicle.est_sponsorise ? "outline" : "default"}
                  onClick={() => sponsorMutation.mutate(!vehicle.est_sponsorise)}
                  disabled={busy}
                  className="w-full rounded-xl"
                >
                  {vehicle.est_sponsorise ? "Retirer sponsoring" : "Sponsoriser"}
                </Button>

                <Button
                  variant={vehicle.est_coup_de_coeur ? "outline" : "default"}
                  onClick={() => coupDeCoeurMutation.mutate(!vehicle.est_coup_de_coeur)}
                  disabled={busy}
                  className="w-full rounded-xl"
                >
                  {vehicle.est_coup_de_coeur
                    ? "Retirer coup de cœur"
                    : "Mettre en coup de cœur"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {(vehicle.description || vehicle.conditions_particulieres) && (
          <div className="grid gap-6 md:grid-cols-2">
            {vehicle.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-line">{vehicle.description}</p>
                </CardContent>
              </Card>
            )}

            {vehicle.conditions_particulieres && (
              <Card>
                <CardHeader>
                  <CardTitle>Conditions particulières</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-line">
                    {vehicle.conditions_particulieres}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </AdminPageShell>
  );
}