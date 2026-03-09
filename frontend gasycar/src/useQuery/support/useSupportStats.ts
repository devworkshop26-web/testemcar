// src/useQuery/support/useSupportStats.ts
import { useQuery } from "@tanstack/react-query";
import { InstanceAxis } from "@/helper/InstanceAxios";

// Types simplifiés pour ce dont on a besoin
type Reservation = {
  status: string;
  created_at: string;
  client_data?: {
    id: string;
    date_joined?: string;
  };
  vehicle_data?: {
    id: string;
    est_disponible?: boolean;
  };
};

type SupportTicket = {
  id: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" | string;
};

export type SupportStats = {
  ongoingReservations: number;
  newClients24h: number;
  pendingTickets: number;
  availableCars: number;
  totalCars: number;
};

export function useSupportStats() {
  return useQuery<SupportStats>({
    queryKey: ["support-stats"],
    queryFn: async () => {
      // 1. Toutes les réservations actives
      const [activeResRes, allResRes, ticketsRes] = await Promise.all([
        InstanceAxis.get<Reservation[]>("/bookings/active/reservations/"),
        InstanceAxis.get<Reservation[]>("/bookings/reservations/"),
        InstanceAxis.get<SupportTicket[]>("/support/support-tickets/"),
      ]);

      const activeReservations = activeResRes.data || [];
      const allReservations = allResRes.data || [];
      const tickets = ticketsRes.data || [];

      // 👉 1) Réservations en cours : on prend le nombre de réservations actives
      const ongoingReservations = activeReservations.length;

      // 👉 2) Nouveaux clients (24h)
      const now = new Date();
      const since = new Date(now.getTime() - 24 * 60 * 60 * 1000); // -24h
      const newClientIds = new Set<string>();

      for (const r of allReservations) {
        const client = r.client_data;
        if (!client?.id || !client.date_joined) continue;

        const joined = new Date(client.date_joined);
        if (!Number.isNaN(joined.getTime()) && joined > since) {
          newClientIds.add(client.id);
        }
      }

      const newClients24h = newClientIds.size;

      // 👉 3) Tickets en attente : status OPEN
      const pendingTickets = tickets.filter(
        (t) => t.status === "OPEN"
      ).length;

      // 👉 4) Véhicules disponibles : à partir des vehicles présents dans les réservations
      const vehicleMap = new Map<string, boolean | undefined>();

      for (const r of allReservations) {
        const v = r.vehicle_data;
        if (!v?.id) continue;
        // On enregistre est_disponible (true/false/undefined)
        vehicleMap.set(v.id, v.est_disponible);
      }

      const totalCars = vehicleMap.size;
      let availableCars = 0;
      for (const [, isAvailable] of vehicleMap.entries()) {
        if (isAvailable) {
          availableCars += 1;
        }
      }

      return {
        ongoingReservations,
        newClients24h,
        pendingTickets,
        availableCars,
        totalCars,
      };
    },
  });
}
