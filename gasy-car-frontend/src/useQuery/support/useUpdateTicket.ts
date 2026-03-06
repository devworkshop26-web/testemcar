import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supportAPI } from "@/Actions/supportApi";
import type { SupportTicket } from "@/types/supportTypes";

interface UpdateTicketPayload {
  id: string;
  payload: Partial<SupportTicket>;
}

export const useUpdateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateTicketPayload) =>
      supportAPI.update_ticket(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["support-ticket-detail", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
    },
  });
};
