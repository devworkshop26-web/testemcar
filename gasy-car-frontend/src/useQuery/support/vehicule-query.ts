import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vehiculeAPI } from "@/Actions/vehiculeApi";

export const useValidateVehiculeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, valide }: { id: string; valide: boolean }) => {
      const res = await vehiculeAPI.patch_vehicule(id, { valide } as any);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vehicules-all"] });
      queryClient.invalidateQueries({ queryKey: ["vehicule-one", variables.id] });
    },
  });
};
