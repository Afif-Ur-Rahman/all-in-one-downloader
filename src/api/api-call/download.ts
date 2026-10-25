import { getErrorMessage } from "@/lib";
import {
  getDownloadStartUrl,
  getJobDownloadUrl,
  getJobPauseUrl,
  getJobResumeUrl,
} from "./video";
import type { VideoFormat } from "@/types/video";

type Chunk = Uint8Array<ArrayBuffer>;

type DownloadStartInfo = {
  total: number | null;
  fileName: string | null;
  type: string;
};

export type PrepareProgress = {
  jobId: string | null;
  stream: "video" | "audio" | "merge" | null;
  streamPercent: number | null;
  streamLoaded: number | null;
  streamTotal: number | null;
  overallPercent: number | null;
  overallLoaded: number | null;
  overallTotal: number | null;
  speed: string | null;
  eta: string | null;
  phase: string;
};

type DownloadFileOptions = {
  signal: AbortSignal;
  size?: number | null;
  onStart: (info: DownloadStartInfo) => void | Promise<void>;
  onChunk: (chunk: Chunk) => void | Promise<void>;
  onProgress: (progress: { loaded: number; total: number | null }) => void;
  onPrepareProgress?: (data: PrepareProgress) => void;
};

const parseFileName = (header: string | null): string | null => {
  if (!header) return null;

  const encoded = header.match(/filename\*=UTF-8''([^;]+)/i);

  if (encoded) {
    try {
      return decodeURIComponent(encoded[1]);
    } catch {
      // Try the regular filename header.
    }
  }

  const plain = header.match(/filename="?([^";]+)"?/i);
  return plain ? plain[1] : null;
};

const readError = async (response: Response): Promise<string> => {
  try {
    return getErrorMessage(await response.json());
  } catch {
    return "We couldn't download this format. Try another quality.";
  }
};

const parseSseData = (raw: string): Record<string, unknown> | null => {
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
};

const getNumberOrNull = (value: unknown): number | null =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

type ProgressHandlers = Pick<DownloadFileOptions, "onPrepareProgress">;

const readProgressUntilReady = async (
  response: Response,
  { onPrepareProgress }: ProgressHandlers,
): Promise<string> => {
  if (!response.body) {
    throw new Error("No progress stream from server");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";
  let jobId: string | null = null;
  let ready = false;

  try {
    while (!ready) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const parts = buffer.split(/\r?\n\r?\n/);
      buffer = parts.pop() ?? "";

      for (const part of parts) {
        const dataLine = part
          .split(/\r?\n/)
          .find((line) => line.startsWith("data:"));

        if (!dataLine) continue;

        const data = parseSseData(dataLine.slice(5).trim());
        if (!data) continue;

        if (typeof data.jobId === "string") {
          jobId = data.jobId;
        }

        const phase = String(data.phase ?? "");

        const stream =
          data.stream === "video" ||
          data.stream === "audio" ||
          data.stream === "merge"
            ? data.stream
            : null;

        onPrepareProgress?.({
          jobId,
          stream,
          streamPercent: getNumberOrNull(data.streamPercent),
          streamLoaded: getNumberOrNull(data.streamLoaded),
          streamTotal: getNumberOrNull(data.streamTotal),
          overallPercent: getNumberOrNull(data.overallPercent),
          overallLoaded: getNumberOrNull(data.overallLoaded),
          overallTotal: getNumberOrNull(data.overallTotal),
          speed: typeof data.speed === "string" ? data.speed : null,
          eta: typeof data.eta === "string" ? data.eta : null,
          phase,
        });

        if (phase === "error") {
          throw new Error(
            typeof data.message === "string"
              ? data.message
              : "Download failed on the server",
          );
        }

        if (phase === "ready") {
          ready = true;
          break;
        }
      }
    }
  } finally {
    await reader.cancel().catch(() => undefined);
  }

  if (!jobId) {
    throw new Error("Server never returned a job id");
  }

  if (!ready) {
    throw new Error("The server closed the progress stream unexpectedly");
  }

  return jobId;
};

const transferFile = async (
  jobId: string,
  {
    signal,
    onStart,
    onChunk,
    onProgress,
  }: Omit<DownloadFileOptions, "size" | "onPrepareProgress">,
): Promise<void> => {
  const fileUrl = getJobDownloadUrl(jobId);
  const response = await fetch(fileUrl, { signal });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  const contentLength = Number(response.headers.get("Content-Length"));
  const total =
    Number.isFinite(contentLength) && contentLength > 0 ? contentLength : null;

  await onStart({
    total,
    fileName: parseFileName(response.headers.get("Content-Disposition")),
    type: response.headers.get("Content-Type") ?? "application/octet-stream",
  });

  if (!response.body) {
    const chunk = new Uint8Array(await response.arrayBuffer());

    await onChunk(chunk);
    onProgress({ loaded: chunk.length, total });
    return;
  }

  const fileReader = response.body.getReader();
  let loaded = 0;

  try {
    while (true) {
      const { done, value } = await fileReader.read();

      if (done) break;

      await onChunk(value as Chunk);
      loaded += value.length;

      onProgress({ loaded, total });
    }
  } finally {
    if (signal.aborted) {
      await fileReader.cancel().catch(() => undefined);
    }
  }
};

export const downloadFile = async (
  url: string,
  formatId: string,
  kind: VideoFormat["kind"],
  {
    signal,
    size,
    onStart,
    onChunk,
    onProgress,
    onPrepareProgress,
  }: DownloadFileOptions,
): Promise<void> => {
  const startUrl = getDownloadStartUrl(url, formatId, kind, size);
  const startResponse = await fetch(startUrl, { signal });

  if (!startResponse.ok) {
    throw new Error(await readError(startResponse));
  }

  const jobId = await readProgressUntilReady(startResponse, {
    onPrepareProgress,
  });

  await transferFile(jobId, {
    signal,
    onStart,
    onChunk,
    onProgress,
  });
};

export const resumeDownloadFile = async (
  jobId: string,
  {
    signal,
    onStart,
    onChunk,
    onProgress,
    onPrepareProgress,
  }: Omit<DownloadFileOptions, "size">,
): Promise<void> => {
  const resumeUrl = getJobResumeUrl(jobId);
  const resumeResponse = await fetch(resumeUrl, { signal });

  if (!resumeResponse.ok) {
    throw new Error(await readError(resumeResponse));
  }

  await readProgressUntilReady(resumeResponse, {
    onPrepareProgress,
  });

  await transferFile(jobId, {
    signal,
    onStart,
    onChunk,
    onProgress,
  });
};

export const pauseDownload = async (
  jobId: string,
  signal?: AbortSignal,
): Promise<void> => {
  const response = await fetch(getJobPauseUrl(jobId), {
    method: "POST",
    signal,
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }
};

export const saveBlob = (blob: Blob, fileName: string) => {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
};
