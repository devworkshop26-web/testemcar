import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  MessageSquareText,
  Tag,
  UserCircle2,
  type LucideIcon,
} from "lucide-react";

import type { SupportTicket } from "@/types/supportTypes";
import {
  formatTicketFullDateTime,
  getTicketContextLongLabel,
  getTicketPriorityDisplay,
  getTicketStatusDisplay,
  getTicketTypeLongLabel,
} from "@/features/support/supportUi";

type SideItem = {
  label: string;
  value: string;
};

interface SupportTicketDetailsHeaderProps {
  ticket: SupportTicket;
  backHref: string;
  backLabel: string;
  eyebrow: string;
  topBadgeLabel?: string;
  requesterLabel: string;
  requesterName: string;
  requesterSecondaryText?: string;
  contextLabel?: string;
  contextIcon?: LucideIcon;
  sideTitle: string;
  referenceText?: string;
  sideItems: SideItem[];
}

export function SupportTicketDetailsHeader({
  ticket,
  backHref,
  backLabel,
  eyebrow,
  topBadgeLabel,
  requesterLabel,
  requesterName,
  requesterSecondaryText,
  contextLabel,
  contextIcon: ContextIcon = MessageSquareText,
  sideTitle,
  referenceText,
  sideItems,
}: SupportTicketDetailsHeaderProps) {
  const status = getTicketStatusDisplay(ticket.status);
  const priority = getTicketPriorityDisplay(ticket.priority);

  return (
    <>
      <Link
        to={backHref}
        className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800"
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
        <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500" />

        <div className="grid gap-6 p-6 md:grid-cols-[1.6fr_0.9fr] md:p-8">
          <div>
            {topBadgeLabel && (
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {topBadgeLabel}
              </div>
            )}

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {eyebrow}
                </p>
                <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
                  {ticket.title}
                </h1>
                <p className="mt-3 max-w-2xl whitespace-pre-wrap text-sm leading-6 text-slate-600">
                  {ticket.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${status.tone}`}
                >
                  {status.label}
                </span>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${priority.tone}`}
                >
                  Priorité {priority.label}
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <UserCircle2 className="h-4 w-4" />
                  {requesterLabel}
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {requesterName}
                </p>
                {requesterSecondaryText && (
                  <p className="mt-1 text-xs text-slate-500">
                    {requesterSecondaryText}
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <Tag className="h-4 w-4" />
                  Type
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {getTicketTypeLongLabel(ticket.ticket_type)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <CalendarDays className="h-4 w-4" />
                  Créé le
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {formatTicketFullDateTime(ticket.created_at)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <ContextIcon className="h-4 w-4" />
                  Contexte
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {contextLabel || getTicketContextLongLabel(ticket)}
                </p>
              </div>
            </div>
          </div>

          <aside className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
              {sideTitle}
            </p>

            <p className="mt-2 break-all font-mono text-sm font-bold text-slate-900">
              {referenceText || `#${ticket.id.slice(0, 8)}`}
            </p>

            <div className="mt-5 space-y-4 text-sm text-slate-700">
              {sideItems.map((item) => (
                <div key={item.label}>
                  <p className="font-semibold text-slate-900">{item.label}</p>
                  <p className="mt-1 text-slate-600">{item.value}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}