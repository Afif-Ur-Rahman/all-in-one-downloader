const IGNORED_CONSOLE_PATTERNS = [/^\[Fast Refresh\]/i, /^\[HMR\]/i, /^\[locatorjs\]/i];

export const shouldIgnoreConsoleMessage = (message: string) =>
  IGNORED_CONSOLE_PATTERNS.some(pattern => pattern.test(message));

const IGNORED_URL_PATTERNS = [
  /[?&]_rsc=/, // Next.js RSC payload requests
  /\/_next\//, // Next.js static assets / internals
  /hot-update\.(js|json)$/, // webpack/turbopack HMR
  /__nextjs_/, // Next devtools internal endpoints
];

export const shouldIgnoreNetworkUrl = (url: string) =>
  IGNORED_URL_PATTERNS.some(pattern => pattern.test(url));
