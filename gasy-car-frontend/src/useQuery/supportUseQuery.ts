// src/useQuery/supportUseQuery.ts

import { useQuery, useMutation } from "@tanstack/react-query";
import { supportAPI } from "@/Actions/supportApi";
import { SupportTicket, TicketMessage } from "@/types/supportTypes";

export const useSupportQuery = () => {
  // GET — all tickets
  const { data: ticketsData, refetch: refetchTickets } = useQuery<
    Array<SupportTicket>
  >({
    queryKey: ["support-tickets"],
    queryFn: async () => {
      const res = await supportAPI.get_all_tickets();
      return Array.isArray(res.data) ? res.data : [];
    },
    staleTime: 1000 * 60 * 10,
    retry: 2,
  });

  // GET — detail of a ticket
  const getTicketDetail = (ticketId: string) =>
    useQuery<SupportTicket>({
      queryKey: ["support-ticket-detail", ticketId],
      queryFn: async () => {
        const res = await supportAPI.get_ticket_detail(ticketId);
        return res.data;
      },
      enabled: !!ticketId,
    });

  // GET — messages
  const getTicketMessages = (ticketId: string) =>
    useQuery<Array<TicketMessage>>({
      queryKey: ["support-ticket-messages", ticketId],
      queryFn: async () => {
        const res = await supportAPI.get_ticket_messages(ticketId);
        return Array.isArray(res.data) ? res.data : [];
      },
      enabled: !!ticketId,
    });

  // CREATE — ticket
  const createTicketMutation = useMutation({
    mutationFn: supportAPI.create_ticket,
  });

  // UPDATE — ticket
  const updateTicketMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      supportAPI.update_ticket(id, payload),
  });

  // CREATE — message
  const createMessageMutation = useMutation({
    mutationFn: supportAPI.create_message,
  });

  return {
    ticketsData,
    refetchTickets,

    getTicketDetail,
    getTicketMessages,

    createTicketMutation,
    updateTicketMutation,
    createMessageMutation,
  };
};
