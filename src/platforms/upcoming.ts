import { SiReddit, SiTiktok } from "react-icons/si";
import type { Platform } from "./types";

export const upcomingPlatforms: Platform[] = [
  {
    id: "tiktok",
    name: "TikTok",
    domains: ["tiktok.com"],
    icon: SiTiktok,
    color: "text-foreground",
    available: false,
  },
  {
    id: "reddit",
    name: "Reddit",
    domains: ["reddit.com", "redd.it"],
    icon: SiReddit,
    color: "text-[#FF4500]",
    available: false,
  },
];
