// src/components/support/SupportStats.tsx
import { CalendarCheck, Users, Headset } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useSupportStats } from "@/useQuery/support/useSupportStats";
import { Skeleton } from "@/components/ui/skeleton";

export default function SupportStats() {
  const { data, isLoading, isError } = useSupportStats();

  const safeData = data ?? {
    ongoingReservations: 0,
    newClients24h: 0,
    pendingTickets: 0,
    availableCars: 0,
    totalCars: 0,
  };

  const stats = [
    {
      icon: CalendarCheck,
      title: "Réservations en cours",
      value: safeData.ongoingReservations.toString(),
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: Users,
      title: "Nouveaux clients (24h)",
      value: safeData.newClients24h.toString(),
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      icon: Headset,
      title: "Tickets en attente",
      value: safeData.pendingTickets.toString(),
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
  ];

  // ⛔ Gestion erreur API
  if (isError) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-none shadow-md rounded-2xl">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-sm text-red-500">Erreur de chargement</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // ⏳ Loading --> Skeleton UI
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="border-none shadow-md rounded-2xl">
            <CardContent className="p-5 flex items-center gap-4">
              {/* Icon Skeleton */}
              <Skeleton className="w-12 h-12 rounded-full" />

              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // ✅ Affichage normal
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="border-none shadow-md rounded-2xl">
          <CardContent className="p-5 flex items-center gap-4">
            <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
