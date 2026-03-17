import {
  CheckCheck,
  Headset,
  Heart,
  Car,
  Zap,
  Shield,
  Award,
  Users,
  Calendar,
  ThumbsUp,
  Clock,
  Phone,
  TrendingUp,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import car1 from "@/assets/car-1.jpg";
import car2 from "@/assets/car-2.jpg";
import car3 from "@/assets/car-3.jpg";
import car4 from "@/assets/car-4.jpg";

// Types
export interface Vehicle {
  image: string;
  year: number;
  brand: string;
  model: string;
  rating: number;
  trips: number;
  price: number;
  oldPrice?: number;
  distance: number;
  seats: number;
  transmission: string;
  fuel: string;
  certified: boolean;
  superHost?: boolean;
  newListing?: boolean;
  deliveryAvailable: boolean;
}

export interface Category {
  name: string;
  icon: LucideIcon;
  count: string;
  description: string;
}

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface Step {
  number: number;
  title: string;
  icon: LucideIcon;
  description: string;
}

export interface BlogPost {
  title: string;
  link: string;
  date: string;
  icon: LucideIcon;
}

export interface EssentialLink {
  title: string;
  link: string;
  icon: LucideIcon;
}

export interface Stat {
  number: string;
  label: string;
  icon: LucideIcon;
  delay: number;
}

// Données des véhicules
export const vehicles: Vehicle[] = [
  {
    image: car1,
    year: 2022,
    brand: "Toyota",
    model: "Fortuner",
    rating: 4.96,
    trips: 127,
    price: 85000,
    oldPrice: 100000,
    distance: 2.5,
    seats: 7,
    transmission: "Automatique",
    fuel: "Diesel",
    certified: true,
    superHost: true,
    deliveryAvailable: true,
  },
  {
    image: car2,
    year: 2023,
    brand: "Honda",
    model: "Accord",
    rating: 4.89,
    trips: 89,
    price: 65000,
    distance: 1.2,
    seats: 5,
    transmission: "Automatique",
    fuel: "Essence",
    certified: true,
    newListing: false,
    deliveryAvailable: true,
  },
  {
    image: car3,
    year: 2024,
    brand: "BMW",
    model: "Série 1",
    rating: 5.0,
    trips: 34,
    price: 95000,
    oldPrice: 200000,
    distance: 4.1,
    seats: 5,
    transmission: "Automatique",
    fuel: "Essence",
    certified: true,
    newListing: true,
    superHost: false,
    deliveryAvailable: false,
  },
  {
    image: car4,
    year: 2023,
    brand: "Renault",
    model: "Clio",
    rating: 4.92,
    trips: 156,
    price: 45000,
    distance: 3.8,
    seats: 5,
    transmission: "Manuelle",
    fuel: "Essence",
    certified: true,
    superHost: true,
    deliveryAvailable: true,
  },
  {
    image: car1,
    year: 2022,
    brand: "Toyota",
    model: "Fortuner",
    rating: 4.96,
    trips: 127,
    price: 85000,
    oldPrice: 100000,
    distance: 2.5,
    seats: 7,
    transmission: "Automatique",
    fuel: "Diesel",
    certified: true,
    superHost: true,
    deliveryAvailable: true,
  },
  {
    image: car3,
    year: 2024,
    brand: "BMW",
    model: "Série 1",
    rating: 5.0,
    trips: 34,
    price: 95000,
    oldPrice: 200000,
    distance: 4.1,
    seats: 5,
    transmission: "Automatique",
    fuel: "Essence",
    certified: true,
    newListing: true,
    superHost: false,
    deliveryAvailable: false,
  },
];

// Catégories de véhicules
export const categories: Category[] = [
  { name: "Tous", icon: Car, count: "250+", description: "Tous types de véhicules" },
  { name: "Économique", icon: Zap, count: "80+", description: "Parfait pour la ville" },
  { name: "SUV", icon: Shield, count: "45+", description: "Confort et espace" },
  { name: "Luxe", icon: Award, count: "25+", description: "Prestige et confort" },
  { name: "Familial", icon: Users, count: "60+", description: "Idéal pour les familles" },
];

// Features
export const features: Feature[] = [
  {
    icon: Shield,
    title: "Assurance Complète",
    description: "Tous nos véhicules sont couverts par une assurance tous risques pour votre tranquillité d'esprit",
  },
  {
    icon: Clock,
    title: "Flexibilité Totale",
    description: "Choisissez la durée de location qui vous convient, de quelques heures à plusieurs semaines",
  },
  {
    icon: Phone,
    title: "Support Local",
    description: "Une équipe locale dédiée pour vous accompagner 24h/24 pendant votre location",
  },
  {
    icon: TrendingUp,
    title: "Meilleurs Prix",
    description: "Des tarifs compétitifs jusqu'à 40% moins chers que les agences traditionnelles",
  },
];

// Étapes "Comment ça marche"
export const steps: Step[] = [
  {
    number: 1,
    title: "Recherchez & Réservez",
    icon: Calendar,
    description: "Entrez votre destination et vos dates. Choisissez parmi des centaines de véhicules vérifiés.",
  },
  {
    number: 2,
    title: "Rencontrez l'Hôte",
    icon: Users,
    description: "Rencontrez le propriétaire pour l'échange de clés, vérifiez le véhicule et partez à l'aventure.",
  },
  {
    number: 3,
    title: "Roulez en Toute Sécurité",
    icon: Shield,
    description: "Profitez de votre voyage en toute tranquillité, avec notre assurance complète incluse.",
  },
  {
    number: 4,
    title: "Retour Simple",
    icon: ThumbsUp,
    description: "Restituez le véhicule, laissez un avis et préparez-vous pour votre prochaine aventure !",
  },
];

// Articles de blog
export const blogPosts: BlogPost[] = [
  {
    title: "5 conseils pour une location de voiture réussie à Mada",
    link: "/blog/conseils-location-mada",
    date: "15 Oct",
    icon: ThumbsUp,
  },
  {
    title: "Les meilleurs 4x4 pour explorer les pistes malgaches",
    link: "/blog/meilleurs-4x4-madagascar",
    date: "01 Nov",
    icon: TrendingUp,
  },
  {
    title: "Assurance auto : Ce qu'il faut savoir avant de louer",
    link: "/blog/assurance-location-auto",
    date: "22 Sep",
    icon: Shield,
  },
];

// Liens essentiels
export const essentialContent: EssentialLink[] = [
  { title: "Comment ça marche ?", link: "/comment-ca-marche", icon: CheckCheck },
  { title: "Centre d'aide & FAQ", link: "/faq", icon: Headset },
  { title: " Devenir Hôtes", link: "/devenir-proprietaire", icon: Heart },
];

// Statistiques
export const stats: Stat[] = [
  { number: "500+", label: "Véhicules Disponibles", icon: Car, delay: 100 },
  { number: "45K+", label: "Clients Satisfaits", icon: Award, delay: 200 },
  { number: "15K+", label: "Voyages Réussis", icon: ThumbsUp, delay: 300 },
  { number: "200+", label: "Hôtes Partenaires", icon: Users, delay: 400 },
];
