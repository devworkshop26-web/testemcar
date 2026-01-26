// queries/vehicule-query.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import type {
  CreateVehiculePayload,
  UpdateVehiculePayload,
} from "@/types/vehiculeType";
import { vehiculeAPI } from "@/Actions/vehiculeApi";
import { Vehicule } from "@/types/vehiculeType";
import { User } from "@/types/userType";
import { InstanceAxis } from "@/helper/InstanceAxios";

const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;

// Liste de tous les véhicules
export const useVehiculesQuery = (type?: string) => {
  return useQuery<Vehicule[]>({
    queryKey: ["vehicules-all", type],
    queryFn: async () => {
      const { data } = await vehiculeAPI.get_all_vehicules(type);
      return Array.isArray(data) ? data : [];
    },
    staleTime: ONE_YEAR_MS,
    retry: 2,
  });
};

// Détail d'un véhicule
export const useVehiculeQuery = (id?: string) => {
  return useQuery<Vehicule>({
    queryKey: ["vehicule-one", id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) throw new Error("ID véhicule manquant");
      const { data } = await vehiculeAPI.get_one_vehicule(id);
      return data;
    },
    retry: 1,
  });
};

// Alias 
// Alias clair pour un véhicule unique (utilisé par les pages de réservation)
export const useSingleCarQuery = (carId?: string) => useVehiculeQuery(carId);

// Création
export const useCreateVehiculeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateVehiculePayload | FormData) =>
      vehiculeAPI.create_vehicule(payload).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicules-all"] });
      queryClient.invalidateQueries({ queryKey: ["vehicule-owner-vehicules"] });
    },
  });
};

// Upload des images liées à un véhicule existant
export const useUploadVehiculeImagesMutation = () => {
  return useMutation({
    mutationFn: ({
      vehiculeId,
      formData,
    }: {
      vehiculeId: string;
      formData: FormData;
    }) =>
      vehiculeAPI
        .upload_vehicule_images(vehiculeId, formData)
        .then((res) => res.data),
  });
};


// Update
export const useUpdateVehiculeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: FormData }) => {
      const res = await InstanceAxis.put(
        `/vehicule/vehicule/${id}/`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vehicules-all"] });
      queryClient.invalidateQueries({ queryKey: ["vehicule-owner-vehicules"] });
      queryClient.invalidateQueries({ queryKey: ["vehicule-one", variables.id] });
    },
  });
};




// Delete
export const useDeleteVehiculeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      vehiculeAPI.delete_vehicule(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicules-all"] });
      queryClient.invalidateQueries({ queryKey: ["vehicule-owner-vehicules"] });
    },
  });
};

export const useOwnerClientsQuery = (id?: string) => {
  return useQuery<User[]>({
    queryKey: ["vehicule-owner-clients", id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) throw new Error("ID user manquant");
      const { data } = await vehiculeAPI.get_owner_clients(id);
      return Array.isArray(data) ? data : [];
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useOwnerVehiculesQuery = (id?: string) => {
  return useQuery<Vehicule[]>({
    queryKey: ["vehicule-owner-vehicules", id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) throw new Error("ID user manquant");
      const { data } = await vehiculeAPI.get_owner_vehicules(id);
      return Array.isArray(data) ? data : [];
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCategoryVehiculesQuery = (id?: string) => {
  return useQuery<Vehicule[]>({
    queryKey: ["vehicule-categorys-vehicules", id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) throw new Error("ID user manquant");
      const { data } = await vehiculeAPI.get_all_vehicules_of_category(id);
      return Array.isArray(data) ? data : [];
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAssignDriverMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      vehiculeId,
      driverId,
    }: {
      vehiculeId: string;
      driverId: string;
    }) => vehiculeAPI.assign_driver(vehiculeId, driverId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vehicules-all"] });
      queryClient.invalidateQueries({
        queryKey: ["vehicule-one", variables.vehiculeId],
      });
      queryClient.invalidateQueries({ queryKey: ["vehicule-owner-vehicules"] });
    },
  });
};

export const useRemoveDriverMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vehiculeId: string) => vehiculeAPI.remove_driver(vehiculeId),
    onSuccess: (_, vehiculeId) => {
      queryClient.invalidateQueries({ queryKey: ["vehicules-all"] });
      queryClient.invalidateQueries({ queryKey: ["vehicule-one", vehiculeId] });
      queryClient.invalidateQueries({ queryKey: ["vehicule-owner-vehicules"] });
    },
  });
};
