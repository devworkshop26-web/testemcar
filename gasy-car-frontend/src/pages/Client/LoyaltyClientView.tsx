import { LoyaltyProgramContent } from "@/components/client/loyalty/LoyaltyProgramContent";
import { Gift, ShieldCheck, Sparkles, Star } from "lucide-react";
import { useLoyaltyOverviewQuery } from "@/useQuery/loyaltyUseQuery";

const staticBenefits = [
  {
    title: "Réductions sur les locations",
    description: "Transformez vos points en avantages lors de vos prochaines réservations sans changer le parcours actuel.",
    icon: <Gift className="h-5 w-5" />,
  },
  {
    title: "Bonus confiance",
    description: "Les clients réguliers peuvent accéder à des privilèges premium et à des offres ciblées.",
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    title: "Récompenses d’engagement",
    description: "Les locations terminées, les avis approuvés et le profil complété renforcent la progression dans le programme.",
    icon: <Star className="h-5 w-5" />,
  },
  {
    title: "Expérience évolutive",
    description: "Le parrainage est volontairement laissé de côté pour le moment, mais le reste est branché aux vraies données backend.",
    icon: <Sparkles className="h-5 w-5" />,
  },
];

export default function LoyaltyClientView() {
  const { data, isLoading, isError } = useLoyaltyOverviewQuery();

  return (
    <LoyaltyProgramContent
      title={data?.title ?? "Mes points fidélité"}
      subtitle={
        data?.subtitle ??
        "Suivez votre progression, découvrez vos avantages et visualisez les récompenses disponibles dans votre espace client."
      }
      points={data?.points ?? 0}
      nextTierLabel={data?.nextTierLabel ?? "Bronze"}
      pointsToNextTier={data?.pointsToNextTier ?? 0}
      progress={data?.progress ?? 0}
      memberSince={data?.memberSince ?? "—"}
      discountLabel={data?.discountLabel ?? "Accès au programme"}
      stats={data?.stats ?? []}
      benefits={staticBenefits}
      history={data?.history ?? []}
      tiers={data?.tiers ?? []}
      actions={[
        { label: "Voir mes locations", href: "/client/rentals", variant: "outline" as const },
        { label: "Parrainer un ami", href: "/client/loyalty" },
      ]}
      isLoading={isLoading}
      isError={isError}
      referralEnabled={data?.rules?.referralEnabled ?? false}
    />
  );
}
