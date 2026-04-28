"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof NextThemesProvider>;

/**
 * Thin wrapper around next-themes provider.
 * Kept as a separate Client Component so the locale layout stays a
 * Server Component — only this tiny file is shipped to the client.
 */
export function ThemeProvider({ children, ...props }: Props) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
