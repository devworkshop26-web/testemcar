// src/components/support/TicketHeader.tsx

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { SupportTicket } from "@/types/supportTypes";

interface TicketHeaderProps {
  ticket: SupportTicket;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    image?: string | null;
  } | null;
}

export function TicketHeader({ ticket, user }: TicketHeaderProps) {
  return (
    <div className="p-4 border-b bg-white shadow-sm flex flex-col gap-5">

      {/* ===================================================== */}
      {/* ==============   USER INFORMATION   ================= */}
      {/* ===================================================== */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.image ?? undefined} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {(user?.first_name?.[0] ?? "") + (user?.last_name?.[0] ?? "")}
            </AvatarFallback>
          </Avatar>

          <div>
            <h2 className="text-lg font-semibold">
              {user ? `${user.first_name} ${user.last_name}` : "Utilisateur inconnu"}
            </h2>
            <p className="text-sm text-muted-foreground">{user?.email ?? ""}</p>
          </div>
        </div>

        {/* Ticket status & priority */}
        <div className="flex flex-col items-end gap-2">
          <Badge
            variant={ticket.status === "OPEN" ? "default" : "outline"}
            className="text-xs"
          >
            {ticket.status}
          </Badge>

          <Badge variant="secondary" className="text-xs">
            Priorité : {ticket.priority}
          </Badge>
        </div>
      </div>

      {/* ===================================================== */}
      {/* ================   TICKET DETAILS   ================= */}
      {/* ===================================================== */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">

        <h1 className="text-lg font-bold text-slate-900 leading-tight">
          {ticket.title}
        </h1>

        {ticket.description && (
          <p className="text-sm text-slate-700 mt-2 whitespace-pre-line break-words">
            {ticket.description}
          </p>
        )}

        <div className="mt-3 flex flex-col text-xs text-slate-500">
          <span>
            Créé le :{" "}
            {new Date(ticket.created_at).toLocaleString("fr-FR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {ticket.updated_at && (
            <span>
              Dernière mise à jour :{" "}
              {new Date(ticket.updated_at).toLocaleString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
