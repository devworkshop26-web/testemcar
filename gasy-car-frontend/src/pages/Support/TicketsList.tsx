import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ArrowUpDown,
  Eye,
  Filter,
  Loader2,
  MoreHorizontal,
  Search,
  ShieldCheck,
  Ticket,
  Trash2,
  UserCircle2,
} from "lucide-react";

import { useTickets } from "@/useQuery/support/useTickets";
import { useAllUsers } from "@/useQuery/useAllUsers";
import { useDeleteTicket } from "@/useQuery/support/useDeleteTicket";
import { useUpdateTicketStatus } from "@/useQuery/support/useUpdateTicketStatus";

import type { SupportTicket } from "@/types/supportTypes";
import type { User } from "@/types/userType";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  getTicketPriorityDisplay,
  getTicketRelevantDate,
  getTicketRoleLabel,
  getTicketStatusDisplay,
  getTicketTypeLabel,
  getUserInitials,
} from "@/features/support/supportUi";

type SortBy = "recent" | "oldest" | "priority" | "requester";

type EnrichedTicket = SupportTicket & {
  fullName: string;
  avatar: string | null;
  role?: string;
};

export default function TicketsList() {
  const { data: tickets = [], isLoading } = useTickets();
  const { data: users } = useAllUsers();
  const { mutate: deleteTicket } = useDeleteTicket();
  const { mutate: updateStatus } = useUpdateTicketStatus();

  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("recent");
  const [page, setPage] = useState(1);

  const itemsPerPage = 10;

  const enrichedTickets: EnrichedTicket[] = useMemo(() => {
    if (!users) {
      return tickets.map((t) => ({
        ...t,
        fullName: "Utilisateur inconnu",
        avatar: null,
        role: undefined,
      }));
    }

    return tickets.map((t) => {
      const user = (users as User[]).find((u) => String(u.id) === String(t.user));
      const fullName = user
        ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() ||
          user.email ||
          "Utilisateur inconnu"
        : "Utilisateur inconnu";

      return {
        ...t,
        fullName,
        avatar: (user as any)?.image || null,
        role: user?.role,
      };
    });
  }, [tickets, users]);

  const filteredTickets = useMemo(() => {
    const q = search.trim().toLowerCase();

    return enrichedTickets.filter((ticket) => {
      const matchesStatus =
        statusFilter === "all" || ticket.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || ticket.priority === priorityFilter;
      const matchesRole = roleFilter === "all" || ticket.role === roleFilter;

      const matchesSearch =
        !q ||
        ticket.title.toLowerCase().includes(q) ||
        ticket.fullName.toLowerCase().includes(q) ||
        ticket.description.toLowerCase().includes(q) ||
        ticket.id.toLowerCase().includes(q);

      return matchesStatus && matchesPriority && matchesRole && matchesSearch;
    });
  }, [enrichedTickets, search, statusFilter, priorityFilter, roleFilter]);

  const sortedTickets = useMemo(() => {
    const copy = [...filteredTickets];

    switch (sortBy) {
      case "oldest":
        copy.sort(
          (a, b) =>
            new Date(getTicketRelevantDate(a)).getTime() -
            new Date(getTicketRelevantDate(b)).getTime()
        );
        break;
      case "priority": {
        const order = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 } as const;
        copy.sort((a, b) => (order[b.priority] ?? 0) - (order[a.priority] ?? 0));
        break;
      }
      case "requester":
        copy.sort((a, b) => a.fullName.localeCompare(b.fullName));
        break;
      case "recent":
      default:
        copy.sort(
          (a, b) =>
            new Date(getTicketRelevantDate(b)).getTime() -
            new Date(getTicketRelevantDate(a)).getTime()
        );
        break;
    }

    return copy;
  }, [filteredTickets, sortBy]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, priorityFilter, roleFilter, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedTickets.length / itemsPerPage));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * itemsPerPage;
  const paginatedTickets = sortedTickets.slice(start, start + itemsPerPage);

  const stats = useMemo(() => {
    return {
      total: tickets.length,
      open: tickets.filter(
        (t) => t.status === "OPEN" || t.status === "IN_PROGRESS"
      ).length,
      urgent: tickets.filter((t) => t.priority === "URGENT").length,
      resolved: tickets.filter(
        (t) => t.status === "RESOLVED" || t.status === "CLOSED"
      ).length,
    };
  }, [tickets]);

  const handleDeleteTicket = (ticketId: string) => {
    if (confirm("Supprimer définitivement ce ticket ?")) {
      deleteTicket(ticketId);
    }
  };

  const handleStatusChange = (
    ticketId: string,
    newStatus: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"
  ) => {
    updateStatus({ ticketId, status: newStatus });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/40 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
          <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500" />

          <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                Interface support
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Gestion des tickets
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
                Suivez les demandes, filtrez les urgences et gérez les statuts
                depuis une vue unique.
              </p>
            </div>

            <Link to="/support/tickets/create">
              <Button className="h-12 gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 text-white hover:from-blue-700 hover:to-indigo-700">
                <Ticket className="h-4 w-4" />
                Nouveau ticket
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="rounded-3xl border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <p className="text-sm text-slate-500">Total tickets</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {stats.total}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <p className="text-sm text-slate-500">À traiter</p>
              <p className="mt-2 text-3xl font-bold text-blue-700">
                {stats.open}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <p className="text-sm text-slate-500">Urgents</p>
              <p className="mt-2 text-3xl font-bold text-rose-700">
                {stats.urgent}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <p className="text-sm text-slate-500">Résolus / fermés</p>
              <p className="mt-2 text-3xl font-bold text-emerald-700">
                {stats.resolved}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-600">
              Recherche et filtres
            </h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <div className="relative xl:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Rechercher par ticket, demandeur ou description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 rounded-2xl border-slate-200 bg-slate-50 pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-11 rounded-2xl border-slate-200 bg-slate-50">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="OPEN">Ouvert</SelectItem>
                <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                <SelectItem value="RESOLVED">Résolu</SelectItem>
                <SelectItem value="CLOSED">Fermé</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="h-11 rounded-2xl border-slate-200 bg-slate-50">
                <SelectValue placeholder="Priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes priorités</SelectItem>
                <SelectItem value="LOW">Basse</SelectItem>
                <SelectItem value="MEDIUM">Moyenne</SelectItem>
                <SelectItem value="HIGH">Haute</SelectItem>
                <SelectItem value="URGENT">Urgente</SelectItem>
              </SelectContent>
            </Select>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="h-11 rounded-2xl border-slate-200 bg-slate-50">
                <SelectValue placeholder="Rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="CLIENT">Client</SelectItem>
                <SelectItem value="PRESTATAIRE">Prestataire</SelectItem>
                <SelectItem value="SUPPORT">Support</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
              <ArrowUpDown className="h-3.5 w-3.5" />
              Trier par
            </div>

            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortBy)}
            >
              <SelectTrigger className="h-10 w-[180px] rounded-2xl border-slate-200 bg-slate-50">
                <SelectValue placeholder="Tri" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Activité récente</SelectItem>
                <SelectItem value="oldest">Plus anciens</SelectItem>
                <SelectItem value="priority">Priorité</SelectItem>
                <SelectItem value="requester">Demandeur</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : paginatedTickets.length === 0 ? (
            <div className="py-20 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <Ticket className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-lg font-semibold text-slate-800">
                Aucun ticket trouvé
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Modifiez les filtres pour afficher d’autres résultats.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {paginatedTickets.map((ticket) => {
                const status = getTicketStatusDisplay(ticket.status);
                const priority = getTicketPriorityDisplay(ticket.priority);
                const StatusIcon = status.icon;
                const relativeDate = formatDistanceToNow(
                  new Date(getTicketRelevantDate(ticket)),
                  {
                    addSuffix: true,
                    locale: fr,
                  }
                );

                return (
                  <div
                    key={ticket.id}
                    className="flex flex-col gap-4 p-5 transition-colors hover:bg-slate-50/70 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start gap-3">
                        <Avatar className="h-11 w-11 border border-slate-200">
                          <AvatarImage src={ticket.avatar || undefined} />
                          <AvatarFallback className="bg-slate-100 text-xs text-slate-600">
                            {getUserInitials(ticket.fullName)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="line-clamp-1 text-base font-semibold text-slate-900">
                              {ticket.title}
                            </h3>

                            <span
                              className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${status.style}`}
                            >
                              <span className="inline-flex items-center gap-1">
                                <StatusIcon className="h-3.5 w-3.5" />
                                {status.label}
                              </span>
                            </span>

                            <span
                              className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${priority.style}`}
                            >
                              {priority.label}
                            </span>

                            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                              {getTicketTypeLabel(ticket.ticket_type)}
                            </span>
                          </div>

                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                            {ticket.description}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                            <span className="inline-flex items-center gap-1">
                              <UserCircle2 className="h-3.5 w-3.5" />
                              {ticket.fullName}
                            </span>
                            <span>{getTicketRoleLabel(ticket.role)}</span>
                            <span>#{ticket.id.slice(0, 8)}</span>
                            <span>{relativeDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center justify-end gap-2">
                      <Button
                        asChild
                        variant="outline"
                        className="rounded-xl border-slate-200"
                      >
                        <Link to={`/support/ticket/${ticket.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir
                        </Link>
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-xl"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link
                              to={`/support/ticket/${ticket.id}`}
                              className="flex w-full items-center"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Voir détails
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              Changer statut
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(ticket.id, "OPEN")
                                }
                              >
                                Ouvert
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(ticket.id, "IN_PROGRESS")
                                }
                              >
                                En cours
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(ticket.id, "RESOLVED")
                                }
                              >
                                Résolu
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(ticket.id, "CLOSED")
                                }
                              >
                                Fermé
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="cursor-pointer text-red-600 focus:text-red-600"
                            onClick={() => handleDeleteTicket(ticket.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {sortedTickets.length > itemsPerPage && (
          <div className="flex flex-col items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
            <Button
              variant="outline"
              className="rounded-xl border-slate-200"
              disabled={safePage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ← Précédent
            </Button>

            <div className="text-sm text-slate-500">
              Page{" "}
              <span className="font-semibold text-slate-900">{safePage}</span>{" "}
              sur{" "}
              <span className="font-semibold text-slate-900">
                {totalPages}
              </span>
            </div>

            <Button
              variant="outline"
              className="rounded-xl border-slate-200"
              disabled={safePage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Suivant →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}