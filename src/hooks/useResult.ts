"use client";

import { useCallback, useRef } from "react";
import { toast } from "sonner";
import { getDownloadUrl, getVideoInfo } from "@/api";
import { useVideoStore } from "@/store";
import type { VideoFormat } from "@/types/video";

const DEFAULT_ERROR =
  "We couldn't fetch this video. Check that the link is correct and the video is public, then try again.";

export const useResult = () => {
  const { setLoading, setSuccess, setError, reset, url } = useVideoStore();
  const latestRequest = useRef(0);

  const fetchInfo = useCallback(
    async (videoUrl: string) => {
      const requestId = ++latestRequest.current;
      setLoading(videoUrl);

      const result = await getVideoInfo(videoUrl);

      if (requestId !== latestRequest.current) return;

      if (result.state) {
        setSuccess(result.data);
      } else {
        setError(result.error || DEFAULT_ERROR);
      }
    },
    [setLoading, setSuccess, setError],
  );

  const retry = useCallback(() => {
    if (url) fetchInfo(url);
  }, [url, fetchInfo]);

  const download = useCallback(
    (format: VideoFormat) => {
      if (!url) return;

      const link = document.createElement("a");
      link.href = getDownloadUrl(url, format.id, format.kind);
      link.target = "_blank";
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.info("Preparing your download. Large videos can take a moment.");
    },
    [url],
  );

  return { fetchInfo, retry, reset, download };
};
