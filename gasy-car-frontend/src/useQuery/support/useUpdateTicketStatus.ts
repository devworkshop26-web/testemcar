import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InstanceAxis } from "@/helper/InstanceAxios";

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ticketId,
      status,
    }: {
      ticketId: string;
      status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
    }) =>
      InstanceAxis.patch(`/support/support-tickets/${ticketId}/`, {
        status,
      }),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["support-tickets"],
      });
      queryClient.invalidateQueries({
        queryKey: ["support-ticket-detail", variables.ticketId],
      });
    },
  });
}