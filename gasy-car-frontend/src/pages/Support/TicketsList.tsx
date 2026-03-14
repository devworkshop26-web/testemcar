import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  MoreHorizontal,
  Search,
  Filter,
  ArrowUpDown,
  Ticket,
  AlertCircle,
  CheckCircle2,
  Clock,
  Trash2,
  Eye,
  Loader2
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useTickets } from "@/useQuery/support/useTickets";
import { useAllUsers } from "@/useQuery/useAllUsers";
import { useDeleteTicket } from "@/useQuery/support/useDeleteTicket";
import { useUpdateTicketStatus } from "@/useQuery/support/useUpdateTicketStatus";

import type { SupportTicket } from "@/types/supportTypes";
import type { User } from "@/types/userType";

const statusConfig: Record<string, { label: string; style: string; icon: any }> = {
  OPEN: {
    label: "Ouvert",
    style: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    icon: AlertCircle
  },
  IN_PROGRESS: {
    label: "En cours",
    style: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100",
    icon: Clock
  },
  RESOLVED: {
    label: "Résolu",
    style: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100",
    icon: CheckCircle2
  },
  CLOSED: {
    label: "Fermé",
    style: "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-100",
    icon: CheckCircle2
  },
};

const priorityConfig: Record<string, { label: string; style: string }> = {
  LOW: { label: "Basse", style: "text-slate-600 bg-slate-50 border-slate-200" },
  MEDIUM: { label: "Moyenne", style: "text-blue-600 bg-blue-50 border-blue-200" },
  HIGH: { label: "Haute", style: "text-orange-600 bg-orange-50 border-orange-200" },
  URGENT: { label: "Critique", style: "text-red-600 bg-red-50 border-red-200 font-semibold" },
};

const roleLabels: Record<string, string> = {
  CLIENT: "Client",
  PRESTATAIRE: "Prestataire",
  ADMIN: "Admin",
  SUPPORT: "Support",
};

const getInitials = (fullname?: string | null) => {
  const safe = (fullname || "Client").trim();
  const [f = "", l = ""] = safe.split(" ");
  return `${f.charAt(0)}${l.charAt(0)}`.toUpperCase() || "C";
};

type SortBy = "recent" | "oldest" | "priority" | "client";

type EnrichedTicket = SupportTicket & {
  fullName: string;
  avatar: string | null;
  role?: string;
};

export default function TicketsList() {
  const { data: tickets = [], isLoading, refetch } = useTickets();
  const { data: users } = useAllUsers();
  const { mutate: deleteTicket } = useDeleteTicket();
  const { mutate: updateStatus } = useUpdateTicketStatus();

  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("recent");
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const enrichedTickets: EnrichedTicket[] = useMemo(() => {
    if (!users) {
      return tickets.map((t) => ({
        ...t,
        fullName: "Client inconnu",
        avatar: null,
        role: undefined,
      }));
    }

    return tickets.map((t) => {
      const user = (users as User[])?.find((u) => u.id === t.user);
      const fullName = user
        ? `${user.first_name} ${user.last_name}`.trim()
        : "Client inconnu";

      return {
        ...t,
        fullName,
        avatar: user?.image || null,
        role: user?.role,
      };
    });
  }, [tickets, users]);

  const filteredTickets = useMemo(() => {
    return enrichedTickets.filter((t) => {
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || t.priority === priorityFilter;
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !searchLower ||
        t.fullName.toLowerCase().includes(searchLower) ||
        t.title.toLowerCase().includes(searchLower) ||
        t.id.toLowerCase().includes(searchLower);

      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [enrichedTickets, statusFilter, priorityFilter, search]);

  const sortedTickets = useMemo(() => {
    const copy = [...filteredTickets];
    switch (sortBy) {
      case "oldest":
        copy.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case "priority":
        const order = { URGENT: 3, HIGH: 2, MEDIUM: 1, LOW: 0 } as const;
        copy.sort((a, b) => (order[b.priority] ?? 0) - (order[a.priority] ?? 0));
        break;
      case "client":
        copy.sort((a, b) => a.fullName.localeCompare(b.fullName));
        break;
      case "recent":
      default:
        copy.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }
    return copy;
  }, [filteredTickets, sortBy]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, priorityFilter, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedTickets.length / itemsPerPage));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * itemsPerPage;
  const paginatedTickets = sortedTickets.slice(start, start + itemsPerPage);

  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status === "OPEN").length;
  const urgentTickets = tickets.filter((t) => t.priority === "URGENT").length;
  const resolvedTickets = tickets.filter((t) => t.status === "RESOLVED" || t.status === "CLOSED").length;

  const handleDeleteTicket = (ticketId: string) => {
    if (confirm("Supprimer définitivement ce ticket ?")) {
      deleteTicket(ticketId, {
        onSuccess: () => setTimeout(() => refetch(), 500),
      });
    }
  };

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    updateStatus({ ticketId, status: newStatus as any }, { onSuccess: () => refetch() });
  };

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-slate-50/50">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Support</h1>
          <p className="text-sm text-slate-500 mt-1">Gestion et suivi des demandes clients.</p>
        </div>
        <Link to="/support/tickets/create">
          <Button className="gap-2">
            <Ticket className="h-4 w-4" />
            Nouveau Ticket
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTickets}</div>
            <p className="text-xs text-muted-foreground">Toutes catégories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <AlertCircle className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{openTickets}</div>
            <p className="text-xs text-muted-foreground">Nécessitent une action</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgents</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{urgentTickets}</div>
            <p className="text-xs text-muted-foreground">Priorité haute/critique</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Traités</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{resolvedTickets}</div>
            <p className="text-xs text-muted-foreground">Résolus ou fermés</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 md:max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous status</SelectItem>
                  <SelectItem value="OPEN">Ouvert</SelectItem>
                  <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                  <SelectItem value="RESOLVED">Résolu</SelectItem>
                  <SelectItem value="CLOSED">Fermé</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[140px]">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes priorités</SelectItem>
                  <SelectItem value="LOW">Basse</SelectItem>
                  <SelectItem value="MEDIUM">Moyenne</SelectItem>
                  <SelectItem value="HIGH">Haute</SelectItem>
                  <SelectItem value="URGENT">Critique</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(val) => setSortBy(val as SortBy)}>
                <SelectTrigger className="w-[140px]">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Trier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Plus récent</SelectItem>
                  <SelectItem value="oldest">Plus ancien</SelectItem>
                  <SelectItem value="priority">Priorité</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="relative w-full overflow-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="w-[300px]">Ticket</TableHead>
                    <TableHead>Demandeur</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Priorité</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTickets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Aucun ticket ne correspond à vos critères.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedTickets.map((ticket) => {
                      const StatusIcon = statusConfig[ticket.status]?.icon || AlertCircle;
                      return (
                        <TableRow key={ticket.id} className="group hover:bg-slate-50/50">
                          <TableCell className="font-medium">
                            <div className="flex flex-col gap-1">
                              <span className="font-semibold text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">
                                {ticket.title}
                              </span>
                              <span className="font-mono text-[10px] text-slate-400 uppercase">
                                #{ticket.id.slice(0, 8)}...
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 border border-slate-200">
                                <AvatarImage src={ticket.avatar || undefined} />
                                <AvatarFallback className="bg-slate-100 text-xs text-slate-600">
                                  {getInitials(ticket.fullName)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-700">
                                  {ticket.fullName}
                                </span>
                                <span className="text-[10px] text-slate-500 uppercase">
                                  {roleLabels[ticket.role || ""] || "Utilisateur"}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-500 text-xs whitespace-nowrap">
                            {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true, locale: fr })}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`font-medium border shadow-sm ${priorityConfig[ticket.priority]?.style}`}
                            >
                              {priorityConfig[ticket.priority]?.label || ticket.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`font-medium border gap-1 pl-1 pr-2 py-0.5 shadow-sm ${statusConfig[ticket.status]?.style}`}
                            >
                              <StatusIcon className="h-3 w-3" />
                              <span>{statusConfig[ticket.status]?.label || ticket.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-[160px]">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                  <Link to={`/support/ticket/${ticket.id}`} className="flex w-full items-center cursor-pointer">
                                    <Eye className="mr-2 h-4 w-4" />
                                    Voir détails
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuSub>
                                  <DropdownMenuSubTrigger>Changer statut</DropdownMenuSubTrigger>
                                  <DropdownMenuSubContent>
                                    <DropdownMenuItem onClick={() => handleStatusChange(ticket.id, "OPEN")}>
                                      Ouvert
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusChange(ticket.id, "IN_PROGRESS")}>
                                      En cours
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusChange(ticket.id, "RESOLVED")}>
                                      Résolu
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusChange(ticket.id, "CLOSED")}>
                                      Fermé
                                    </DropdownMenuItem>
                                  </DropdownMenuSubContent>
                                </DropdownMenuSub>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600 focus:text-red-600 cursor-pointer"
                                  onClick={() => handleDeleteTicket(ticket.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        {sortedTickets.length > itemsPerPage && (
          <div className="flex items-center justify-end space-x-2 p-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
            >
              Précédent
            </Button>
            <div className="text-xs text-muted-foreground">
              Page {safePage} sur {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
            >
              Suivant
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}