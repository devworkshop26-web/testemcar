// src/useQuery/support/useDeleteTicket.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supportAPI } from "@/Actions/supportApi";

export const useDeleteTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return supportAPI.delete_ticket(id);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
    },
  });
};
