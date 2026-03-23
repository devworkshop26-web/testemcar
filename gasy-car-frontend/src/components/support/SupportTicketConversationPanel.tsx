import { useEffect, useRef } from "react";

import { ConversationBox } from "@/components/support/ConversationBox";
import { MessageInput } from "@/components/support/MessageInput";

import type { TicketMessage } from "@/types/supportTypes";
import type { User } from "@/types/userType";

interface SupportTicketConversationPanelProps {
  title: string;
  description: string;
  messages: TicketMessage[];
  currentUserId: string;
  profilesById: Record<string, User>;
  profilesByEmail: Record<string, User>;
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function SupportTicketConversationPanel({
  title,
  description,
  messages,
  currentUserId,
  profilesById,
  profilesByEmail,
  onSend,
  disabled = false,
}: SupportTicketConversationPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5">
      <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-4">
        <h2 className="font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      <div className="max-h-[56vh] overflow-y-auto bg-slate-50 p-4 md:p-6">
        <ConversationBox
          messages={messages}
          currentUserId={currentUserId}
          profilesById={profilesById}
          profilesByEmail={profilesByEmail}
        />
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-slate-200 bg-white p-4 md:p-6">
        <MessageInput disabled={disabled} onSend={onSend} />
      </div>
    </div>
  );
}