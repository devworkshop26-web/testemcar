import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { DailyIncomeChart } from "@/components/admin/analytics/DailyIncomeChart";
import { MonthlyReservationsChart } from "@/components/admin/analytics/MonthlyReservationsChart";
import { ReservationStatusChart } from "@/components/admin/analytics/ReservationStatusChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminAnalyticsQuery } from "@/useQuery/useAdminAnalyticsQuery";
import { RefreshCw } from "lucide-react";

function ChartSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      <Skeleton className="h-6 w-2/5" />
      <Skeleton className="h-64 w-full" />
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}

export function AdminAnalyticsPage() {
  const { reservationStatsQuery, dailyIncomeQuery } = useAdminAnalyticsQuery();

  const isRefreshing = reservationStatsQuery.isFetching || dailyIncomeQuery.isFetching;

  const handleRefresh = () => {
    reservationStatsQuery.refetch();
    dailyIncomeQuery.refetch();
  };

  return (
    <AdminPageShell
      title="Statistiques"
      description="Suivez les indicateurs clés des réservations et revenus en temps réel."
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Vue d’ensemble des performances des réservations, statuts et revenus quotidiens.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : "invisible"}`}
            aria-hidden={!isRefreshing}
          />
          {isRefreshing ? "Actualisation..." : "Actualiser"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Statuts des réservations</CardTitle>
            <p className="text-sm text-muted-foreground">
              Répartition des réservations par statut pour identifier les points de friction.
            </p>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            {reservationStatsQuery.isLoading ? (
              <ChartSkeleton />
            ) : (
              <ReservationStatusChart data={reservationStatsQuery.data?.statusBreakdown ?? []} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Réservations / mois</CardTitle>
            <p className="text-sm text-muted-foreground">
              Volume de réservations mensuel pour suivre les tendances saisonnières.
            </p>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            {reservationStatsQuery.isLoading ? (
              <ChartSkeleton />
            ) : (
              <MonthlyReservationsChart data={reservationStatsQuery.data?.monthlyReservations ?? []} />
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenus par jour</CardTitle>
            <p className="text-sm text-muted-foreground">
              Suivi journalier des revenus générés par les réservations confirmées.
            </p>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            {dailyIncomeQuery.isLoading ? (
              <ChartSkeleton lines={6} />
            ) : (
              <DailyIncomeChart data={dailyIncomeQuery.data ?? []} />
            )}
          </CardContent>
        </Card>
      </div>
    </AdminPageShell>
  );
}
