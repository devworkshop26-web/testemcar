import { LoyaltyProgramContent } from "@/components/client/loyalty/LoyaltyProgramContent";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { useLoyaltyQuery } from "@/useQuery/useLoyaltyQuery";
import { Gift, ShieldCheck, Sparkles, Star } from "lucide-react";

export default function LoyaltyClientView() {
  const { data, isLoading, isError, error } = useLoyaltyQuery();

  if (isLoading) {
    return (
      <Card className="rounded-3xl border-slate-200/70 shadow-sm">
        <CardContent className="p-8 text-sm text-slate-500">
          Chargement de vos données fidélité…
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Impossible de charger la fidélité</AlertTitle>
        <AlertDescription>
          {error instanceof Error
            ? error.message
            : "Le backend fidélité ne répond pas pour le moment."}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <LoyaltyProgramContent
      title={data.title}
      subtitle={data.subtitle}
      points={data.points}
      nextTierLabel={data.next_tier_label || data.current_tier}
      pointsToNextTier={data.points_to_next_tier}
      progress={data.progress}
      memberSince={data.member_since}
      discountLabel={data.discount_label}
      stats={data.stats}
      benefits={[
        {
          title: "Réductions sur les locations",
          description: "Transformez vos points en avantages sur vos prochaines réservations.",
          icon: <Gift className="h-5 w-5" />,
        },
        {
          title: "Bonus confiance",
          description: "Les clients réguliers profitent d’avantages supplémentaires selon leur niveau.",
          icon: <ShieldCheck className="h-5 w-5" />,
        },
        {
          title: "Récompenses d’engagement",
          description: "Les avis vérifiés et le profil complété améliorent aussi votre progression.",
          icon: <Star className="h-5 w-5" />,
        },
        {
          title: "Expérience connectée au backend",
          description: "Cette page affiche maintenant les données réelles calculées depuis votre compte.",
          icon: <Sparkles className="h-5 w-5" />,
        },
      ]}
      history={data.history.map((item) => ({
        ...item,
        date: new Date(item.date).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
      }))}
      tiers={data.tiers.map((tier) => ({
        name: tier.name,
        thresholdLabel: tier.threshold_label,
        active: tier.active,
        perks: tier.perks,
      }))}
      actions={[
        { label: "Voir mes locations", href: "/client/rentals", variant: "outline" as const },
      ]}
      earningRules={data.earning_rules}
    />
  );
}
