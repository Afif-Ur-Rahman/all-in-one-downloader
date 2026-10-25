export const formatBytes = (bytes: number): string => {
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;

  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }

  return `${value.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
};

export const timeAgo = (timestamp: number): string => {
  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.floor(hours / 24);
  return `${days} ${days === 1 ? "day" : "days"} ago`;
};

export const formatSpeed = (bytesPerSecond: number): string =>
  `${formatBytes(bytesPerSecond)}/s`;

export const formatEta = (seconds: number): string => {
  const total = Math.max(1, Math.ceil(seconds));

  if (total < 60) return `${total}s left`;

  const minutes = Math.floor(total / 60);
  const remainder = total % 60;

  if (minutes < 60) return `${minutes}m ${remainder}s left`;

  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m left`;
};
