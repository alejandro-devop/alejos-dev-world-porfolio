/**
 * Root layout — intentionally minimal.
 *
 * The `<html lang>` attribute, fonts, and per-page metadata are all
 * applied in `app/[locale]/layout.tsx` where the locale is known.
 * ThemeInitScript lives in the locale layout's <head> as a native <script>
 * to avoid React 19 ordering warnings with sync scripts in Fragment roots.
 */
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
