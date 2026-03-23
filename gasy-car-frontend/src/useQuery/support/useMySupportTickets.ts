import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { supportAPI } from "@/Actions/supportApi";
import { useCurrentUserQuery } from "@/useQuery/useCurrentUserQuery";
import type { SupportTicket } from "@/types/supportTypes";

function getRelevantDate(ticket: SupportTicket) {
  return ticket.last_activity_at || ticket.updated_at || ticket.created_at;
}

export const useMySupportTickets = () => {
  const { data: currentUser, isLoading: isCurrentUserLoading } = useCurrentUserQuery();

  const query = useQuery<SupportTicket[]>({
    queryKey: ["my-support-tickets", currentUser?.id],
    enabled: !!currentUser?.id,
    queryFn: async () => {
      const res = await supportAPI.get_all_tickets();
      const rows = Array.isArray(res.data) ? res.data : [];

      // sécurité supplémentaire côté frontend
      const mine = rows.filter(
        (ticket) => String(ticket.user) === String(currentUser?.id)
      );

      return mine.sort((a, b) => {
        const aTime = new Date(getRelevantDate(a) || a.created_at).getTime();
        const bTime = new Date(getRelevantDate(b) || b.created_at).getTime();
        return bTime - aTime;
      });
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
  });

  const tickets = useMemo(() => query.data ?? [], [query.data]);

  return {
    ...query,
    tickets,
    currentUser,
    isLoading: isCurrentUserLoading || query.isLoading,
  };
};