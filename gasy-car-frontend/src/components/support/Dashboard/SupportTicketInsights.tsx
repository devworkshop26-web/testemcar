import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supportAPI } from "@/Actions/supportApi";
import type { SupportTicket } from "@/types/supportTypes";
import { useQuery } from "@tanstack/react-query";

type PriorityCount = {
  label: string;
  key: string;
  color: string;
  value: number;
};

const PRIORITY_MAP: Record<string, PriorityCount> = {
  URGENT: { label: "Urgent", key: "URGENT", color: "bg-red-500", value: 0 },
  HIGH: { label: "Haute", key: "HIGH", color: "bg-orange-500", value: 0 },
  MEDIUM: { label: "Moyenne", key: "MEDIUM", color: "bg-yellow-500", value: 0 },
  LOW: { label: "Basse", key: "LOW", color: "bg-green-500", value: 0 },
  OTHER: { label: "Autre", key: "OTHER", color: "bg-slate-400", value: 0 },
};

const STATUS_LABELS: Record<string, string> = {
  OPEN: "Ouverts",
  IN_PROGRESS: "En cours",
  RESOLVED: "Résolus",
  CLOSED: "Fermés",
};

const normalizeValue = (value?: string) => (value || "").toUpperCase().trim();

export default function SupportTicketInsights() {
  const { data: tickets = [], isLoading, isError } = useQuery<SupportTicket[]>({
    queryKey: ["support-tickets"],
    queryFn: async () => {
      const res = await supportAPI.get_all_tickets();
      return Array.isArray(res.data) ? res.data : [];
    },
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <Card className="border-none shadow-md rounded-2xl">
        <CardHeader>
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-xl border border-muted p-4">
                <Skeleton className="h-3 w-24 mb-3" />
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index}>
                <Skeleton className="h-3 w-24 mb-2" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border-none shadow-md rounded-2xl">
        <CardContent className="p-6">
          <p className="text-sm text-red-500">Impossible de charger les tickets support.</p>
        </CardContent>
      </Card>
    );
  }

  const now = Date.now();
  const statusCounts = {
    OPEN: 0,
    IN_PROGRESS: 0,
    RESOLVED: 0,
    CLOSED: 0,
  };
  const priorityCounts = Object.values(PRIORITY_MAP).map((item) => ({
    ...item,
    value: 0,
  }));

  let urgentCount = 0;
  let overdueCount = 0;
  let recentCount = 0;

  tickets.forEach((ticket) => {
    const status = normalizeValue(ticket.status);
    if (status in statusCounts) {
      statusCounts[status as keyof typeof statusCounts] += 1;
    }

    const priority = normalizeValue(ticket.priority);
    const priorityItem =
      priorityCounts.find((item) => item.key === priority) ||
      priorityCounts.find((item) => item.key === "OTHER");

    if (priorityItem) {
      priorityItem.value += 1;
    }

    if (["URGENT", "HIGH"].includes(priority)) {
      urgentCount += 1;
    }

    const createdAt = new Date(ticket.created_at).getTime();
    if (!Number.isNaN(createdAt)) {
      const hoursOld = (now - createdAt) / (1000 * 60 * 60);
      if (hoursOld >= 48 && ["OPEN", "IN_PROGRESS"].includes(status)) {
        overdueCount += 1;
      }
      if (hoursOld <= 24) {
        recentCount += 1;
      }
    }
  });

  const totalTickets = tickets.length || 1;

  return (
    <Card className="border-none shadow-md rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg">Santé des tickets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Object.entries(statusCounts).map(([key, value]) => (
            <div key={key} className="rounded-xl border border-muted p-4">
              <p className="text-xs font-medium text-muted-foreground">
                {STATUS_LABELS[key]}
              </p>
              <p className="text-2xl font-semibold text-gray-900">{value}</p>
            </div>
          ))}
          <div className="rounded-xl border border-muted p-4">
            <p className="text-xs font-medium text-muted-foreground">Priorité élevée</p>
            <p className="text-2xl font-semibold text-red-600">{urgentCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Urgent &amp; Haute</p>
          </div>
          <div className="rounded-xl border border-muted p-4">
            <p className="text-xs font-medium text-muted-foreground">Tickets en retard</p>
            <p className="text-2xl font-semibold text-orange-600">{overdueCount}</p>
            <p className="text-xs text-muted-foreground mt-1">+48h ouverts</p>
          </div>
          <div className="rounded-xl border border-muted p-4">
            <p className="text-xs font-medium text-muted-foreground">Nouveaux (24h)</p>
            <p className="text-2xl font-semibold text-blue-600">{recentCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Créés récemment</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-700">Répartition par priorité</p>
          <div className="space-y-2">
            {priorityCounts.map((priority) => {
              const percentage = Math.round((priority.value / totalTickets) * 100);
              return (
                <div key={priority.key}>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{priority.label}</span>
                    <span>{priority.value}</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
                    <div
                      className={`h-2 rounded-full ${priority.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
