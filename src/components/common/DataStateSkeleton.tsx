import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonVariant = "cards" | "list" | "table";

interface DataStateSkeletonProps {
  variant?: SkeletonVariant;
  count?: number;
  className?: string;
  itemClassName?: string;
}

export function DataStateSkeleton({
  variant = "cards",
  count = 4,
  className,
  itemClassName,
}: DataStateSkeletonProps) {
  const items = Array.from({ length: count }, (_, index) => index);

  if (variant === "list") {
    return (
      <div className={cn("space-y-3", className)} aria-hidden="true">
        {items.map((item) => (
          <div
            key={item}
            className={cn(
              "flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center",
              itemClassName,
            )}
          >
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className={cn("space-y-3", className)} aria-hidden="true">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="ml-auto h-4 w-16" />
        </div>
        {items.map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"
          >
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="ml-auto h-8 w-20 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
      aria-hidden="true"
    >
      {items.map((item) => (
        <div
          key={item}
          className={cn(
            "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm",
            itemClassName,
          )}
        >
          <Skeleton className="h-40 w-full rounded-xl" />
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
