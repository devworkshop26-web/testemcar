// src/data/adminSidebar.tsx

import { UserRound, CalendarCheck } from "lucide-react";
import {
  BarChart3,
  Home,
  Inbox,
  LifeBuoy,
  Settings2,
  Users,
  UserCog,
  Car,
  Wrench,

  Megaphone,
  BookOpen,
  CreditCard,
  VaultIcon
} from "lucide-react";
import type { ComponentType } from "react";

import {
  Tags,
  Layers3,
  Repeat,
  Fuel,
  BadgeCheck,
  CarFront,
} from "lucide-react";

export type AdminSidebarItem = {
  title: string;
  url: string;
  icon: ComponentType<{ className?: string }>;
  badge?: string;
};

export const adminMainNav: AdminSidebarItem[] = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "/admin/inbox",
    icon: Inbox,
  },
  {
    title: "Statistiques",
    url: "/admin/analytics",
    icon: BarChart3,
  },
];
export const adminUsersNav = [
  {
    title: "Tous les utilisateurs",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Clients",
    url: "/admin/users/clients",
    icon: UserRound,
  },
  {
    title: "Prestataires",
    url: "/admin/users/owners",
    icon: UserCog,
  },
  {
    title: "Support",
    url: "/admin/users/support",
    icon: LifeBuoy,
  },
  {
    title: "Chauffeur",
    url: "/admin/users/drivers",
    icon: VaultIcon
    ,
  },
];
export const adminVehicleSettingsNav = [
  { title: "Marques", url: "/admin/vehicles/marques", icon: Tags },
  { title: "Catégories", url: "/admin/vehicles/categories", icon: Layers3 },
  { title: "Transmissions", url: "/admin/vehicles/transmissions", icon: Repeat },
  { title: "Types de carburant", url: "/admin/vehicles/fuel-types", icon: Fuel },
  { title: "Statuts véhicule", url: "/admin/vehicles/status", icon: BadgeCheck },
  { title: "Modèles de véhicules", url: "/admin/vehicles/models", icon: CarFront },
  { title: "Equipement de véhicules", url: "/admin/vehicles/equipements", icon: Wrench },
];
export const adminActionNav = [
  {
    title: "véhicules",
    url: "/admin/vehicles",
    icon: Car,
  },
  {
    title: "Reservations",
    url: "/admin/reservations",
    icon: CalendarCheck,
  },
  {
    title: "Marketing",
    url: "/admin/marketing",
    icon: Megaphone,
  },
  {
    title: "Blog",
    url: "/admin/blogs",
    icon: BookOpen,
  },
];

export const adminPlatformNav: AdminSidebarItem[] = [
  {
    title: "Modes de paiement",
    url: "/admin/mode-payments",
    icon: CreditCard,
  },
  {
    title: "Configuration",
    url: "/admin/settings",
    icon: Settings2,
  },
  // {
  //   title: "Confiance & sécurité",
  //   url: "/admin/trust-safety",
  //   icon: ShieldCheck,
  // },
  // {
  //   title: "Marketing & contenu",
  //   url: "/admin/marketing",
  //   icon: Megaphone,
  // },
];
