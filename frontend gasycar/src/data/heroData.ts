import { MarketingHero } from "@/types/MarketingHeroType";
import carSlide1 from "@/assets/default.webp";

export const marketingHeroData: MarketingHero[] = [
  {
    id: "1",
    name: "hero_4x4_exploration",
    titre: "Trouver une voiture à louer en quelque clic",
    subtitle: "",
    description:
      "La première plateforme malgache de mise en relation entre propriétaires et locataires. Confort, sécurité, simplicité",
    start_date: "2025-01-01",
    end_date: "2025-12-31",
    price: "199900.00",
    image: carSlide1,
    link: "/allcars",
    btn_text: "Louer un véhicule",
    active: true,
    created_at: "2025-01-01T10:00:00Z",
    updated_at: "2025-01-01T10:00:00Z",
  },
];
