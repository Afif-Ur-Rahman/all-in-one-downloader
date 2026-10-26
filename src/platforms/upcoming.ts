import { SiInstagram, SiReddit, SiTiktok, SiVimeo, SiX } from "react-icons/si";
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
    id: "instagram",
    name: "Instagram",
    domains: ["instagram.com"],
    icon: SiInstagram,
    color: "text-[#E4405F]",
    available: false,
  },
  {
    id: "x",
    name: "X (Twitter)",
    domains: ["x.com", "twitter.com"],
    icon: SiX,
    color: "text-foreground",
    available: false,
  },
  {
    id: "vimeo",
    name: "Vimeo",
    domains: ["vimeo.com"],
    icon: SiVimeo,
    color: "text-[#1AB7EA]",
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
