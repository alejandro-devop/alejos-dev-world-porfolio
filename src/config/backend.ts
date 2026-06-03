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

/**
 * Normalizes BACKEND_URL from env (Vercel/users often omit https://, add /api, or typo rlhttps).
 */
export function normalizeBackendUrl(raw: string): string {
  let url = raw.trim().replace(/^['"]|['"]$/g, "");

  // Common paste/keyboard typos (e.g. "rlhttps://" → double scheme → host "rlhttps")
  url = url.replace(/^rl+(?=https?:\/\/)/i, "");
  url = url.replace(/^rlhttps:\/\//i, "https://");
  url = url.replace(/^rlhttp:\/\//i, "http://");

  url = trimTrailingSlash(url);

  if (url.endsWith("/api")) {
    url = url.slice(0, -4);
    url = trimTrailingSlash(url);
  }

  const hasHttpScheme = /^https:\/\//i.test(url) || /^http:\/\//i.test(url);
  if (!hasHttpScheme) {
    url = `https://${url}`;
  }

  try {
    const parsed = new URL(url);
    const { hostname, protocol } = parsed;

    if (!hostname) {
      throw new Error("missing hostname");
    }

    if (protocol !== "http:" && protocol !== "https:") {
      throw new Error(`unsupported protocol ${protocol}`);
    }

    if (
      hostname !== "localhost" &&
      !hostname.includes(".") &&
      !hostname.includes(":")
    ) {
      throw new Error(
        `suspicious hostname "${hostname}" (check BACKEND_URL for typos like rlhttps)`,
      );
    }

    return trimTrailingSlash(parsed.origin);
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    throw new Error(
      `[backend] Invalid BACKEND_URL "${raw}" (${detail}). Expected: https://alejos-admin-api-wqpmywszuq-uc.a.run.app`,
    );
  }
}

export type BackendConfig = {
  /** Base URL without trailing slash, e.g. http://localhost:8080 */
  url: string;
  /** X-API-Key header — required for GET /api/:locale/content */
  apiKey?: string;
  /**
   * ISR revalidate interval in seconds.
   * `false` = always fetch fresh (`cache: 'no-store'`).
   */
  revalidateSeconds: number | false;
};

/** Cache tags for on-demand revalidation (see POST /api/revalidate). */
export function getContentCacheTags(
  locale: string,
  sections: readonly ContentKey[],
): string[] {
  return [
    "portfolio-content",
    `portfolio-content-${locale}`,
    ...sections.map((section) => `portfolio-content-${locale}-${section}`),
  ];
}

/**
 * Resolve fetch cache behaviour:
 * - BACKEND_REVALIDATE_SECONDS=0 → no cache
 * - BACKEND_REVALIDATE_SECONDS=N → ISR every N seconds
 * - unset in development → no cache (instant admin → site feedback)
 * - unset in production → 60s ISR
 */
function resolveRevalidateSeconds(): number | false {
  const raw = process.env.BACKEND_REVALIDATE_SECONDS?.trim();

  if (raw === "0") return false;

  if (raw) {
    const parsed = Number.parseInt(raw, 10);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }

  if (process.env.NODE_ENV === "development") return false;

  return 60;
}

/** Fetch options for content loaders — server-only. */
export function getContentFetchInit(
  locale: string,
  sections: readonly ContentKey[],
): Pick<RequestInit, "cache" | "next"> {
  const revalidateSeconds = resolveRevalidateSeconds();

  if (revalidateSeconds === false) {
    return { cache: "no-store" };
  }

  return {
    next: {
      revalidate: revalidateSeconds,
      tags: getContentCacheTags(locale, sections),
    },
  };
}

export function isBackendEnabled(): boolean {
  const raw = process.env.BACKEND_URL?.trim();
  if (!raw) return false;
  try {
    normalizeBackendUrl(raw);
    return true;
  } catch {
    return false;
  }
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

  const revalidateSeconds = resolveRevalidateSeconds();

  return {
    url: normalizeBackendUrl(url),
    apiKey: process.env.BACKEND_API_KEY?.trim(),
    revalidateSeconds,
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
