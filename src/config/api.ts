const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
const rawSocketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

const formatUrl = (url: string, isApi: boolean = false): string => {
  let trimmed = url.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    trimmed = `https://${trimmed}`;
  }
  if (isApi) {
    trimmed = trimmed.replace(/\/+$/, "");
    if (!trimmed.endsWith("/api")) {
      trimmed = `${trimmed}/api`;
    }
  }
  return trimmed;
};

export const API_URL = formatUrl(rawApiUrl, true);
export const SOCKET_URL = formatUrl(rawSocketUrl, false);
