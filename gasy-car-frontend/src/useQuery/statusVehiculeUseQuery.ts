// queries/status-vehicule-query.ts
import { statusVehiculeAPI } from "@/Actions/StatusVehiculeApi";
import { CreateStatusVehiculePayload, StatusVehicule, UpdateStatusVehiculePayload } from "@/types/StatusVehiculeType";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;

// Liste
export const useStatusVehiculesQuery = () => {
  return useQuery<StatusVehicule[]>({
    queryKey: ["status-vehicule-all"],
    queryFn: async () => {
      const { data } = await statusVehiculeAPI.get_all_status();
      return Array.isArray(data) ? data : [];
    },
    staleTime: ONE_YEAR_MS,
    retry: 2,
  });
};

// Détail
export const useStatusVehiculeQuery = (id?: string) => {
  return useQuery<StatusVehicule>({
    queryKey: ["status-vehicule-one", id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) throw new Error("ID status manquant");
      const { data } = await statusVehiculeAPI.get_one_status(id);
      return data;
    },
    retry: 1,
  });
};

// Create
export const useCreateStatusVehiculeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateStatusVehiculePayload) =>
      statusVehiculeAPI.create_status(payload).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["status-vehicule-all"] });
    },
  });
};

// Update
export const useUpdateStatusVehiculeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateStatusVehiculePayload;
    }) =>
      statusVehiculeAPI.update_status(id, payload).then((res) => res.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["status-vehicule-all"] });
      queryClient.invalidateQueries({ queryKey: ["status-vehicule-one", id] });
    },
  });
};

// Delete
export const useDeleteStatusVehiculeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      statusVehiculeAPI.delete_status(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["status-vehicule-all"] });
    },
  });
};
