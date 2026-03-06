// types/vehicule.ts
export type Transmission = {
  id: string;
  nom: string;
  created_at?: string;
  updated_at?: string;
};

export type CreateTransmissionPayload = {
  nom: string;
};

export type UpdateTransmissionPayload = {
  nom?: string;
};
