// types/vehicule.ts

export interface VehicleEquipment {
  id: string;
  vehicle: string;       // UUID du véhicule
  code: string;
  label: string;
  description: string;
  price?: number;
  created_at?: string;
  updated_at?: string;
}

export type CreateVehicleEquipmentPayload = {
  code: string;
  label: string;
  description?: string;
  price?: number;
};

export type UpdateVehicleEquipmentPayload = Partial<CreateVehicleEquipmentPayload>;
