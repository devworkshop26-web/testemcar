import { useMutation } from "@tanstack/react-query";
import { InstanceAxis } from "@/helper/InstanceAxios";

export function useResolveTicket() {
  return useMutation({
    mutationFn: async (ticketId: string) => {
      return InstanceAxis.post(
        `/support/support-tickets/${ticketId}/resolve/`
      );
    },
  });
}
