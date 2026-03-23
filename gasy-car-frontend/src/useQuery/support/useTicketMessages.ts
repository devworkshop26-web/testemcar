import { useQuery } from "@tanstack/react-query";
import { supportAPI } from "@/Actions/supportApi";
import type { TicketMessage } from "@/types/supportTypes";

export const ticketMessagesKey = (ticketId: string) => [
  "support-ticket-messages",
  ticketId,
];

function normalizeTicketId(id: string) {
  return String(id ?? "").trim();
}

function getMsgTicketId(m: any): string {
  return String(m?.ticket ?? m?.ticket_id ?? "").trim();
}

export function useTicketMessages(ticketId: string, enabled: boolean = true) {
  const tid = normalizeTicketId(ticketId);

  return useQuery<TicketMessage[]>({
    queryKey: ticketMessagesKey(tid),
    enabled: !!tid && enabled,
    queryFn: async () => {
      const res = await supportAPI.get_ticket_messages(tid);

      const rows: any[] = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.results)
        ? res.data.results
        : [];

      const filtered = rows.filter((m) => getMsgTicketId(m) === tid);

      filtered.sort((a, b) => {
        const da = new Date(a?.created_at ?? 0).getTime();
        const db = new Date(b?.created_at ?? 0).getTime();
        return da - db;
      });

      return filtered as TicketMessage[];
    },
    refetchInterval: () =>
      document.visibilityState === "visible" ? 4000 : false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
}