"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { isHomePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Locale } from "@/config/i18n";

interface SiteChromeProps {
  locale: Locale;
  children: React.ReactNode;
}

/**
 * Route-aware shell: fixed nav on mobile everywhere; on desktop, fixed nav
 * except homepage (sticky nav lives in page.tsx below the hero).
 */
export function SiteChrome({ locale, children }: SiteChromeProps) {
  const pathname = usePathname();
  const isHome = isHomePath(pathname);

  return (
    <>
      <Navbar locale={locale} position="fixed" className="md:hidden" />
      {!isHome && (
        <Navbar locale={locale} position="fixed" className="hidden md:block" />
      )}
      <main
        className={cn(
          "flex-1 flex flex-col",
          isHome
            ? "pt-[var(--nav-height)] md:pt-0"
            : "pt-[var(--nav-height)]",
        )}
      >
        {children}
      </main>
    </>
  );
}
