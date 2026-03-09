// src/pages/Support/ReviewsView.tsx
import { useMemo, useState } from "react";
import { Car, Search, ShieldCheck, Star, Trash2 } from "lucide-react";
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

type ReviewItem = {
  id: string;
  review_type: string;
  rating: number;
  comment: string;
  is_verified: boolean;
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
          className={`w-4 h-4 ${i < v ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
        />
      ))}
    </div>
  );
}

export default function ReviewsView() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // ✅ 1) Avis
  const {
    data: reviewsData,
    isLoading: isLoadingReviews,
    isError: isErrorReviews,
  } = useQuery({
    queryKey: ["support", "reviews", "all"],
    queryFn: () => reviewAPI.getAll(),
  });

  const reviews = (reviewsData ?? []) as ReviewItem[];

  // ✅ 2) Réservations (pour afficher véhicule lié à review.reservation)
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

  // ✅ map reservationId => vehicle_data
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

      const vehicle = r.reservation ? reservationVehicleMap.get(r.reservation) : null;
      const matricule = getVehicleMatricule(vehicle).toLowerCase();
      const title = getVehicleTitle(vehicle).toLowerCase();

      return (
        fullName.includes(q) ||
        comment.includes(q) ||
        matricule.includes(q) ||
        title.includes(q)
      );
    });
  }, [reviews, search, reservationVehicleMap]);

  const avg = useMemo(() => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews]);

  // ✅ Suppression
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-500" />
            Gestion des avis
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Modération des avis + véhicule concerné (matricule + photo).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="rounded-full">
            Total: {reviews.length}
          </Badge>
          <Badge className="rounded-full bg-amber-500 hover:bg-amber-500">
            Note moyenne: {reviews.length ? avg : "—"}
          </Badge>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
        <Search className="w-5 h-5 text-slate-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom, commentaire, matricule..."
          className="border-0 focus-visible:ring-0"
        />
      </div>

      {/* Errors */}
      {(isErrorReviews || isErrorReservations) && !showLoading && (
        <div className="text-sm text-red-600 font-medium">
          Erreur de chargement :{" "}
          {isErrorReviews ? "avis" : ""} {isErrorReservations ? "réservations" : ""}
        </div>
      )}

      {/* List */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900">
            Avis récents
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {showLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-4 border rounded-xl">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-56" />
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-12 w-64 rounded-xl" />
                    </div>
                    <Skeleton className="h-9 w-28 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-sm text-slate-500 font-medium">
              Aucun avis trouvé.
            </div>
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
                  className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-white"
                >
                  {/* Auteur */}
                  <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center font-bold text-slate-600">
                    {r.author_details?.image ? (
                      <img
                        src={r.author_details.image}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      (r.author_details?.first_name?.[0] ?? "U").toUpperCase()
                    )}
                  </div>

                  {/* Contenu */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-slate-900">
                        {r.author_details?.first_name ?? "Utilisateur"}{" "}
                        {r.author_details?.last_name ?? ""}
                      </p>

                      <Stars value={r.rating} />

                      {r.is_verified && (
                        <Badge className="rounded-full bg-emerald-600 hover:bg-emerald-600 flex items-center gap-1">
                          <ShieldCheck className="w-4 h-4" />
                          Vérifié
                        </Badge>
                      )}

                      <span className="text-xs text-slate-400">
                        {formatDateFR(r.created_at)}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      {r.comment}
                    </p>

                    {/* ✅ Véhicule lié (via reservation) */}
                    <div className="mt-3">
                      {r.reservation && vehicle ? (
                        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 w-fit">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center">
                            {photo ? (
                              <img
                                src={photo}
                                alt="vehicule"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Car className="w-5 h-5 text-slate-400" />
                            )}
                          </div>

                          <div className="leading-tight">
                            <p className="text-xs font-semibold text-slate-700">
                              Véhicule concerné
                            </p>
                            <p className="text-sm font-black text-slate-900">
                              {matricule}
                            </p>
                            {title ? (
                              <p className="text-xs text-slate-500">{title}</p>
                            ) : null}
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
                        <p className="text-xs text-slate-500 font-medium">
                          Véhicule introuvable (réservation non trouvée dans /bookings/reservations/)
                        </p>
                      ) : (
                        <p>
                          
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ✅ Supprimer direct (pas de 3 points) */}
                  <div className="ml-auto">
                    <Button
                      onClick={() => setDeleteId(r.id)}
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Confirm delete */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
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
