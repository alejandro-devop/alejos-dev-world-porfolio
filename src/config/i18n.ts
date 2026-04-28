/**
 * i18n configuration.
 *
 * `locales`        – all supported language codes.
 * `defaultLocale`  – used when no locale is detected in the URL.
 *
 * No library dependency — this config is consumed by both
 * the middleware (edge runtime) and the rest of the app.
 */
export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Human-readable labels shown in the language switcher. */
export const localeLabels: Record<Locale, string> = {
  en: "English",
  es: "Español",
};
