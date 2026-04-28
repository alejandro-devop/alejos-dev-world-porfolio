/**
 * Root layout — intentionally minimal.
 *
 * The `<html lang>` attribute, fonts, and per-page metadata are all
 * applied in `app/[locale]/layout.tsx` where the locale is known.
 * This file only wraps the document shell so Next.js is satisfied.
 */
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
