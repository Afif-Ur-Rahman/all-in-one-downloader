"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Download } from "lucide-react";
import { cn } from "@/lib";
import { useDownloadStore } from "@/store/download-store";
import { Button } from "@/components";
import { DownloadItemRow } from "./download-item";

const MENU_LIMIT = 5;

export const DownloadsMenu = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const items = useDownloadStore((state) => state.items);

  const recent = items.slice(0, MENU_LIMIT);
  const activeCount = items.filter(
    (item) => item.status === "preparing" || item.status === "downloading",
  ).length;

  // Load the saved history once, after mount, so SSR and the first client render match.
  useEffect(() => {
    void useDownloadStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Downloads${activeCount ? `, ${activeCount} active` : ""}`}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((current) => !current)}
        icon={<Download />}
      />

      {activeCount > 0 && (
        <span
          aria-hidden
          className="pointer-events-none absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground"
        >
          {activeCount}
        </span>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Recent downloads"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full z-50 mt-2 w-[min(26rem,calc(100vw-2rem))] origin-top-right overflow-hidden rounded-2xl border border-border bg-surface shadow-xl"
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
              <Link
                href="/downloads"
                onClick={() => setOpen(false)}
                className={cn(
                  "inline-flex h-10 w-full items-center justify-center rounded-xl border px-5 text-sm font-semibold transition-colors",
                  "border-border bg-surface-muted hover:bg-border",
                )}
              >
                Show all
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
