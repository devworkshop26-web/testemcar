import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Headset } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecentTickets } from "@/useQuery/useRecentTickets";

export default function RecentTickets({ setActiveTab }) {
  const { data: rawTickets = [], isLoading, isError } = useRecentTickets();

  // 🟦 SKELETON — affichage pendant le chargement
  if (isLoading) {
    return (
      <Card className="border-none shadow-md rounded-2xl p-4">
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>

        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
            >
              {/* Icon skeleton */}
              <Skeleton className="w-10 h-10 rounded-lg" />

              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // 🟥 ERREUR
  if (isError) {
    return (
      <Card className="border-none shadow-md rounded-2xl p-4">
        <p className="text-red-500 text-sm">Erreur lors du chargement des tickets.</p>
      </Card>
    );
  }

  // ⭐ MAPPING DES DONNÉES BACKEND
  const recentTickets = rawTickets.map((ticket) => ({
    id: ticket.id,
    subject: ticket.subject || ticket.title || "Ticket sans titre",
    priority: ticket.priority || "Normal",
    date: ticket.created_at
      ? new Date(ticket.created_at).toLocaleString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "short",
        })
      : "Date inconnue",
    color:
      ticket.priority === "Urgent"
        ? "text-red-600"
        : ticket.priority === "Haute"
        ? "text-orange-600"
        : ticket.priority === "Normale"
        ? "text-yellow-600"
        : "text-blue-600",
  }));

  // 🟩 AFFICHAGE NORMAL
  return (
    <Card className="border-none shadow-md rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg">Tickets Support Récents</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {recentTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition"
            onClick={() => setActiveTab("tickets")}
          >
            <div
              className={`w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center ${ticket.color}`}
            >
              <Headset className="w-5 h-5" />
            </div>

            <div>
              <p className="font-bold text-gray-900 text-sm">{ticket.subject}</p>
              <p className="text-xs text-gray-500">
                {ticket.priority} • {ticket.date}
              </p>
            </div>
          </div>
        ))}

        {recentTickets.length === 0 && (
          <p className="text-gray-500 text-sm">Aucun ticket récent.</p>
        )}
      </CardContent>
    </Card>
  );
}
