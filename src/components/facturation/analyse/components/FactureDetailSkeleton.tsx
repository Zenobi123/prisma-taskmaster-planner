
import { Skeleton } from "@/components/ui/skeleton";

export const FactureDetailSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-3/4" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
      <Skeleton className="h-48 w-full" />
    </div>
  );
};
