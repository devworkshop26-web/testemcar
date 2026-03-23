import { loyaltyAPI } from "@/Actions/loyaltyApi";
import { useQuery } from "@tanstack/react-query";

export const useLoyaltySummary = () => {
  return useQuery({
    queryKey: ["loyalty", "summary"],
    queryFn: loyaltyAPI.getSummary,
  });
};

export const useLoyaltyHistory = () => {
  return useQuery({
    queryKey: ["loyalty", "history"],
    queryFn: loyaltyAPI.getHistory,
  });
};

export const useLoyaltyTiers = () => {
  return useQuery({
    queryKey: ["loyalty", "tiers"],
    queryFn: loyaltyAPI.getTiers,
  });
};
