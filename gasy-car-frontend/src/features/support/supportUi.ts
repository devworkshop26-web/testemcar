import type { SupportTicket } from "@/types/supportTypes";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

export const ticketStatusConfig: Record<
  string,
  {
    label: string;
    tone: string;
    style: string;
    icon: any;
  }
> = {
  OPEN: {
    label: "Ouvert",
    tone: "border-blue-200 bg-blue-50 text-blue-700",
    style: "bg-blue-50 text-blue-700 border-blue-200",
    icon: AlertCircle,
  },
  IN_PROGRESS: {
    label: "En cours",
    tone: "border-amber-200 bg-amber-50 text-amber-700",
    style: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
  },
  RESOLVED: {
    label: "Résolu",
    tone: "border-emerald-200 bg-emerald-50 text-emerald-700",
    style: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  CLOSED: {
    label: "Fermé",
    tone: "border-slate-200 bg-slate-100 text-slate-700",
    style: "bg-slate-100 text-slate-700 border-slate-200",
    icon: CheckCircle2,
  },
};

export const ticketPriorityConfig: Record<
  string,
  {
    label: string;
    tone: string;
    style: string;
  }
> = {
  LOW: {
    label: "Basse",
    tone: "border-emerald-200 bg-emerald-50 text-emerald-700",
    style: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  MEDIUM: {
    label: "Moyenne",
    tone: "border-blue-200 bg-blue-50 text-blue-700",
    style: "text-blue-700 bg-blue-50 border-blue-200",
  },
  HIGH: {
    label: "Haute",
    tone: "border-amber-200 bg-amber-50 text-amber-700",
    style: "text-amber-700 bg-amber-50 border-amber-200",
  },
  URGENT: {
    label: "Urgente",
    tone: "border-rose-200 bg-rose-50 text-rose-700",
    style: "text-rose-700 bg-rose-50 border-rose-200 font-semibold",
  },
};

export const ticketTypeLabels: Record<string, string> = {
  TECHNICAL: "Technique",
  CONFLICT: "Conflit",
  PAYMENT: "Paiement",
  OTHER: "Autre",
};

export const ticketTypeLongLabels: Record<string, string> = {
  TECHNICAL: "Problème technique",
  CONFLICT: "Conflit / litige",
  PAYMENT: "Paiement / facturation",
  OTHER: "Autre demande",
};

export const ticketRoleLabels: Record<string, string> = {
  CLIENT: "Client",
  PRESTATAIRE: "Prestataire",
  ADMIN: "Admin",
  SUPPORT: "Support",
};

export function formatTicketDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";

  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatTicketDateTime(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";

  return d.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTicketFullDateTime(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";

  return d.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getTicketRelevantDate(ticket: SupportTicket) {
  return ticket.last_activity_at || ticket.updated_at || ticket.created_at;
}

export function getTicketContextLabel(ticket: SupportTicket) {
  if (ticket.reservation) return "Réservation";
  if (ticket.vehicule) return "Véhicule";
  return "Général";
}

export function getTicketContextLongLabel(ticket: SupportTicket) {
  if (ticket.reservation) return "Réservation liée";
  if (ticket.vehicule) return "Véhicule lié";
  return "Demande générale";
}

export function isTicketMatchingDateFilter(
  ticket: SupportTicket,
  dateFilter: string
) {
  if (!dateFilter || dateFilter === "all") return true;

  const created = new Date(ticket.created_at);
  const now = new Date();

  if (dateFilter === "today") {
    return created.toDateString() === now.toDateString();
  }

  if (dateFilter === "week") {
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);
    return created >= weekAgo;
  }

  if (dateFilter === "month") {
    return (
      created.getMonth() === now.getMonth() &&
      created.getFullYear() === now.getFullYear()
    );
  }

  if (dateFilter === "year") {
    return created.getFullYear() === now.getFullYear();
  }

  return true;
}

export function getTicketStatusDisplay(status?: string) {
  return ticketStatusConfig[status || "OPEN"] || ticketStatusConfig.OPEN;
}

export function getTicketPriorityDisplay(priority?: string) {
  return (
    ticketPriorityConfig[priority || "MEDIUM"] || ticketPriorityConfig.MEDIUM
  );
}

export function getTicketTypeLabel(type?: string) {
  return ticketTypeLabels[type || "OTHER"] || type || "Autre";
}

export function getTicketTypeLongLabel(type?: string) {
  return ticketTypeLongLabels[type || "OTHER"] || type || "Autre demande";
}

export function getTicketRoleLabel(role?: string) {
  return ticketRoleLabels[role || ""] || "Utilisateur";
}

export function getUserInitials(fullname?: string | null) {
  const safe = (fullname || "Utilisateur").trim();
  const [f = "", l = ""] = safe.split(" ");
  return `${f.charAt(0)}${l.charAt(0)}`.toUpperCase() || "U";
}