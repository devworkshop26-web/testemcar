// src/hooks/support/useTicketSocket.ts
import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { WS_BASE_URL } from "@/helper/InstanceAxios";
import type { TicketMessage } from "@/types/supportTypes";
import { ticketMessagesKey } from "@/useQuery/support/useTicketMessages";
import { useUnreadTickets } from "./useUnreadTickets";

function getUserIdFromAccessToken(): string | null {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) return null;
    const payload = token.split(".")[1];
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return (json.user_id ?? json.id ?? json.sub ?? null) as string | null;
  } catch {
    return null;
  }
}

// Convertit base URL en WS + enlève /api si présent
function buildWsBaseUrl(base: string) {
  const noApi = base.replace(/\/api\/?$/, "");
  return noApi.replace(/^https?/, (m) => (m === "https" ? "wss" : "ws"));
}

// Extraction robuste sender id
function extractSenderId(d: any): string {
  const raw =
    d?.sender_id ??
    d?.sender?.id ??
    d?.sender?.user_id ??
    d?.sender?.user?.id ??
    d?.user_id ??
    d?.user?.id ??
    d?.sender ??
    d?.user ??
    "";
  return raw ? String(raw) : "";
}

// Extraction robuste sender name (si le backend l’envoie)
function extractSenderName(d: any): string {
  return (
    (d?.sender_name && String(d.sender_name).trim()) ||
    (d?.sender?.first_name || d?.sender?.last_name
      ? `${d.sender?.first_name ?? ""} ${d.sender?.last_name ?? ""}`.trim()
      : "") ||
    (d?.sender?.user?.first_name || d?.sender?.user?.last_name
      ? `${d.sender?.user?.first_name ?? ""} ${d.sender?.user?.last_name ?? ""}`.trim()
      : "") ||
    d?.sender?.full_name ||
    d?.sender?.username ||
    d?.sender?.email ||
    d?.user?.email ||
    ""
  );
}

// Extraction robuste avatar
function extractSenderAvatar(d: any): string | null {
  return (
    d?.sender_avatar ??
    d?.sender?.avatar_url ??
    d?.sender?.avatar ??
    d?.sender?.profile_photo ??
    d?.sender?.image ??
    d?.sender?.user?.avatar_url ??
    d?.sender?.user?.image ??
    null
  );
}

export function useTicketSocket(ticketId: string, enabled: boolean = true) {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const { markUnread } = useUnreadTickets();

  // messages envoyés localement en attente de confirmation WS
  const pendingRef = useRef<
    Array<{ tempId: string; message: string; sender: string; ts: number }>
  >([]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!enabled) return;

      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        console.warn("WS non connecté, impossible d'envoyer.");
        return;
      }

      const msg = text.trim();
      if (!msg) return;

      // ✅ optimistic
      const senderId = getUserIdFromAccessToken() ?? "me";
      const tempId = `temp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const nowIso = new Date().toISOString();

      const optimistic: TicketMessage = {
        id: tempId as any,
        ticket: ticketId as any,
        sender: senderId as any,
        message: msg,
        created_at: nowIso,
        updated_at: nowIso,
        attachment_url: null as any,
      };

      pendingRef.current.push({
        tempId,
        message: msg,
        sender: String(senderId),
        ts: Date.now(),
      });

      queryClient.setQueryData<TicketMessage[]>(
        ticketMessagesKey(ticketId),
        (old = []) => [...old, optimistic]
      );

      ws.send(JSON.stringify({ message: msg }));
    },
    [enabled, queryClient, ticketId]
  );

  useEffect(() => {
    if (!enabled) return;
    if (!ticketId) return;

    const token = localStorage.getItem("access_token");
    if (!token) return;

    // ferme l'ancien socket si existant (évite double connexion en dev)
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    const wsBase = buildWsBaseUrl(WS_BASE_URL);
    const url = `${wsBase}/ws/support/tickets/${ticketId}/?token=${token}`;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ SUPPORT WS connecté :", url);
    };

    ws.onerror = (e) => {
      console.log("❌ SUPPORT WS error", e);
    };

    ws.onclose = () => {
      console.log("🔌 SUPPORT WS fermé", ticketId);
    };

    ws.onmessage = (event) => {
      let payload: any;
      try {
        payload = JSON.parse(event.data);
      } catch {
        return;
      }

      // Supporte: { event: "NEW_TICKET_MESSAGE", data: {...} }
      // ou payload direct
      const eventName = payload?.event;
      const d = payload?.data ?? payload?.message ?? payload;

      // -------- STATUS_CHANGED (optionnel)
      if (eventName === "STATUS_CHANGED") {
        queryClient.invalidateQueries({ queryKey: ["support-ticket-detail", ticketId] });
        queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
        return;
      }

      // -------- NEW MESSAGE
      // Si ton backend n'envoie pas eventName, on tente quand même si d ressemble à un message
      const isNewMessage =
        eventName === "NEW_TICKET_MESSAGE" ||
        (!!d?.message && (d?.ticket_id || d?.ticket || d?.id));

      if (!isNewMessage) return;

      // ✅ FIX CRITIQUE: ne jamais injecter un message d’un autre ticket
      const incomingTicketId = String(d?.ticket_id ?? d?.ticket ?? "").trim();
      if (incomingTicketId && String(incomingTicketId) !== String(ticketId)) {
        // on peut juste marquer unread (liste), mais on n'ajoute PAS au chat ouvert
        markUnread(String(incomingTicketId));
        return;
      }

      // construit le message
      const senderId = extractSenderId(d);
      const senderName = extractSenderName(d);
      const senderAvatar = extractSenderAvatar(d);

      const newMsg: TicketMessage = {
        id: d.id,
        ticket: String(d.ticket ?? d.ticket_id ?? ticketId) as any,
        sender: (senderId || String(d.sender ?? "")) as any,
        sender_name: senderName || undefined,
        sender_avatar: senderAvatar || undefined,
        sender_role: d.sender_role ?? d.sender?.role ?? undefined,
        is_support: d.is_support ?? undefined,
        message: d.message,
        created_at: d.created_at,
        updated_at: d.updated_at,
        attachment_url: d.attachment_url ?? null,
      } as any;

      if (!newMsg?.id) return;

      // ✅ inject dans le cache de CE ticket seulement
      queryClient.setQueryData<TicketMessage[]>(
        ticketMessagesKey(ticketId),
        (old = []) => {
          // anti duplicate
          if (old.some((m) => String(m.id) === String(newMsg.id))) return old;

          // replace optimistic si match
          const pIndex = pendingRef.current.findIndex((p) => {
            const sameText = p.message === newMsg.message;
            const sameSender = String(p.sender) === String(newMsg.sender);
            const close = Date.now() - p.ts < 15000;
            return sameText && sameSender && close;
          });

          if (pIndex !== -1) {
            const tempId = pendingRef.current[pIndex].tempId;
            pendingRef.current.splice(pIndex, 1);
            return old.map((m) => (String(m.id) === String(tempId) ? newMsg : m));
          }

          return [...old, newMsg];
        }
      );
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [enabled, ticketId, queryClient, markUnread]);

  return { sendMessage };
}
