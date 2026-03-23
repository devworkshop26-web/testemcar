import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  resolveWsBaseUrl,
  WS_BASE_URL,
  accessTokenKey,
} from "@/helper/InstanceAxios";

interface NotificationMessage {
  id: string;
  title: string;
  body: string;
  notification_type?: string;
  created_at: string;
  is_read: boolean;
  reservation?: string | null;
  vehicle?: string | null;
  vehicle_document?: string | null;
  action_url?: string | null;
  extra_data?: Record<string, any> | null;
}

const isNotificationPayload = (payload: any): payload is NotificationMessage => {
  return Boolean(
    payload &&
      typeof payload === "object" &&
      payload.id &&
      payload.title &&
      payload.body &&
      payload.created_at
  );
};

export const useNotificationSocket = () => {
  const queryClient = useQueryClient();
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(accessTokenKey);
    if (!token) return;

    if (socketRef.current) {
      socketRef.current.close();
    }

    const wsBase = resolveWsBaseUrl(WS_BASE_URL);
    const socketUrl = `${wsBase}/ws/notifications/?token=${token}`;
    const socket = new WebSocket(socketUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("🔔 Notification WS Connected");
    };

    socket.onmessage = (event) => {
      try {
        const rawPayload = JSON.parse(event.data);

        const payload = isNotificationPayload(rawPayload)
          ? rawPayload
          : isNotificationPayload(rawPayload?.data)
          ? rawPayload.data
          : null;

        if (!payload) return;

        queryClient.setQueryData(["notifications"], (oldData: any) => {
          if (!oldData) return [payload];

          if (Array.isArray(oldData)) {
            const exists = oldData.some((item: any) => item.id === payload.id);
            return exists ? oldData : [payload, ...oldData];
          }

          const results = Array.isArray(oldData.results) ? oldData.results : [];
          const exists = results.some((item: any) => item.id === payload.id);

          return {
            ...oldData,
            results: exists ? results : [payload, ...results],
            count: exists ? oldData.count || results.length : (oldData.count || 0) + 1,
          };
        });

        toast(payload.title, {
          description: payload.body,
        });
      } catch (err) {
        console.error("WS Notification parse error", err);
      }
    };

    socket.onclose = () => {
      console.log("🔔 Notification WS Closed");
    };

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [queryClient]);

  return {};
};