// src/useQuery/useRecentTickets.ts
import { useQuery } from "@tanstack/react-query";
import { InstanceAxis } from "@/helper/InstanceAxios";

export function useRecentTickets() {
  return useQuery({
    queryKey: ["recent-tickets"],
    queryFn: async () => {
      const res = await InstanceAxis.get("/support/support-tickets/");
      const data = res.data;

      // Cas 1 : réponse paginée (DRF par défaut)
      if (Array.isArray(data.results)) {
        return data.results.slice(0, 5);
      }

      // Cas 2 : backend renvoie une liste brute []
      if (Array.isArray(data)) {
        return data.slice(0, 5);
      }

      // Cas 3 : réponse inattendue
      return [];
    },
  });
}
