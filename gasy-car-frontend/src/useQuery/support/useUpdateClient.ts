import { useMutation } from "@tanstack/react-query";
import { InstanceAxis } from "@/helper/InstanceAxios";

export function useUpdateClient(clientId: string) {
  return useMutation({
    mutationFn: async (data: FormData) => {
      return await InstanceAxis.put(`/users/profile/${clientId}/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },

    onSuccess: () => {
      console.log("%c✔ Modification réussie !", "color: green; font-size: 14px;");
    },

    onError: (err) => {
      console.log("%c❌ Échec de la modification :", "color: red; font-size: 14px;");
      console.error(err);
    },
  });
}
