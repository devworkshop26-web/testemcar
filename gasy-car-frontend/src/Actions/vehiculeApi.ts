// api/vehicule-api.ts
import { InstanceAxis } from "@/helper/InstanceAxios";
import { VehicleSearchFilters } from "@/types/vehicleSearchType";
import type {
  CreateVehiculePayload,
  UpdateVehiculePayload,
} from "@/types/vehiculeType";
import { Vehicule } from "@/types/vehiculeType";

export const vehiculeAPI = {
  // GET /vehicule/vehicule/
  get_all_vehicules: async (type_vehicule?: string) => {
    let url = "/vehicule/vehicule/";
    if (type_vehicule) {
      url += `?type_vehicule=${type_vehicule}`;
    }
    return await InstanceAxis.get<Vehicule[]>(url);
  },

  // GET /vehicule/vehicule/:id/
  get_one_vehicule: async (id: string) => {
    return await InstanceAxis.get<Vehicule>(`/vehicule/vehicule/${id}/`);
  },

  // POST /vehicule/vehicule/
  create_vehicule: async (payload: CreateVehiculePayload | FormData) => {
    return await InstanceAxis.post<Vehicule>("/vehicule/vehicule/", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // PUT /vehicule/vehicule/:id/
  update_vehicule: async (id: string, payload: UpdateVehiculePayload) => {
    return await InstanceAxis.put<Vehicule>(
      `/vehicule/vehicule/${id}/`,
      payload
    );
  },

  // 🔥 PATCH /vehicule/vehicule/:id/
  // 🔥 AJOUTÉ — NE REMPLACE RIEN
  patch_vehicule: async (id: string, payload: UpdateVehiculePayload) => {
    return await InstanceAxis.patch<Vehicule>(
      `/vehicule/vehicule/${id}/`,
      payload
    );
  },

  // POST /vehicule/vehicule/:id/upload-images/
  upload_vehicule_images: async (vehiculeId: string, formData: FormData) => {
    return await InstanceAxis.post<{
      message: string;
      images?: { url: string; id: string }[];
    }>(`/vehicule/vehicule/${vehiculeId}/upload-images/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // DELETE /vehicule/vehicule/:id/
  delete_vehicule: async (id: string) => {
    return await InstanceAxis.delete<void>(`/vehicule/vehicule/${id}/`);
  },

  // get clinet
  get_owner_clients: async (id: string) => {
    return await InstanceAxis.get("/vehicule/clients/" + id + "/");
    return await InstanceAxis.get("/vehicule/clients/" + id + "/");
  },

  // get vehicule
  get_owner_vehicules: async (id: string) => {
    return await InstanceAxis.get(`/vehicule/owners/${id}/`);
  },

  get_all_vehicules_of_category: async (category_id: string) => {
    return await InstanceAxis.get(
      `/vehicule/category-all-vehicules/${category_id}/`
    );
  },

  // Driver Assignment Actions
  assign_driver: async (vehiculeId: string, driverId: string) => {
    return await InstanceAxis.post(`/vehicule/vehicule/${vehiculeId}/assign_driver/`, {
      driver_id: driverId,
    });
  },

  remove_driver: async (vehiculeId: string) => {
    return await InstanceAxis.post(`/vehicule/vehicule/${vehiculeId}/remove_driver/`);
  },
};

export const searchVehicles = async (filters: VehicleSearchFilters) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== null) {
      params.append(key, String(value));
    }
  });

  const { data } = await InstanceAxis.get(
    `/vehicule/vehicule-search/search/?${params.toString()}`
  );
  return data;
};

export const vehiculeSearchAPI = {
  popular: async () => {
    const res = await InstanceAxis.get("/vehicule/vehicule-search/popular/");
    return res.data;
  },

  coupDeCoeur: async () => {
    const res = await InstanceAxis.get(
      "/vehicule/vehicule-search/coup-de-coeur/"
    );
    return res.data;
  },

  mostBooked: async () => {
    const res = await InstanceAxis.get(
      "/vehicule/vehicule-search/most-booked/"
    );
    return res.data;
  },
};
