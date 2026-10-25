"use client";

import Link from "next/link";
import { Download, Trash2 } from "lucide-react";
import { Button, Skeleton } from "@/components";
import { cn } from "@/lib";
import { useDownloadStore } from "@/store";
import { DownloadItemRow } from "./blocks";

export const Downloads = () => {
  const { items, hydrated, clearFinished } = useDownloadStore();

  const hasFinished = items.some(
    (item) => item.status !== "preparing" && item.status !== "downloading",
  );

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      <header className="flex flex-col gap-6 border-b border-border pb-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-balance">
            Downloads
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Your recent downloads in this browser. The files themselves are in
            your device&apos;s downloads folder.
          </p>
        </div>

        <Button
          variant="secondary"
          icon={<Trash2 />}
          onClick={clearFinished}
          disabled={!hasFinished}
        >
          Clear finished
        </Button>
      </header>

      <div className="mt-5">
        {!hydrated ? (
          <div className="space-y-4" aria-hidden>
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-5 rounded-3xl border border-border bg-surface p-10 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-surface-muted text-muted">
              <Download className="size-6" aria-hidden />
            </span>
            <div className="max-w-md">
              <h2 className="font-display text-xl font-bold tracking-tight">
                No downloads yet
              </h2>
              <p className="mt-2 leading-relaxed text-muted">
                Paste a video link on the home page and your downloads will be
                listed here.
              </p>
            </div>
            <Link
              href="/"
              className={cn(
                "inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold transition-colors",
                "bg-accent text-accent-foreground hover:bg-accent-hover",
              )}
            >
              Paste a link
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-border rounded-3xl border border-border bg-surface px-5">
            {items.map((item) => (
              <DownloadItemRow key={item.id} item={item} />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};
