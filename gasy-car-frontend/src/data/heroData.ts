import { MarketingHero } from "@/types/MarketingHeroType";
import carSlide1 from "@/assets/car-slide-1.png";
import carSlide2 from "@/assets/car-slide-2.png";
import carSlide3 from "@/assets/car-slide-3.png";

export const marketingHeroData: MarketingHero[] = [
  {
    id: "1",
    name: "hero_4x4_exploration",
    titre: "Découvrez l'aventure en 4x4",
    subtitle: "Voyagez en toute liberté",
    description:
      "Explorez Madagascar avec nos véhicules 4x4 tout-terrain adaptés aux routes difficiles. Une expérience unique vous attend.",
    start_date: "2025-01-01",
    end_date: "2025-12-31",
    price: "199900.00",
    image: carSlide1,
    link: "/allcars",
    btn_text: "Réserver maintenant",
    active: true,
    created_at: "2025-01-01T10:00:00Z",
    updated_at: "2025-01-01T10:00:00Z",
  },
  {
    id: "2",
    name: "hero_affaires",
    titre: "Le confort pour vos voyages d'affaires",
    subtitle: "Confort & élégance",
    description:
      "Nos berlines premium offrent une qualité de conduite inégalée pour vos déplacements professionnels en ville.",
    start_date: "2025-01-01",
    end_date: "2025-06-30",
    price: "149900.00",
    image: carSlide2,
    link: "/allcars",
    btn_text: "Réserver",
    active: true,
    created_at: "2025-01-01T10:00:00Z",
    updated_at: "2025-01-01T10:00:00Z",
  },
  {
    id: "3",
    name: "hero_citadines",
    titre: "Des citadines agiles pour la ville",
    subtitle: "Parfaites au quotidien",
    description:
      "Compactes, économiques et maniables, nos citadines sont idéales pour se déplacer facilement dans la ville.",
    start_date: "2025-02-01",
    end_date: "2025-12-31",
    price: "99900.00",
    image: carSlide3,
    link: "/allcars",
    btn_text: "Voir les modèles",
    active: true,
    created_at: "2025-02-01T09:00:00Z",
    updated_at: "2025-02-01T09:00:00Z",
  },
];
