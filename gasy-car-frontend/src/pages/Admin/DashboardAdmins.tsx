// src/pages/admin/AdminDashboardPage.tsx
import { AdminPageShell } from "@/components/admin/AdminPageShell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { adminUseQuery } from "@/useQuery/adminUseQuery"
import { useVehiculesQuery } from "@/useQuery/vehiculeUseQuery"
import { useReservationsQuery } from "@/useQuery/reservationsUseQuery"
import { BarChart3, Users, Car, CreditCard } from "lucide-react"
import ReservationChart from "@/components/admin/analytics/ReservationStats"

export function AdminDashboardPage() {
  const { usersData } = adminUseQuery()
  const { data: vehicles } = useVehiculesQuery()
  const { data: reservations } = useReservationsQuery()
  
  // Calculate stats
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyReservations = reservations?.filter(r => {
    const d = new Date(r.start_datetime);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }) || [];

  const totalRevenue = reservations?.reduce((acc, curr) => {
    // Assuming total_amount is a string or number, handle both
    const amount = typeof curr.total_amount === 'string' ? parseFloat(curr.total_amount) : curr.total_amount;
    return acc + (amount || 0);
  }, 0) || 0;

  return (
    <AdminPageShell
      title="Dashboard Super Admin"
      description="Vue d’ensemble de l’activité Madagasycar : utilisateurs, véhicules, réservations et revenus."
      
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="w-full rounded-xl bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium sm:text-base">
              Utilisateurs
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold sm:text-3xl">{usersData ? usersData.length : 0}</div>
            <p className="text-xs text-muted-foreground sm:text-sm">Total des comptes actifs</p>
          </CardContent>
        </Card>

        <Card className="w-full rounded-xl bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium sm:text-base">
              Véhicules listés
            </CardTitle>
            <Car className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold sm:text-3xl">{vehicles ? vehicles.length : 0}</div>
            <p className="text-xs text-muted-foreground sm:text-sm">Annonces publiées</p>
          </CardContent>
        </Card>

        <Card className="w-full rounded-xl bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium sm:text-base">
              Réservations du mois
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold sm:text-3xl">{monthlyReservations.length}</div>
            <p className="text-xs text-muted-foreground sm:text-sm">Taux de complétion --%</p>
          </CardContent>
        </Card>

        <Card className="w-full rounded-xl bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium sm:text-base">
              Revenus plateforme
            </CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold sm:text-3xl">{totalRevenue.toLocaleString()} Ar</div>
            <p className="text-xs text-muted-foreground sm:text-sm">Commission moyenne --%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="today" className="mt-4">
        <TabsList className="flex w-full flex-wrap gap-2 rounded-lg bg-muted/60 p-2 sm:gap-3">
          <TabsTrigger className="flex-1 rounded-md text-sm sm:text-base" value="today">
            Aujourd’hui
          </TabsTrigger>
          <TabsTrigger className="flex-1 rounded-md text-sm sm:text-base" value="week">
            Cette semaine
          </TabsTrigger>
          <TabsTrigger className="flex-1 rounded-md text-sm sm:text-base" value="month">
            Ce mois
          </TabsTrigger>
        </TabsList>
        <TabsContent value="today" className="mt-4">
          <Card className="rounded-xl bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Activité du jour</CardTitle>
            </CardHeader>
            <CardContent>
              
              
              <ReservationChart type="day" title="Réservations de l’heure" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="week" className="mt-4">
          <Card className="rounded-xl bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Tendance hebdomadaire</CardTitle>
            </CardHeader>
            <CardContent>
              <ReservationChart type="week" title="Réservations de la semaine" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="month" className="mt-4">
          <Card className="rounded-xl bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Tendance mensuelle</CardTitle>
            </CardHeader>
            <CardContent>
             <ReservationChart type="month" title="Réservations du mois" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminPageShell>
  )
}
