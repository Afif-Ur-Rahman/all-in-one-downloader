"use client";

import Link from "next/link";
import { Download, FolderOpen, Trash2 } from "lucide-react";
import { Button, Skeleton } from "@/components";
import { useDownloadFolder } from "@/hooks";
import { cn } from "@/lib";
import { useDownloadStore } from "@/store/download-store";
import { DownloadItemRow } from "./blocks";

export const Downloads = () => {
  const items = useDownloadStore((state) => state.items);
  const hydrated = useDownloadStore((state) => state.hydrated);
  const clearFinished = useDownloadStore((state) => state.clearFinished);
  const { supported, folderName, choose } = useDownloadFolder();

  const hasFinished = items.some(
    (item) => item.status !== "preparing" && item.status !== "downloading",
  );

  const locationText = !supported
    ? 'Your browser decides where files are saved. To skip the save dialog, turn off "Ask where to save each file before downloading" in its download settings.'
    : folderName
      ? `New downloads are saved straight into your "${folderName}" folder, with no save dialog.`
      : "Pick a folder once and every download is saved there without asking. We'll create an aio-downloads folder inside it.";

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16 md:py-24">
      <header className="flex flex-col gap-6 border-b border-border pb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-balance md:text-5xl">
            Downloads
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Your recent downloads in this browser. The files themselves are on
            your device.
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

      <section className="mt-8 flex flex-col gap-4 rounded-3xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-muted">
            <FolderOpen className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold">Save location</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              {locationText}
            </p>
          </div>
        </div>

        {supported && (
          <Button variant="secondary" icon={<FolderOpen />} onClick={choose}>
            {folderName ? "Change folder" : "Choose folder"}
          </Button>
        )}
      </section>

      <div className="mt-8">
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
