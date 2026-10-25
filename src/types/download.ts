import type { VideoFormat } from "./video";

export type DownloadStatus =
  | "preparing"
  | "downloading"
  | "completed"
  | "error"
  | "cancelled";

export type DownloadItem = {
  id: string;
  sourceUrl: string;
  title: string;
  thumbnail: string | null;
  platform: string;
  format: Pick<VideoFormat, "id" | "kind" | "quality" | "extension">;
  status: DownloadStatus;
  progress: number;
  loaded: number;
  total: number | null;
  speed: number | null;
  eta: number | null;
  fileName: string | null;
  error: string | null;
  createdAt: number;
};
