import React from "react";
import { Bell, CheckCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { useNotificationsQuery, useMarkAllReadMutation, useMarkReadMutation } from "@/hooks/useNotificationsQuery";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";

import { useNavigate } from "react-router-dom";
import { useCurrentUserQuery } from "@/useQuery/useCurrentUserQuery";

const NotificationBell = () => {
    // Use socket hook to subscribe and update cache/show toasts
    useNotificationSocket();
    const navigate = useNavigate();
    const { data: user } = useCurrentUserQuery();

    const { data, isLoading } = useNotificationsQuery();
    const markAllRead = useMarkAllReadMutation();
    const markRead = useMarkReadMutation();

    const [isOpen, setIsOpen] = React.useState(false);

    // Safely access results array if paginated
    // API returns { count: ..., results: [...] } based on DRF standard pagination if enabled
    // But my viewset didn't specify pagination class?
    // DRF defautls to PAGE_SIZE settings. Assuming standard DRF ModelViewSet which often paginates.
    // Let's assume response IS array OR results object.
    const notifications = Array.isArray(data) ? data : data?.results || [];

    const unreadCount = notifications.filter((n: any) => !n.is_read).length;

    const handleMarkAllRead = () => {
        markAllRead.mutate();
    };

    const handleItemClick = (notification: any) => {
        // 1. Mark as read
        if (!notification.is_read) {
            markRead.mutate(notification.id);
        }

        // 2. Redirect if reservation linked
        if (notification.reservation && user) {
            if (user.role === "CLIENT") {
                navigate(`/client/booking/${notification.reservation}`);
            } else if (user.role === "PRESTATAIRE") {
                navigate(`/prestataire/bookings/${notification.reservation}`);
            }
        }

        setIsOpen(false);
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-slate-100 rounded-full">
                    <Bell className="h-5 w-5 text-slate-600" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0 rounded-xl shadow-xl border-slate-100 bg-white">
                <div className="flex items-center justify-between p-4 border-b border-slate-50">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto px-2 py-1 text-xs text-primary hover:text-primary/90 hover:bg-primary/5"
                            onClick={handleMarkAllRead}
                        >
                            <CheckCheck className="h-3 w-3 mr-1" />
                            Tout lire
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[300px]">
                    {isLoading ? (
                        <div className="p-4 space-y-3">
                            <Skeleton className="h-12 w-full rounded-lg" />
                            <Skeleton className="h-12 w-full rounded-lg" />
                            <Skeleton className="h-12 w-full rounded-lg" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground text-sm">
                            Aucune notification
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications.map((notif: any) => (
                                <button
                                    key={notif.id}
                                    onClick={() => handleItemClick(notif)}
                                    className={`flex flex-col gap-1 p-4 text-left border-b border-slate-50 hover:bg-slate-50 transition-colors ${!notif.is_read ? "bg-slate-50/50" : ""
                                        }`}
                                >
                                    <div className="flex items-start justify-between w-full">
                                        <span className={`text-sm font-medium ${!notif.is_read ? 'text-slate-900' : 'text-slate-600'}`}>
                                            {notif.title}
                                        </span>
                                        {!notif.is_read && (
                                            <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        {notif.body}
                                    </p>
                                    <span className="text-[10px] text-slate-400 mt-1">
                                        {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: fr })}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
};

export default NotificationBell;
