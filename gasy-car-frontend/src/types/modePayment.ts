export interface ModePayment {
  id: string;
  name: string;
  numero: string;
  operateur?: string | null;
  description: string;
  image?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateModePaymentPayload {
  operateur?: string | null;
  name: string;
  numero: string;
  description: string;
  image?: File | null;
}

export type UpdateModePaymentPayload = Partial<CreateModePaymentPayload>;
