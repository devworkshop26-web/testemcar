import { useParams } from "react-router-dom";
import { useEffect, useMemo, useRef } from "react";
import { Loader2 } from "lucide-react";

import { useTicketDetail } from "@/useQuery/support/useTicketDetail";
import { useTicketMessages } from "@/useQuery/support/useTicketMessages";
import { useClients } from "@/useQuery/support/useClients";
import { useChatProfiles } from "@/useQuery/support/useChatProfiles";

import { TicketHeader } from "@/pages/Support/TicketHeader";
import { ConversationBox } from "@/components/support/ConversationBox";
import { MessageInput } from "@/components/support/MessageInput";
import { useTicketSocket } from "@/hooks/support/useTicketSocket";
import type { User } from "@/types/userType";

function getUserIdFromAccessToken(): string {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) return "";
    const payload = token.split(".")[1];
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return String(json.user_id ?? json.id ?? json.sub ?? "");
  } catch {
    return "";
  }
}

export default function TicketDetailsSupport() {
  const { id } = useParams();
  const ticketId = id ?? "";

  const myUserId = useMemo(() => getUserIdFromAccessToken(), []);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const { data: ticket, isLoading: loadingTicket } = useTicketDetail(ticketId);
  const { data: messages, isLoading: loadingMessages } = useTicketMessages(ticketId, true);

  const clientsQuery = useClients();
  const users = (clientsQuery.data ?? []) as User[];

  const senderIds = useMemo(() => {
    const ids: string[] = [];
    for (const m of (messages ?? []) as any[]) {
      const raw =
        m?.sender_id ??
        m?.sender?.id ??
        m?.user_id ??
        m?.user?.id ??
        m?.sender ??
        m?.user ??
        "";
      if (raw) ids.push(String(raw));
    }
    if (myUserId) ids.push(myUserId);
    return ids;
  }, [messages, myUserId]);

  const { byId, byEmail, isLoading: loadingProfiles } = useChatProfiles(senderIds, users);

  // ✅ support toujours autorisé
  const { sendMessage } = useTicketSocket(ticketId, true);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loading = loadingTicket || loadingMessages || clientsQuery.isLoading || loadingProfiles;

  if (!ticketId) return <div className="p-4 text-red-500">Ticket introuvable</div>;

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!ticket) return <div className="p-4">Ticket introuvable</div>;

  const ticketUser = users.find((u: any) => String(u?.id) === String((ticket as any)?.user)) ?? null;

  const onSend = (text: string) => {
    const msg = text.trim();
    if (!msg) return;
    sendMessage(msg);
    setTimeout(scrollToBottom, 50);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white shadow-xl">
      <TicketHeader ticket={ticket as any} user={ticketUser} />

      <div className="flex-1 overflow-y-auto p-4 bg-slate-100">
        <ConversationBox
          messages={messages ?? []}
          currentUserId={myUserId}
          profilesById={byId}
          profilesByEmail={byEmail}
        />
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-3 bg-white">
        <MessageInput disabled={false} onSend={onSend} />
      </div>
    </div>
  );
}
