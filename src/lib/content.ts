/**
 * lib/content.ts
 *
 * Typed data loaders for every content section.
 *
 * Design principles:
 *  - Server-only (Node.js `import()` or `fetch()` — no client bundle bloat).
 *  - Each loader is a simple async function with a stable signature.
 *  - All return types come from `@/types/content`, never from `any`.
 *  - Errors surface loudly in development.
 *
 * Data source (phased rollout):
 *  - BACKEND_URL + section in BACKEND_SECTIONS → bulk fetch from admin API.
 *  - Otherwise → static JSON under src/data/{locale}/.
 */

import {
  getBackendBulkContentUrl,
  getBackendConfig,
  getContentFetchInit,
  isSectionBackendEnabled,
} from "@/config/backend";
import type {
  AboutData,
  BlogData,
  ContentKey,
  ContentMap,
  ExperienceData,
  HeroData,
  ProjectsData,
  SeoData,
  ServicesData,
  SkillsData,
  TestimonialsData,
} from "@/types/content";
import type { Locale } from "@/config/i18n";

// ---------------------------------------------------------------------------
// Generic loader — the implementation detail
// ---------------------------------------------------------------------------

async function fetchBulkSections<K extends ContentKey>(
  locale: Locale,
  sections: readonly K[],
): Promise<Pick<ContentMap, K>> {
  const { apiKey } = getBackendConfig();
  const headers: Record<string, string> = { Accept: "application/json" };

  if (apiKey) {
    headers["X-API-Key"] = apiKey;
  }

  const res = await fetch(getBackendBulkContentUrl(locale, [...sections]), {
    headers,
    ...getContentFetchInit(locale, sections),
  });

  if (!res.ok) {
    throw new Error(
      `[content] Failed to fetch sections [${sections.join(", ")}] for locale "${locale}" (${res.status}).`,
    );
  }

  const json = (await res.json()) as {
    status?: boolean;
    data?: Partial<ContentMap>;
    errors?: string[];
  };

  if (!json.status || json.data === undefined) {
    const detail = json.errors?.join(", ") ?? "Unknown API error";
    throw new Error(
      `[content] API error for sections [${sections.join(", ")}] (${locale}): ${detail}`,
    );
  }

  const result = {} as Pick<ContentMap, K>;

  for (const section of sections) {
    const value = json.data[section];
    if (value === undefined) {
      throw new Error(
        `[content] API response missing section "${section}" for locale "${locale}".`,
      );
    }
    result[section] = value as ContentMap[K];
  }

  return result;
}

/**
 * Dynamically import a JSON data file by locale and content key.
 * Next.js statically analyses `import()` expressions, so the path must be
 * a string literal template — not a fully dynamic variable.
 */
async function loadJsonContent<K extends ContentKey>(
  locale: Locale,
  key: K,
): Promise<ContentMap[K]> {
  try {
    const mod = await import(`@/data/${locale}/${key}.json`);
    // JSON modules expose the parsed value as `default`.
    return mod.default as ContentMap[K];
  } catch {
    throw new Error(
      `[content] Failed to load "${key}" for locale "${locale}". ` +
        `Make sure src/data/${locale}/${key}.json exists and is valid JSON.`,
    );
  }
}

/** True when API payload is present enough to render (empty {} → use static JSON). */
function isApiContentUsable<K extends ContentKey>(
  key: K,
  value: ContentMap[K] | undefined,
): value is ContentMap[K] {
  if (value === undefined) return false;
  if (
    typeof value === "object" &&
    value !== null &&
    Object.keys(value).length === 0
  ) {
    return false;
  }
  if (key === "hero") {
    const hero = value as HeroData;
    return Boolean(hero.cta?.primary?.label && hero.name);
  }
  return true;
}

async function loadContent<K extends ContentKey>(
  locale: Locale,
  key: K,
): Promise<ContentMap[K]> {
  if (isSectionBackendEnabled(key)) {
    try {
      const bulk = await fetchBulkSections(locale, [key]);
      const fromApi = bulk[key];
      if (isApiContentUsable(key, fromApi)) {
        return fromApi;
      }
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `[content] API "${key}" for "${locale}" is empty or incomplete — using static JSON.`,
        );
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `[content] API fetch failed for "${key}" (${locale}) — using static JSON.`,
          error,
        );
      } else {
        throw error;
      }
    }
  }
  return loadJsonContent(locale, key);
}

// ---------------------------------------------------------------------------
// Public loaders — one per section
// ---------------------------------------------------------------------------

export async function getHero(locale: Locale): Promise<HeroData> {
  return loadContent(locale, "hero");
}

export async function getAbout(locale: Locale): Promise<AboutData> {
  return loadContent(locale, "about");
}

export async function getSkills(locale: Locale): Promise<SkillsData> {
  return loadContent(locale, "skills");
}

export async function getExperience(locale: Locale): Promise<ExperienceData> {
  return loadContent(locale, "experience");
}

export async function getProjects(locale: Locale): Promise<ProjectsData> {
  return loadContent(locale, "projects");
}

export async function getServices(locale: Locale): Promise<ServicesData> {
  return loadContent(locale, "services");
}

export async function getTestimonials(
  locale: Locale,
): Promise<TestimonialsData> {
  return loadContent(locale, "testimonials");
}

export async function getBlog(locale: Locale): Promise<BlogData> {
  return loadContent(locale, "blog");
}

export async function getSeo(locale: Locale): Promise<SeoData> {
  return loadContent(locale, "seo");
}

// ---------------------------------------------------------------------------
// Convenience: load every section at once
// ---------------------------------------------------------------------------

export type AllContent = ContentMap;

export async function getAllContent(locale: Locale): Promise<AllContent> {
  const [
    hero,
    about,
    skills,
    experience,
    projects,
    services,
    testimonials,
    blog,
    seo,
  ] = await Promise.all([
    getHero(locale),
    getAbout(locale),
    getSkills(locale),
    getExperience(locale),
    getProjects(locale),
    getServices(locale),
    getTestimonials(locale),
    getBlog(locale),
    getSeo(locale),
  ]);

  return {
    hero,
    about,
    skills,
    experience,
    projects,
    services,
    testimonials,
    blog,
    seo,
  };
}
