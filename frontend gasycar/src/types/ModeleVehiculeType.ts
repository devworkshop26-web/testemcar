// types/vehicule.ts

export interface ModeleVehicule {
  id: string;
  label: string;
  marque?: string;
  created_at?: string;
  updated_at?: string;
}

export type CreateModeleVehiculePayload = {
  label: string;
};

export type UpdateModeleVehiculePayload = {
  label?: string;
};
