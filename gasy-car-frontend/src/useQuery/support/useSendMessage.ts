import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supportAPI } from "@/Actions/supportApi";

type SendMessagePayload = {
  ticket: string;
  message: string;
  attachment_url?: string;
  is_internal?: boolean;
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SendMessagePayload) => {
      const body = {
        ticket: payload.ticket,
        message: payload.message,
        attachment_url: payload.attachment_url ?? "",
        ...(payload.is_internal ? { is_internal: true } : {}),
      };

      const res = await supportAPI.create_message(body);
      return res.data;
    },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["support-ticket-messages", variables.ticket],
      });
      queryClient.invalidateQueries({
        queryKey: ["support-ticket-detail", variables.ticket],
      });
      queryClient.invalidateQueries({
        queryKey: ["support-tickets"],
      });
    },
  });
};