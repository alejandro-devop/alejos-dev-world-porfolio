import { NextRequest, NextResponse } from "next/server";
import {
  LOCALE_COOKIE,
  buildLocalePath,
  detectLocaleFromHeader,
  getLocaleFromPathname,
  isValidLocale,
} from "@/lib/i18n";
import { defaultLocale } from "@/config/i18n";

/**
 * Locale middleware — runs on the Edge runtime.
 *
 * Detection priority (highest → lowest):
 *  1. Locale already present in the URL  → pass through, refresh cookie.
 *  2. NEXT_LOCALE cookie                → redirect to persisted preference.
 *  3. Accept-Language request header    → redirect to best match.
 *  4. Default locale fallback           → redirect to defaultLocale.
 *
 * The resolved locale is always written back into the NEXT_LOCALE cookie so
 * subsequent visits skip header-sniffing entirely.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const localeInPath = getLocaleFromPathname(pathname);

  if (localeInPath) {
    // URL already has a valid locale — just refresh the cookie and continue.
    const response = NextResponse.next();
    response.cookies.set(LOCALE_COOKIE, localeInPath, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
    });
    return response;
  }

  // --- No locale in URL: resolve one ---

  // 1. Cookie (user's explicit previous choice).
  const cookieValue = request.cookies.get(LOCALE_COOKIE)?.value;
  const fromCookie = isValidLocale(cookieValue) ? cookieValue : null;

  // 2. Accept-Language header.
  const fromHeader = detectLocaleFromHeader(
    request.headers.get("accept-language"),
  );

  const resolvedLocale = fromCookie ?? fromHeader ?? defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = buildLocalePath(pathname, resolvedLocale);

  const response = NextResponse.redirect(url);
  response.cookies.set(LOCALE_COOKIE, resolvedLocale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  /**
   * Run on every route EXCEPT:
   *  - Next.js internals  (_next/static, _next/image)
   *  - Static assets with file extensions (favicon.ico, og.png, …)
   *  - API routes (/api/*)
   */
  matcher: ["/((?!_next|api|favicon\\.ico|.*\\..*).*)"],
};
