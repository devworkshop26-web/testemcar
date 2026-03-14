// queries/modele-vehicule-query.ts
import { modeleVehiculeAPI } from "@/Actions/ModeleVehiculeApi";
import { CreateModeleVehiculePayload, ModeleVehicule, UpdateModeleVehiculePayload } from "@/types/ModeleVehiculeType";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;

// Liste
export const useModelesVehiculeQuery = () => {
  return useQuery<ModeleVehicule[]>({
    queryKey: ["modeles-vehicule-all"],
    queryFn: async () => {
      const { data } = await modeleVehiculeAPI.get_all_modeles();
      return Array.isArray(data) ? data : [];
    },
    staleTime: ONE_YEAR_MS,
    retry: 2,
  });
};

// Détail
export const useModeleVehiculeQuery = (id?: string) => {
  return useQuery<ModeleVehicule>({
    queryKey: ["modele-vehicule-one", id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) throw new Error("ID modèle manquant");
      const { data } = await modeleVehiculeAPI.get_one_modele(id);
      return data;
    },
    retry: 1,
  });
};

// Create
export const useCreateModeleVehiculeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateModeleVehiculePayload) =>
      modeleVehiculeAPI.create_modele(payload).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modeles-vehicule-all"] });
    },
  });
};

// Update
export const useUpdateModeleVehiculeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateModeleVehiculePayload;
    }) =>
      modeleVehiculeAPI.update_modele(id, payload).then((res) => res.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["modeles-vehicule-all"] });
      queryClient.invalidateQueries({ queryKey: ["modele-vehicule-one", id] });
    },
  });
};

// Delete
export const useDeleteModeleVehiculeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      modeleVehiculeAPI.delete_modele(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modeles-vehicule-all"] });
    },
  });
};
