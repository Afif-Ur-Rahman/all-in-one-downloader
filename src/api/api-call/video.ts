import { api, POST } from "../api.client";
import {
  VIDEO_DOWNLOAD_JOB,
  VIDEO_DOWNLOAD_START,
  VIDEO_INFO,
} from "../endpoints";
import type { NetworkResult } from "@/types/api";
import type { VideoFormat, VideoInfo } from "@/types/video";

export const getVideoInfo = (
  url: string,
): Promise<NetworkResult<VideoInfo>> => {
  return POST<VideoInfo>(VIDEO_INFO, { url });
};

export const getDownloadStartUrl = (
  url: string,
  formatId: string,
  kind: VideoFormat["kind"],
  size?: number | null,
): string => {
  return api.getUri({
    url: VIDEO_DOWNLOAD_START,
    params: { url, formatId, kind, size: size ?? undefined },
  });
};

export const getJobDownloadUrl = (jobId: string): string => {
  return api.getUri({
    url: VIDEO_DOWNLOAD_JOB(jobId),
  });
};
