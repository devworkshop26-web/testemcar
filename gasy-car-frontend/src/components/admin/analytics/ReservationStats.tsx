import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useReservationStatsQuery } from "@/useQuery/reservationsUseQuery";

type ReservationChartProps = {
  type: "day" | "week" | "month";
  title?: string;
};

export default function ReservationChart({ type, title }: ReservationChartProps) {
  const { day, week, month } = useReservationStatsQuery();

  // -------------------------------
  // 1) Choose correct query by type
  // -------------------------------
  const queryMap: Record<string, any> = {
    day,
    week,
    month,
  };

  const { data, isLoading, error } = queryMap[type] ?? {};

  // -------------------------------
  // 2) Data key (X-axis key)
  // -------------------------------
  const xKey =
    type === "day"
      ? "hour"
      : type === "week"
      ? "day"
      : "monthName"; // customize if needed

  // -------------------------------
  // 3) Loading UI
  // -------------------------------
  if (isLoading) {
    return (
      <Card className="p-4 w-full h-80 flex flex-col gap-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-full w-full rounded" />
      </Card>
    );
  }

  // -------------------------------
  // 4) Error UI
  // -------------------------------
  if (error) {
    return (
      <Card className="p-4 w-full h-80 flex items-center justify-center text-red-500">
        <p>Erreur lors du chargement des statistiques.</p>
      </Card>
    );
  }

  // -------------------------------
  // 5) No Data
  // -------------------------------
  if (!data || data.length === 0) {
    return (
      <Card className="p-4 w-full h-80 flex items-center justify-center text-muted-foreground">
        <p>Aucune donnée disponible.</p>
      </Card>
    );
  }

  // -------------------------------
  // 6) Render chart
  // -------------------------------
  return (
    <Card className="w-full h-80 shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="capitalize">
          {title ?? `Statistiques des réservations (${type})`}
        </CardTitle>
      </CardHeader>

      <CardContent className="h-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted-foreground/20" />
            <XAxis dataKey={xKey} className="text-xs" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#0EA5E9" // sky-500
              fill="#0EA5E988"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
