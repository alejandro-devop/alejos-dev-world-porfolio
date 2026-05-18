"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocaleTransition } from "@/components/LocaleTransition";
import { localeLabels, locales, type Locale } from "@/config/i18n";
import { buildLocalePath, LOCALE_COOKIE } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  /** The locale that is currently active. Pass down from the locale layout. */
  currentLocale: Locale;
  className?: string;
}

/**
 * LanguageSwitcher
 *
 * A minimal Client Component that swaps the locale prefix in the current URL
 * and writes the new preference to the NEXT_LOCALE cookie so the middleware
 * remembers it on subsequent visits.
 *
 * No library dependency — works with any styling system.
 * Drop this anywhere inside the locale layout tree.
 */
export function LanguageSwitcher({
  currentLocale,
  className,
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { startLocaleTransition } = useLocaleTransition();

  function handleChange(locale: Locale) {
    if (locale === currentLocale) return;

    const nextPath = buildLocalePath(pathname, locale);

    startLocaleTransition(() => {
      document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
      router.push(nextPath);
    });
  }

  return (
    <nav aria-label="Language switcher" className={cn("flex gap-1", className)}>
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          aria-current={locale === currentLocale ? "true" : undefined}
          aria-label={`Switch to ${localeLabels[locale]}`}
          onClick={() => handleChange(locale)}
          className={cn(
            "rounded px-2 py-1 text-sm font-medium transition-colors",
            locale === currentLocale
              ? "bg-primary text-primary-foreground cursor-default"
              : "text-muted-foreground hover:text-foreground hover:bg-muted",
          )}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </nav>
  );
}
