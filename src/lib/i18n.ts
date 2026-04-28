/**
 * lib/i18n.ts
 *
 * Pure utility functions for locale detection and routing.
 * No framework imports — safe to use in middleware (Edge) and
 * in Server / Client Components alike.
 */

import { defaultLocale, locales, type Locale } from "@/config/i18n";

export { defaultLocale, locales, type Locale };

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Cookie that persists the user's explicit locale choice. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

// ---------------------------------------------------------------------------
// Detection helpers
// ---------------------------------------------------------------------------

/**
 * Parse the `Accept-Language` request header and return the best matching
 * supported locale, or `null` if nothing matches.
 *
 * Example header: "es-AR,es;q=0.9,en-US;q=0.8,en;q=0.7"
 */
export function detectLocaleFromHeader(
  acceptLanguage: string | null,
): Locale | null {
  if (!acceptLanguage) return null;

  // Split into weighted tags, sort by q-value descending.
  const tags = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.trim(), q: q ? parseFloat(q) : 1.0 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of tags) {
    // Exact match first (e.g. "es").
    const exact = locales.find((l) => l === tag.toLowerCase());
    if (exact) return exact;

    // Prefix match — e.g. "es-AR" → "es".
    const prefix = locales.find((l) => tag.toLowerCase().startsWith(`${l}-`));
    if (prefix) return prefix;
  }

  return null;
}

/**
 * Return the locale encoded in a URL pathname, or `null`.
 * e.g. "/es/about" → "es",  "/about" → null
 */
export function getLocaleFromPathname(pathname: string): Locale | null {
  const [, segment] = pathname.split("/");
  return locales.find((l) => l === segment) ?? null;
}

/**
 * Strip the locale prefix from a pathname.
 * e.g. "/es/about" → "/about",  "/es" → "/"
 */
export function stripLocalePrefix(pathname: string): string {
  const locale = getLocaleFromPathname(pathname);
  if (!locale) return pathname;
  const stripped = pathname.slice(`/${locale}`.length);
  return stripped || "/";
}

/**
 * Build a locale-prefixed pathname.
 * e.g. ("/about", "es") → "/es/about"
 */
export function buildLocalePath(pathname: string, locale: Locale): string {
  const clean = stripLocalePrefix(pathname);
  return `/${locale}${clean === "/" ? "" : clean}`;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/** Type-guard — narrows an unknown string to Locale. */
export function isValidLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" && (locales as readonly string[]).includes(value)
  );
}
