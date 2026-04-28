import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales } from "@/config/i18n";

/**
 * Locale middleware — runs on the Edge runtime.
 *
 * Behaviour:
 *  1. If the path already starts with a supported locale, pass through.
 *  2. Otherwise prefix the path with the default locale and redirect.
 *
 * When you add `next-intl` or `@formatjs/intl-localematcher` later, replace
 * the detection logic here without touching any other file.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Redirect to the default locale.
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  /**
   * Skip:
   *  - Next.js internals (_next/static, _next/image)
   *  - Static files with extensions (favicon.ico, robots.txt, og.png …)
   *  - API routes (/api/*)
   */
  matcher: ["/((?!_next|api|favicon\\.ico|.*\\..*).*)"],
};
