/**
 * Admin API connection (server-only).
 *
 * Set BACKEND_URL in `.env.local` to fetch selected sections from the admin
 * API instead of static JSON under `src/data/`.
 *
 * Phased rollout: only sections listed in BACKEND_SECTIONS use the API.
 * Default when unset: `hero` only.
 */

import type { ContentKey } from "@/types/content";

const DEFAULT_BACKEND_SECTIONS: ContentKey[] = ["hero"];

function trimTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

export type BackendConfig = {
  /** Base URL without trailing slash, e.g. http://localhost:8080 */
  url: string;
  /** X-API-Key header — required for GET /api/:locale/content */
  apiKey?: string;
  /** ISR revalidate interval in seconds (Next.js fetch cache) */
  revalidateSeconds: number;
};

export function isBackendEnabled(): boolean {
  return Boolean(process.env.BACKEND_URL?.trim());
}

/** Sections that load from the admin API when BACKEND_URL is set. */
export function getBackendSections(): ContentKey[] {
  const raw = process.env.BACKEND_SECTIONS?.trim();
  if (!raw) return DEFAULT_BACKEND_SECTIONS;

  return raw
    .split(",")
    .map((section) => section.trim())
    .filter(Boolean) as ContentKey[];
}

export function isSectionBackendEnabled(section: ContentKey): boolean {
  return isBackendEnabled() && getBackendSections().includes(section);
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

/** Bulk read URL, e.g. http://localhost:8080/api/en/content?sections=hero */
export function getBackendBulkContentUrl(
  locale: string,
  sections: ContentKey[],
): string {
  const { url } = getBackendConfig();
  const params = new URLSearchParams({ sections: sections.join(",") });
  return `${url}/api/${locale}/content?${params.toString()}`;
}
