"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ChevronDown,
  Download,
  Loader2,
  Music2,
  Play,
  Video,
} from "lucide-react";
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

const INITIAL_VISIBLE = 4;

export const ResultCard = ({ video, onDownload }: ResultCardProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("video");
  const [expanded, setExpanded] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const reduceMotion = useReducedMotion();

  const transition = {
    duration: reduceMotion ? 0 : 0.3,
    ease: "easeInOut" as const,
  };

  const formats = video.formats.filter((format) => format.kind === activeTab);
  const primaryFormats = formats.slice(0, INITIAL_VISIBLE);
  const extraFormats = formats.slice(INITIAL_VISIBLE);
  const hasMore = extraFormats.length > 0;

  const handleTabChange = (tab: Tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setExpanded(false);
  };

  const renderFormat = (format: VideoFormat) => (
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
  );

  return (
    <article className="w-full overflow-hidden rounded-3xl border border-border bg-surface text-left">
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:p-6">
        <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-2xl bg-surface-muted sm:w-56">
          {video.thumbnail ? (
            <>
              {imageLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-muted">
                  <Loader2
                    className="size-6 animate-spin text-muted"
                    aria-hidden
                  />
                </div>
              )}
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                sizes="(max-width: 640px) 100vw, 224px"
                className={cn(
                  "object-cover transition-opacity duration-300",
                  imageLoading ? "opacity-0" : "opacity-100",
                )}
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
                unoptimized // external thumbnails (YouTube, TikTok, etc.)
              />
            </>
          ) : (
            <div className="flex size-full items-center justify-center text-muted">
              <Play className="size-8" aria-hidden />
            </div>
          )}

          <span className="absolute bottom-2 right-2 z-20 rounded-md bg-black/75 px-1.5 py-0.5 font-mono text-xs font-medium text-white">
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
                onClick={() => handleTabChange(value)}
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

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={transition}
            className="overflow-hidden"
          >
            <ul role="tabpanel" className="mt-4 divide-y divide-border">
              {primaryFormats.map(renderFormat)}

              <motion.div
                initial={false}
                animate={{
                  height: expanded ? "auto" : 0,
                  opacity: expanded ? 1 : 0,
                }}
                transition={transition}
                className="overflow-hidden"
              >
                {extraFormats.map(renderFormat)}
              </motion.div>
            </ul>

            {hasMore && (
              <div className="mt-3 flex justify-center">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={
                    <motion.span
                      initial={false}
                      animate={{ rotate: expanded ? 180 : 0 }}
                      transition={transition}
                      className="flex"
                    >
                      <ChevronDown className="size-4" />
                    </motion.span>
                  }
                  onClick={() => setExpanded((prev) => !prev)}
                >
                  {expanded ? "Show less" : `Show ${extraFormats.length} more`}
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </article>
  );
};
