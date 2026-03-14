import { useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { useVehicleAvailabilityQuery } from "@/useQuery/vehicleAvailabilityUseQuery";
import { VehicleAvailability } from "@/Actions/VehicleAvailabilityApi";
import { addDays, parseISO, isWithinInterval } from "date-fns";
import { fr } from "date-fns/locale";

interface VehicleAvailabilityCalendarProps {
  vehicleId: string;
  className?: string;
  availabilities?: VehicleAvailability[] | null;
}

const VehicleAvailabilityCalendar = ({ vehicleId, className, availabilities: providedAvailabilities }: VehicleAvailabilityCalendarProps) => {
  const { data: fetchedAvailabilities, isLoading } = useVehicleAvailabilityQuery(providedAvailabilities ? undefined : vehicleId);
  const availabilities = providedAvailabilities ?? fetchedAvailabilities;

  const modifiers = useMemo(() => {
    if (!availabilities) return {};

    const reserved: Date[] = [];
    const blocked: Date[] = [];
    const maintenance: Date[] = [];

    availabilities.forEach((availability) => {
      const start = parseISO(availability.start_date);
      const end = parseISO(availability.end_date);
      let current = start;

      while (current <= end) {
        if (availability.type === "RESERVED") {
          reserved.push(new Date(current));
        } else if (availability.type === "BLOCKED") {
          blocked.push(new Date(current));
        } else if (availability.type === "MAINTENANCE") {
          maintenance.push(new Date(current));
        }
        current = addDays(current, 1);
      }
    });

    return { reserved, blocked, maintenance };
  }, [availabilities]);

  const modifiersStyles = {
    reserved: { color: "white", backgroundColor: "#ef4444" }, // Red-500
    blocked: { color: "white", backgroundColor: "#374151" }, // Gray-700
    maintenance: { color: "white", backgroundColor: "#f97316" }, // Orange-500
  };

  if (isLoading) {
    return <div className="p-4 text-center text-muted-foreground">Chargement du calendrier...</div>;
  }

  return (
    <div className={className}>
      <div className="flex gap-4 mb-4 text-sm justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Réservé</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-700" />
          <span>Indisponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span>Maintenance</span>
        </div>
      </div>
      <div className="border rounded-md p-4 flex justify-center">
        <Calendar
          mode="default"
          locale={fr}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          disableNavigation={false}
          showOutsideDays={false}
          className="rounded-md border shadow"
        />
      </div>
    </div>
  );
};

export default VehicleAvailabilityCalendar;
