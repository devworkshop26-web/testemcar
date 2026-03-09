// api/fueltype-vehicule-api.ts
import { InstanceAxis } from "@/helper/InstanceAxios";
import { CreateFuelTypePayload, FuelType, UpdateFuelTypePayload } from "@/types/fuelType";


export const fuelTypeVehiculeAPI = {
  // GET /vehicule/fueltype/
  get_all_fuel_types: async () => {
    return await InstanceAxis.get<FuelType[]>("/vehicule/fueltype/");
  },

  // GET /vehicule/fueltype/:id/
  get_one_fuel_type: async (id: string) => {
    return await InstanceAxis.get<FuelType>(`/vehicule/fueltype/${id}/`);
  },

  // POST /vehicule/fueltype/
  create_fuel_type: async (payload: CreateFuelTypePayload) => {
    return await InstanceAxis.post<FuelType>(
      "/vehicule/fueltype/",
      payload,
    );
  },

  // PUT /vehicule/fueltype/:id/
  update_fuel_type: async (id: string, payload: UpdateFuelTypePayload) => {
    return await InstanceAxis.put<FuelType>(
      `/vehicule/fueltype/${id}/`,
      payload,
    );
  },

  // DELETE /vehicule/fueltype/:id/
  delete_fuel_type: async (id: string) => {
    return await InstanceAxis.delete<void>(`/vehicule/fueltype/${id}/`);
  },
};
