import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import type {
  CreateVehiculePayload,
  UpdateVehiculePayload,
  ReviewVehiclePayload,
} from "@/types/vehiculeType";
import { vehiculeAPI } from "@/Actions/vehiculeApi";
import { Vehicule } from "@/types/vehiculeType";
import { User } from "@/types/userType";

const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;

export const useVehiculesQuery = (
  filters?:
    | string
    | {
        type_vehicule?: string;
        est_sponsorise?: boolean;
        est_disponible?: boolean;
        est_coup_de_coeur?: boolean;
        valide?: boolean;
        workflow_status?: string;
      }
) => {
  return useQuery<Vehicule[]>({
    queryKey: ["vehicules-all", filters],
    queryFn: async () => {
      const { data } = await vehiculeAPI.get_all_vehicules(filters);
      return Array.isArray(data) ? data : [];
    },
    staleTime: ONE_YEAR_MS,
    retry: 2,
  });
};

export const usePublicVehiculesQuery = (
  filters?:
    | string
    | {
        type_vehicule?: string;
        est_sponsorise?: boolean;
        est_disponible?: boolean;
        est_coup_de_coeur?: boolean;
      }
) => {
  return useQuery<Vehicule[]>({
    queryKey: ["vehicules-public", filters],
    queryFn: async () => {
      const { data } = await vehiculeAPI.get_public_vehicules(filters);
      return Array.isArray(data) ? data : [];
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useVehicleReviewQueueQuery = (filters?: { workflow_status?: string; valide?: boolean }) => {
  return useQuery<Vehicule[]>({
    queryKey: ["vehicules-review-queue", filters],
    queryFn: async () => {
      const { data } = await vehiculeAPI.get_review_queue(filters);
      return Array.isArray(data) ? data : [];
    },
    staleTime: 60 * 1000,
    retry: 1,
  });
};

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

export const useSingleCarQuery = (carId?: string) => useVehiculeQuery(carId);

export const useCreateVehiculeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateVehiculePayload | FormData) =>
      vehiculeAPI.create_vehicule(payload).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicules-all"] });
      queryClient.invalidateQueries({ queryKey: ["vehicule-owner-vehicules"] });
      queryClient.invalidateQueries({ queryKey: ["vehicules-review-queue"] });
    },
  });
};

export const useUploadVehiculeImagesMutation = () => {
  return useMutation({
    mutationFn: ({
      vehiculeId,
      formData,
    }: {
      vehiculeId: string;
      formData: FormData;
    }) =>
      vehiculeAPI.upload_vehicule_images(vehiculeId, formData).then((res) => res.data),
  });
};

export const useUpdateVehiculeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateVehiculePayload | FormData;
    }) => {
      const res = await vehiculeAPI.update_vehicule(id, payload);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vehicules-all"] });
      queryClient.invalidateQueries({ queryKey: ["vehicule-owner-vehicules"] });
      queryClient.invalidateQueries({ queryKey: ["vehicule-one", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["vehicules-review-queue"] });
      queryClient.invalidateQueries({ queryKey: ["vehicules-public"] });
    },
  });
};

export const usePatchVehiculeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateVehiculePayload | FormData;
    }) => {
      const res = await vehiculeAPI.patch_vehicule(id, payload);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vehicules-all"] });
      queryClient.invalidateQueries({ queryKey: ["vehicule-owner-vehicules"] });
      queryClient.invalidateQueries({ queryKey: ["vehicule-one", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["vehicules-review-queue"] });
      queryClient.invalidateQueries({ queryKey: ["vehicules-public"] });
    },
  });
};

export const useSubmitVehicleForReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => vehiculeAPI.submit_vehicle_for_review(id).then((res) => res.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vehicules-all"] });
      queryClient.invalidateQueries({ queryKey: ["vehicule-owner-vehicules"] });
      queryClient.invalidateQueries({ queryKey: ["vehicule-one", data.id] });
      queryClient.invalidateQueries({ queryKey: ["vehicules-review-queue"] });
    },
  });
};

export const useReviewVehicleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ReviewVehiclePayload;
    }) => vehiculeAPI.review_vehicle(id, payload).then((res) => res.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vehicules-all"] });
      queryClient.invalidateQueries({ queryKey: ["vehicule-owner-vehicules"] });
      queryClient.invalidateQueries({ queryKey: ["vehicule-one", data.id] });
      queryClient.invalidateQueries({ queryKey: ["vehicules-review-queue"] });
      queryClient.invalidateQueries({ queryKey: ["vehicules-public"] });
    },
  });
};

export const useDeleteVehiculeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => vehiculeAPI.delete_vehicule(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicules-all"] });
      queryClient.invalidateQueries({ queryKey: ["vehicule-owner-vehicules"] });
      queryClient.invalidateQueries({ queryKey: ["vehicules-review-queue"] });
      queryClient.invalidateQueries({ queryKey: ["vehicules-public"] });
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
    staleTime: 60 * 1000,
  });
};

export const useCategoryVehiculesQuery = (id?: string) => {
  return useQuery<Vehicule[]>({
    queryKey: ["vehicule-categorys-vehicules", id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) throw new Error("ID catégorie manquant");
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
      queryClient.invalidateQueries({ queryKey: ["vehicule-one", variables.vehiculeId] });
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