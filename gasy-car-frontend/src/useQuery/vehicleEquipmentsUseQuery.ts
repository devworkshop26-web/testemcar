// queries/vehicle-equipments-query.ts
import { vehicleEquipmentsAPI } from "@/Actions/VehicleEquipmentsApi";
import { CreateVehicleEquipmentPayload, UpdateVehicleEquipmentPayload, VehicleEquipment } from "@/types/VehicleEquipmentsType";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;

export const useAllVehicleEquipmentsQuery = () => {
  return useQuery<VehicleEquipment[]>({
    queryKey: ["vehicle-equipments-all"],
    queryFn: async () => {
      const { data } = await vehicleEquipmentsAPI.get_all_equipments();
      return Array.isArray(data) ? data : [];
    },
    staleTime: ONE_YEAR_MS,
    retry: 2,
  });
};

// Liste des équipements, filtrés par véhicule
export const useVehicleEquipmentsQuery = (vehicleId?: string) => {
  return useQuery<VehicleEquipment[]>({
    queryKey: ["vehicle-equipments-all", vehicleId],
    queryFn: async () => {
      const { data } = await vehicleEquipmentsAPI.get_all_equipments(vehicleId);
      return Array.isArray(data) ? data : [];
    },
    enabled: !!vehicleId, // on attend d’avoir l’id du véhicule
    staleTime: ONE_YEAR_MS,
    retry: 2,
  });
};

// Détail
export const useVehicleEquipmentQuery = (id?: string) => {
  return useQuery<VehicleEquipment>({
    queryKey: ["vehicle-equipment-one", id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) throw new Error("ID équipement manquant");
      const { data } = await vehicleEquipmentsAPI.get_one_equipment(id);
      return data;
    },
    retry: 1,
  });
};

// Création
export const useCreateVehicleEquipmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateVehicleEquipmentPayload) =>
      vehicleEquipmentsAPI.create_equipment(payload).then((res) => res.data),
    onSuccess: (_data, variables) => {
      // Invalidate la liste filtrée par véhicule
      queryClient.invalidateQueries({
        queryKey: ["vehicle-equipments-all"],
      });
    },
  });
};

// Update
export const useUpdateVehicleEquipmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateVehicleEquipmentPayload;
    }) =>
      vehicleEquipmentsAPI.update_equipment(id, payload).then((res) => res.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["vehicle-equipments-all", data.vehicle],
      });
      queryClient.invalidateQueries({
        queryKey: ["vehicle-equipment-one", data.id],
      });
    },
  });
};

// Delete
export const useDeleteVehicleEquipmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      vehicleEquipmentsAPI.delete_equipment(id).then((res) => res.data),
    // tu peux gérer l’invalidation dans l’appelant (page) selon le vehicleId connu
  });
};
