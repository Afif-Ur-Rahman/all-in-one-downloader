"use client";

import { useEffect } from "react";
import Link from "next/link";
import * as Popover from "@radix-ui/react-popover";
import { Download } from "lucide-react";
import { cn } from "@/lib";
import { useDownloadStore } from "@/store/download-store";
import { Button } from "@/components";
import { DownloadItemRow } from "./download-item";

const MENU_LIMIT = 5;

export const DownloadsMenu = () => {
  const items = useDownloadStore((state) => state.items);

  const recent = items.slice(0, MENU_LIMIT);
  const activeCount = items.filter(
    (item) => item.status === "preparing" || item.status === "downloading",
  ).length;

  // Load the saved history once, after mount, so SSR and the first client render match.
  useEffect(() => {
    void useDownloadStore.persist.rehydrate();
  }, []);

  return (
    <Popover.Root>
      <div className="relative">
        <Popover.Trigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Downloads${activeCount ? `, ${activeCount} active` : ""}`}
            icon={<Download />}
          />
        </Popover.Trigger>

        {activeCount > 0 && (
          <span
            aria-hidden
            className="pointer-events-none absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground"
          >
            {activeCount}
          </span>
        )}
      </div>

      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          collisionPadding={16}
          aria-label="Recent downloads"
          className={cn(
            "z-50 w-[min(26rem,calc(100vw-2rem))] origin-(--radix-popover-content-transform-origin) overflow-hidden rounded-2xl border border-border bg-surface text-foreground shadow-xl outline-none",
            "data-[state=open]:animate-popover-in data-[state=closed]:animate-popover-out motion-reduce:animate-none",
          )}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-semibold">Downloads</p>
            {activeCount > 0 && (
              <p className="text-xs text-muted">{activeCount} in progress</p>
            )}
          </div>

          {recent.length > 0 ? (
            <ul className="max-h-[60vh] divide-y divide-border overflow-y-auto px-4">
              {recent.map((item) => (
                <DownloadItemRow key={item.id} item={item} compact />
              ))}
            </ul>
          ) : (
            <p className="px-4 py-8 text-center text-sm leading-relaxed text-muted">
              No downloads yet. Paste a link and your downloads will show up
              here.
            </p>
          )}

          <div className="border-t border-border p-3">
            <Popover.Close asChild>
              <Link
                href="/downloads"
                className={cn(
                  "inline-flex h-10 w-full items-center justify-center rounded-xl border px-5 text-sm font-semibold transition-colors",
                  "border-border bg-surface-muted hover:bg-border",
                )}
              >
                Show all
              </Link>
            </Popover.Close>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
