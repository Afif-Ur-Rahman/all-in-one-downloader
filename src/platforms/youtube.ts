import { SiYoutube } from "react-icons/si";
import type { Platform } from "./types";

export const youtubePlatform: Platform = {
  id: "youtube",
  name: "YouTube",
  domains: ["youtube.com", "youtu.be"],
  icon: SiYoutube,
  color: "text-[#FF0000]",
  available: true,
};
