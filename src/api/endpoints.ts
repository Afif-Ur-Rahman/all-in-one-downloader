export const VIDEO_INFO = "/video/info";
export const VIDEO_DOWNLOAD_START = "/video/download/start";
export const VIDEO_DOWNLOAD_JOB = (jobId: string) => `/video/download/${jobId}`;
export const VIDEO_DOWNLOAD_PAUSE = (jobId: string) =>
  `/video/download/${jobId}/pause`;

export const VIDEO_DOWNLOAD_RESUME = (jobId: string) =>
  `/video/download/${jobId}/resume`;
