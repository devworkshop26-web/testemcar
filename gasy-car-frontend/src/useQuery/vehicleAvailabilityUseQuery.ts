import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getVehicleAvailabilities,
  createVehicleAvailability,
  deleteVehicleAvailability,
  updateVehicleAvailability,
  VehicleAvailability,
} from "../Actions/VehicleAvailabilityApi";

export const useVehicleAvailabilityQuery = (vehicleId: string | undefined) => {
  return useQuery<VehicleAvailability[]>({
    queryKey: ["vehicleAvailability", vehicleId],
    queryFn: () => getVehicleAvailabilities(vehicleId!),
    enabled: !!vehicleId,
  });
};

export const useCreateVehicleAvailabilityMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createVehicleAvailability,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vehicleAvailability", variables.vehicle] });
    },
  });
};

export const useUpdateVehicleAvailabilityMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<VehicleAvailability, "id">> }) =>
      updateVehicleAvailability(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicleAvailability"] });
    },
  });
};

export const useDeleteVehicleAvailabilityMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteVehicleAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicleAvailability"] });
    },
  });
};
