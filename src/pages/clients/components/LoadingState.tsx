
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {
  isMobile?: boolean;
}

export function LoadingState({ isMobile }: LoadingStateProps) {
  return (
    <div className={isMobile ? "p-3 sm:p-4" : "p-8"}>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-7 w-48 mb-1" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="border p-4 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
