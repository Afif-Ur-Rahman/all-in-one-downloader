import { SiTiktok } from "react-icons/si";
import type { Platform } from "./types";

export const tiktokPlatform: Platform = {
  id: "tiktok",
  name: "TikTok",
  domains: ["tiktok.com"],
  icon: SiTiktok,
  color: "text-foreground",
  available: true,
};
