// src/useQuery/support/useSendMessage.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supportAPI } from "@/Actions/supportApi";
import { useCurentuser } from "@/useQuery/authUseQuery";

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { user } = useCurentuser(); // <<< UTILISER LE BON HOOK

  return useMutation({
    mutationFn: async (payload: { ticket: string; message: string }) => {
      if (!user?.id) {
        throw new Error("Utilisateur non authentifié — sender manquant");
      }

      const body = {
        message: payload.message,
        ticket: payload.ticket,
        sender: user.id, // <<< MAINTENANT OK POUR SUPPORT + CLIENT
      };

      return supportAPI.create_message(body);
    },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["support-ticket-messages", variables.ticket],
      });
      queryClient.invalidateQueries({
        queryKey: ["support-ticket-detail", variables.ticket],
      });
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
    },
  });
};
