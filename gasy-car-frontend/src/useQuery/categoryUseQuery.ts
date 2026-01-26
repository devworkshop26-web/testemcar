
import { categoryVehiculeAPI } from "@/Actions/categoryVehiculeApi";
import { Category, CreateCategoryPayload, UpdateCategoryPayload } from "@/types/categoryType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const categoryVehiculeUseQuery = () => {
  // all Category query
  const { data: CategoryData ,isLoading} = useQuery<Array<Category>>({
    queryKey: ["category-all"],
    queryFn: async (): Promise<Category[]> => {
      const { data } = await categoryVehiculeAPI.get_all_categorys();
      

      // sécurité si data n'est pas un tableau
      return Array.isArray(data) ? data : [];
    },
    staleTime: 1000 * 60 * 60 * 24 * 365, // 1 an mais écrit propre
    retry: 2,
  });


  return { CategoryData ,isLoading};
}

export const CategoryVehiculeUseQuery = (id?: string) => {
  return useQuery<Category>({
    queryKey: ["category-vehicule-one", id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) throw new Error("ID Category manquant");
      const { data } = await categoryVehiculeAPI.get_one_category(id);
      return data;
    },
    retry: 1,
  });
};


export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      categoryVehiculeAPI.create_category(payload).then((res) => res.data),
    onSuccess: () => {
      // rafraîchir la liste
      queryClient.invalidateQueries({ queryKey: ["category-all"] });
    },
  });
};


export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCategoryPayload;
    }) => categoryVehiculeAPI.update_category(id, payload).then((res) => res.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["category-all"] });
      queryClient.invalidateQueries({
        queryKey: ["category-vehicule-one", id],
      });
    },
  });
};


export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      categoryVehiculeAPI.delete_category(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-all"] });
    },
  });
};
