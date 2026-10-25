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
import { ProgressBar } from "./progress-bar";

type DownloadItemRowProps = {
  item: DownloadItem;
  compact?: boolean;
};

const statusText = (item: DownloadItem): string => {
  switch (item.status) {
    case "preparing":
      return "Preparing on the server…";

    case "downloading":
      return item.activeStream === "merge"
        ? "Merging media…"
        : item.activeStream
          ? `Downloading ${item.activeStream}…`
          : "Preparing file for transfer…";

    case "completed":
      return `${formatBytes(item.total ?? item.loaded ?? 0)} · Saved to your device`;

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

  const KindIcon = item.format.kind === "audio" ? Music2 : Video;
  const showThumbnail = Boolean(item.thumbnail) && !imageFailed;

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
            unoptimized
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

        {active ? (
          <ProgressBar item={item} />
        ) : (
          <p
            className={cn(
              "mt-1 flex items-center gap-1.5 text-xs",
              isError ? "text-red-500" : "text-muted",
            )}
          >
            {isError && (
              <CircleAlert className="size-3.5 shrink-0" aria-hidden />
            )}

            {isDone && (
              <CircleCheck
                className="size-3.5 shrink-0 text-green-500"
                aria-hidden
              />
            )}

            <span className="min-w-0 truncate">{statusText(item)}</span>
          </p>
        )}
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
