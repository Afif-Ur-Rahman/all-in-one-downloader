import { SiInstagram } from "react-icons/si";
import type { Platform } from "./types";

export const instagramPlatform: Platform = {
  id: "instagram",
  name: "Instagram",
  domains: ["instagram.com"],
  icon: SiInstagram,
  color: "text-[#E4405F]",
  available: true,
};
