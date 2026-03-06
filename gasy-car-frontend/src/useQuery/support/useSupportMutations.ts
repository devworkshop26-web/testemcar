import { useMutation } from "@tanstack/react-query";
import { supportAPI } from "@/Actions/supportApi";

export const useSupportMutations = () => {
  return {
    createTicket: useMutation({ mutationFn: supportAPI.create_ticket }),
    updateTicket: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: any }) =>
        supportAPI.update_ticket(id, payload),
    }),
    createMessage: useMutation({
      mutationFn: supportAPI.create_message,
    }),
  };
};
