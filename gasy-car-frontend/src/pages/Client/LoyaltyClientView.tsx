import { LoyaltyProgramContent } from "@/components/client/loyalty/LoyaltyProgramContent";
import { useLoyaltySummary } from "@/useQuery/loyaltyUseQuery";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Gift, ShieldCheck, Sparkles, Star } from "lucide-react";
import type { ReactNode } from "react";

const iconMap: Record<string, ReactNode> = {
  gift: <Gift className="h-5 w-5" />,
  "shield-check": <ShieldCheck className="h-5 w-5" />,
  star: <Star className="h-5 w-5" />,
  sparkles: <Sparkles className="h-5 w-5" />,
};

const formatFrenchDate = (value: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return format(date, "dd MMMM yyyy", { locale: fr });
};

const formatFrenchMonth = (value: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return format(date, "MMMM yyyy", { locale: fr });
};

export default function LoyaltyClientView() {
  const { data, isLoading, isError } = useLoyaltySummary();

  if (!data && isLoading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const content = data
    ? {
        title: data.title,
        subtitle: data.subtitle,
        points: data.points,
        nextTierLabel: data.next_tier_label,
        pointsToNextTier: data.points_to_next_tier,
        progress: data.progress,
        memberSince: formatFrenchMonth(data.member_since),
        discountLabel: data.discount_label,
        stats: data.stats,
        benefits: data.benefits.map((benefit) => ({
          title: benefit.title,
          description: benefit.description,
          icon: iconMap[benefit.icon] ?? <Gift className="h-5 w-5" />,
        })),
        history: data.history.map((item) => ({
          id: item.id,
          title: item.label,
          date: formatFrenchDate(item.created_at),
          points: item.points,
          status: item.display_status,
          description: item.description,
        })),
        tiers: data.tiers.map((tier) => ({
          name: tier.name,
          thresholdLabel: tier.threshold_label,
          active: tier.active,
          perks: tier.perks,
        })),
        actions: data.actions,
      }
    : {
        title: "Mes points fidélité",
        subtitle: "Impossible de charger les données fidélité pour le moment.",
        points: 0,
        nextTierLabel: "Bronze",
        pointsToNextTier: 0,
        progress: 0,
        memberSince: "",
        discountLabel: "Programme indisponible",
        stats: [],
        benefits: [],
        history: [],
        tiers: [],
        actions: [
          { label: "Retour au dashboard", href: "/client", variant: "outline" as const },
        ],
      };

  return <LoyaltyProgramContent {...content} isLoading={isLoading} isError={isError} />;
}
