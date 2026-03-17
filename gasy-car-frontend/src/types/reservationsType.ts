import { User } from "./userType";
import { Vehicule } from "./vehiculeType";
import { ModePayment } from "./modePayment";
import { VehicleEquipment } from "./VehicleEquipmentsType";

export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus =
  | "PENDING"
  | "VALIDATED"
  | "REJECTED"
  | "REFUNDED";

export type ReservationTransitionAction =
  | "accept"
  | "cancel"
  | "start"
  | "complete";

export interface Driver {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  secondary_phone?: string;
  profile_photo?: string;
  experience_years: number;
  is_available: boolean;
  license_number?: string;
  license_category?: string;
}

export interface ReservationService {
  id: string;
  reservation: string;
  service_type: "ASSURANCE" | "CHAUFFEUR" | "EQUIPEMENT" | "AUTRE";
  service_name: string;
  price: string;
  quantity: number;
  created_at?: string;
  updated_at?: string;
}

export interface ReservationPayment {
  id: string;
  reservation: string | null;
  mode: string | null;
  mode_data?: ModePayment;
  reason: string;
  proof_image: string | null;
  status: PaymentStatus;
  processed_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: string;
  reference: string;
  client: string;
  client_data: User;
  vehicle: string;
  vehicle_data: Vehicule;

  driver?: string | null;
  driver_data?: Driver | null;

  equipments?: string[];
  equipments_data?: VehicleEquipment[];

  services_data?: ReservationService[];

  start_datetime: string;
  end_datetime: string;

  total_days: number;
  base_amount: string;
  options_amount: string;
  total_amount: string;
  caution_amount: string;

  status: ReservationStatus;
  with_chauffeur: boolean;
  pickup_location: string;
  dropoff_location: string;

  created_at?: string;
  updated_at?: string;
  payment?: ReservationPayment;

  driving_mode: "SELF_DRIVE" | "WITH_DRIVER";
  pricing_zone: "URBAIN" | "PROVINCE";
  driver_source: "NONE" | "PROVIDER" | "ADMIN_POOL";

  guest_first_name?: string;
  guest_last_name?: string;
  guest_email?: string;
  guest_phone?: string;
}

export interface CreateReservationPayload {
  client?: string;
  vehicle: string;
  start_datetime: string;
  end_datetime: string;
  caution_amount: string;
  with_chauffeur?: boolean;
  pickup_location: string;
  dropoff_location?: string;

  driving_mode?: "SELF_DRIVE" | "WITH_DRIVER";
  pricing_zone?: "URBAIN" | "PROVINCE";
  equipments?: string[];

  guest_first_name?: string;
  guest_last_name?: string;
  guest_email?: string;
  guest_phone?: string;
}

export type UpdateReservationPayload = Partial<
  Pick<
    CreateReservationPayload,
    | "start_datetime"
    | "end_datetime"
    | "pickup_location"
    | "dropoff_location"
    | "pricing_zone"
    | "equipments"
  >
>;

export interface CreateReservationServicePayload {
  reservation: string;
  service_type: ReservationService["service_type"];
  service_name: string;
  price: string;
  quantity?: number;
}

export type UpdateReservationServicePayload =
  Partial<CreateReservationServicePayload>;

export interface ReservationGraphiqueDay {
  hour: number;
  total: number;
}

export interface ReservationGraphiqueWeek {
  day: string;
  total: number;
}

export interface ReservationGraphiqueMonth {
  day: number;
  total: number;
}

export interface UploadPaymentProofPayload {
  reservation_id: string;
  proof_image: File;
}

export interface CreateReservationPaymentPayload {
  reservation: string;
  mode: string;
  reason: string;
  proof_image?: File | null;
}

export interface UpdateReservationPaymentPayload {
  mode?: string;
  reason?: string;
  status?: PaymentStatus;
  proof_image?: File | null;
}

export interface ReservationPricingConfig {
  service_fee: string;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateReservationPricingConfigPayload {
  service_fee: number | string;
}