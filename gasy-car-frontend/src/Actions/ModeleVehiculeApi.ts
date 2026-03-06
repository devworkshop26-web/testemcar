// api/modele-vehicule-api.ts
import { InstanceAxis } from "@/helper/InstanceAxios";
import { CreateModeleVehiculePayload, ModeleVehicule, UpdateModeleVehiculePayload } from "@/types/ModeleVehiculeType";

export const modeleVehiculeAPI = {
  // GET /vehicule/modelevehicule/
  get_all_modeles: async () => {
    return await InstanceAxis.get<ModeleVehicule[]>("/vehicule/modelevehicule/");
  },

  // GET /vehicule/modelevehicule/:id/
  get_one_modele: async (id: string) => {
    return await InstanceAxis.get<ModeleVehicule>(
      `/vehicule/modelevehicule/${id}/`,
    );
  },

  // POST /vehicule/modelevehicule/
  create_modele: async (payload: CreateModeleVehiculePayload) => {
    return await InstanceAxis.post<ModeleVehicule>(
      "/vehicule/modelevehicule/",
      payload,
    );
  },

  // PUT /vehicule/modelevehicule/:id/
  update_modele: async (id: string, payload: UpdateModeleVehiculePayload) => {
    return await InstanceAxis.put<ModeleVehicule>(
      `/vehicule/modelevehicule/${id}/`,
      payload,
    );
  },

  // DELETE /vehicule/modelevehicule/:id/
  delete_modele: async (id: string) => {
    return await InstanceAxis.delete<void>(
      `/vehicule/modelevehicule/${id}/`,
    );
  },
};
