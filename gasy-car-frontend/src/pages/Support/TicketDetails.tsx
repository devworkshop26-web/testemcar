import { useParams } from "react-router-dom";
import { useRef, useEffect, useMemo } from "react";

import { useTicketDetail } from "@/useQuery/support/useTicketDetail";
import { useTicketMessages } from "@/useQuery/support/useTicketMessages";
import { useSendMessage } from "@/useQuery/support/useSendMessage";
import { useAllUsers } from "@/useQuery/useAllUsers";
import { User } from "@/types/userType";

import { Loader2 } from "lucide-react";
import { TicketHeader } from "./TicketHeader";
import { ConversationBox } from "@/components/support/ConversationBox";
import { MessageInput } from "@/components/support/MessageInput";
import { useTicketSocket } from "@/hooks/support/useTicketSocket";
import { useUnreadTickets } from "@/hooks/support/useUnreadTickets";

export default function TicketDetails() {
  const { id } = useParams();
  const ticketId = id;

  const { markRead } = useUnreadTickets();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (!ticketId) {
    return (
      <div className="text-red-600 font-medium p-4">
        ❌ Ticket introuvable (identifiant manquant).
      </div>
    );
  }

  // ✅ Activer WS pour ce ticket
  useTicketSocket(ticketId);

  const { data: ticket, isLoading: loadingTicket } = useTicketDetail(ticketId);
  const { data: messages, isLoading: loadingMessages } = useTicketMessages(ticketId);
  const { data: users } = useAllUsers();
  const { mutate: sendMessage, isPending: sending } = useSendMessage();

  const loading = loadingTicket || loadingMessages;

  /** 🔥 Scroll automatique quand messages changent */
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ... inside component ...

  /** 🎯 Trouver les infos de l'utilisateur associé au ticket */
  const ticketUser = useMemo(() => {
    if (!ticket || !users) return null;

    return (users as User[]).find((u) => u.id === ticket.user) || null;
  }, [ticket, users]);

  const onSend = (text: string) => {
    if (!text.trim()) return;

    sendMessage(
      { ticket: ticketId, message: text },
      {
        onSuccess: () => {
          setTimeout(scrollToBottom, 50);
        },
      }
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center text-gray-500 mt-10">
        🚫 Ce ticket n'existe pas ou a été supprimé.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* 🔥 TicketHeader reçoit maintent les infos utilisateur */}
      <TicketHeader ticket={ticket} user={ticketUser} />

      <div className="flex-1 overflow-y-auto p-4">
        <ConversationBox messages={messages ?? []} currentUserId={ticket.user} />

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-3">
        <MessageInput disabled={sending} onSend={onSend} />
      </div>
    </div>
  );
}
