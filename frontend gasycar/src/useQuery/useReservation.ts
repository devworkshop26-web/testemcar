import { useCallback, useMemo, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import type { DateRange } from "react-day-picker";

export const useReservation = (dailyRate: number) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const normalizeRange = useCallback((range: DateRange | undefined) => {
    if (range?.from && range?.to && range.to < range.from) {
      return { from: range.to, to: range.from };
    }
    return range;
  }, []);

  const handleDateChange = useCallback((range: DateRange | undefined) => {
    setDateRange(normalizeRange(range));
  }, [normalizeRange]);

  const duration = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return 0;
    return Math.max(1, differenceInCalendarDays(dateRange.to, dateRange.from) + 1);
  }, [dateRange]);

  const totalPrice = useMemo(() => {
    if (!dailyRate || !duration) return 0;
    return dailyRate * duration;
  }, [dailyRate, duration]);

  const reset = useCallback(() => setDateRange(undefined), []);

  return {
    dateRange,
    setDateRange: handleDateChange,
    duration,
    totalPrice,
    reset,
  } as const;
};
