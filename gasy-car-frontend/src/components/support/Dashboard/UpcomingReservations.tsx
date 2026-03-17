"use client";

import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarCheck, ChevronRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useReservationsQuery } from "@/useQuery/reservationsUseQuery";
import { Reservation } from "@/types/reservationsType";

export default function UpcomingReservations() {
  const navigate = useNavigate();

  const { data: reservations = [], isLoading } = useReservationsQuery();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const now = new Date();

  const upcomingReservations: Reservation[] = reservations
    .filter((r) => {
      if (!r.start_datetime) return false;

      const start = new Date(r.start_datetime);

      return (
        start > now &&
        r.status !== "CANCELLED" &&
        r.status !== "COMPLETED"
      );
    })
    .sort(
      (a, b) =>
        new Date(a.start_datetime).getTime() -
        new Date(b.start_datetime).getTime()
    )
    .slice(0, 3);

  if (upcomingReservations.length === 0) {
    return (
      <Card className="rounded-xl border-dashed">
        <CardContent className="p-4 text-sm text-muted-foreground text-center">
          Aucun retrait prévu prochainement
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {upcomingReservations.map((reservation) => {
        const vehicle = reservation.vehicle_data;
        const client = reservation.client_data;

        return (
          <Card
            key={reservation.id}
            className="border-none shadow-sm hover:shadow-md transition-shadow rounded-xl cursor-pointer"
            onClick={() => navigate("/support/reservations?pickup=UPCOMING_24H")}
          >
            <CardContent className="p-4 flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5 text-green-500" />
                </div>

                <div>
                  <h5 className="font-semibold text-sm">
                    Retrait prévu — {client?.first_name} {client?.last_name}
                  </h5>
                  <p className="text-xs text-gray-500">
                    {format(
                      new Date(reservation.start_datetime),
                      "dd MMM yyyy • HH:mm",
                      { locale: fr }
                    )}{" "}
                    • {vehicle?.marque_data?.nom} {vehicle?.modele_data?.label}
                  </p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-gray-400" />
            </CardContent>
          </Card>
        );
      })}

      {/* Bouton voir tout */}
      <Button
        variant="outline"
        className="w-full rounded-xl"
        onClick={() => navigate("/support/reservations?pickup=UPCOMING_24H")}
      >
        Voir toutes les réservations
      </Button>
    </div>
  );
}
