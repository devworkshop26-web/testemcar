import { InstanceAxis } from "@/helper/InstanceAxios";

// Interface for Driver from Backend
export interface Driver {
    id: string;
    first_name: string;
    last_name: string;
    date_of_birth?: string | null;
    nationality?: string;
    experience_years: number;
    is_available: boolean;
    phone_number: string;
    secondary_phone?: string;
    address?: string;
    city?: string;
    profile_photo?: string | null;
    created_at: string;
    updated_at: string;
    user?: string | null; // ID of the linked user
    owner?: string | null; // ID of the owner
    full_name?: string;
    owner_name?: string | null;

    // License fields (merged)
    license_number?: string;
    license_category?: string;
    license_issued_date?: string | null;
    license_expiry_date?: string | null;
    license_photo?: string | null; // URL

    // CIN fields
    cin_number?: string;
    cin_recto?: string | null; // URL
    cin_verso?: string | null; // URL

    // Residence certificate
    residence_certificate?: string | null; // URL
}

export type CreateDriverPayload = Omit<Driver, "id" | "created_at" | "updated_at" | "full_name" | "owner_name">;
export type UpdateDriverPayload = Partial<CreateDriverPayload>;

const URL_DRIVERS = "/driver/drivers/";

export const getDrivers = async (role?: string) => {
    // Role handling is done backend side via auth token, 
    // but if we need specific filters we can add params
    const response = await InstanceAxis.get(URL_DRIVERS);
    return response.data as Driver[];
};

export const getDriver = async (id: string) => {
    const response = await InstanceAxis.get(`${URL_DRIVERS}${id}/`);
    return response.data as Driver;
};

export const createDriver = async (payload: CreateDriverPayload | FormData) => {
    const response = await InstanceAxis.post(URL_DRIVERS, payload, {
        headers: {
            // If payload is FormData, axios handles Content-Type automatically usually,
            // but explicit multipart is safe for file uploads (photo)
            "Content-Type": payload instanceof FormData ? "multipart/form-data" : "application/json",
        }
    });
    return response.data;
};

export const updateDriver = async (id: string, payload: UpdateDriverPayload | FormData) => {
    const response = await InstanceAxis.patch(`${URL_DRIVERS}${id}/`, payload, {
        headers: {
            "Content-Type": payload instanceof FormData ? "multipart/form-data" : "application/json",
        }
    });
    return response.data;
};

export const deleteDriver = async (id: string) => {
    await InstanceAxis.delete(`${URL_DRIVERS}${id}/`);
};
