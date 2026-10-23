"use client";

import { useState } from "react";
import { Download, Music2, Play, Video } from "lucide-react";
import { cn } from "@/lib";
import type { VideoFormat, VideoInfo } from "@/types/video";
import { Button } from "@/components";

type ResultCardProps = {
  video: VideoInfo;
  onDownload?: (format: VideoFormat) => void;
};

type Tab = VideoFormat["kind"];

const tabs: { value: Tab; label: string; icon: typeof Video }[] = [
  { value: "video", label: "Video", icon: Video },
  { value: "audio", label: "Audio", icon: Music2 },
];

export const ResultCard = ({ video, onDownload }: ResultCardProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("video");
  const formats = video.formats.filter((format) => format.kind === activeTab);

  return (
    <article className="w-full overflow-hidden rounded-3xl border border-border bg-surface text-left">
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:p-6">
        <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-2xl bg-surface-muted sm:w-56">
          {video.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={video.thumbnail}
              alt={video.title}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-muted">
              <Play className="size-8" aria-hidden />
            </div>
          )}
          <span className="absolute bottom-2 right-2 rounded-md bg-black/75 px-1.5 py-0.5 font-mono text-xs font-medium text-white">
            {video.duration}
          </span>
        </div>

        <div className="min-w-0 self-center">
          <h2 className="line-clamp-2 font-display text-lg font-bold leading-snug tracking-tight sm:text-xl">
            {video.title}
          </h2>
          <p className="mt-2 text-sm text-muted">
            {video.author} <span aria-hidden>·</span> {video.platform}
          </p>
        </div>
      </div>

      <div className="border-t border-border p-5 sm:p-6">
        <div
          role="tablist"
          aria-label="Download type"
          className="inline-flex rounded-xl bg-surface-muted p-1"
        >
          {tabs.map(({ value, label, icon: Icon }) => {
            const isActive = activeTab === value;

            return (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(value)}
                className={cn(
                  "flex h-9 cursor-pointer items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-surface text-foreground shadow-sm"
                    : "text-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </button>
            );
          })}
        </div>

        <ul role="tabpanel" className="mt-4 divide-y divide-border">
          {formats.map((format) => (
            <li
              key={format.id}
              className="flex items-center justify-between gap-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="w-20 font-display text-base font-bold tracking-tight">
                  {format.quality}
                </span>
                <span className="rounded-md border border-border px-2 py-0.5 font-mono text-xs text-muted">
                  {format.extension}
                </span>
                <span className="hidden font-mono text-sm text-muted sm:inline">
                  {format.size}
                </span>
              </div>

              <Button
                size="sm"
                icon={<Download />}
                onClick={() => onDownload?.(format)}
                aria-label={`Download ${format.quality} ${format.extension}`}
              >
                Download
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
};
