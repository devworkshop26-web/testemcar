"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  AlertTriangle,
  Mail,
  CreditCard,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { useReservationsQuery } from "@/useQuery/reservationsUseQuery";
import { Reservation } from "@/types/reservationsType";
import { useNavigate } from "react-router-dom";

interface Props {
  setActiveTab: (tab: string) => void;
}

export default function CriticalReservationCard({ setActiveTab }: Props) {
  const { data: reservations = [], isLoading } = useReservationsQuery();
  const navigate = useNavigate();

  if (isLoading || !Array.isArray(reservations)) return null;

  /* -----------------------------
     1️⃣ Filtrer les urgences
  ------------------------------ */
  const criticalReservations: Reservation[] = reservations
    .filter((r) => {
      const paymentStatus = r.payment?.status;
      const unpaid =
        !paymentStatus ||
        paymentStatus === "PENDING" ||
        paymentStatus === "FAILED";

      const active =
        r.status !== "CANCELLED" && r.status !== "COMPLETED";

      return unpaid && active;
    })
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() -
        new Date(b.created_at).getTime()
    );

  if (criticalReservations.length === 0) return null;

  /* -----------------------------
     2️⃣ Limiter l’affichage
  ------------------------------ */
  const MAX_DISPLAY = 3;
  const visible = criticalReservations.slice(0, MAX_DISPLAY);
  const remaining = criticalReservations.length - visible.length;

  return (
    <Card className="border-none shadow-xl rounded-2xl bg-red-500/10 border-red-200">
      <CardHeader>
        <CardTitle className="flex justify-between items-center text-red-700">
          <span className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Réservations critiques
          </span>

          <Badge className="bg-red-600">
            {criticalReservations.length} urgente
            {criticalReservations.length > 1 && "s"}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Liste des urgences */}
        {visible.map((reservation) => {
          const client = reservation.client_data;
          const vehicle = reservation.vehicle_data;

          return (
            <div
              key={reservation.id}
              className="p-4 bg-white rounded-xl shadow-inner space-y-2"
            >
              {/* Client */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="font-semibold text-sm">
                      {client?.first_name} {client?.last_name}
                    </p>
                    <p className="text-xs text-gray-500 font-mono">
                      #{reservation.reference}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-semibold text-red-600">
                  {format(
                    new Date(reservation.created_at),
                    "dd MMM yyyy",
                    { locale: fr }
                  )}
                </span>
              </div>

              {/* Infos */}
              <div className="pl-3 border-l-2 border-red-200 space-y-1 text-sm">
                <p>
                  Véhicule :
                  <span className="ml-1 text-gray-600">
                    {vehicle?.marque_data?.nom}{" "}
                    {vehicle?.modele_data?.label} –{" "}
                    <span className="font-mono">
                      {vehicle?.numero_immatriculation}
                    </span>
                  </span>
                </p>

                <p className="flex items-center gap-1 text-red-600 font-semibold">
                  <CreditCard className="h-3 w-3" />
                  Paiement {reservation.payment?.status ?? "NON INITIÉ"}
                </p>
              </div>

              {/* Action rapide */}
              <div className="flex justify-end">
              </div>
            </div>
          );
        })}

        {/* S’il reste d’autres urgences */}
        {remaining > 0 && (
          <p className="text-xs text-red-600 font-medium">
            + {remaining} autre(s) réservation(s) critique(s)
          </p>
        )}

        {/* Action globale */}
        <Button
          className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl"
          onClick={() => navigate("/support/reservations")}
        >
          Gérer toutes les réservations urgentes
        </Button>

      </CardContent>
    </Card>
  );
}
