// src/useQuery/support/useClients.ts
import { useQuery } from "@tanstack/react-query";
import { InstanceAxis } from "@/helper/InstanceAxios";

export function useClients() {
  return useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const res = await InstanceAxis.get("/users/users-all/");

      // Cas 1 : DRF renvoie { results: [...] }
      if (res.data?.results) return res.data.results;

      // Cas 2 : DRF renvoie directement []
      if (Array.isArray(res.data)) return res.data;

      // Cas 3 : réponse inconnue
      return [];
    },
  });
}
