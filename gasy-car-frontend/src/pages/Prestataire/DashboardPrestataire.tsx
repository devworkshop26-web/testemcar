import {
  Car,
  Wallet,
  TrendingUp,
  Clock,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllReservationOfMyvehiculeQuery } from "@/useQuery/reservationsUseQuery";
import { useCurentuser } from "@/useQuery/authUseQuery";
import { useOwnerVehiculesQuery } from "@/useQuery/vehiculeUseQuery";
import { useMemo } from "react";
import DashboardStats from "@/components/Prestataire/Dashboard/DashboardStats";
import RevenueChart from "@/components/Prestataire/Dashboard/RevenueChart";
import RecentBookings from "@/components/Prestataire/Dashboard/RecentBookings";
import QuickActions from "@/components/Prestataire/Dashboard/QuickActions";
import FleetStatus from "@/components/Prestataire/Dashboard/FleetStatus";
import MaintenanceAlerts from "@/components/Prestataire/Dashboard/MaintenanceAlerts";

// Helper function to get initials from name
const getInitials = (name: string): string => {
  if (!name) return "CL";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Helper function to safely parse amount
const parseAmount = (amount: string | number): number => {
  if (typeof amount === 'number') return amount;
  const parsed = parseFloat(amount);
  return isNaN(parsed) ? 0 : parsed;
};

const DashboardPrestataire = () => {
  const { user } = useCurentuser();

  const { 
    data: allReservations = [], 
    isLoading: isLoadingReservations,
    isError: isErrorReservations 
  } = useAllReservationOfMyvehiculeQuery(user?.id);
  
  const { 
    data: allVehicles = [],
    isLoading: isLoadingVehicles,
    isError: isErrorVehicles
  } = useOwnerVehiculesQuery(user?.id);

  const isLoading = isLoadingReservations || isLoadingVehicles;
  const isError = isErrorReservations || isErrorVehicles;

  // Memoized calculations for better performance
  const calculatedStats = useMemo(() => {
    const activeReservations = allReservations.filter(r => 
      r.status === "CONFIRMED" || r.status === "IN_PROGRESS"
    );

    const pendingReservations = allReservations.filter(r => r.status === "PENDING");

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyRevenue = allReservations
      .filter(r => {
        const d = new Date(r.start_datetime);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((acc, curr) => acc + parseAmount(curr.total_amount), 0);

    const availableVehicles = allVehicles.filter(v => v.est_disponible);
    
    // Calculate occupancy rate based on unique vehicles in active reservations
    const vehiclesInUse = new Set(
      activeReservations.map(r => r.vehicle)
    ).size;
    const occupancyRate = allVehicles.length > 0 
      ? Math.round((vehiclesInUse / allVehicles.length) * 100) 
      : 0;

    return {
      monthlyRevenue,
      activeReservations,
      pendingReservations,
      availableVehicles,
      occupancyRate,
      vehiclesInUse
    };
  }, [allReservations, allVehicles]);

  // Memoized recent bookings
  const recentBookings = useMemo(() => {
    return allReservations
      .sort((a, b) => new Date(b.created_at || b.start_datetime).getTime() - new Date(a.created_at || a.start_datetime).getTime())
      .slice(0, 4)
      .map(reservation => {
        const clientName = reservation.client_data?.first_name + " " + reservation.client_data?.last_name || 
                          reservation.client_data?.email || 
                          "Client";
        const vehicleName = reservation.vehicle_data?.titre || "Véhicule";
        
        return {
          id: reservation.id.substring(0, 8),
          client: clientName,
          car: vehicleName,
          dates: `${new Date(reservation.start_datetime).toLocaleDateString()} - ${new Date(reservation.end_datetime).toLocaleDateString()}`,
          amount: `${parseAmount(reservation.total_amount).toLocaleString()} Ar`,
          status: reservation.status === "PENDING" ? "En attente" : 
                  reservation.status === "CONFIRMED" ? "Confirmé" :
                  reservation.status === "IN_PROGRESS" ? "En cours" :
                  reservation.status === "COMPLETED" ? "Terminé" : "Annulé",
          avatar: getInitials(clientName)
        };
      });
  }, [allReservations]);

  // Memoized revenue chart data based on last 6 months
  const revenueChartData = useMemo(() => {
    const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
    const currentMonth = new Date().getMonth();
    const chartData = [];

    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const year = currentMonth - i < 0 
        ? new Date().getFullYear() - 1 
        : new Date().getFullYear();

      const monthRevenue = allReservations
        .filter(r => {
          const d = new Date(r.start_datetime);
          return d.getMonth() === monthIndex && d.getFullYear() === year;
        })
        .reduce((acc, curr) => acc + parseAmount(curr.total_amount), 0);

      chartData.push({
        label: months[monthIndex],
        value: monthRevenue,
        displayValue: `${(monthRevenue / 1000000).toFixed(1)}M Ar`
      });
    }

    return chartData;
  }, [allReservations]);

  const statsCards: { title: string; value: string; change: string; trend: "up" | "down" | "neutral"; icon: any; bg: string; }[] = [
    { 
      title: "Revenu Mensuel", 
      value: `${calculatedStats.monthlyRevenue.toLocaleString()} Ar`, 
      change: "--", 
      trend: "neutral" as const, 
      icon: <Wallet className="w-5 h-5 text-blue-600" />, 
      bg: "bg-blue-100" 
    },
    { 
      title: "Locations Actives", 
      value: calculatedStats.activeReservations.length.toString(), 
      change: `${allReservations.length} total`, 
      trend: "up" as const, 
      icon: <Car className="w-5 h-5 text-purple-600" />, 
      bg: "bg-purple-100" 
    },
    { 
      title: "Taux d'Occupation", 
      value: `${calculatedStats.occupancyRate}%`, 
      change: `${allVehicles.length} véhicules`, 
      trend: "neutral" as const, 
      icon: <TrendingUp className="w-5 h-5 text-emerald-600" />, 
      bg: "bg-emerald-100" 
    },
    { 
      title: "Demandes en attente", 
      value: calculatedStats.pendingReservations.length.toString(), 
      change: calculatedStats.pendingReservations.length > 0 ? "À traiter" : "Aucune", 
      trend: "neutral" as const, 
      icon: <Clock className="w-5 h-5 text-orange-600" />, 
      bg: "bg-orange-100" 
    },
  ];

  // Error State
  if (isError) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Erreur de chargement</h3>
            <p className="text-gray-600 text-sm">
              Impossible de charger les données du tableau de bord.
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="w-full space-y-8 animate-in fade-in duration-500">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-none shadow-md rounded-2xl">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <Skeleton className="w-16 h-6 rounded-lg" />
                </div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-md rounded-2xl">
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-8">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div>
          <h2 className="text-2xl font-bold text-gray-900 font-poppins">Vue d'ensemble</h2>
          <p className="text-gray-500 text-sm mt-1">Bienvenue sur votre tableau de bord partenaire.</p>
      </div>

      {/* STATS GRID */}
      <DashboardStats stats={statsCards} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN (REVENUE & TABLE) */}
        <div className="lg:col-span-2 space-y-8">
          {/* REVENUE CHART - Real Data */}
          <RevenueChart data={revenueChartData} />

          {/* RECENT BOOKINGS TABLE */}
          <RecentBookings bookings={recentBookings} />
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">
          {/* QUICK ACTIONS */}
          <QuickActions />

          {/* FLEET STATUS */}
          <FleetStatus 
            availableCount={calculatedStats.availableVehicles.length}
            inUseCount={calculatedStats.vehiclesInUse}
            totalCount={allVehicles.length}
          />

          {/* ALERTS */}
          <MaintenanceAlerts />

        </div>
      </div>
    </div>
  );
};

export default DashboardPrestataire;