import { useMutation } from "@tanstack/react-query";
import { InstanceAxis } from "@/helper/InstanceAxios";

export function useUpdateTicketStatus() {
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
  });
}
