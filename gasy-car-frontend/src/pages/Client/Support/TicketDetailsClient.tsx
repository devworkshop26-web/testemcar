import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useRef } from "react";
import { Loader2, ArrowLeft, UserIcon } from "lucide-react";

import { useTicketDetail } from "@/useQuery/support/useTicketDetail";
import { useTicketMessages } from "@/useQuery/support/useTicketMessages";
import { useClients } from "@/useQuery/support/useClients";
import { useChatProfiles } from "@/useQuery/support/useChatProfiles";

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

const statusColors: Record<string, string> = {
  OPEN: "bg-blue-100/80 text-blue-700 border border-blue-200",
  IN_PROGRESS: "bg-orange-100/80 text-orange-700 border border-orange-200",
  RESOLVED: "bg-emerald-100/80 text-emerald-700 border border-emerald-200",
  CLOSED: "bg-slate-100/80 text-slate-600 border border-slate-200",
};

export default function TicketDetailsClient() {
  const { id } = useParams();
  const ticketId = String(id ?? "").trim();

  const myUserId = useMemo(() => getUserIdFromAccessToken(), []);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const { data: ticket, isLoading: loadingTicket } = useTicketDetail(ticketId);

  const isOwner = useMemo(() => {
    if (!ticket || !myUserId) return false;
    return String((ticket as any).user) === String(myUserId);
  }, [ticket, myUserId]);

  const { data: messages, isLoading: loadingMessages } = useTicketMessages(
    ticketId,
    isOwner
  );

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

  const { byId, byEmail, isLoading: loadingProfiles } = useChatProfiles(
    senderIds,
    users
  );

  const { sendMessage } = useTicketSocket(ticketId, isOwner);

  useEffect(() => {
    if (isOwner) scrollToBottom();
  }, [isOwner, messages]);

  if (!ticketId) return <div className="p-4 text-red-500">Ticket introuvable</div>;

  if (loadingTicket || clientsQuery.isLoading) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!ticket) return <div className="p-4">Ticket introuvable</div>;

  if (!isOwner) {
    return (
      <div className="p-6">
        <div className="rounded-xl border bg-white p-4">
          <p className="font-semibold text-red-600">Accès refusé</p>
          <p className="text-sm text-gray-600 mt-1">
            Ce ticket ne vous appartient pas.
          </p>
        </div>
      </div>
    );
  }

  if (loadingMessages || loadingProfiles) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const onSend = (text: string) => {
    const msg = text.trim();
    if (!msg) return;
    sendMessage(msg);
    setTimeout(scrollToBottom, 50);
  };

  // ✅ si tu veux afficher le nom du client (toi) :
  const me = users.find((u) => String(u.id) === String(myUserId)) ?? null;
  const myName = me ? `${me.first_name ?? ""} ${me.last_name ?? ""}`.trim() : "";

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white shadow-xl">
      {/* ✅ HEADER DU TICKET (AJOUTÉ) */}
      <div className="p-4 border-b bg-white">
        <Link
          to="/client/supports"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>

        <div className="mt-4 rounded-2xl border bg-gradient-to-br from-white to-slate-50 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-xl font-bold truncate">{(ticket as any).title}</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Créé le{" "}
                {new Date((ticket as any).created_at).toLocaleDateString("fr-FR")}
              </p>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                statusColors[(ticket as any).status] ?? statusColors.OPEN
              }`}
            >
              {String((ticket as any).status ?? "OPEN").replace("_", " ")}
            </span>
          </div>

          <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-slate-100/60">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Ticket créé par</p>
              <p className="text-sm font-semibold truncate">
                {myName || "Vous"}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
              Description
            </p>
            <p className="text-sm mt-1 text-foreground/80 whitespace-pre-wrap">
              {(ticket as any).description}
            </p>
          </div>

          <p className="mt-4 text-xs text-muted-foreground font-mono">
            #{String((ticket as any).id).slice(0, 8)}
          </p>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-100">
        <ConversationBox
          messages={messages ?? []}
          currentUserId={myUserId}
          profilesById={byId}
          profilesByEmail={byEmail}
        />
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="border-t p-3 bg-white">
        <MessageInput disabled={false} onSend={onSend} />
      </div>
    </div>
  );
}
