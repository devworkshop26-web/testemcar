// types/bookings.ts

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

export interface Reservation {
  id: string;
  reference: string; // Référence unique (ex: RES-20251219-0001)
  client: string; // id User
  client_data: User; // id User
  vehicle: string; // id Vehicule
  vehicle_data: Vehicule; // id Vehicule

  // Driver information
  driver?: string | null; // driver ID
  driver_data?: Driver | null; // populated driver data

  // Equipments
  equipments?: string[]; // equipment IDs
  equipments_data?: VehicleEquipment[]; // populated equipment data

  // Services
  services_data?: ReservationService[]; // populated services data

  start_datetime: string; // ISO "2025-11-26T10:00:00Z"
  end_datetime: string;

  total_days: number;
  base_amount: string; // Decimal -> string
  options_amount: string;
  total_amount: string;
  caution_amount: string;

  status: ReservationStatus;
  with_chauffeur: boolean;
  pickup_location: string;
  dropoff_location: string;

  created_at?: string;
  updated_at?: string;
  payment_reason?: string;
  payment_method?: string; // ID or object depending on backend, assuming string ID for now or populated object if handled
  payment?: ReservationPayment;

  driving_mode: "SELF_DRIVE" | "WITH_DRIVER";
  pricing_zone: "URBAIN" | "PROVINCE";
  driver_source: "NONE" | "PROVIDER" | "ADMIN_POOL";

  guest_first_name?: string;
  guest_last_name?: string;
  guest_email?: string;
  guest_phone?: string;
}



export interface ReservationService {
  id: string;
  reservation: string; // id Reservation
  service_type: "ASSURANCE" | "CHAUFFEUR" | "EQUIPEMENT" | "AUTRE";
  service_name: string;
  price: string; // Decimal
  quantity: number;
  created_at?: string;
  updated_at?: string;
}

// Payload pour création (admin)
export interface CreateReservationPayload {
  client?: string;
  vehicle: string;
  start_datetime: string;
  end_datetime: string;
  total_days: number;
  base_amount: string;
  options_amount?: string;
  total_amount: string;
  caution_amount: string;
  status?: ReservationStatus;
  with_chauffeur?: boolean;
  pickup_location: string;
  dropoff_location?: string;
  payment_method?: string; // ID of the payment mode
  payment_reason?: string;

  driving_mode?: "SELF_DRIVE" | "WITH_DRIVER";
  pricing_zone?: "URBAIN" | "PROVINCE";
  equipments?: string[];

  guest_first_name?: string;
  guest_last_name?: string;
  guest_email?: string;
  guest_phone?: string;
}

export type UpdateReservationPayload = Partial<CreateReservationPayload>;

// ReservationService
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

export type PaymentStatus =
  | "PENDING"
  | "VALIDATED"
  | "REJECTED"
  | "REFUNDED";

export interface ReservationPayment {
  id: string;
  reservation: string | null;     // OneToOne → ID
  mode: string | null;            // ModePayment ID
  mode_data?: ModePayment;        // Populated ModePayment object
  reason: string;
  proof_image: string | null;     // URL
  status: PaymentStatus;
  processed_by: string | null;    // User ID
  created_at: string;
  updated_at: string;
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
