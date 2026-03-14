// types/vehicule.ts

export interface FuelType {
  id: string;
  nom: string;
  created_at?: string;
  updated_at?: string;
}

export type CreateFuelTypePayload = {
  nom: string;
};

export type UpdateFuelTypePayload = {
  nom?: string;
};
