import { MonthlyReservationStat } from "@/useQuery/useAdminAnalyticsQuery";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const formatMonth = (month: string) => {
  const date = new Date(month);
  if (Number.isNaN(date.getTime())) return month;
  return date.toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
};

type MonthlyReservationsChartProps = {
  data: MonthlyReservationStat[];
};

export function MonthlyReservationsChart({ data }: MonthlyReservationsChartProps) {
  const chartData = data?.length
    ? data.map((item) => ({ ...item, label: formatMonth(item.month) }))
    : [];

  return (
    <div className="h-[320px] w-full">
      {chartData.length ? (
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ left: 8, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} className="text-xs" />
            <YAxis tickLine={false} axisLine={false} className="text-xs" allowDecimals={false} />
            <Tooltip
              formatter={(value: number) => `${value.toLocaleString()} réservation${value > 1 ? "s" : ""}`}
              labelClassName="text-sm font-medium"
            />
            <Bar dataKey="total" radius={[6, 6, 0, 0]} fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          Aucune réservation enregistrée sur les derniers mois.
        </div>
      )}
    </div>
  );
}
