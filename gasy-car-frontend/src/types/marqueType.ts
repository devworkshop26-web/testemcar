
export type Marque = {
  id: string;
  nom: string;
  created_at?: string;
  updated_at?: string;
};

export type CreateMarquePayload = {
  nom: string;
};

export type UpdateMarquePayload = {
  nom?: string;
};