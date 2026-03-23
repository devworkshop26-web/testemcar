import { LoyaltyProgramContent } from "@/components/client/loyalty/LoyaltyProgramContent";
import { Gift, ShieldCheck, Sparkles, Star } from "lucide-react";

const loyaltyMockData = {
  title: "Mes points fidélité",
  subtitle:
    "Suivez votre progression, découvrez vos avantages et visualisez les récompenses disponibles dans votre espace client.",
  points: 1250,
  nextTierLabel: "Platinum",
  pointsToNextTier: 50,
  progress: 96,
  memberSince: "janvier 2026",
  discountLabel: "-10% sur certaines locations",
  stats: [
    {
      label: "Niveau actuel",
      value: "Gold",
      helper: "Accès aux offres fidélité et aux bonus sur vos prochaines réservations.",
    },
    {
      label: "Points disponibles",
      value: "1 250",
      helper: "Solde frontend simulé avant connexion aux vraies données backend.",
    },
    {
      label: "Prochain palier",
      value: "50 pts",
      helper: "Encore un petit effort pour atteindre Platinum.",
    },
  ],
  benefits: [
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
      description: "Avis, locations terminées et parrainage peuvent renforcer la progression dans le programme.",
      icon: <Star className="h-5 w-5" />,
    },
    {
      title: "Expérience évolutive",
      description: "La page est pensée pour rester réutilisable quand on branchera les données backend réelles.",
      icon: <Sparkles className="h-5 w-5" />,
    },
  ],
  history: [
    {
      id: "history-1",
      title: "Location terminée · Toyota Land Cruiser Prado",
      date: "18 mars 2026",
      points: 180,
      status: "earned" as const,
      description: "Points accordés après une location finalisée avec succès.",
    },
    {
      id: "history-2",
      title: "Avis vérifié publié",
      date: "14 mars 2026",
      points: 25,
      status: "earned" as const,
      description: "Bonus engagement après publication d’un retour client utile.",
    },
    {
      id: "history-3",
      title: "Réduction appliquée sur une réservation",
      date: "10 mars 2026",
      points: -120,
      status: "redeemed" as const,
      description: "Utilisation de points pour bénéficier d’une remise fidélité.",
    },
    {
      id: "history-4",
      title: "Parrainage en attente",
      date: "07 mars 2026",
      points: 80,
      status: "pending" as const,
      description: "Les points seront validés lorsque le filleul terminera sa première location.",
    },
  ],
  tiers: [
    {
      name: "Bronze",
      thresholdLabel: "0 à 299 points",
      perks: ["Accès au programme", "Historique des points"],
    },
    {
      name: "Silver",
      thresholdLabel: "300 à 799 points",
      perks: ["Bonus ponctuels", "Offres fidélité"],
    },
    {
      name: "Gold",
      thresholdLabel: "800 à 1 499 points",
      active: true,
      perks: ["-10% sur certaines locations", "Avantages exclusifs", "Priorité promo"],
    },
    {
      name: "Platinum",
      thresholdLabel: "1 500+ points",
      perks: ["Privilèges premium", "Bonus majorés", "Accès anticipé aux offres"],
    },
  ],
  actions: [
    { label: "Voir mes locations", href: "/client/rentals", variant: "outline" as const },
    { label: "Parrainer un ami", href: "/client/loyalty" },
  ],
};

export default function LoyaltyClientView() {
  return <LoyaltyProgramContent {...loyaltyMockData} />;
}
