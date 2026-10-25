"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { downloadFile, saveBlob } from "@/api";
import { useDownloadStore } from "@/store/download-store";
import type { DownloadItem } from "@/types/download";
import type { VideoFormat, VideoInfo } from "@/types/video";

const PROGRESS_INTERVAL_MS = 200;

// Controllers live outside the store because they can't be serialized.
const controllers = new Map<string, AbortController>();

const fallbackFileName = (item: DownloadItem) => {
  const base =
    item.title
      .replace(/[\\/:*?"<>|]+/g, "")
      .trim()
      .slice(0, 80) || "video";
  return `${base}.${item.format.extension.toLowerCase()}`;
};

const toMessage = (error: unknown) => {
  if (error instanceof TypeError) {
    return "Couldn't reach the server. Check your connection and try again.";
  }
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
};

const run = async (id: string) => {
  const { items, update } = useDownloadStore.getState();
  const item = items.find((entry) => entry.id === id);
  if (!item) return;

  const controller = new AbortController();
  controllers.set(id, controller);

  update(id, {
    status: "preparing",
    progress: 0,
    loaded: 0,
    total: null,
    error: null,
  });

  let lastTick = 0;

  try {
    const { blob, fileName } = await downloadFile(
      item.sourceUrl,
      item.format.id,
      item.format.kind,
      {
        signal: controller.signal,
        onStart: ({ total }) => update(id, { status: "downloading", total }),
        onProgress: ({ loaded, total }) => {
          const now = Date.now();
          if (now - lastTick < PROGRESS_INTERVAL_MS) return;
          lastTick = now;

          update(id, {
            loaded,
            progress: total
              ? Math.min(99, Math.round((loaded / total) * 100))
              : 0,
          });
        },
      },
    );

    const name = fileName ?? fallbackFileName(item);

    saveBlob(blob, name);
    update(id, {
      status: "completed",
      progress: 100,
      loaded: blob.size,
      total: blob.size,
      fileName: name,
    });
    toast.success("Download complete");
  } catch (error) {
    if (controller.signal.aborted) {
      update(id, { status: "cancelled", error: null });
    } else {
      update(id, { status: "error", error: toMessage(error) });
    }
  } finally {
    controllers.delete(id);
  }
};

export const useDownloads = () => {
  const start = useCallback(
    (video: VideoInfo, sourceUrl: string, format: VideoFormat) => {
      const { items, add } = useDownloadStore.getState();

      const alreadyRunning = items.some(
        (item) =>
          item.sourceUrl === sourceUrl &&
          item.format.id === format.id &&
          (item.status === "preparing" || item.status === "downloading"),
      );

      if (alreadyRunning) {
        toast.info("This download is already in progress.");
        return;
      }

      const id = crypto.randomUUID();

      add({
        id,
        sourceUrl,
        title: video.title,
        thumbnail: video.thumbnail,
        platform: video.platform,
        format: {
          id: format.id,
          kind: format.kind,
          quality: format.quality,
          extension: format.extension,
        },
        status: "preparing",
        progress: 0,
        loaded: 0,
        total: null,
        fileName: null,
        error: null,
        createdAt: Date.now(),
      });

      toast.info("Added to your downloads.");
      void run(id);
    },
    [],
  );

  const cancel = useCallback((id: string) => {
    controllers.get(id)?.abort();
  }, []);

  const retry = useCallback((id: string) => {
    void run(id);
  }, []);

  return { start, cancel, retry };
};
