import React, { useMemo, useState, useEffect } from "react";
import { 
  Star, MessageCircle, ShieldCheck, Filter, ChevronDown, 
  AlertCircle 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { useOwnerReviews, useCreateReview, useReviewEligibility } from "@/hooks/useReviews";
import { Review } from "@/types/reveiewType";

// --- UTILITAIRES ---
function getRatingLabel(rating: number) {
  if (rating >= 4.5) return "Excellent";
  if (rating >= 4) return "Très bien";
  if (rating >= 3) return "Moyen";
  return "Décevant";
}

const ReviewsSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex gap-4 p-6 bg-white rounded-2xl border border-gray-100">
        <Skeleton className="w-12 h-12 rounded-full shrink-0" />
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
}> = ({ vehicleId, ownerId, ownerName }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useCurentuser();
  
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterStar, setFilterStar] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(5);

  const { data: reviewsData, isLoading: isLoadingReviews } = useOwnerReviews(
    ownerId ? String(ownerId) : undefined
  );

  const { data: pendingReservations, isLoading: isLoadingEligibility } = useReviewEligibility(
    vehicleId ? String(vehicleId) : undefined
  );

  const { mutate: submitReview, isPending: isSubmittingReview } = useCreateReview();

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
      displayReviews = displayReviews.filter(r => Math.round(Number(r.rating)) === filterStar);
    }

    displayReviews.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      const rateA = Number(a.rating);
      const rateB = Number(b.rating);

      switch (sortBy) {
        case "highest": return rateB - rateA;
        case "lowest": return rateA - rateB;
        case "newest": default: return dateB - dateA;
      }
    });

    return {
      stats: { total, avg: Math.round(avg * 10) / 10, counts },
      processedReviews: displayReviews
    };
  }, [reviewsData, sortBy, filterStar]);

  useEffect(() => {
    setVisibleCount(5);
  }, [filterStar, sortBy]);

  const handleReviewSubmit = (ratingValue: number, comment: string) => {
    const reservation = pendingReservations?.[0];
    if (!user?.id || !ownerId || !reservation?.id) return;

    submitReview({
      author: user.id,
      target: String(ownerId),
      review_type: "CLIENT_TO_OWNER",
      rating: ratingValue,
      comment,
      reservation: reservation.id,
    }, {
      onSuccess: () => {
        toast({ title: "Avis publié !", className: "bg-slate-900 text-white" });
      },
    });
  };

  const isEligible = Array.isArray(pendingReservations) && pendingReservations.length > 0;

  return (
    <div className="bg-[#f1f5f9] rounded-[2.5rem] p-6 md:p-10 border border-slate-200 mt-12 shadow-inner">
      
      {/* --- BLOC STATISTIQUES NOIR (SaaS STYLE) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-4 bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 blur-[60px]" />
          
          <p className="text-slate-400 font-bold uppercase tracking-tighter text-xs mb-2">Note Globale</p>
          <div className="text-7xl font-black mb-2 tracking-tighter">
            {stats.avg}<span className="text-2xl text-slate-500 font-normal">/5</span>
          </div>
          
          <div className="flex gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`w-5 h-5 ${s <= Math.round(stats.avg) ? "fill-amber-400 text-amber-400" : "text-slate-700"}`} />
            ))}
          </div>
          
          <Badge className="bg-slate-800 text-slate-300 border-slate-700 px-4 py-1 hover:bg-slate-800">
            {stats.total} avis certifiés
          </Badge>
        </div>

        {/* --- RÉPARTITION GRIS FONCÉ --- */}
        <div className="lg:col-span-8 bg-white/50 backdrop-blur-sm rounded-[2rem] p-8 border border-white/50 flex flex-col justify-center space-y-3">
          <h3 className="text-slate-900 font-black text-lg mb-2">Analyse des retours</h3>
          {[5, 4, 3, 2, 1].map((star) => {
            const pct = stats.total > 0 ? (stats.counts[star] / stats.total) * 100 : 0;
            return (
              <button 
                key={star} 
                onClick={() => setFilterStar(filterStar === star ? null : star)}
                className={`flex items-center gap-4 group w-full transition-all ${filterStar && filterStar !== star ? "opacity-30" : "opacity-100"}`}
              >
                <span className="text-sm font-bold text-slate-600 w-4">{star}</span>
                <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-900 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-sm font-black text-slate-900 w-10 tabular-nums text-right">{Math.round(pct)}%</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* --- BARRE DE FILTRES --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 px-2">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200">
                <MessageCircle size={18} className="text-slate-900" />
            </div>
            <h3 className="text-xl font-black text-slate-900">
                {filterStar ? `Avis ${filterStar} étoiles` : "Tous les avis"}
            </h3>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="rounded-full bg-white border-slate-200 text-slate-700 shadow-sm font-bold hover:bg-slate-50">
              <Filter className="w-4 h-4 mr-2" />
              Tri : {sortBy === "newest" ? "Récent" : sortBy === "highest" ? "Positif" : "Négatif"}
              <ChevronDown className="w-3 h-3 ml-2 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl shadow-xl border-slate-200 w-48 font-medium">
            <DropdownMenuItem onClick={() => setSortBy("newest")}>Le plus récent</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("highest")}>Meilleures notes</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("lowest")}>Notes les plus basses</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* --- LISTE DES AVIS --- */}
      <div className="space-y-4">
        {isLoadingReviews ? (
          <ReviewsSkeleton />
        ) : processedReviews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="flex justify-center mt-8">
                <Button 
                  variant="ghost" 
                  onClick={() => setVisibleCount(v => v + 4)}
                  className="text-slate-900 font-bold hover:bg-slate-200 rounded-full px-8 border border-slate-300"
                >
                  Charger plus de témoignages
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white/40 rounded-[2rem] border border-dashed border-slate-300 py-16 text-center">
             <p className="text-slate-500 font-bold italic">Aucun avis ne correspond à vos filtres.</p>
          </div>
        )}
      </div>

      {/* --- SECTION FORMULAIRE (FOOTER) --- */}
      <div className="mt-12 bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
          <div>
            <h3 className="text-3xl font-black tracking-tight mb-2">Votre expérience compte</h3>
            <p className="text-slate-400 font-medium">Contruisez la confiance au sein de notre communauté.</p>
          </div>
          {isEligible && (
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 self-start md:self-center px-4 py-2 rounded-full">
              <ShieldCheck className="w-4 h-4 mr-2" /> Éligible à la notation
            </Badge>
          )}
        </div>

        {!user ? (
          <div className="bg-white/5 rounded-2xl p-8 text-center border border-white/10 backdrop-blur-md">
            <p className="mb-6 text-slate-300">Veuillez vous identifier pour publier votre avis sur ce propriétaire.</p>
            <Button onClick={() => navigate("/login")} className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-10 font-bold">
              Se connecter
            </Button>
          </div>
        ) : !isEligible ? (
          <div className="bg-amber-500/10 rounded-2xl p-6 border border-amber-500/20 flex items-start gap-4">
            <AlertCircle className="text-amber-500 shrink-0 mt-1" />
            <p className="text-amber-200/80 text-sm leading-relaxed">
              La notation est réservée aux utilisateurs ayant complété une réservation avec ce véhicule. 
              Ceci garantit l'intégrité de notre système de confiance.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-1">
             <ReviewForm onSubmit={handleReviewSubmit} isSubmitting={isSubmittingReview} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;