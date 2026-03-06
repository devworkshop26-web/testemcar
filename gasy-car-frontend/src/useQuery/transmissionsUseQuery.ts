// queries/transmissions-vehicule-query.ts
import { transmissionsVehiculeAPI } from "@/Actions/transmissionsVehiculeAPI";
import { CreateTransmissionPayload, Transmission, UpdateTransmissionPayload } from "@/types/transmissionType";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;

export const transmissionsVehiculeUseQuery = () => {
  return useQuery<Transmission[]>({
    queryKey: ["transmissions-vehicule-all"],
    queryFn: async () => {
      const { data } = await transmissionsVehiculeAPI.get_all_transmissions();
      return Array.isArray(data) ? data : [];
    },
    staleTime: ONE_YEAR_MS,
    retry: 2,
  });
};

export const transmissionVehiculeUseQuery = (id?: string) => {
  return useQuery<Transmission>({
    queryKey: ["transmissions-vehicule-one", id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) throw new Error("ID transmission manquant");
      const { data } = await transmissionsVehiculeAPI.get_one_transmission(id);
      return data;
    },
    retry: 1,
  });
};

export const useCreateTransmissionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTransmissionPayload) =>
      transmissionsVehiculeAPI
        .create_transmission(payload)
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transmissions-vehicule-all"],
      });
    },
  });
};

export const useUpdateTransmissionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateTransmissionPayload;
    }) =>
      transmissionsVehiculeAPI
        .update_transmission(id, payload)
        .then((res) => res.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ["transmissions-vehicule-all"],
      });
      queryClient.invalidateQueries({
        queryKey: ["transmissions-vehicule-one", id],
      });
    },
  });
};

export const useDeleteTransmissionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      transmissionsVehiculeAPI.delete_transmission(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transmissions-vehicule-all"],
      });
    },
  });
};
