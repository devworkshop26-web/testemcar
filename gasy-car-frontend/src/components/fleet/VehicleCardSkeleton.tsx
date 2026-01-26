// src/components/fleet/VehicleCardSkeleton.tsx

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function VehicleCardSkeleton() {
  return (
    <Card className="border-none shadow-md rounded-2xl overflow-hidden">
      {/* Image */}
      <div className="relative h-40 bg-gray-200">
        <Skeleton className="w-full h-full rounded-none" />
      </div>

      <CardContent className="p-5 space-y-4">
        <Skeleton className="h-5 w-2/3" /> {/* Titre */}
        <Skeleton className="h-4 w-1/3" /> {/* Plaque */}

        {/* Bouton */}
        <Skeleton className="h-10 w-full rounded-xl" />
      </CardContent>
    </Card>
  );
}
