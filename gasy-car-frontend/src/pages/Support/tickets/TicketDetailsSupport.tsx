import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Loader2, MessageSquareText } from "lucide-react";

import { useCurrentUserQuery } from "@/useQuery/useCurrentUserQuery";
import { useTicketDetail } from "@/useQuery/support/useTicketDetail";
import { useTicketMessages } from "@/useQuery/support/useTicketMessages";
import { useClients } from "@/useQuery/support/useClients";
import { useChatProfiles } from "@/useQuery/support/useChatProfiles";
import { useTicketSocket } from "@/hooks/support/useTicketSocket";
import { useSendMessage } from "@/useQuery/support/useSendMessage";

import { SupportTicketDetailsHeader } from "@/components/support/SupportTicketDetailHeader";
import { SupportTicketConversationPanel } from "@/components/support/SupportTicketConversationPanel";

import type { User } from "@/types/userType";

import {
  formatTicketFullDateTime,
  getTicketRelevantDate,
  getTicketRoleLabel,
} from "@/features/support/supportUi";

export default function TicketDetailsSupport() {
  const { id } = useParams();
  const ticketId = String(id ?? "").trim();

  const { data: currentUser } = useCurrentUserQuery();
  const currentUserId = String(currentUser?.id ?? "").trim();

  const { data: ticket, isLoading: loadingTicket } = useTicketDetail(ticketId);
  const { data: messages = [], isLoading: loadingMessages } =
    useTicketMessages(ticketId, true);

  const clientsQuery = useClients();
  const users = (clientsQuery.data ?? []) as User[];

  const senderIds = useMemo(() => {
    const ids: string[] = [];
    for (const msg of messages as any[]) {
      const raw =
        msg?.sender_id ??
        msg?.sender?.id ??
        msg?.user_id ??
        msg?.user?.id ??
        msg?.sender ??
        msg?.user ??
        "";
      if (raw) ids.push(String(raw));
    }
    if (currentUserId) ids.push(currentUserId);
    return ids;
  }, [messages, currentUserId]);

  const { byId, byEmail, isLoading: loadingProfiles } = useChatProfiles(
    senderIds,
    users
  );

  const { sendMessage } = useTicketSocket(ticketId, true);
  const { mutate: sendMessageFallback, isPending: sendingFallback } =
    useSendMessage();

  const loading =
    loadingTicket || loadingMessages || clientsQuery.isLoading || loadingProfiles;

  if (!ticketId) {
    return <div className="p-6 text-red-500">Ticket introuvable</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-7 w-7 animate-spin" />
      </div>
    );
  }

  if (!ticket) {
    return <div className="p-6">Ticket introuvable</div>;
  }

  const requester =
    users.find((u) => String(u?.id) === String(ticket.user)) ?? null;
  const requesterName = requester
    ? `${requester.first_name ?? ""} ${requester.last_name ?? ""}`.trim() ||
      requester.email ||
      "Utilisateur"
    : "Utilisateur";

  const requesterRole = getTicketRoleLabel(requester?.role);

  const onSend = (text: string) => {
    const value = text.trim();
    if (!value) return;

    const sentBySocket = sendMessage(value);
    if (sentBySocket) return;

    sendMessageFallback({ ticket: ticketId, message: value });
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 to-slate-100/50 p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-5">
        <SupportTicketDetailsHeader
          ticket={ticket}
          backHref="/support/tickets"
          backLabel="Retour à la liste support"
          eyebrow={`Ticket #${ticket.id.slice(0, 8)}`}
          topBadgeLabel="Vue support"
          requesterLabel="Demandeur"
          requesterName={requesterName}
          requesterSecondaryText={requesterRole}
          contextIcon={MessageSquareText}
          sideTitle="Suivi du ticket"
          referenceText={`#${ticket.id.slice(0, 8)}`}
          sideItems={[
            {
              label: "Dernière activité",
              value: formatTicketFullDateTime(getTicketRelevantDate(ticket)),
            },
            {
              label: "Assignation",
              value: ticket.assigned_admin ? "Ticket assigné" : "Non assigné",
            },
            {
              label: "Conseil de traitement",
              value:
                "Répondez dans ce fil pour centraliser les échanges et garder l’historique complet.",
            },
          ]}
        />

        <SupportTicketConversationPanel
          title="Conversation support"
          description="Répondez au demandeur et suivez l’historique du ticket."
          messages={messages}
          currentUserId={currentUserId}
          profilesById={byId}
          profilesByEmail={byEmail}
          onSend={onSend}
          disabled={sendingFallback}
        />
      </div>
    </div>
  );
}