// src/useQuery/useCriticalReservation.ts
import { useQuery } from "@tanstack/react-query";
import { InstanceAxis } from "@/helper/InstanceAxios";

export function useCriticalReservation() {
  return useQuery({
    queryKey: ["critical-reservation"],
    queryFn: async () => {
      const res = await InstanceAxis.get("/reservation/reservations/");
      const list = res.data.results ?? [];

      // Exemple : réserver ce qui est en attente de paiement
      return list.find((item) => item.status === "PENDING_PAYMENT") || null;
    },
  });
}
