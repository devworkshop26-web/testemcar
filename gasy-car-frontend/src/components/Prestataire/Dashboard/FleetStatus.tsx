import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FleetStatusProps {
  availableCount: number;
  inUseCount: number;
  totalCount: number;
}

const FleetStatus = ({ availableCount, inUseCount, totalCount }: FleetStatusProps) => {
  const items = [
    { 
      label: "Disponible", 
      count: availableCount, 
      color: "bg-emerald-500", 
      percentage: totalCount > 0 
        ? Math.round((availableCount / totalCount) * 100) 
        : 0 
    },
    { 
      label: "En location", 
      count: inUseCount, 
      color: "bg-blue-500", 
      percentage: totalCount > 0 
        ? Math.round((inUseCount / totalCount) * 100) 
        : 0 
    },
    { 
      label: "Total véhicules", 
      count: totalCount, 
      color: "bg-gray-500", 
      percentage: 100 
    },
  ];

  return (
    <Card className="border-none shadow-md rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-900 font-poppins">État du Parc</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {items.map((item, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-gray-600 font-medium">{item.label}</span>
              <span className="text-gray-900 font-bold">{item.count}</span>
            </div>
            <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${item.color} transition-all duration-500`}
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default FleetStatus;
