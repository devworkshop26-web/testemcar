export type ReservationStatusStat = {
  status: string;
  count: number;
  fill?: string;
};

export type MonthlyReservationStat = {
  month: string;
  total: number;
};

export type ReservationStats = {
  totalReservations: number;
  statusBreakdown: ReservationStatusStat[];
  monthlyReservations: MonthlyReservationStat[];
};

export type DailyIncomeData = {
  date: string;
  income: number;
};