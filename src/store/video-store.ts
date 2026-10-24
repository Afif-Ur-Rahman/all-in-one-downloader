import { create } from "zustand";
import type { VideoInfo } from "@/types/video";

type Status = "idle" | "loading" | "success" | "error";

type VideoState = {
  status: Status;
  url: string | null;
  video: VideoInfo | null;
  error: string | null;
  fetchInfo: (url: string) => Promise<void>;
  reset: () => void;
};

const DEFAULT_ERROR =
  "We couldn't fetch this video. Check that the link is correct and the video is public, then try again.";

// Lets us ignore the response of an older request if the user submits again
let latestRequest = 0;

export const useVideoStore = create<VideoState>((set) => ({
  status: "idle",
  url: null,
  video: null,
  error: null,

  fetchInfo: async (url) => {
    const requestId = ++latestRequest;
    set({ status: "loading", url, video: null, error: null });

    try {
      const response = await fetch("/api/video/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      console.log("====================================");
      console.log(response);
      console.log("====================================");
      const data = await response.json().catch(() => null);

      if (requestId !== latestRequest) return;

      if (!response.ok) {
        set({ status: "error", error: data?.message ?? DEFAULT_ERROR });
        return;
      }

      set({ status: "success", video: data as VideoInfo });
    } catch {
      if (requestId !== latestRequest) return;
      set({
        status: "error",
        error: "Network error. Check your connection and try again.",
      });
    }
  },

  reset: () => {
    latestRequest += 1;
    set({ status: "idle", url: null, video: null, error: null });
  },
}));
