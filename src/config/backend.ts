/**
 * Admin API connection (server-only).
 *
 * Set BACKEND_URL in `.env.local` to fetch content from the admin API
 * instead of static JSON under `src/data/`.
 */

function trimTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

export type BackendConfig = {
  /** Base URL without trailing slash, e.g. http://localhost:8080 */
  url: string;
  /** X-API-Key header — required for GET /api/:locale/:section */
  apiKey?: string;
  /** ISR revalidate interval in seconds (Next.js fetch cache) */
  revalidateSeconds: number;
};

export function isBackendEnabled(): boolean {
  return Boolean(process.env.BACKEND_URL?.trim());
}

export function getBackendConfig(): BackendConfig {
  const url = process.env.BACKEND_URL?.trim();

  if (!url) {
    throw new Error(
      "[backend] BACKEND_URL is not set. Add it to .env.local or use static JSON.",
    );
  }

  const revalidateRaw = process.env.BACKEND_REVALIDATE_SECONDS ?? "60";
  const revalidateSeconds = Number.parseInt(revalidateRaw, 10);

  return {
    url: trimTrailingSlash(url),
    apiKey: process.env.BACKEND_API_KEY?.trim(),
    revalidateSeconds:
      Number.isFinite(revalidateSeconds) && revalidateSeconds > 0
        ? revalidateSeconds
        : 60,
  };
}

/** Full URL for a content section, e.g. http://localhost:8080/api/en/hero */
export function getBackendSectionUrl(locale: string, section: string): string {
  const { url } = getBackendConfig();
  return `${url}/api/${locale}/${section}`;
}
