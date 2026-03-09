import { InstanceAxis } from "@/helper/InstanceAxios";
import { parseMonthlyReservations, parseStatusBreakdown, toNumber } from "@/helper/reservatioUtils";
import { DailyIncomeData, ReservationStats } from "@/types/analysticType";


export const getReservationStats = async (): Promise<ReservationStats> => {
  const { data } = await InstanceAxis.get("bookings/statistics/");

  return {
    totalReservations: toNumber(data?.total_reservations ?? data?.total ?? 0),
    statusBreakdown: parseStatusBreakdown(
      data?.status_breakdown ?? data?.statuses ?? data?.status_counts ?? data?.status,
    ),
    monthlyReservations: parseMonthlyReservations(
      data?.monthly_reservations ?? data?.monthly ?? data?.reservations_per_month,
    ),
  };
};


export const getDailyIncome = async (): Promise<DailyIncomeData[]> => {
  const { data } = await InstanceAxis.get("bookings/daily-income/");

  if (!Array.isArray(data)) return [];

  return data
    .map((item) => ({
      date: typeof item?.date === "string" ? item.date : String(item?.label ?? ""),
      income: toNumber(item?.income ?? item?.total ?? item?.value ?? item?.amount),
    }))
    .filter((item) => item.date);
};