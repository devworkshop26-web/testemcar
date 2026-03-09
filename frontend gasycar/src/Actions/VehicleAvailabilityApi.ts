import { InstanceAxis } from "../helper/InstanceAxios";

export interface VehicleAvailability {
  id: string;
  vehicle: string;
  start_date: string;
  end_date: string;
  type: "AVAILABLE" | "BLOCKED" | "MAINTENANCE" | "RESERVED";
  description?: string;
}

export const getVehicleAvailabilities = async (vehicleId: string): Promise<VehicleAvailability[]> => {
  const response = await InstanceAxis.get(`/vehicule/vehicle-availability/?vehicle=${vehicleId}`);
  return response.data;
};

export const createVehicleAvailability = async (data: Omit<VehicleAvailability, "id">) => {
  const response = await InstanceAxis.post(`/vehicule/vehicle-availability/`, data);
  return response.data;
};

export const deleteVehicleAvailability = async (id: string) => {
  await InstanceAxis.delete(`/vehicule/vehicle-availability/${id}/`);
};

export const updateVehicleAvailability = async (id: string, data: Partial<Omit<VehicleAvailability, "id">>) => {
  const response = await InstanceAxis.patch(`/vehicule/vehicle-availability/${id}/`, data);
  return response.data;
};
