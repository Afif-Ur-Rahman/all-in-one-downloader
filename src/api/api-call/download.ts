import { getErrorMessage } from "@/lib";

import { getDownloadUrl } from "./video";

import type { VideoFormat } from "@/types/video";

type DownloadProgress = {
  loaded: number;
  total: number | null;
};

type DownloadFileOptions = {
  signal: AbortSignal;
  onStart: (info: { total: number | null }) => void;
  onProgress: (progress: DownloadProgress) => void;
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
  { signal, onStart, onProgress }: DownloadFileOptions,
): Promise<{ blob: Blob; fileName: string | null }> => {
  const response = await fetch(getDownloadUrl(url, formatId, kind), { signal });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  const length = Number(response.headers.get("Content-Length"));
  const total = Number.isFinite(length) && length > 0 ? length : null;
  const fileName = parseFileName(response.headers.get("Content-Disposition"));
  const type =
    response.headers.get("Content-Type") ?? "application/octet-stream";

  onStart({ total });

  if (!response.body) {
    return { blob: await response.blob(), fileName };
  }

  const reader = response.body.getReader();
  const chunks: BlobPart[] = [];
  let loaded = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    chunks.push(value);
    loaded += value.length;
    onProgress({ loaded, total });
  }

  return { blob: new Blob(chunks, { type }), fileName };
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
