import { MessageBubble } from "@/pages/Support/MessageBubble";
import { useEffect, useRef } from "react";


export function ConversationList({
  messages,
  currentUserId,
}: {
  messages: any[];
  currentUserId: string;
}) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="bg-white border rounded-2xl p-4 max-h-[60vh] overflow-y-auto space-y-2 shadow-sm">
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isMine={msg.sender === currentUserId}
        />
      ))}

      {/* Auto-scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
}
