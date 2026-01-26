import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
  bg: string;
}

interface DashboardStatsProps {
  stats: StatCardProps[];
}

const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow duration-300 rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                {stat.icon}
              </div>
              <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-lg ${
                stat.trend === "up" ? "bg-green-50 text-green-700" :
                stat.trend === "down" ? "bg-red-50 text-red-700" : "bg-gray-50 text-gray-600"
              }`}>
                {stat.trend === "up" ? <ArrowUpRight className="w-3 h-3 mr-1" /> :
                  stat.trend === "down" ? <ArrowDownRight className="w-3 h-3 mr-1" /> : null}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1 font-poppins">{stat.value}</h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
