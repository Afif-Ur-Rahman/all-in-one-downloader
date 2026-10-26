import type { IconType } from "react-icons";

export type PlatformId =
  | "youtube"
  | "facebook"
  | "tiktok"
  | "instagram"
  | "x"
  | "vimeo"
  | "reddit";

export type Platform = {
  id: PlatformId;
  name: string;
  domains: string[];
  icon: IconType;
  color: string;
  available: boolean;
};
