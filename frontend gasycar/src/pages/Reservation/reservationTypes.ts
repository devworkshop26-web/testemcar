import type { LucideIcon } from 'lucide-react';
import type { Vehicule } from '@/types/vehiculeType';

export enum DriverOption {
  REQUIRED = 'OBLIGATOIRE',
  OPTIONAL = 'OPTIONNEL',
  NONE = 'SANS_CHAUFFEUR'
}

export type ChauffeurChoice = 'AVEC_CHAUFFEUR' | 'SANS_CHAUFFEUR';
export type TravelZone = 'TANA' | 'PROVINCE';

export type IconKey =
  | 'Wifi'
  | 'Map'
  | 'Baby'
  | 'Shield'
  | 'Music'
  | 'Coffee'
  | 'Snowflake'
  | 'BatteryCharging'
  | 'ShoppingBag'
  | 'Umbrella'
  | 'TabletSmartphone';

export type ReservationAddon = {
  id: string;
  label: string;
  price: number;
  iconKey: IconKey;
  description?: string;
};

export type PricingRates = {
  hour?: number;
  halfDay?: number;
  day: number;
  twentyFourHours?: number;
  week?: number;
  month?: number;
  provinceDay?: number;
  weeklyDiscount?: number;
  monthlyDiscount?: number;
};

export type ReservationVehicle = Vehicule & {
  title?: string;
  image?: string;
  location?: string;
  rating?: number;
  trips?: number;
  ownerName?: string;
  pricingRates?: PricingRates;
  unavailableDates?: string[];
  features?: string[];
  unlimitedMileage?: boolean;
  mileageLimit?: number;
  extraKmPrice?: number;
  pricePerDay?: number;
  type?: string;
  driverOption?: DriverOption;
  isCertified?: boolean;

  // Specific details
  categoryLabel?: string;
  transmissionLabel?: string;
  fuelLabel?: string;
  year?: number;
  doorCount?: number;
  seatCount?: number;
  color?: string;
  bootVolume?: number;
  currentMileage?: number;
  licensePlate?: string; // Maybe hide partly? usage said "all details"
};

export type IconMap = Record<IconKey, LucideIcon>;
