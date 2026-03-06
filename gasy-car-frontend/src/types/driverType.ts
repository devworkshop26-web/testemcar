import { User } from "./userType";

export interface Driver {
    id: string;
    user?: string | User | null;
    vehicule?: string | null;
    owner?: string | User | null;

    first_name: string;
    last_name: string;
    full_name: string; // From @property in backend
    date_of_birth?: string | null;
    nationality?: string;

    experience_years: number;
    is_available: boolean;
    phone_number: string;
    secondary_phone?: string;
    address?: string;
    city?: string;

    profile_photo?: string | null;

    // Permis
    license_number?: string;
    license_category?: string;
    license_issued_date?: string | null;
    license_expiry_date?: string | null;
    license_photo?: string | null;

    // CIN
    cin_number?: string;
    cin_recto?: string | null;
    cin_verso?: string | null;

    created_at: string;
    updated_at: string;
}

export interface CreateDriverPayload {
    first_name: string;
    last_name: string;
    phone_number: string;
    experience_years?: number;
    is_available?: boolean;
    // ... other fields
}

export type UpdateDriverPayload = Partial<CreateDriverPayload> & {
    vehicule?: string | null;
};
