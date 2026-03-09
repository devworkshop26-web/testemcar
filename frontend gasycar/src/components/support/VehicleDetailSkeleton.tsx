import { Skeleton } from "@/components/ui/skeleton";

export default function VehicleDetailSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-64 w-full rounded-2xl" />

      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-1/4" />

      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-5 bg-white rounded-2xl shadow space-y-3">
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}
