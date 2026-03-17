type ReservationStatusStat = {
  status: string;
  count: number;
  fill?: string;
};
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const STATUS_COLORS = ["#10b981", "#6366f1", "#f59e0b", "#ef4444", "#0ea5e9", "#8b5cf6"];

type ReservationStatusChartProps = {
  data: ReservationStatusStat[];
};

export function ReservationStatusChart({ data }: ReservationStatusChartProps) {
  const chartData = data?.length ? data : [];

  return (
    <div className="h-[320px] w-full">
      {chartData.length ? (
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={50}
              paddingAngle={4}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={entry.status}
                  fill={entry.fill || STATUS_COLORS[index % STATUS_COLORS.length]}
                  strokeWidth={1.5}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [value.toLocaleString(), name]}
              cursor={{ fill: "rgba(0,0,0,0.04)" }}
            />
            <Legend layout="horizontal" align="center" verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          Aucune donnée de statut pour le moment.
        </div>
      )}
    </div>
  );
}
