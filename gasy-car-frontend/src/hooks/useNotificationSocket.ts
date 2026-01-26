import { useEffect, useRef, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { WS_BASE_URL, accessTokenKey } from "@/helper/InstanceAxios";

interface NotificationMessage {
    id: string;
    title: string;
    body: string;
    type: string;
    created_at: string;
    is_read: boolean;
}

export const useNotificationSocket = () => {
    const queryClient = useQueryClient();
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const token = localStorage.getItem(accessTokenKey);
        if (!token) return;

        // Close existing connection if any
        if (socketRef.current) {
            socketRef.current.close();
        }

        const socketUrl = `${WS_BASE_URL}/ws/notifications/?token=${token}`;
        const socket = new WebSocket(socketUrl);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log("🔔 Notification WS Connected");
        };

        socket.onmessage = (event) => {
            try {
                const payload = JSON.parse(event.data);
                // Assuming backend sends: { type: "notification_message", message: { ... } }
                // or just the message object directly?
                // In consumers.py: self.send(text_data=json.dumps(message)) where message is the dict.
                // So payload IS the message.

                const message = payload as NotificationMessage;

                // Update React Query cache
                queryClient.setQueryData(["notifications"], (oldData: any) => {
                    // Check if backend returns array directly or paginated object
                    // If paginated (results: []), we update results.
                    if (!oldData) return [message]; // If array
                    if (Array.isArray(oldData)) return [message, ...oldData];

                    // If paginated object
                    return {
                        ...oldData,
                        results: [message, ...(oldData.results || [])],
                        count: (oldData.count || 0) + 1
                    };
                });

                // Invalidate to be sure
                queryClient.invalidateQueries({ queryKey: ["notifications"] });

                // Show Toast
                toast(message.title, {
                    description: message.body,
                    action: {
                        label: "Voir",
                        onClick: () => {
                            // Logic to navigate or open bell
                        }
                    }
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
