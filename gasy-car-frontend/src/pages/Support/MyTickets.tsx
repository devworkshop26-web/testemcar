import { useSupportQuery } from "@/useQuery/supportUseQuery";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "@/types/userType";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Loader2, MessageSquare, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useUnreadTickets } from "@/hooks/support/useUnreadTickets";
import { useTicketsListSocket } from "@/hooks/support/useTicketsListSocket";

export default function MyTickets() {
  // ---------------------------
  // Hooks (toujours tout en haut)
  // ---------------------------
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<User>(["currentUser"]);
  const { ticketsData } = useSupportQuery();
  const { unreadTickets } = useUnreadTickets();
useTicketsListSocket();

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  // ---------------------------
  // Loading
  // ---------------------------
  if (!ticketsData) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  // ---------------------------
  // Data filtering (NO HOOKS INSIDE)
  // ---------------------------

  // 1. Tickets du user
  const myTickets = ticketsData.filter((t) => t.user === currentUser?.id);

  // 2. Filtre search
  let filtered = myTickets.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  // 3. Filtre date
  filtered = filtered.filter((ticket) => {
    if (!dateFilter) return true;

    const created = new Date(ticket.created_at);
    const now = new Date();

    if (dateFilter === "today") {
      return created.toDateString === now.toDateString;
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
  });

  // ---------------------------
  // Pagination
  // ---------------------------
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (page - 1) * itemsPerPage;
  const paginated = filtered.slice(start, start + itemsPerPage);

  // ---------------------------
  // RENDER
  // ---------------------------
  return (
    <div className="p-4 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Mes tickets</h2>

        <Link to="/client/supports/create">
          <Button>+ Nouveau Ticket</Button>
        </Link>
      </div>

      {/* SEARCH & DATE FILTER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Rechercher un ticket..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* Date filter */}
        <Select
          onValueChange={(v) => {
            setPage(1);
            setDateFilter(v);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Aujourd’hui</SelectItem>
            <SelectItem value="week">Cette semaine</SelectItem>
            <SelectItem value="month">Ce mois</SelectItem>
            <SelectItem value="year">Cette année</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* EMPTY STATE */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          Aucun ticket trouvé.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginated.map((ticket) => (
            <Card
              key={ticket.id}
              className="shadow-sm hover:shadow-md transition rounded-xl"
            >
              <CardContent className="p-4 flex items-start gap-4">
                {/* Icon */}
                <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-xl">
                  <MessageSquare />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-lg">
                    {ticket.title}

                    {unreadTickets.includes(ticket.id) && (
                      <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-600 text-white">
                        Nouveau
                      </span>
                    )}
                  </h3>

                  <p className="text-sm text-gray-600 line-clamp-2">
                    {ticket.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </span>

                    <Link
                      to={`/client/supports/ticket/${ticket.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Voir
                    </Link>

                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            ← Précédent
          </Button>

          <span>
            Page {page} / {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Suivant →
          </Button>
        </div>
      )}
    </div>
  );
}
