// api/transmissions-vehicule-api.ts
import { InstanceAxis } from "@/helper/InstanceAxios";
import { CreateTransmissionPayload, Transmission, UpdateTransmissionPayload } from "@/types/transmissionType";


export const transmissionsVehiculeAPI = {
  // GET /vehicule/transmission/
  get_all_transmissions: async () => {
    return await InstanceAxis.get<Transmission[]>("/vehicule/transmission/");
  },

  // GET /vehicule/transmission/:id/
  get_one_transmission: async (id: string) => {
    return await InstanceAxis.get<Transmission>(`/vehicule/transmission/${id}/`);
  },

  // POST /vehicule/transmission/
  create_transmission: async (payload: CreateTransmissionPayload) => {
    return await InstanceAxis.post<Transmission>(
      "/vehicule/transmission/",
      payload,
    );
  },

  // PUT /vehicule/transmission/:id/
  update_transmission: async (id: string, payload: UpdateTransmissionPayload) => {
    return await InstanceAxis.put<Transmission>(
      `/vehicule/transmission/${id}/`,
      payload,
    );
  },

  // DELETE /vehicule/transmission/:id/
  delete_transmission: async (id: string) => {
    return await InstanceAxis.delete<void>(`/vehicule/transmission/${id}/`);
  },
};
