import type { PageProps } from "@/types";

/**
 * Home page — locale-aware entry point.
 *
 * `locale` is available for when copy/content needs to be
 * selected per language. UI implementation comes later.
 */
export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <main className="flex flex-1 flex-col items-center justify-center">
      <p className="text-muted-foreground text-sm">
        {/* Placeholder — replace with real UI */}
        locale: {locale}
      </p>
    </main>
  );
}
