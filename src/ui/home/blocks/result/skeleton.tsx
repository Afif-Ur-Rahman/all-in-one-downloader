import { Skeleton } from "@/components";

export const ResultSkeleton = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="w-full overflow-hidden rounded-3xl border border-border bg-surface text-left"
    >
      <span className="sr-only">Fetching video details...</span>

      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:p-6">
        <Skeleton className="aspect-video w-full shrink-0 rounded-2xl sm:w-56" />

        <div className="min-w-0 flex-1 space-y-3 self-center">
          <Skeleton className="h-5 w-11/12" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="mt-4 h-4 w-1/3" />
        </div>
      </div>

      <div className="border-t border-border p-5 sm:p-6">
        <Skeleton className="h-11 w-44 rounded-xl" />

        <div className="mt-4 divide-y divide-border">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 py-3"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-6 w-12" />
                <Skeleton className="hidden h-5 w-16 sm:block" />
              </div>
              <Skeleton className="h-9 w-28 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
