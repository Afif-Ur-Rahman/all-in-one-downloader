import { create } from "zustand";
import type { VideoInfo } from "@/types/video";

type Status = "idle" | "loading" | "success" | "error";

type VideoState = {
  status: Status;
  url: string | null;
  video: VideoInfo | null;
  error: string | null;
  setLoading: (url: string) => void;
  setSuccess: (video: VideoInfo) => void;
  setError: (error: string) => void;
  reset: () => void;
};

export const useVideoStore = create<VideoState>((set) => ({
  status: "idle",
  url: null,
  video: null,
  error: null,

  setLoading: (url) =>
    set({ status: "loading", url, video: null, error: null }),

  setSuccess: (video) => set({ status: "success", video, error: null }),

  setError: (error) => set({ status: "error", error, video: null }),

  reset: () => set({ status: "idle", url: null, video: null, error: null }),
}));
