import { cn } from "@/lib/utils";

export function TicketMessage({ msg, isMine }: { msg: any; isMine: boolean }) {
  return (
    <div
      className={cn("flex mb-3", {
        "justify-end": isMine,
        "justify-start": !isMine,
      })}
    >
      <div
        className={cn(
          "max-w-xs p-3 rounded-xl text-sm shadow",
          isMine
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-100 text-gray-800 rounded-bl-none"
        )}
      >
        <p>{msg.message}</p>
        <span className="text-[10px] opacity-70 block mt-1">
          {new Date(msg.created_at).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
