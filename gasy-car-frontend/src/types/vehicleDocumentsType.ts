export interface VehicleDocument {
    id: string;
    vehicle: string;
    carte_grise: string | null;
    visite_technique: string | null;
    assurance: string | null;
    is_valide: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateVehicleDocumentPayload {
    vehicle: string;
    carte_grise?: File;
    visite_technique?: File;
    assurance?: File;
    is_valide?: boolean;
}
