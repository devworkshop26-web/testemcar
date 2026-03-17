import { cn } from "@/lib/utils";

export function MessageBubble({
  message,
  isMine,
}: {
  message: any;
  isMine: boolean;
}) {
  return (
    <div
      className={cn("flex w-full mb-2", {
        "justify-end": isMine,
        "justify-start": !isMine,
      })}
    >
      <div
        className={cn(
          "max-w-[75%] p-3 rounded-2xl text-sm shadow",
          isMine
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-100 text-gray-900 rounded-bl-none"
        )}
      >
        <p>{message.message}</p>

        <span className="text-[10px] opacity-70 block mt-1">
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
