import React, { useMemo, useState, useEffect } from "react";
import {
  Star,
  MessageCircle,
  ShieldCheck,
  Filter,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

import ReviewCard from "@/components/vehicule/ReviewCard";
import ReviewForm from "@/components/vehicule/ReviewForm";
import { useToast } from "@/hooks/use-toast";

import { useCurentuser } from "@/useQuery/authUseQuery";
import {
  useOwnerReviews,
  useCreateReview,
  useReviewEligibility,
} from "@/hooks/useReviews";
import { Review } from "@/types/reveiewType";

const ReviewsSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-6">
        <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    ))}
  </div>
);

type SortOption = "newest" | "highest" | "lowest";

const ReviewsSection: React.FC<{
  vehicleId?: string | number;
  ownerId?: string | number;
  ownerName?: string;
}> = ({ vehicleId, ownerId }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useCurentuser();

  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterStar, setFilterStar] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(5);

  const { data: reviewsData, isLoading: isLoadingReviews } = useOwnerReviews(
    ownerId ? String(ownerId) : undefined,
  );

  const { data: pendingReservations, isLoading: isLoadingEligibility } =
    useReviewEligibility(vehicleId ? String(vehicleId) : undefined);

  const { mutate: submitReview, isPending: isSubmittingReview } =
    useCreateReview();

  const { stats, processedReviews } = useMemo(() => {
    const allReviews = Array.isArray(reviewsData) ? (reviewsData as Review[]) : [];

    const total = allReviews.length;
    const sum = allReviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
    const avg = total > 0 ? sum / total : 0;
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    allReviews.forEach((r) => {
      const star = Math.max(1, Math.min(5, Math.round(Number(r.rating) || 0)));
      counts[star] = (counts[star] || 0) + 1;
    });

    let displayReviews = [...allReviews];
    if (filterStar) {
      displayReviews = displayReviews.filter(
        (r) => Math.round(Number(r.rating)) === filterStar,
      );
    }

    displayReviews.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      const rateA = Number(a.rating);
      const rateB = Number(b.rating);

      switch (sortBy) {
        case "highest":
          return rateB - rateA;
        case "lowest":
          return rateA - rateB;
        case "newest":
        default:
          return dateB - dateA;
      }
    });

    return {
      stats: { total, avg: Math.round(avg * 10) / 10, counts },
      processedReviews: displayReviews,
    };
  }, [reviewsData, sortBy, filterStar]);

  useEffect(() => {
    setVisibleCount(5);
  }, [filterStar, sortBy]);

  const handleReviewSubmit = (ratingValue: number, comment: string) => {
    const reservation = pendingReservations?.[0];
    if (!user?.id || !ownerId || !reservation?.id) return;

    submitReview(
      {
        author: user.id,
        target: String(ownerId),
        review_type: "CLIENT_TO_OWNER",
        rating: ratingValue,
        comment,
        reservation: reservation.id,
      },
      {
        onSuccess: () => {
          toast({
            title: "Avis envoyé",
            description: "Votre avis a bien été transmis. Il sera publié après vérification par le support.",
            className: "bg-slate-900 text-white",
          });
        },
      },
    );
  };

  const isEligible =
    Array.isArray(pendingReservations) && pendingReservations.length > 0;

  return (
    <div className="mt-12 rounded-[2rem] border border-slate-200 bg-[#f8fbff] p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="rounded-[1.75rem] bg-[#111a2f] px-6 py-8 text-white shadow-[0_20px_40px_rgba(17,26,47,0.25)]">
          <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Note globale
          </p>
          <div className="mb-4 flex items-end justify-center gap-1 text-center">
            <span className="text-6xl font-black leading-none">{stats.avg}</span>
            <span className="mb-1 text-xl font-medium text-slate-400">/5</span>
          </div>
          <div className="mb-5 flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`h-5 w-5 ${
                  s <= Math.round(stats.avg)
                    ? "fill-[#ffb547] text-[#ffb547]"
                    : "text-slate-600"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-center">
            <Badge className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-[11px] font-semibold text-slate-200 hover:bg-slate-800">
              {stats.total} avis certifiés
            </Badge>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white px-5 py-6 shadow-sm sm:px-6">
          <h3 className="mb-5 text-lg font-extrabold text-slate-900">
            Analyse des retours
          </h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((star) => {
              const pct = stats.total > 0 ? (stats.counts[star] / stats.total) * 100 : 0;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFilterStar(filterStar === star ? null : star)}
                  className={`flex w-full items-center gap-4 transition ${
                    filterStar && filterStar !== star ? "opacity-40" : "opacity-100"
                  }`}
                >
                  <span className="w-3 text-sm font-bold text-slate-700">{star}</span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-300 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-sm font-bold text-slate-800">
                    {Math.round(pct)}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
            <MessageCircle className="h-4 w-4 text-slate-700" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">
            {filterStar ? `Avis ${filterStar} étoiles` : "Tous les avis"}
          </h3>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="rounded-full border-slate-200 bg-white px-4 font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <Filter className="mr-2 h-4 w-4" />
              Tri : {sortBy === "newest" ? "Récent" : sortBy === "highest" ? "Positif" : "Négatif"}
              <ChevronDown className="ml-2 h-3 w-3 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-2xl border-slate-200">
            <DropdownMenuItem onClick={() => setSortBy("newest")}>Le plus récent</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("highest")}>Meilleures notes</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("lowest")}>Notes les plus basses</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-5 space-y-4">
        {isLoadingReviews ? (
          <ReviewsSkeleton />
        ) : processedReviews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {processedReviews.slice(0, visibleCount).map((review) => (
                <ReviewCard
                  key={review.id}
                  firstName={review.author_details?.first_name || "Client"}
                  lastName={review.author_details?.last_name || ""}
                  photoUrl={review.author_details?.image}
                  rating={review.rating}
                  date={format(new Date(review.created_at), "dd MMM yyyy", { locale: fr })}
                  comment={review.comment}
                  isVerified={true}
                />
              ))}
            </div>

            {processedReviews.length > visibleCount && (
              <div className="mt-6 flex justify-center">
                <Button
                  variant="ghost"
                  onClick={() => setVisibleCount((v) => v + 4)}
                  className="rounded-full border border-slate-300 px-8 font-bold text-slate-900 hover:bg-slate-100"
                >
                  Charger plus de témoignages
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white/70 px-6 py-14 text-center">
            <p className="text-sm font-semibold italic text-slate-500">
              Aucun avis ne correspond à vos filtres.
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 rounded-[1.75rem] bg-[#111a2f] p-6 text-white shadow-[0_20px_40px_rgba(17,26,47,0.22)] sm:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-3xl font-black tracking-tight">
              Votre expérience compte
            </h3>
            <p className="mt-2 text-sm font-medium text-slate-300">
              Construisez la confiance au sein de notre communauté.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Chaque avis envoyé est d’abord vérifié par le support avant d’être publié sur la plateforme.
            </p>
          </div>
          {isEligible && (
            <Badge className="self-start rounded-full border border-emerald-400/20 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/15">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Éligible à la notation
            </Badge>
          )}
        </div>

        {!user ? (
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
            <p className="mb-6 text-slate-300">
              Veuillez vous identifier pour publier votre avis sur ce propriétaire.
            </p>
            <Button
              onClick={() => navigate("/login")}
              className="rounded-full bg-white px-10 font-bold text-slate-900 hover:bg-slate-100"
            >
              Se connecter
            </Button>
          </div>
        ) : !isEligible ? (
          <div className="flex items-start gap-4 rounded-[1.5rem] border border-amber-400/20 bg-amber-500/10 p-5">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <p className="text-sm leading-relaxed text-amber-100/85">
              La notation est réservée aux utilisateurs ayant complété une réservation avec ce véhicule.
              Ceci garantit l’intégrité de notre système de confiance.
            </p>
          </div>
        ) : (
          <div className="rounded-[1.5rem] bg-white p-3 sm:p-4">
            <ReviewForm
              onSubmit={handleReviewSubmit}
              isSubmitting={isSubmittingReview}
            />
          </div>
        )}

        {isLoadingEligibility && (
          <p className="mt-4 text-xs font-medium text-slate-400">
            Vérification de votre éligibilité en cours…
          </p>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;
