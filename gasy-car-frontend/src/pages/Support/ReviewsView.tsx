// src/pages/Support/ReviewsView.tsx
import { useMemo, useState } from "react";
import { Car, CheckCircle2, Clock3, Search, ShieldCheck, Star, Trash2, XCircle } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { reviewAPI } from "@/Actions/reveiewApi";
import { bookingAPI, type BookingReservation } from "@/Actions/bookingApi";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ModerationStatus = "PENDING" | "APPROVED" | "REJECTED";

type ReviewItem = {
  id: string;
  review_type: string;
  rating: number;
  comment: string;
  is_verified: boolean;
  moderation_status: ModerationStatus;
  created_at: string;
  reservation?: string | null;
  author_details?: {
    first_name?: string;
    last_name?: string;
    image?: string | null;
  };
};

function formatDateFR(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function getVehiclePhoto(vehicle: any): string | null {
  if (!vehicle) return null;
  if (vehicle.photo_principale) return vehicle.photo_principale;

  const photos = Array.isArray(vehicle.photos) ? vehicle.photos : [];
  const primary = photos.find((p) => p?.is_primary);
  return (
    primary?.image_url ||
    primary?.image ||
    photos[0]?.image_url ||
    photos[0]?.image ||
    null
  );
}

function getVehicleMatricule(vehicle: any): string {
  if (!vehicle) return "—";
  return (
    vehicle.numero_immatriculation ||
    vehicle.immatriculation ||
    vehicle.plate_number ||
    vehicle.registration_number ||
    "—"
  );
}

function getVehicleTitle(vehicle: any): string {
  if (!vehicle) return "";
  const marque = vehicle.marque_data?.nom;
  const modele = vehicle.modele_data?.label;
  const titre = vehicle.titre;
  return [marque, modele].filter(Boolean).join(" ") || titre || "";
}

function Stars({ value }: { value: number }) {
  const v = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < v ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
        />
      ))}
    </div>
  );
}

function ModerationBadge({ status }: { status: ModerationStatus }) {
  if (status === "APPROVED") {
    return (
      <Badge className="rounded-full bg-emerald-600 hover:bg-emerald-600">
        <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
        Publié
      </Badge>
    );
  }

  if (status === "REJECTED") {
    return (
      <Badge className="rounded-full bg-rose-600 hover:bg-rose-600">
        <XCircle className="mr-1 h-3.5 w-3.5" />
        Rejeté
      </Badge>
    );
  }

  return (
    <Badge className="rounded-full bg-amber-500 hover:bg-amber-500">
      <Clock3 className="mr-1 h-3.5 w-3.5" />
      En attente
    </Badge>
  );
}

export default function ReviewsView() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    data: reviewsData,
    isLoading: isLoadingReviews,
    isError: isErrorReviews,
  } = useQuery({
    queryKey: ["support", "reviews", "all"],
    queryFn: () => reviewAPI.getAll(),
  });

  const reviews = (reviewsData ?? []) as ReviewItem[];

  const {
    data: reservationsData,
    isLoading: isLoadingReservations,
    isError: isErrorReservations,
  } = useQuery({
    queryKey: ["support", "bookings", "reservations", "all"],
    queryFn: () => bookingAPI.getAllReservations(),
    staleTime: 60_000,
  });

  const reservations = (reservationsData ?? []) as BookingReservation[];

  const reservationVehicleMap = useMemo(() => {
    const map = new Map<string, any>();
    for (const r of reservations) {
      if (r?.id && r?.vehicle_data) map.set(r.id, r.vehicle_data);
    }
    return map;
  }, [reservations]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return reviews;

    return reviews.filter((r) => {
      const fullName = `${r.author_details?.first_name ?? ""} ${r.author_details?.last_name ?? ""}`
        .toLowerCase()
        .trim();
      const comment = (r.comment ?? "").toLowerCase();
      const moderationLabel = r.moderation_status.toLowerCase();

      const vehicle = r.reservation ? reservationVehicleMap.get(r.reservation) : null;
      const matricule = getVehicleMatricule(vehicle).toLowerCase();
      const title = getVehicleTitle(vehicle).toLowerCase();

      return (
        fullName.includes(q) ||
        comment.includes(q) ||
        matricule.includes(q) ||
        title.includes(q) ||
        moderationLabel.includes(q)
      );
    });
  }, [reviews, search, reservationVehicleMap]);

  const avg = useMemo(() => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews]);

  const pendingCount = useMemo(
    () => reviews.filter((review) => review.moderation_status === "PENDING").length,
    [reviews],
  );

  const { mutate: moderateReview, isPending: isModerating } = useMutation({
    mutationFn: ({ id, moderation_status }: { id: string; moderation_status: ModerationStatus }) =>
      reviewAPI.moderate(id, { moderation_status }),
    onSuccess: (_, variables) => {
      toast({
        title:
          variables.moderation_status === "APPROVED"
            ? "Avis publié"
            : variables.moderation_status === "REJECTED"
              ? "Avis rejeté"
              : "Avis remis en attente",
        description: "Le statut de modération de l’avis a été mis à jour.",
      });
      queryClient.invalidateQueries({ queryKey: ["support", "reviews", "all"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de modération.",
      });
    },
  });

  const { mutate: deleteReview, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => reviewAPI.delete(id),
    onSuccess: () => {
      toast({ title: "Supprimé", description: "L'avis a été supprimé." });
      setDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ["support", "reviews", "all"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (err: any) => {
      setDeleteId(null);
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          err?.response?.status === 403
            ? "Accès refusé : le rôle SUPPORT n'a pas la permission de supprimer."
            : "Impossible de supprimer l'avis.",
      });
    },
  });

  const confirmDelete = () => {
    if (!deleteId) return;
    deleteReview(deleteId);
  };

  const showLoading = isLoadingReviews || isLoadingReservations;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-black text-slate-900">
            <Star className="h-6 w-6 text-amber-500" />
            Gestion des avis
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Le support valide ou rejette chaque avis avant sa publication sur la plateforme.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="rounded-full">
            Total: {reviews.length}
          </Badge>
          <Badge className="rounded-full bg-amber-500 hover:bg-amber-500">
            En attente: {pendingCount}
          </Badge>
          <Badge className="rounded-full bg-slate-900 hover:bg-slate-900">
            Note moyenne: {reviews.length ? avg : "—"}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <Search className="h-5 w-5 text-slate-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom, commentaire, matricule ou statut..."
          className="border-0 focus-visible:ring-0"
        />
      </div>

      {(isErrorReviews || isErrorReservations) && !showLoading && (
        <div className="text-sm font-medium text-red-600">
          Erreur de chargement : {isErrorReviews ? "avis" : ""} {isErrorReservations ? "réservations" : ""}
        </div>
      )}

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900">Avis récents</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {showLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border p-4">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-56" />
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-12 w-64 rounded-xl" />
                    </div>
                    <Skeleton className="h-9 w-48 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-sm font-medium text-slate-500">Aucun avis trouvé.</div>
          ) : (
            filtered.slice(0, 30).map((r) => {
              const vehicle = r.reservation ? reservationVehicleMap.get(r.reservation) : null;
              const photo = getVehiclePhoto(vehicle);
              const matricule = getVehicleMatricule(vehicle);
              const title = getVehicleTitle(vehicle);
              const vehicleId = vehicle?.id ? String(vehicle.id) : null;

              return (
                <div
                  key={r.id}
                  className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 xl:flex-row"
                >
                  <div className="flex flex-1 items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-slate-100 font-bold text-slate-600">
                      {r.author_details?.image ? (
                        <img src={r.author_details.image} alt="avatar" className="h-full w-full object-cover" />
                      ) : (
                        (r.author_details?.first_name?.[0] ?? "U").toUpperCase()
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold text-slate-900">
                          {r.author_details?.first_name ?? "Utilisateur"} {r.author_details?.last_name ?? ""}
                        </p>

                        <Stars value={r.rating} />
                        <ModerationBadge status={r.moderation_status} />

                        {r.is_verified && (
                          <Badge className="rounded-full bg-emerald-600 hover:bg-emerald-600">
                            <ShieldCheck className="mr-1 h-4 w-4" />
                            Réservation vérifiée
                          </Badge>
                        )}

                        <span className="text-xs text-slate-400">{formatDateFR(r.created_at)}</span>
                      </div>

                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{r.comment}</p>

                      <div className="mt-3">
                        {r.reservation && vehicle ? (
                          <div className="flex w-fit items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                              {photo ? (
                                <img src={photo} alt="vehicule" className="h-full w-full object-cover" />
                              ) : (
                                <Car className="h-5 w-5 text-slate-400" />
                              )}
                            </div>

                            <div className="leading-tight">
                              <p className="text-xs font-semibold text-slate-700">Véhicule concerné</p>
                              <p className="text-sm font-black text-slate-900">{matricule}</p>
                              {title ? <p className="text-xs text-slate-500">{title}</p> : null}
                            </div>

                            {vehicleId ? (
                              <Link
                                to={`/support/fleet/vehicule/${vehicleId}`}
                                className="ml-2 text-xs font-semibold text-blue-700 hover:underline"
                              >
                                Voir
                              </Link>
                            ) : null}
                          </div>
                        ) : r.reservation && !vehicle ? (
                          <p className="text-xs font-medium text-slate-500">
                            Véhicule introuvable (réservation non trouvée dans /bookings/reservations/)
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-start justify-end gap-2 xl:w-[320px] xl:flex-col xl:items-end">
                    <Button
                      onClick={() => moderateReview({ id: r.id, moderation_status: "APPROVED" })}
                      disabled={isModerating || r.moderation_status === "APPROVED"}
                      className="rounded-lg bg-emerald-600 hover:bg-emerald-700"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Publier
                    </Button>
                    <Button
                      onClick={() => moderateReview({ id: r.id, moderation_status: "REJECTED" })}
                      disabled={isModerating || r.moderation_status === "REJECTED"}
                      variant="outline"
                      className="rounded-lg border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Rejeter
                    </Button>
                    <Button
                      onClick={() => moderateReview({ id: r.id, moderation_status: "PENDING" })}
                      disabled={isModerating || r.moderation_status === "PENDING"}
                      variant="outline"
                      className="rounded-lg border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
                    >
                      <Clock3 className="mr-2 h-4 w-4" />
                      Remettre en attente
                    </Button>
                    <Button
                      onClick={() => setDeleteId(r.id)}
                      variant="outline"
                      className="rounded-lg border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet avis ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est définitive. L’avis sera supprimé de la plateforme.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
