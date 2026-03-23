import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMySupportTickets } from "@/useQuery/support/useMySupportTickets";
import { Loader2, MessageSquare, Plus } from "lucide-react";

import { useUnreadTickets } from "@/hooks/support/useUnreadTickets";
import { useTicketsListSocket } from "@/hooks/support/useTicketsListSocket";

import { Button } from "@/components/ui/button";
import { TicketCard } from "@/components/support/TicketCard";
import { SupportStatsCards } from "@/components/support/SupportStatsCard";
import { SupportTicketFilters } from "@/components/support/SupportTicketFilter";
import { SupportEmptyState } from "@/components/support/SupportEmptyState";

import { isTicketMatchingDateFilter } from "@/features/support/supportUi";

export default function MyTickets() {
  const { tickets: myTickets, isLoading } = useMySupportTickets();
  const { unreadTickets } = useUnreadTickets();

  useTicketsListSocket();

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const itemsPerPage = 6;

  const filteredTickets = useMemo(() => {
    const q = search.trim().toLowerCase();

    return myTickets.filter((ticket) => {
      const matchesSearch =
        !q ||
        ticket.title.toLowerCase().includes(q) ||
        ticket.description.toLowerCase().includes(q) ||
        String(ticket.id).toLowerCase().includes(q);

      const matchesDate = isTicketMatchingDateFilter(ticket, dateFilter);
      const matchesStatus =
        statusFilter === "all" || ticket.status === statusFilter;

      return matchesSearch && matchesDate && matchesStatus;
    });
  }, [myTickets, search, dateFilter, statusFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, dateFilter, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTickets.length / itemsPerPage)
  );
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * itemsPerPage;
  const paginatedTickets = filteredTickets.slice(start, start + itemsPerPage);

  const stats = useMemo(() => {
    return [
      {
        label: "Total tickets",
        value: myTickets.length,
      },
      {
        label: "En cours",
        value: myTickets.filter(
          (t) => t.status === "OPEN" || t.status === "IN_PROGRESS"
        ).length,
        valueClassName: "text-blue-700",
      },
      {
        label: "Résolus / fermés",
        value: myTickets.filter(
          (t) => t.status === "RESOLVED" || t.status === "CLOSED"
        ).length,
        valueClassName: "text-emerald-700",
      },
      {
        label: "Nouveaux messages",
        value: myTickets.filter((t) => unreadTickets.includes(t.id)).length,
        valueClassName: "text-rose-700",
      },
    ];
  }, [myTickets, unreadTickets]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/40 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
          <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500" />

          <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                <MessageSquare className="h-3.5 w-3.5" />
                Espace support client
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Mes tickets
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
                Suivez vos demandes d’assistance, consultez les réponses du
                support et gardez tout votre historique au même endroit.
              </p>
            </div>

            <Link to="/client/supports/create">
              <Button className="h-12 gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 text-white hover:from-blue-700 hover:to-indigo-700">
                <Plus className="h-4 w-4" />
                Nouveau ticket
              </Button>
            </Link>
          </div>
        </div>

        <SupportStatsCards items={stats} />

        <SupportTicketFilters
          search={search}
          onSearchChange={setSearch}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          searchPlaceholder="Rechercher par titre ou description..."
        />

        {filteredTickets.length === 0 ? (
          <SupportEmptyState
            title="Aucun ticket trouvé"
            description="Essayez de modifier vos filtres ou créez une nouvelle demande."
          />
        ) : (
          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {paginatedTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                href={`/client/supports/ticket/${ticket.id}`}
                unread={unreadTickets.includes(ticket.id)}
                variant="client"
                actionLabel="Voir"
              />
            ))}
          </div>
        )}

        {filteredTickets.length > itemsPerPage && (
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
              Page <span className="font-semibold text-slate-900">{safePage}</span>{" "}
              sur <span className="font-semibold text-slate-900">{totalPages}</span>
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