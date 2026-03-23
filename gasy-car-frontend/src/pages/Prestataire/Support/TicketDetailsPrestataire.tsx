"use client";

import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Car, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { useCurrentUserQuery } from "@/useQuery/useCurrentUserQuery";
import { useTicketDetail } from "@/useQuery/support/useTicketDetail";
import { useTicketMessages } from "@/useQuery/support/useTicketMessages";
import { useSendMessage } from "@/useQuery/support/useSendMessage";
import { useAllUsers } from "@/useQuery/useAllUsers";
import { useChatProfiles } from "@/useQuery/support/useChatProfiles";
import { useTicketSocket } from "@/hooks/support/useTicketSocket";

import { SupportTicketDetailsHeader } from "@/components/support/SupportTicketDetailHeader";
import { SupportTicketConversationPanel } from "@/components/support/SupportTicketConversationPanel";

import type { User } from "@/types/userType";

import {
  formatTicketFullDateTime,
  getTicketRelevantDate,
} from "@/features/support/supportUi";

export default function TicketDetailsPrestataire() {
  const { id } = useParams();
  const ticketId = String(id ?? "").trim();

  const queryClient = useQueryClient();
  const cachedUser = queryClient.getQueryData<User>(["currentUser"]);

  const { data: currentUser } = useCurrentUserQuery();
  const currentUserId = String(currentUser?.id ?? cachedUser?.id ?? "").trim();

  const { data: ticket, isLoading: loadingTicket } = useTicketDetail(ticketId);

  const isOwner = useMemo(() => {
    if (!ticket || !currentUserId) return false;
    return String(ticket.user) === String(currentUserId);
  }, [ticket, currentUserId]);

  const { data: messages = [], isLoading: loadingMessages } = useTicketMessages(
    ticketId,
    isOwner
  );

  const { data: users } = useAllUsers();
  const allUsers = (users ?? []) as User[];

  const { mutate: sendMessageFallback, isPending: sending } =
    useSendMessage();
  const { sendMessage } = useTicketSocket(ticketId, isOwner);

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
    allUsers
  );

  const loading = loadingTicket || loadingMessages || loadingProfiles;

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

  if (!isOwner) {
    return (
      <div className="p-6">
        <div className="rounded-3xl border border-red-200 bg-white p-6">
          <p className="font-semibold text-red-600">Accès refusé</p>
          <p className="mt-2 text-sm text-slate-600">
            Ce ticket ne vous appartient pas.
          </p>
        </div>
      </div>
    );
  }

  const me =
    allUsers.find((u) => String(u.id) === String(currentUserId)) ?? null;
  const myName = me
    ? `${me.first_name ?? ""} ${me.last_name ?? ""}`.trim()
    : "Vous";

  const onSend = (text: string) => {
    const value = text.trim();
    if (!value) return;

    const sentBySocket = sendMessage(value);
    if (sentBySocket) return;

    sendMessageFallback({ ticket: ticketId, message: value });
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 to-slate-100/50 p-4 md:p-6">
      <div className="mx-auto max-w-5xl space-y-5">
        <SupportTicketDetailsHeader
          ticket={ticket}
          backHref="/prestataire/supports/my-tickets"
          backLabel="Retour à mes tickets"
          eyebrow="Ticket support prestataire"
          requesterLabel="Créé par"
          requesterName={myName}
          contextIcon={Car}
          sideTitle="Référence"
          referenceText={`#${ticket.id.slice(0, 8)}`}
          sideItems={[
            {
              label: "Dernière activité",
              value: formatTicketFullDateTime(getTicketRelevantDate(ticket)),
            },
            {
              label: "Astuce",
              value:
                "Gardez toutes les réponses dans ce fil pour faciliter le suivi du support.",
            },
          ]}
        />

        <SupportTicketConversationPanel
          title="Conversation"
          description="Retrouvez ici les échanges entre vous et le support."
          messages={messages}
          currentUserId={currentUserId}
          profilesById={byId}
          profilesByEmail={byEmail}
          onSend={onSend}
          disabled={sending}
        />
      </div>
    </div>
  );
}