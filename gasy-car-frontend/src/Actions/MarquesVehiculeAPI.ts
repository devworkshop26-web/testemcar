import { InstanceAxis } from "@/helper/InstanceAxios";
import { CreateMarquePayload, Marque, UpdateMarquePayload } from "@/types/marqueType";

export const marquesVehiculeAPI = {
   // GET /vehicule/marque/
  get_all_marques: async () => {
    return await InstanceAxis.get<Marque[]>("/vehicule/marque/");
  },

  // GET /vehicule/marque/:id/
  get_one_marque: async (id: string) => {
    return await InstanceAxis.get<Marque>(`/vehicule/marque/${id}/`);
  },

  // POST /vehicule/marque/
  create_marque: async (payload: CreateMarquePayload) => {
    return await InstanceAxis.post<Marque>("/vehicule/marque/", payload);
  },

  // PUT /vehicule/marque/:id/
  update_marque: async (id: string, payload: UpdateMarquePayload) => {
    return await InstanceAxis.put<Marque>(`/vehicule/marque/${id}/`, payload);
  },

  // DELETE /vehicule/marque/:id/
  delete_marque: async (id: string) => {
    return await InstanceAxis.delete<void>(`/vehicule/marque/${id}/`);
  },
};
