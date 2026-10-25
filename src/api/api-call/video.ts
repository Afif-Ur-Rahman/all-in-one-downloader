import { api, POST } from "../api.client";
import { VIDEO_DOWNLOAD, VIDEO_INFO } from "../endpoints";
import type { NetworkResult } from "@/types/api";
import type { VideoFormat, VideoInfo } from "@/types/video";

export const getVideoInfo = (
  url: string,
): Promise<NetworkResult<VideoInfo>> => {
  return POST<VideoInfo>(VIDEO_INFO, { url });
};

export const getDownloadUrl = (
  url: string,
  formatId: string,
  kind: VideoFormat["kind"],
): string => {
  return api.getUri({
    url: VIDEO_DOWNLOAD,
    params: { url, formatId, kind },
  });
};
