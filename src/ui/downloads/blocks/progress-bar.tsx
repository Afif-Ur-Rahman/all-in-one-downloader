"use client";

import type { DownloadItem } from "@/types/download";
import { cn, formatBytes, formatEta, formatSpeed } from "@/lib";

type Props = {
  item: DownloadItem;
};

export const ProgressBar = ({ item }: Props) => {
  const progress = Math.min(100, Math.max(0, item.progress ?? 0));
  const isCompleted = item.status === "completed";
  const isPreparing = item.status === "preparing";
  const isPaused = item.status === "paused";

  const sizeText =
    item.total != null && item.total > 0
      ? `${formatBytes(item.loaded ?? 0)} of ${formatBytes(item.total)}`
      : item.loaded != null && item.loaded > 0
        ? `${formatBytes(item.loaded)} downloaded`
        : null;

  return (
    <div className="mt-2 w-full min-w-0">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="min-w-0 truncate text-muted">
          {sizeText ?? (isPreparing ? "Preparing download…" : "Starting…")}
        </span>

        <span
          className={cn(
            "shrink-0 font-medium tabular-nums",
            isPaused ? "text-amber-500" : "text-accent",
          )}
        >
          {Math.round(progress)}%
        </span>
      </div>

      <div
        role="progressbar"
        aria-label="Download progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-muted"
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width,background-color] duration-300 ease-out",
            isPaused ? "bg-amber-500" : "bg-accent",
            isPreparing && progress === 0 && "w-1/3 progress-indeterminate",
          )}
          style={
            isPreparing && progress === 0
              ? undefined
              : { width: `${progress}%` }
          }
        />
      </div>

      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs tabular-nums text-muted">
        {item.speed != null && item.speed > 0 && (
          <span>{formatSpeed(item.speed)}</span>
        )}

        {item.eta != null && item.eta > 0 && !isCompleted && (
          <span>{formatEta(item.eta)} remaining</span>
        )}

        {isCompleted && <span>Completed</span>}
      </div>
    </div>
  );
};
