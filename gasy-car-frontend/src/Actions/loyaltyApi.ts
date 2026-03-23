import { InstanceAxis } from "@/helper/InstanceAxios";
import type { LoyaltyHistoryItem, LoyaltySummaryResponse, LoyaltyTier } from "@/types/loyaltyType";

export const loyaltyAPI = {
  getSummary: async (): Promise<LoyaltySummaryResponse> => {
    const response = await InstanceAxis.get<LoyaltySummaryResponse>("/loyalty/me/summary/");
    return response.data;
  },

  getHistory: async (): Promise<LoyaltyHistoryItem[]> => {
    const response = await InstanceAxis.get<LoyaltyHistoryItem[]>("/loyalty/me/history/");
    return response.data;
  },

  getTiers: async (): Promise<LoyaltyTier[]> => {
    const response = await InstanceAxis.get<LoyaltyTier[]>("/loyalty/tiers/");
    return response.data;
  },
};
