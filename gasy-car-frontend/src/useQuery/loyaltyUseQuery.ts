import { loyaltyAPI } from "@/Actions/loyaltyApi";
import type { LoyaltyOverview } from "@/types/loyalty";
import { useQuery } from "@tanstack/react-query";

export const useLoyaltyOverviewQuery = () => {
  return useQuery<LoyaltyOverview>({
    queryKey: ["loyalty-overview"],
    queryFn: async () => {
      const { data } = await loyaltyAPI.getOverview();
      return data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });
};
