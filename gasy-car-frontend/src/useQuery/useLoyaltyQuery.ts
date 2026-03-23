import { loyaltyApi } from "@/Actions/loyaltyApi";
import { accessTokenKey } from "@/helper/InstanceAxios";
import type { LoyaltyDashboard } from "@/types/loyaltyType";
import { useQuery } from "@tanstack/react-query";

export const useLoyaltyQuery = () => {
  const token = localStorage.getItem(accessTokenKey);

  return useQuery<LoyaltyDashboard>({
    queryKey: ["loyalty-dashboard"],
    queryFn: loyaltyApi.getMyDashboard,
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
