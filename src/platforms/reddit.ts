import { SiReddit } from "react-icons/si";
import type { Platform } from "./types";

export const redditPlatform: Platform = {
  id: "reddit",
  name: "Reddit",
  domains: ["reddit.com", "redd.it"],
  icon: SiReddit,
  color: "text-[#FF4500]",
  available: true,
};
