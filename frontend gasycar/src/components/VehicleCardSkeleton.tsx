import { Skeleton } from "@/components/ui/skeleton";

export const VehicleCardSkeleton = () => {
  return (
    <div className="w-full max-w-sm bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 flex flex-col animate-in fade-in duration-500">
      
      {/* Image skeleton */}
      <div className="relative aspect-video overflow-hidden flex-shrink-0">
        <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
      </div>

      {/* Content skeleton */}
      <div className="p-3 sm:p-4 flex flex-col gap-3">
        
        {/* Title + rating */}
        <div className="flex items-start justify-between">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-4 w-12 rounded" />
        </div>

        {/* Distance */}
        <Skeleton className="h-3 w-24 rounded" />

        {/* Specs grid */}
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
          <Skeleton className="h-6 w-20 rounded" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>

      </div>
    </div>
  );
};

export default VehicleCardSkeleton;
