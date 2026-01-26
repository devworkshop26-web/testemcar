import { useQuery } from "@tanstack/react-query";
import { supportAPI } from "@/Actions/supportApi";
import type { SupportTicket } from "@/types/supportTypes";

export const useTickets = () => {
  return useQuery<SupportTicket[]>({
    queryKey: ["support-tickets"],
    queryFn: async () => {
      const res = await supportAPI.get_all_tickets();
      return res.data || [];
    }
  });
};
