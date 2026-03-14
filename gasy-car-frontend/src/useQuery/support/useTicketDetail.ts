// src/useQuery/support/useTicketDetail.ts
import { useQuery } from "@tanstack/react-query";
import { supportAPI } from "@/Actions/supportApi";
import type { SupportTicket } from "@/types/supportTypes";

export const useTicketDetail = (ticketId: string) => {
  return useQuery<SupportTicket>({
    queryKey: ["support-ticket-detail", ticketId],
    queryFn: async () => {
      const res = await supportAPI.get_ticket_detail(ticketId);
      return res.data;
    },
    enabled: Boolean(ticketId),
    staleTime: 1000 * 60 * 2,
  });
};
