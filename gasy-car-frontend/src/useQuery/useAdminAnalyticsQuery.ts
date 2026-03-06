import { getDailyIncome, getReservationStats } from "@/Actions/analyticsApi";
import { DailyIncomeData, ReservationStats } from "@/types/analysticType";
import { useQuery } from "@tanstack/react-query";






export const useAdminAnalyticsQuery = () => {
  const reservationStatsQuery = useQuery<ReservationStats>({
    queryKey: ["admin", "reservations", "statistics"],
    queryFn: getReservationStats,
    staleTime: 1000 * 60 * 5,
  });

  const dailyIncomeQuery = useQuery<DailyIncomeData[]>({
    queryKey: ["admin", "reservations", "daily-income"],
    queryFn: getDailyIncome,
    staleTime: 1000 * 60 * 5,
  });

  return { reservationStatsQuery, dailyIncomeQuery };
};
export type { DailyIncomeData };

