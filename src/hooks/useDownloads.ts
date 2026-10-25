"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { downloadFile, saveBlob } from "@/api";
import { resolveDownloadFolder, uniqueFileName } from "@/lib";
import { useDownloadStore } from "@/store/download-store";
import type { DownloadItem } from "@/types/download";
import type { VideoFormat, VideoInfo } from "@/types/video";

const PROGRESS_INTERVAL_MS = 200;
// Weight given to the newest speed sample. Lower is smoother, higher is more responsive.
const SPEED_SMOOTHING = 0.3;

const FIRST_PICK_HINT =
  "Choose your Downloads folder. We'll create an aio-downloads folder inside it.";

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
  if (error instanceof DOMException && error.name === "NotFoundError") {
    return "Your download folder no longer exists. Choose a folder again on the Downloads page.";
  }
  if (error instanceof TypeError) {
    return "Couldn't reach the server. Check your connection and try again.";
  }
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
};

const findFolder = () =>
  resolveDownloadFolder(() => toast.info(FIRST_PICK_HINT));

const run = async (id: string, folder: FileSystemDirectoryHandle | null) => {
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
    speed: null,
    eta: null,
    error: null,
  });

  let lastTick = 0;
  let lastLoaded = 0;
  let smoothedSpeed = 0;

  const chunks: BlobPart[] = [];
  const state = {
    writable: null as FileSystemWritableFileStream | null,
    name: "",
    type: "application/octet-stream",
    received: 0,
    entryCreated: false,
  };

  try {
    await downloadFile(item.sourceUrl, item.format.id, item.format.kind, {
      signal: controller.signal,
      onStart: async ({ total, fileName, type }) => {
        state.type = type;
        state.name = fileName ?? fallbackFileName(item);

        if (folder) {
          state.name = await uniqueFileName(folder, state.name);
          const handle = await folder.getFileHandle(state.name, {
            create: true,
          });
          state.entryCreated = true;
          state.writable = await handle.createWritable();
        }

        // Speed is measured from the moment bytes start arriving, not from the click.
        lastTick = Date.now();
        update(id, { status: "downloading", total });
      },
      onChunk: async (chunk) => {
        state.received += chunk.length;

        if (state.writable) {
          await state.writable.write(chunk);
        } else {
          chunks.push(chunk);
        }
      },
      onProgress: ({ loaded, total }) => {
        const now = Date.now();
        const elapsed = now - lastTick;
        if (elapsed < PROGRESS_INTERVAL_MS) return;

        const instantSpeed = ((loaded - lastLoaded) / elapsed) * 1000;
        smoothedSpeed =
          smoothedSpeed === 0
            ? instantSpeed
            : SPEED_SMOOTHING * instantSpeed +
              (1 - SPEED_SMOOTHING) * smoothedSpeed;

        lastTick = now;
        lastLoaded = loaded;

        update(id, {
          loaded,
          progress: total
            ? Math.min(99, Math.round((loaded / total) * 100))
            : 0,
          speed: smoothedSpeed,
          eta:
            total && smoothedSpeed > 0
              ? (total - loaded) / smoothedSpeed
              : null,
        });
      },
    });

    if (state.writable) {
      await state.writable.close();
      state.writable = null;
    } else {
      saveBlob(new Blob(chunks, { type: state.type }), state.name);
    }

    update(id, {
      status: "completed",
      progress: 100,
      loaded: state.received,
      total: state.received,
      speed: null,
      eta: null,
      fileName: state.name,
    });
    toast.success(folder ? `Saved to ${folder.name}` : "Download complete");
  } catch (error) {
    // Discard the half-written file and the empty placeholder entry.
    await state.writable?.abort().catch(() => undefined);
    if (folder && state.entryCreated) {
      await folder.removeEntry(state.name).catch(() => undefined);
    }

    if (controller.signal.aborted) {
      update(id, { status: "cancelled", speed: null, eta: null, error: null });
    } else {
      update(id, {
        status: "error",
        speed: null,
        eta: null,
        error: toMessage(error),
      });
    }
  } finally {
    controllers.delete(id);
  }
};

export const useDownloads = () => {
  const start = useCallback(
    async (video: VideoInfo, sourceUrl: string, format: VideoFormat) => {
      // Must run first: the folder picker and permission prompt need the click's user activation.
      const folder = await findFolder();

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
        speed: null,
        eta: null,
        fileName: null,
        error: null,
        createdAt: Date.now(),
      });

      toast.info("Added to your downloads.");
      void run(id, folder);
    },
    [],
  );

  const cancel = useCallback((id: string) => {
    controllers.get(id)?.abort();
  }, []);

  const retry = useCallback(async (id: string) => {
    const folder = await findFolder();
    void run(id, folder);
  }, []);

  return { start, cancel, retry };
};
