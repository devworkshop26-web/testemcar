import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Car,
  Clock3,
  MessageSquare,
  Tag,
} from "lucide-react";

import type { SupportTicket } from "@/types/supportTypes";

import { Card, CardContent } from "@/components/ui/card";
import {
  formatTicketDate,
  formatTicketDateTime,
  getTicketContextLabel,
  getTicketPriorityDisplay,
  getTicketRelevantDate,
  getTicketStatusDisplay,
  getTicketTypeLabel,
} from "@/features/support/supportUi";

type TicketCardVariant = "client" | "prestataire";

interface TicketCardProps {
  ticket: SupportTicket;
  href: string;
  unread?: boolean;
  variant?: TicketCardVariant;
  showContext?: boolean;
  showVehicleHint?: boolean;
  actionLabel?: string;
}

const variantStyles: Record<
  TicketCardVariant,
  {
    iconWrapper: string;
    titleHover: string;
    actionText: string;
  }
> = {
  client: {
    iconWrapper:
      "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20",
    titleHover: "group-hover:text-blue-700",
    actionText: "text-blue-700",
  },
  prestataire: {
    iconWrapper:
      "bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-md",
    titleHover: "group-hover:text-blue-700",
    actionText: "text-blue-700",
  },
};

export function TicketCard({
  ticket,
  href,
  unread = false,
  variant = "client",
  showContext = false,
  showVehicleHint = false,
  actionLabel = "Voir",
}: TicketCardProps) {
  const status = getTicketStatusDisplay(ticket.status);
  const priority = getTicketPriorityDisplay(ticket.priority);
  const styles = variantStyles[variant];

  return (
    <Link to={href} className="group">
      <Card className="h-full rounded-3xl border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
        <CardContent className="flex h-full flex-col p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${styles.iconWrapper}`}
            >
              <MessageSquare className="h-5 w-5" />
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              {unread && (
                <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700">
                  Nouveau
                </span>
              )}
              <span
                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${status.tone}`}
              >
                {status.label}
              </span>
            </div>
          </div>

          <h3
            className={`line-clamp-2 text-lg font-semibold text-slate-900 transition-colors ${styles.titleHover}`}
          >
            {ticket.title}
          </h3>

          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
            {ticket.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span
              className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${priority.tone}`}
            >
              {priority.label}
            </span>

            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
              {getTicketTypeLabel(ticket.ticket_type)}
            </span>

            {showContext && (
              <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700">
                {getTicketContextLabel(ticket)}
              </span>
            )}
          </div>

          <div className="mt-5 grid gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <CalendarDays className="h-4 w-4 text-slate-400" />
              <span>Créé le {formatTicketDate(ticket.created_at)}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-600">
              <Clock3 className="h-4 w-4 text-slate-400" />
              <span>
                Dernière activité{" "}
                {formatTicketDateTime(getTicketRelevantDate(ticket))}
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-600">
              <Tag className="h-4 w-4 text-slate-400" />
              <span>Réf. #{ticket.id.slice(0, 8)}</span>
            </div>

            {showVehicleHint && ticket.vehicule && (
              <div className="flex items-center gap-2 text-slate-600">
                <Car className="h-4 w-4 text-slate-400" />
                <span>Ticket lié à un véhicule</span>
              </div>
            )}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="text-sm font-medium text-slate-500">
              Ouvrir la conversation
            </span>
            <span
              className={`inline-flex items-center gap-2 text-sm font-semibold transition-all group-hover:gap-3 ${styles.actionText}`}
            >
              {actionLabel}
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}