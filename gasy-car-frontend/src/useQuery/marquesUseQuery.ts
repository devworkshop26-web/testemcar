import { marquesVehiculeAPI } from "@/Actions/MarquesVehiculeAPI";
import { CreateMarquePayload, Marque, UpdateMarquePayload } from "@/types/marqueType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const marquesVehiculeUseQuery = () => {
  return useQuery<Array<Marque>>({
    queryKey: ["marques-vehicule-all"],
    queryFn: async (): Promise<Marque[]> => {
      const { data } = await marquesVehiculeAPI.get_all_marques();
      return Array.isArray(data) ? data : [];
    },
    staleTime: 1000 * 60 * 60 * 24 * 365, // 1 an mais écrit propre
    retry: 2,
  });
};

export const marqueVehiculeUseQuery = (id?: string) => {
  return useQuery<Marque>({
    queryKey: ["marques-vehicule-one", id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) throw new Error("ID marque manquant");
      const { data } = await marquesVehiculeAPI.get_one_marque(id);
      return data;
    },
    retry: 1,
  });
};


export const useCreateMarqueMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMarquePayload) =>
      marquesVehiculeAPI.create_marque(payload).then((res) => res.data),
    onSuccess: () => {
      // rafraîchir la liste
      queryClient.invalidateQueries({ queryKey: ["marques-vehicule-all"] });
    },
  });
};


export const useUpdateMarqueMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateMarquePayload;
    }) => marquesVehiculeAPI.update_marque(id, payload).then((res) => res.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["marques-vehicule-all"] });
      queryClient.invalidateQueries({
        queryKey: ["marques-vehicule-one", id],
      });
    },
  });
};


export const useDeleteMarqueMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      marquesVehiculeAPI.delete_marque(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marques-vehicule-all"] });
    },
  });
};
