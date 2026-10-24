import { POST } from "../api.client";
import { VIDEO_INFO } from "../endpoints";
import type { NetworkResult } from "@/types/api";
import type { VideoInfo } from "@/types/video";

export const getVideoInfo = (
  url: string,
): Promise<NetworkResult<VideoInfo>> => {
  return POST<VideoInfo>(VIDEO_INFO, { url });
};
