import {
  CalendarDays,
  CalendarRange,
  Headset,
  Heart,
  LayoutDashboard,
  MessageSquare,
  Search,
  Settings,
} from "lucide-react";
import { ComponentType } from "react";


export type ClientSidebarItem = {
  id: string;
  label: string;
  url: string;
  icon: ComponentType<{ className?: string }>;
  badge?: string;
};

export const menuItemsClient:ClientSidebarItem[] = [
  { id: "dashboard",    icon: LayoutDashboard,    label: "Accueil",    url: "/client",  },
  // {
  //   id: "browse",
  //   icon: Search,
  //   label: "Trouver une voiture",
  //   url: "/client/browse",
  // },
  {id: "rentals", icon: CalendarDays,   label: "Mes Locations",   url: "/client/rentals",  },
  // { id: "favorites", icon: Heart, label: "Favoris", url: "/client/favorites" },
  // {
  //   id: "reservation",
  //   icon: CalendarRange,
  //   label: "Reservation",
  //   url: "/client/booking",
  // },

  {
    id: "supports",
    icon: Headset,
    label: "Supports",
    url: "/client/supports/my-tickets",
  },
  {
    id: "settings",
    icon: Settings,
    label: "Mon Profil",
    url: "/client/settings",
  },
];
