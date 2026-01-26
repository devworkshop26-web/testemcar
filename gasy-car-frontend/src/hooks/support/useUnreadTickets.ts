import { useQueryClient } from "@tanstack/react-query";

export const useUnreadTickets = () => {
  const queryClient = useQueryClient();

  const unreadTickets =
    queryClient.getQueryData<string[]>(["unread-tickets"]) ?? [];

  const markUnread = (ticketId: string) => {
    queryClient.setQueryData<string[]>(["unread-tickets"], (old = []) =>
      old.includes(ticketId) ? old : [...old, ticketId]
    );
  };

  const markRead = (ticketId: string) => {
    queryClient.setQueryData<string[]>(["unread-tickets"], (old = []) =>
      old.filter((id) => id !== ticketId)
    );
  };

  return { unreadTickets, markUnread, markRead };
};
