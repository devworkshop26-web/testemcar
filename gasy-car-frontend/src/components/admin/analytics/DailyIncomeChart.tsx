import { DailyIncomeData } from "@/useQuery/useAdminAnalyticsQuery";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type DailyIncomeChartProps = {
  data: DailyIncomeData[];
};

const formatDate = (date: string) => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
};

export function DailyIncomeChart({ data }: DailyIncomeChartProps) {
  const chartData = data?.length
    ? data.map((item) => ({ ...item, label: formatDate(item.date) }))
    : [];

  return (
    <div className="h-[360px] w-full">
      {chartData.length ? (
        <ResponsiveContainer>
          <AreaChart data={chartData} margin={{ left: 16, right: 16, top: 8 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} className="text-xs" />
            <YAxis tickLine={false} axisLine={false} className="text-xs" tickFormatter={(value) => `${value} Ar`} />
            <Tooltip
              formatter={(value: number) => `${value.toLocaleString()} Ar`}
              labelClassName="text-sm font-medium"
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#0ea5e9"
              fill="url(#incomeGradient)"
              strokeWidth={2}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          Aucun revenu journalier à afficher pour l'instant.
        </div>
      )}
    </div>
  );
}
