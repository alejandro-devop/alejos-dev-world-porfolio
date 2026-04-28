import type { PageProps } from "@/types";
import type { Locale } from "@/config/i18n";
import { locales } from "@/config/i18n";
import { notFound } from "next/navigation";

/**
 * Home page — locale-aware entry point.
 */
export default async function HomePage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  if (!(locales as readonly string[]).includes(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  return (
    <main className="flex flex-1 flex-col items-center justify-center">
      <p className="text-muted-foreground text-sm">
        {/* Placeholder — replace with real UI */}
        locale: {locale}
      </p>
    </main>
  );
}
