import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { DownloadItem } from "@/types/download";

const MAX_HISTORY = 50;

type DownloadState = {
  items: DownloadItem[];
  hydrated: boolean;
  add: (item: DownloadItem) => void;
  update: (id: string, patch: Partial<DownloadItem>) => void;
  remove: (id: string) => void;
  clearFinished: () => void;
};

const isActive = (item: DownloadItem) =>
  item.status === "preparing" || item.status === "downloading";

export const useDownloadStore = create<DownloadState>()(
  persist(
    (set) => ({
      items: [],
      hydrated: false,

      add: (item) =>
        set((state) => ({
          items: [item, ...state.items].slice(0, MAX_HISTORY),
        })),

      update: (id, patch) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...patch } : item,
          ),
        })),

      remove: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      clearFinished: () =>
        set((state) => ({ items: state.items.filter(isActive) })),
    }),
    {
      name: "aio-downloads",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      skipHydration: true,
      onRehydrateStorage: () => () => {
        useDownloadStore.setState((state) => ({
          hydrated: true,
          items: state.items.map((item) =>
            isActive(item)
              ? {
                  ...item,
                  status: item.jobId ? ("paused" as const) : ("error" as const),
                  activeStream: null,
                  speed: null,
                  eta: null,
                  error: item.jobId
                    ? null
                    : "Interrupted. Download again to retry.",
                }
              : item,
          ),
        }));
      },
    },
  ),
);
