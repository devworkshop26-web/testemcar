// src/components/fleet/VehiculeDetailSkeleton.tsx

import { Skeleton } from "@/components/ui/skeleton";

export default function VehiculeDetailSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <Skeleton className="h-60 w-full rounded-2xl" />

      <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-20" />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md space-y-3">
        <Skeleton className="h-5 w-1/4" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md space-y-3">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}
