import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { TicketMessage } from "@/types/supportTypes";

interface MessageBubbleProps {
  message: TicketMessage;
  isSupport?: boolean;
  supportName?: string;
  clientName?: string;
}

const getInitials = (value?: string) => {
  if (!value) return "?";
  const [first = "", second = ""] = value.split(" ");
  return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase();
};

export function MessageBubble({
  message,
  isSupport = false,
  supportName = "Support",
  clientName = "Client",
}: MessageBubbleProps) {
  const alignment = isSupport ? "ml-auto" : "mr-auto";
  const bubbleColor = isSupport ? "bg-primary text-white" : "bg-muted text-foreground";
  const timestamp = new Date(message.created_at).toLocaleString();
  const name = isSupport ? supportName : clientName;

  return (
    <div className={cn("flex items-end gap-2 max-w-2xl", isSupport ? "justify-end" : "justify-start")}
    >
      {!isSupport && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.sender_avatar || undefined} alt={name} />
          <AvatarFallback className="text-xs bg-slate-100 text-slate-700">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn("space-y-1", alignment)}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 shadow-sm text-sm leading-relaxed",
            bubbleColor,
            isSupport && "rounded-br-none",
            !isSupport && "rounded-bl-none",
          )}
        >
          <p className="font-semibold text-xs opacity-80">{name}</p>
          <p className="whitespace-pre-wrap break-words">{message.message}</p>
        </div>
        <p
          className={cn(
            "text-[11px] text-muted-foreground",
            isSupport ? "text-right" : "text-left",
          )}
        >
          {timestamp}
        </p>
      </div>

      {isSupport && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.sender_avatar || undefined} alt={name} />
          <AvatarFallback className="text-xs bg-primary/10 text-primary">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
