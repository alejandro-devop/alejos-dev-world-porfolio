import type { Locale } from "@/config/i18n";

export type { Locale };

/**
 * Next.js infers dynamic segment params as `string`, not a literal union.
 * We accept `string` here and narrow to `Locale` inside the component
 * (the locale layout calls `notFound()` for unknown values).
 */
export interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}
