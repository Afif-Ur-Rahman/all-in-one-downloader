"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CircleAlert,
  CircleCheck,
  Music2,
  RotateCcw,
  Trash2,
  Video,
  X,
} from "lucide-react";
import { useDownloads } from "@/hooks";
import { cn, formatBytes, timeAgo } from "@/lib";
import { useDownloadStore } from "@/store/download-store";
import type { DownloadItem } from "@/types/download";
import { Button } from "@/components";

type DownloadItemRowProps = {
  item: DownloadItem;
  compact?: boolean;
};

const statusText = (item: DownloadItem): string => {
  switch (item.status) {
    case "preparing":
      return "Preparing on the server...";
    case "downloading":
      return item.total
        ? `${formatBytes(item.loaded)} of ${formatBytes(item.total)} · ${item.progress}%`
        : `${formatBytes(item.loaded)} downloaded`;
    case "completed":
      return `${formatBytes(item.total ?? item.loaded)} · Saved to your device`;
    case "cancelled":
      return "Cancelled";
    case "error":
      return item.error ?? "Download failed";
  }
};

export const DownloadItemRow = ({
  item,
  compact = false,
}: DownloadItemRowProps) => {
  const { cancel, retry } = useDownloads();
  const remove = useDownloadStore((state) => state.remove);
  const [imageFailed, setImageFailed] = useState(false);

  const active = item.status === "preparing" || item.status === "downloading";
  const isError = item.status === "error";
  const isDone = item.status === "completed";
  const indeterminate =
    item.status === "preparing" ||
    (item.status === "downloading" && !item.total);

  const KindIcon = item.format.kind === "audio" ? Music2 : Video;
  const showThumbnail = item.thumbnail && !imageFailed;

  return (
    <li
      className={cn("flex items-center gap-3", compact ? "py-3" : "gap-4 py-4")}
    >
      <div
        className={cn(
          "relative aspect-video shrink-0 overflow-hidden rounded-lg bg-surface-muted",
          compact ? "w-16" : "w-24",
        )}
      >
        {showThumbnail ? (
          <Image
            src={item.thumbnail as string}
            alt=""
            fill
            sizes="96px"
            className="object-cover"
            onError={() => setImageFailed(true)}
            unoptimized // external thumbnails (YouTube, TikTok, etc.)
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted">
            <KindIcon className="size-5" aria-hidden />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold" title={item.title}>
          {item.title}
        </p>
        <p className="mt-0.5 truncate text-xs text-muted">
          {item.format.quality} · {item.format.extension} · {item.platform} ·{" "}
          {timeAgo(item.createdAt)}
        </p>

        {active && (
          <div
            role="progressbar"
            aria-label={`Downloading ${item.title}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={indeterminate ? undefined : item.progress}
            className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-muted"
          >
            <div
              className={cn(
                "h-full rounded-full bg-accent transition-[width] duration-300",
                indeterminate &&
                  "w-1/3 animate-pulse motion-reduce:animate-none",
              )}
              style={indeterminate ? undefined : { width: `${item.progress}%` }}
            />
          </div>
        )}

        <p
          className={cn(
            "mt-1 flex items-center gap-1.5 text-xs",
            isError ? "text-red-500" : "text-muted",
          )}
        >
          {isError && <CircleAlert className="size-3.5 shrink-0" aria-hidden />}
          {isDone && (
            <CircleCheck
              className="size-3.5 shrink-0 text-green-500"
              aria-hidden
            />
          )}
          <span className="min-w-0 truncate">{statusText(item)}</span>
        </p>
      </div>

      <div className="flex shrink-0 items-center">
        {active && (
          <Button
            variant="ghost"
            size="sm"
            className="size-9 px-0"
            aria-label="Cancel download"
            icon={<X />}
            onClick={() => cancel(item.id)}
          />
        )}

        {!active && (
          <Button
            variant="ghost"
            size="sm"
            className="size-9 px-0"
            aria-label={isDone ? "Download again" : "Retry download"}
            icon={<RotateCcw />}
            onClick={() => retry(item.id)}
          />
        )}

        {!active && (
          <Button
            variant="ghost"
            size="sm"
            className="size-9 px-0"
            aria-label="Remove from list"
            icon={<Trash2 />}
            onClick={() => remove(item.id)}
          />
        )}
      </div>
    </li>
  );
};
