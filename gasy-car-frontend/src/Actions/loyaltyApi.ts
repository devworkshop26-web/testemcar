import { InstanceAxis } from "@/helper/InstanceAxios";
import type { LoyaltyDashboard } from "@/types/loyaltyType";

export const loyaltyApi = {
  getMyDashboard: async () => {
    const response = await InstanceAxis.get<LoyaltyDashboard>("/loyalty/me/");
    return response.data;
  },
};
