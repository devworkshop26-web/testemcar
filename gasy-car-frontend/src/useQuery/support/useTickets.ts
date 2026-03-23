import { useQuery } from "@tanstack/react-query";
import { supportAPI } from "@/Actions/supportApi";
import type { SupportTicket } from "@/types/supportTypes";

export const useTickets = () => {
  return useQuery<SupportTicket[]>({
    queryKey: ["support-tickets"],
    queryFn: async () => {
      const res = await supportAPI.get_all_tickets();
      const tickets = Array.isArray(res.data) ? res.data : [];

      return tickets.sort((a, b) => {
        const aDate = new Date(a.last_activity_at || a.created_at).getTime();
        const bDate = new Date(b.last_activity_at || b.created_at).getTime();
        return bDate - aDate;
      });
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
  });
};