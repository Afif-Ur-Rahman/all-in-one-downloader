import { facebookPlatform } from "./facebook";
import type { Platform } from "./types";
import { upcomingPlatforms } from "./upcoming";
import { youtubePlatform } from "./youtube";

export const platforms: Platform[] = [
  youtubePlatform,
  facebookPlatform,
  ...upcomingPlatforms,
];

export const availablePlatforms = platforms.filter(
  (platform) => platform.available,
);

export const detectPlatform = (input: string): Platform | null => {
  try {
    const { hostname, protocol } = new URL(input.trim());

    if (protocol !== "http:" && protocol !== "https:") return null;

    const host = hostname.toLowerCase();

    return (
      platforms.find((platform) =>
        platform.domains.some(
          (domain) => host === domain || host.endsWith(`.${domain}`),
        ),
      ) ?? null
    );
  } catch {
    return null;
  }
};
