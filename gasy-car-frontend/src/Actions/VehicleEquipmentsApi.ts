// api/vehicle-equipments-api.ts
import { InstanceAxis } from "@/helper/InstanceAxios";
import { CreateVehicleEquipmentPayload, UpdateVehicleEquipmentPayload, VehicleEquipment } from "@/types/VehicleEquipmentsType";


export const vehicleEquipmentsAPI = {

    
  // GET /vehicule/equipements/?vehicle=<id>
  get_all_equipments: async (vehicleId?: string) => {
    return await InstanceAxis.get<VehicleEquipment[]>("/vehicule/equipements/", {
      params: vehicleId ? { vehicle: vehicleId } : undefined,
    });
  },

  // GET /vehicule/equipements/:id/
  get_one_equipment: async (id: string) => {
    return await InstanceAxis.get<VehicleEquipment>(`/vehicule/equipements/${id}/`);
  },

  // POST /vehicule/equipements/
  create_equipment: async (payload: CreateVehicleEquipmentPayload) => {
    return await InstanceAxis.post<VehicleEquipment>("/vehicule/equipements/", payload);
  },

  // PUT /vehicule/equipements/:id/
  update_equipment: async (id: string, payload: UpdateVehicleEquipmentPayload) => {
    return await InstanceAxis.put<VehicleEquipment>(
      `/vehicule/equipements/${id}/`,
      payload,
    );
  },

  // DELETE /vehicule/equipements/:id/
  delete_equipment: async (id: string) => {
    return await InstanceAxis.delete<void>(`/vehicule/equipements/${id}/`);
  },
};
