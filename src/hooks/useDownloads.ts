"use client";

import { useCallback } from "react";
import { toast } from "sonner";

import {
  downloadFile,
  pauseDownload,
  resumeDownloadFile,
  saveBlob,
} from "@/api";
import { parseSizeLabel, resolveDownloadFolder, uniqueFileName } from "@/lib";
import { useDownloadStore } from "@/store/download-store";

import type {
  DownloadItem,
  StreamName,
  StreamProgress,
} from "@/types/download";
import type { VideoFormat, VideoInfo } from "@/types/video";

const FIRST_PICK_HINT =
  "Choose your Downloads folder. We'll create an aio-downloads folder inside it.";

const PROGRESS_INTERVAL_MS = 200;
const SPEED_SMOOTHING = 0.3;

const controllers = new Map<string, AbortController>();
const cancelledIds = new Set<string>();

const emptyStreams: Record<StreamName, StreamProgress | null> = {
  video: null,
  audio: null,
  merge: null,
};

const emptyProgress = (): StreamProgress => ({
  percent: 0,
  loaded: null,
  total: null,
  speed: null,
  eta: null,
});

const fallbackFileName = (item: DownloadItem) => {
  const base =
    item.title
      .replace(/[\\/:*?"<>|]+/g, "")
      .trim()
      .slice(0, 80) || "download";

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

const parseSpeedString = (raw: string | null): number | null => {
  if (!raw) return null;

  const match = raw.match(
    /^\s*([\d.]+)\s*(B|KB|MB|GB|TB|KiB|MiB|GiB|TiB)\/s\s*$/i,
  );

  if (!match) return null;

  const value = Number(match[1]);
  const unit = match[2].toUpperCase();

  const multiplier = unit.startsWith("T")
    ? 1024 ** 4
    : unit.startsWith("G")
      ? 1024 ** 3
      : unit.startsWith("M")
        ? 1024 ** 2
        : unit.startsWith("K")
          ? 1024
          : 1;

  return value * multiplier;
};

const parseEtaString = (raw: string | null): number | null => {
  if (!raw || raw.toLowerCase() === "unknown") return null;

  const parts = raw.split(":").map(Number);

  if (parts.some((value) => !Number.isFinite(value))) return null;

  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  return null;
};

const calculateOverallProgress = (
  streams: Record<StreamName, StreamProgress | null>,
  kind: VideoFormat["kind"],
) => {
  const video = streams.video?.percent ?? 0;
  const audio = streams.audio?.percent ?? 0;
  const merge = streams.merge?.percent ?? 0;

  const value =
    kind === "audio"
      ? audio * 0.8 + merge * 0.2
      : video * 0.85 + audio * 0.1 + merge * 0.05;

  return Math.min(100, Math.max(0, Math.round(value)));
};

const estimateSize = (video: VideoInfo, format: VideoFormat): number | null => {
  const own = parseSizeLabel(format.size);

  const originalAudio = video.formats.find(
    (entry) => entry.kind === "audio" && entry.id !== "mp3",
  );
  const audioSize = originalAudio ? parseSizeLabel(originalAudio.size) : null;

  if (format.kind === "video") {
    return own === null ? null : own + (audioSize ?? 0);
  }

  if (format.id === "mp3") return audioSize ?? own;

  return own;
};

const createTransferHandlers = (
  id: string,
  folder: FileSystemDirectoryHandle | null,
  controller: AbortController,
) => {
  const chunks: BlobPart[] = [];

  const state = {
    writable: null as FileSystemWritableFileStream | null,
    name: "",
    type: "application/octet-stream",
    received: 0,
    entryCreated: false,
  };

  let lastTick = 0;
  let lastLoaded = 0;
  let smoothedSpeed = 0;
  let readySize: number | null = null;

  const finish = async () => {
    if (state.writable) {
      await state.writable.close();
      state.writable = null;
    } else {
      saveBlob(new Blob(chunks, { type: state.type }), state.name);
    }

    const current = useDownloadStore
      .getState()
      .items.find((entry) => entry.id === id);

    const completedStreams: Record<StreamName, StreamProgress | null> = {
      video:
        current?.format.kind === "video"
          ? {
              ...(current?.streams.video ?? emptyProgress()),
              percent: 100,
              speed: null,
              eta: null,
            }
          : null,
      audio: {
        ...(current?.streams.audio ?? emptyProgress()),
        percent: 100,
        speed: null,
        eta: null,
      },
      merge: {
        ...(current?.streams.merge ?? emptyProgress()),
        percent: 100,
        loaded: state.received,
        total: state.received,
        speed: null,
        eta: null,
      },
    };

    useDownloadStore.getState().update(id, {
      status: "completed",
      progress: 100,
      activeStream: null,
      streams: completedStreams,
      loaded: state.received,
      total: state.received,
      speed: null,
      eta: null,
      fileName: state.name,
      error: null,
    });

    toast.success(folder ? `Saved to ${folder.name}` : "Download complete");
  };

  const fail = async (error: unknown) => {
    await state.writable?.abort().catch(() => undefined);

    if (folder && state.entryCreated) {
      await folder.removeEntry(state.name).catch(() => undefined);
    }

    const wasCancelled = cancelledIds.has(id);

    if (wasCancelled) {
      cancelledIds.delete(id);

      useDownloadStore.getState().update(id, {
        status: "cancelled",
        activeStream: null,
        speed: null,
        eta: null,
        error: null,
      });

      return;
    }

    if (controller.signal.aborted) {
      useDownloadStore.getState().update(id, {
        status: "paused",
        activeStream: null,
        speed: null,
        eta: null,
        error: null,
      });

      return;
    }

    useDownloadStore.getState().update(id, {
      status: "error",
      activeStream: null,
      speed: null,
      eta: null,
      error: toMessage(error),
    });
  };

  return {
    state,
    finish,
    fail,

    onPrepareProgress: ({
      jobId,
      stream,
      streamPercent,
      streamLoaded,
      streamTotal,
      overallPercent,
      overallLoaded,
      overallTotal,
      speed,
      eta,
      phase,
    }: {
      jobId: string | null;
      stream: StreamName | null;
      streamPercent: number | null;
      streamLoaded: number | null;
      streamTotal: number | null;
      overallPercent: number | null;
      overallLoaded: number | null;
      overallTotal: number | null;
      speed: string | null;
      eta: string | null;
      phase: string;
    }) => {
      const current = useDownloadStore
        .getState()
        .items.find((entry) => entry.id === id);

      if (!current) return;

      if (jobId && current.jobId !== jobId) {
        useDownloadStore.getState().update(id, { jobId });
      }

      if (phase === "ready" && streamTotal) {
        readySize = streamTotal;
      }

      const parsedSpeed = parseSpeedString(speed);
      const parsedEta = parseEtaString(eta);

      const streams: Record<StreamName, StreamProgress | null> = {
        ...current.streams,
      };

      if (stream) {
        const previous = current.streams[stream];

        streams[stream] = {
          percent: Math.max(
            previous?.percent ?? 0,
            Math.min(100, Math.max(0, streamPercent ?? 0)),
          ),
          loaded: streamLoaded ?? previous?.loaded ?? null,
          total: streamTotal ?? previous?.total ?? null,
          speed: parsedSpeed ?? previous?.speed ?? null,
          eta: parsedEta ?? previous?.eta ?? null,
        };
      }

      const isReady = phase === "ready";
      const isMerging = phase === "merging";

      const activeStream: StreamName | null = isReady
        ? null
        : isMerging
          ? "merge"
          : (stream ?? current.activeStream);

      const hasOverall = overallPercent != null;
      const preparationProgress = hasOverall
        ? overallPercent
        : calculateOverallProgress(streams, current.format.kind);
      const mergingFloor = !hasOverall && isMerging ? 90 : 0;

      useDownloadStore.getState().update(id, {
        status: isReady ? "downloading" : "preparing",
        activeStream,
        streams,
        progress: isReady
          ? 100
          : Math.max(current.progress, preparationProgress, mergingFloor),
        speed: parsedSpeed ?? current.speed,
        eta: parsedEta ?? current.eta,
        loaded: overallLoaded ?? streamLoaded ?? current.loaded,
        total: overallTotal ?? streamTotal ?? current.total,
      });
    },

    onStart: async ({
      total,
      fileName,
      type,
    }: {
      total: number | null;
      fileName: string | null;
      type: string;
    }) => {
      const current = useDownloadStore
        .getState()
        .items.find((entry) => entry.id === id);

      if (!current) return;

      state.type = type;
      state.name = fileName ?? fallbackFileName(current);

      if (folder) {
        state.name = await uniqueFileName(folder, state.name);

        const handle = await folder.getFileHandle(state.name, {
          create: true,
        });

        state.entryCreated = true;
        state.writable = await handle.createWritable();
      }

      lastTick = Date.now();
      lastLoaded = 0;
      smoothedSpeed = 0;

      useDownloadStore.getState().update(id, {
        status: "downloading",
        progress: 0,
        loaded: 0,
        total: total ?? readySize,
        speed: null,
        eta: null,
      });
    },

    onChunk: async (chunk: Uint8Array<ArrayBuffer>) => {
      state.received += chunk.length;

      if (state.writable) {
        await state.writable.write(chunk);
      } else {
        chunks.push(chunk);
      }
    },

    onProgress: ({
      loaded,
      total,
    }: {
      loaded: number;
      total: number | null;
    }) => {
      const now = Date.now();
      const elapsed = now - lastTick;

      if (elapsed < PROGRESS_INTERVAL_MS) return;

      const instantSpeed = Math.max(
        0,
        ((loaded - lastLoaded) / elapsed) * 1000,
      );

      smoothedSpeed =
        smoothedSpeed === 0
          ? instantSpeed
          : SPEED_SMOOTHING * instantSpeed +
            (1 - SPEED_SMOOTHING) * smoothedSpeed;

      lastTick = now;
      lastLoaded = loaded;

      const current = useDownloadStore
        .getState()
        .items.find((entry) => entry.id === id);

      if (!current) return;

      const knownTotal = total ?? readySize;
      const displayLoaded = Math.max(current.loaded ?? 0, loaded);

      const eta =
        knownTotal != null && knownTotal > displayLoaded && smoothedSpeed > 0
          ? (knownTotal - displayLoaded) / smoothedSpeed
          : null;

      useDownloadStore.getState().update(id, {
        loaded: displayLoaded,
        total: knownTotal,
        progress:
          knownTotal != null && knownTotal > 0
            ? Math.min(
                100,
                Math.max(current.progress, (displayLoaded / knownTotal) * 100),
              )
            : current.progress,
        speed: smoothedSpeed > 0 ? smoothedSpeed : current.speed,
        eta: eta ?? current.eta,
      });
    },
  };
};

const startTransfer = async (
  id: string,
  folder: FileSystemDirectoryHandle | null,
) => {
  const initial = useDownloadStore
    .getState()
    .items.find((entry) => entry.id === id);

  if (!initial) return;

  controllers.get(id)?.abort();
  cancelledIds.delete(id);

  const controller = new AbortController();
  controllers.set(id, controller);

  const initialStreams: Record<StreamName, StreamProgress | null> = {
    ...emptyStreams,
    ...(initial.format.kind === "audio"
      ? { audio: emptyProgress() }
      : { video: emptyProgress(), audio: emptyProgress() }),
    merge: emptyProgress(),
  };

  useDownloadStore.getState().update(id, {
    status: "preparing",
    progress: 0,
    activeStream: initial.format.kind === "audio" ? "audio" : "video",
    streams: initialStreams,
    loaded: 0,
    total: null,
    speed: null,
    eta: null,
    error: null,
    fileName: null,
  });

  const handlers = createTransferHandlers(id, folder, controller);

  try {
    await downloadFile(
      initial.sourceUrl,
      initial.format.id,
      initial.format.kind,
      {
        signal: controller.signal,
        size: initial.estimatedSize ?? null,
        ...handlers,
      },
    );

    await handlers.finish();
  } catch (error) {
    await handlers.fail(error);
  } finally {
    if (controllers.get(id) === controller) {
      controllers.delete(id);
    }
  }
};

const resumeTransfer = async (
  id: string,
  folder: FileSystemDirectoryHandle | null,
) => {
  const item = useDownloadStore
    .getState()
    .items.find((entry) => entry.id === id);

  if (!item?.jobId || controllers.has(id)) return;

  const controller = new AbortController();
  controllers.set(id, controller);

  useDownloadStore.getState().update(id, {
    status: "preparing",
    activeStream: item.format.kind === "audio" ? "audio" : "video",
    progress: 0,
    total: null,
    speed: null,
    eta: null,
    error: null,
  });

  const handlers = createTransferHandlers(id, folder, controller);

  try {
    await resumeDownloadFile(item.jobId, {
      signal: controller.signal,
      ...handlers,
    });

    await handlers.finish();
  } catch (error) {
    if (!controller.signal.aborted) {
      toast.info("Resuming from the server was unavailable. Restarting…");

      await startTransfer(id, folder);
      return;
    }

    await handlers.fail(error);
  } finally {
    if (controllers.get(id) === controller) {
      controllers.delete(id);
    }
  }
};

export const useDownloads = () => {
  const start = useCallback(
    async (video: VideoInfo, sourceUrl: string, format: VideoFormat) => {
      const { items, add } = useDownloadStore.getState();

      const alreadyRunning = items.some(
        (downloadItem) =>
          downloadItem.sourceUrl === sourceUrl &&
          downloadItem.format.id === format.id &&
          (downloadItem.status === "downloading" ||
            downloadItem.status === "preparing"),
      );

      if (alreadyRunning) {
        toast.info("This download is already in progress.");
        return;
      }

      let folder: FileSystemDirectoryHandle | null;

      try {
        folder = await findFolder();
      } catch (error) {
        toast.error(toMessage(error));
        return;
      }

      const id = crypto.randomUUID();

      add({
        id,
        jobId: null,
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
        estimatedSize: estimateSize(video, format),
        status: "preparing",
        progress: 0,
        activeStream: format.kind === "audio" ? "audio" : "video",
        streams: { ...emptyStreams },
        loaded: 0,
        total: null,
        speed: null,
        eta: null,
        fileName: null,
        error: null,
        createdAt: Date.now(),
      });

      toast.info("Download started.");
      void startTransfer(id, folder);
    },
    [],
  );

  const cancel = useCallback((id: string) => {
    cancelledIds.add(id);
    controllers.get(id)?.abort();
  }, []);

  const pause = useCallback(async (id: string) => {
    const item = useDownloadStore
      .getState()
      .items.find((entry) => entry.id === id);

    if (!item) return;

    controllers.get(id)?.abort();

    useDownloadStore.getState().update(id, {
      status: "paused",
      activeStream: null,
      speed: null,
      eta: null,
      error: null,
    });

    if (!item.jobId) return;

    try {
      await pauseDownload(item.jobId);
    } catch {
      // The browser transfer is already stopped. Resume will restart the
      // server job if its partial files are no longer available.
    }
  }, []);

  const resume = useCallback(async (id: string) => {
    const item = useDownloadStore
      .getState()
      .items.find((entry) => entry.id === id);

    if (!item || controllers.has(id)) return;

    try {
      const folder = await findFolder();

      if (item.jobId) {
        void resumeTransfer(id, folder);
        return;
      }

      void startTransfer(id, folder);
    } catch (error) {
      toast.error(toMessage(error));
    }
  }, []);

  const retry = useCallback(async (id: string) => {
    const item = useDownloadStore
      .getState()
      .items.find((entry) => entry.id === id);

    if (!item || controllers.has(id)) return;

    try {
      const folder = await findFolder();
      void startTransfer(id, folder);
    } catch (error) {
      toast.error(toMessage(error));
    }
  }, []);

  return { start, cancel, pause, resume, retry };
};
