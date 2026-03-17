import { Wifi, Map, Baby, Shield, Music, Coffee, Snowflake, BatteryCharging, ShoppingBag, Umbrella, TabletSmartphone } from 'lucide-react';
import type { IconMap, ReservationAddon } from './reservationTypes';

export const ICON_MAP: IconMap = {
  Wifi,
  Map,
  Baby,
  Shield,
  Music,
  Coffee,
  Snowflake,
  BatteryCharging,
  ShoppingBag,
  Umbrella,
  TabletSmartphone
};

export const DEFAULT_ADDONS: ReservationAddon[] = [
  {
    id: 'wifi',
    label: 'Wi-Fi embarqué',
    price: 5000,
    iconKey: 'Wifi',
    description: 'Connexion illimitée pendant votre trajet.'
  },
  {
    id: 'baby-seat',
    label: 'Siège bébé',
    price: 8000,
    iconKey: 'Baby',
    description: 'Siège homologué et installé par nos soins.'
  },
  {
    id: 'insurance-plus',
    label: 'Assurance Plus',
    price: 12000,
    iconKey: 'Shield',
    description: 'Franchise réduite et assistance 24/7.'
  },
  {
    id: 'cooling-pack',
    label: 'Kit fraicheur',
    price: 4000,
    iconKey: 'Snowflake',
    description: 'Glacière compacte et blocs de refroidissement.'
  },
  {
    id: 'fast-charging',
    label: 'Chargeur rapide',
    price: 2500,
    iconKey: 'BatteryCharging',
    description: 'Câbles multi-ports et adaptateur 12V.'
  }
];
