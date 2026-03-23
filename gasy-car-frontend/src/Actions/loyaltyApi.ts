import { InstanceAxis } from "@/helper/InstanceAxios";
import type { LoyaltyOverview } from "@/types/loyalty";

export const loyaltyAPI = {
  getOverview: async () => {
    return await InstanceAxis.get<LoyaltyOverview>("/bookings/loyalty/overview/");
  },
};
