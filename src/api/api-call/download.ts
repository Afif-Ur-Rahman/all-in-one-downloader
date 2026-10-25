import { getErrorMessage } from "@/lib";

import { getDownloadUrl } from "./video";

import type { VideoFormat } from "@/types/video";

type Chunk = Uint8Array<ArrayBuffer>;

type DownloadStartInfo = {
  total: number | null;
  fileName: string | null;
  type: string;
};

type DownloadFileOptions = {
  signal: AbortSignal;
  onStart: (info: DownloadStartInfo) => void | Promise<void>;
  onChunk: (chunk: Chunk) => void | Promise<void>;
  onProgress: (progress: { loaded: number; total: number | null }) => void;
};

const parseFileName = (header: string | null): string | null => {
  if (!header) return null;

  const encoded = header.match(/filename\*=UTF-8''([^;]+)/i);
  if (encoded) {
    try {
      return decodeURIComponent(encoded[1]);
    } catch {
      // fall through to the plain filename
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

export const downloadFile = async (
  url: string,
  formatId: string,
  kind: VideoFormat["kind"],
  { signal, onStart, onChunk, onProgress }: DownloadFileOptions,
): Promise<void> => {
  const response = await fetch(getDownloadUrl(url, formatId, kind), { signal });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  const length = Number(response.headers.get("Content-Length"));
  const total = Number.isFinite(length) && length > 0 ? length : null;

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

  const reader = response.body.getReader();
  let loaded = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    await onChunk(value);
    loaded += value.length;
    onProgress({ loaded, total });
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
