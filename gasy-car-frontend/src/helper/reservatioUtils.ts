import { MonthlyReservationStat, ReservationStatusStat } from "@/types/analysticType";


export const toNumber = (value: unknown) => {
  if (typeof value === "number") return value;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const parseStatusBreakdown = (raw: unknown): ReservationStatusStat[] => {
  if (Array.isArray(raw)) {
    return raw
      .map((item) => ({
        status: typeof item?.status === "string" ? item.status : String(item?.label ?? item?.name ?? ""),
        count: toNumber(item?.count ?? item?.value ?? item?.total),
      }))
      .filter((item) => item.status);
  }

  if (raw && typeof raw === "object") {
    return Object.entries(raw as Record<string, unknown>)
      .map(([key, value]) => ({
        status: key,
        count: toNumber(value),
      }))
      .filter((item) => item.status);
  }

  return [];
};

export const parseMonthlyReservations = (raw: unknown): MonthlyReservationStat[] => {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => ({
      month: typeof item?.month === "string" ? item.month : String(item?.label ?? item?.name ?? ""),
      total: toNumber(item?.total ?? item?.count ?? item?.value),
    }))
    .filter((item) => item.month);
};