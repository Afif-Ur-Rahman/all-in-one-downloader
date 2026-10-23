import type { VideoInfo } from "@/types/video";

export const mockVideo: VideoInfo = {
  title: "How to build a modern web app from scratch in one afternoon",
  author: "Dev Weekly",
  platform: "YouTube",
  duration: "12:34",
  thumbnail: null,
  formats: [
    {
      id: "v1",
      kind: "video",
      quality: "1080p",
      extension: "MP4",
      size: "84.2 MB",
    },
    {
      id: "v2",
      kind: "video",
      quality: "720p",
      extension: "MP4",
      size: "46.7 MB",
    },
    {
      id: "v3",
      kind: "video",
      quality: "480p",
      extension: "MP4",
      size: "28.1 MB",
    },
    {
      id: "v4",
      kind: "video",
      quality: "360p",
      extension: "MP4",
      size: "17.4 MB",
    },
    {
      id: "a1",
      kind: "audio",
      quality: "High",
      extension: "MP3",
      size: "11.8 MB",
    },
    {
      id: "a2",
      kind: "audio",
      quality: "Standard",
      extension: "M4A",
      size: "7.2 MB",
    },
  ],
};
