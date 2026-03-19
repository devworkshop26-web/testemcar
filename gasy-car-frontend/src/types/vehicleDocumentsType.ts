export interface VehicleDocument {
  id: string;
  vehicle: string;
  carte_grise: string | null;
  visite_technique: string | null;
  assurance: string | null;

  is_valide: boolean;
  rejection_reason?: string;
  submitted_at?: string | null;
  reviewed_at?: string | null;
  reviewed_by?: string | null;

  created_at: string;
  updated_at: string;

  is_complete?: boolean;
}

export interface CreateVehicleDocumentPayload {
  vehicle: string;
  carte_grise?: File;
  visite_technique?: File;
  assurance?: File;
  is_valide?: boolean;
}