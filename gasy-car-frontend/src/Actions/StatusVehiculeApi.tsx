// api/status-vehicule-api.ts
import { InstanceAxis } from "@/helper/InstanceAxios";
import { StatusVehicule } from "@/types/StatusVehiculeType";
import type {
  CreateStatusVehiculePayload,
  UpdateStatusVehiculePayload,
} from "@/types/StatusVehiculeType";

export const statusVehiculeAPI = {
  // GET /vehicule/status/
  get_all_status: async () => {
    return await InstanceAxis.get<StatusVehicule[]>("/vehicule/status/");
  },

  // GET /vehicule/status/:id/
  get_one_status: async (id: string) => {
    return await InstanceAxis.get<StatusVehicule>(`/vehicule/status/${id}/`);
  },

  // POST /vehicule/status/
  create_status: async (payload: CreateStatusVehiculePayload) => {
    return await InstanceAxis.post<StatusVehicule>(
      "/vehicule/status/",
      payload
    );
  },

  // PUT /vehicule/status/:id/
  update_status: async (id: string, payload: UpdateStatusVehiculePayload) => {
    return await InstanceAxis.put<StatusVehicule>(
      `/vehicule/status/${id}/`,
      payload
    );
  },

  // DELETE /vehicule/status/:id/
  delete_status: async (id: string) => {
    return await InstanceAxis.delete<void>(`/vehicule/status/${id}/`);
  },
};
