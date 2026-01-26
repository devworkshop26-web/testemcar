import CriticalReservationCard from "@/components/support/Dashboard/CriticalReservationCard";
import RecentTickets from "@/components/support/Dashboard/RecentTickets";
import SupportStats from "@/components/support/Dashboard/SupportStats";
import UpcomingReservations from "@/components/support/Dashboard/UpcomingReservations";

interface DashboardOverviewProps {
  setActiveTab: (tab: string) => void;
}

export default function DashboardOverview({ setActiveTab }: DashboardOverviewProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* STATS */}
      <SupportStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold font-poppins">Action Urgente</h3>
          <CriticalReservationCard setActiveTab={setActiveTab} />

          <h3 className="text-xl font-bold font-poppins">Réservations à venir (24h)</h3>
          <UpcomingReservations setActiveTab={setActiveTab} />
        </div>

        {/* RIGHT CONTENT */}
        <div className="space-y-6">
          <RecentTickets setActiveTab={setActiveTab} />
        </div>
      </div>
    </div>
  );
}
