// api/vehicule-api.ts
import { InstanceAxis } from "@/helper/InstanceAxios";
import { VehicleSearchFilters } from "@/types/vehicleSearchType";
import type {
  CreateVehiculePayload,
  UpdateVehiculePayload,
} from "@/types/vehiculeType";
import { Vehicule } from "@/types/vehiculeType";

export type VehicleView = "left" | "right" | "front" | "rear" | "top" | "bottom" | "interior-front" | "interior-rear";

export type VehicleConditionPoint = {
  id: string;
  view: VehicleView;
  x: number;
  y: number;
  level: "léger" | "moyen" | "important";
  description: string;
};

export type VehicleConditionReport = {
  id: string;
  vehicle: string;
  created_by: string | null;
  view_notes: Partial<Record<VehicleView, string>>;
  saved_view_timestamps: Partial<Record<VehicleView, string>>;
  points: VehicleConditionPoint[];
  custom_photos_by_view: Partial<Record<VehicleView, string>>;
  created_at: string;
  updated_at: string;
};

export const vehiculeAPI = {
  // GET /vehicule/vehicule/
  get_all_vehicules: async (
    filters?:
      | string
      | {
          type_vehicule?: string;
          est_sponsorise?: boolean;
          est_disponible?: boolean;
          est_coup_de_coeur?: boolean;
        }
  ) => {
    const params = new URLSearchParams();

    if (typeof filters === "string" && filters) {
      params.set("type_vehicule", filters);
    } else if (filters) {
      if (filters.type_vehicule) params.set("type_vehicule", filters.type_vehicule);
      if (typeof filters.est_sponsorise === "boolean") params.set("est_sponsorise", String(filters.est_sponsorise));
      if (typeof filters.est_disponible === "boolean") params.set("est_disponible", String(filters.est_disponible));
      if (typeof filters.est_coup_de_coeur === "boolean") params.set("est_coup_de_coeur", String(filters.est_coup_de_coeur));
    }

    const query = params.toString();
    const url = query ? `/vehicule/vehicule/?${query}` : "/vehicule/vehicule/";
    return await InstanceAxis.get<Vehicule[]>(url, { _skipAuth: true, _skipRefresh: true });
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

  get_vehicle_condition_report: async (vehiculeId: string) => {
    return await InstanceAxis.get<VehicleConditionReport>(`/vehicule/vehicule/${vehiculeId}/condition-report/`);
  },

  patch_vehicle_condition_report: async (
    vehiculeId: string,
    payload: Pick<VehicleConditionReport, "view_notes" | "saved_view_timestamps" | "points" | "custom_photos_by_view">
  ) => {
    return await InstanceAxis.patch<VehicleConditionReport>(`/vehicule/vehicule/${vehiculeId}/condition-report/`, payload);
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
    `/vehicule/vehicule-search/search/?${params.toString()}`,
    { _skipAuth: true, _skipRefresh: true }
  );
  return data;
};

export const vehiculeSearchAPI = {
  sponsored: async () => {
    const res = await InstanceAxis.get("/vehicule/vehicule-search/sponsored/", {
      _skipAuth: true,
      _skipRefresh: true,
    });
    return res.data;
  },

  popular: async () => {
    const res = await InstanceAxis.get("/vehicule/vehicule-search/popular/", { _skipAuth: true, _skipRefresh: true });
    return res.data;
  },

  coupDeCoeur: async () => {
    const res = await InstanceAxis.get(
      "/vehicule/vehicule-search/coup-de-coeur/",
      { _skipAuth: true, _skipRefresh: true }
    );
    return res.data;
  },

  mostBooked: async () => {
    const res = await InstanceAxis.get(
      "/vehicule/vehicule-search/most-booked/",
      { _skipAuth: true, _skipRefresh: true }
    );
    return res.data;
  },
};
