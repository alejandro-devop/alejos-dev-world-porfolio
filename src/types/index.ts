import type { Locale } from "@/config/i18n";

export type { Locale };

/**
 * Props injected by Next.js into every page inside `app/[locale]/`.
 * Use this as the base for all page-level prop types.
 */
export interface PageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

/**
 * Props for layouts nested under `app/[locale]/`.
 */
export interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: Locale;
  }>;
}
