/**
 * Backend origin — used to resolve relative API media paths (e.g. "/api/uploads/...")
 * which are stored in the DB without a host.
 */
export const API_ORIGIN = "http://localhost:8000";

/**
 * Resolve a stored image path to a full URL.
 * - Absolute URLs (http/https/blob/data) pass through unchanged
 * - Relative paths ("/api/uploads/x.jpg") get the backend origin prefixed
 * - Missing values return "" so <img> falls back to alt text
 */
export const mediaUrl = (path?: string | null): string => {
  if (!path) return "";
  if (/^(https?:|blob:|data:)/i.test(path)) return path;
  if (path.startsWith("/")) return `${API_ORIGIN}${path}`;
  return path;
};

export default mediaUrl;
