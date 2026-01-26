import { InstanceAxis } from "@/helper/InstanceAxios";
import { VehicleDocument } from "@/types/vehicleDocumentsType";

export const vehicleDocumentsAPI = {
    get_vehicle_documents: async (vehicleId: string) => {
        return await InstanceAxis.get<VehicleDocument[]>(`/vehicule/vehicle-documents/?vehicle=${vehicleId}`);
    },

    create_document: async (formData: FormData) => {
        return await InstanceAxis.post<VehicleDocument>("/vehicule/vehicle-documents/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    update_document: async (id: string, formData: FormData) => {
        return await InstanceAxis.patch<VehicleDocument>(`/vehicule/vehicle-documents/${id}/`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    delete_document: async (id: string) => {
        return await InstanceAxis.delete<void>(`/vehicule/vehicle-documents/${id}/`);
    },
};
