import { useEffect, useRef } from "react";
import { useUnreadTickets } from "./useUnreadTickets";
import { WS_BASE_URL } from "@/helper/InstanceAxios";

export const useTicketsListSocket = () => {
  const { markUnread } = useUnreadTickets();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    // ✅ ferme l'ancien socket si existant
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // ✅ http -> ws, https -> wss
    const wsBase = WS_BASE_URL.replace(/^https?/, (m) =>
      m === "https" ? "wss" : "ws"
    );

    const url = `${wsBase}/ws/notifications/?token=${token}`;
    const socket = new WebSocket(url);
    wsRef.current = socket;

    socket.onopen = () => {
      // console.log("🔔 Notification WS Connected");
    };

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);

        // adapte si ton backend a un autre event
        if (payload.event === "NEW_MESSAGE") {
          const tid = payload?.data?.ticket_id;
          if (tid) markUnread(String(tid));
        }
      } catch (e) {
        console.error("WS list parse error", e);
      }
    };

    socket.onerror = () => {
      // évite spam
      // console.log("🔔 Notification WS error");
    };

    socket.onclose = () => {
      // console.log("🔔 Notification WS Closed");
    };

    return () => {
      socket.close();
      wsRef.current = null;
    };
  }, [markUnread]);
};
