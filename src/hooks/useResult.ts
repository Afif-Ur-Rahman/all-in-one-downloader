"use client";

import { useCallback, useRef } from "react";
import { getVideoInfo } from "@/api";
import { useVideoStore } from "@/store";

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

  return { fetchInfo, retry, reset };
};
