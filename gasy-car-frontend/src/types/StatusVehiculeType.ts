// types/vehicule.ts

export interface StatusVehicule {
  id: string;
  nom: string;
  created_at?: string;
  updated_at?: string;
}

export type CreateStatusVehiculePayload = {
  nom: string;
};

export type UpdateStatusVehiculePayload = {
  nom?: string;
};
