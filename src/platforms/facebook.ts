import { SiFacebook } from "react-icons/si";
import type { Platform } from "./types";

export const facebookPlatform: Platform = {
  id: "facebook",
  name: "Facebook",
  domains: ["facebook.com", "fb.watch", "fb.com"],
  icon: SiFacebook,
  color: "text-[#0866FF]",
  available: true,
};
